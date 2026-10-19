// ======================================================
// Show Me (tarot): logika aplikasi (frontend only, tanpa server)
// Bergantung pada `cards` dari js/cards-data.js
// ======================================================

const HISTORY_KEY = "tarot-history-v2";
const LEGACY_KEY = "tarot-history";
const THEME_KEY = "tarot-theme";
const MAX_HISTORY = 50;

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, reduceMotion ? 0 : ms));

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

// Tata letak Celtic Cross: [kolom, baris] per posisi (1-based)
const CELTIC_LABELS = [
  "Situasi Saat Ini", "Tantangan", "Fondasi", "Masa Lalu", "Tujuan & Kesadaran",
  "Masa Depan Dekat", "Diri Anda", "Lingkungan", "Harapan & Ketakutan", "Hasil Akhir",
];
const CELTIC_GRID = [[2, 2], [2, 2], [2, 3], [1, 2], [2, 1], [3, 2], [4, 4], [4, 3], [4, 2], [4, 1]];

const SPREADS = {
  daily: { title: "Kartu Harian", count: 1, labels: [null], seeded: true },
  one: { title: "1 Kartu", count: 1, labels: [null] },
  three: { title: "3 Kartu", count: 3, labels: ["Masa Lalu", "Masa Kini", "Masa Depan"] },
  celtic: { title: "Celtic Cross", count: 10, labels: CELTIC_LABELS, layout: "celtic" },
};

const SUITS = ["wands", "cups", "swords", "coins"];

let busy = false;
let lastSpread = null;
let current = null; // { key, items, entryId }
let currentTopic = "umum";
let pick = null;      // state saat memilih kartu: { key, spread, deck, need, picked, question, topic }
let galleryFilter = "all";
let gallerySearch = "";

// ---------- Utilitas ----------

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Angka acak yang adil dan sulit ditebak (crypto); cadangan ke Math.random
function randomInt(max) {
  if (!window.crypto || !crypto.getRandomValues) return Math.floor(Math.random() * max);
  const range = 0x100000000;
  const limit = range - (range % max); // buang angka di atas batas agar tidak bias
  const buf = new Uint32Array(1);
  let x;
  do {
    crypto.getRandomValues(buf);
    x = buf[0];
  } while (x >= limit);
  return x % max;
}

// Fisher-Yates shuffle
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function drawCards(n) {
  return shuffle(cards).slice(0, n).map((card) => ({ card, reversed: randomInt(2) === 1 }));
}

// PRNG deterministik (mulberry32) agar Kartu Harian sama sepanjang hari
function hashString(s) {
  let h = 2166136261;
  for (const ch of s) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  return function next() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function todayKey() {
  return new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD, zona waktu lokal
}

function dailyDraw() {
  const rng = mulberry32(hashString("daily-" + todayKey()));
  const card = cards[Math.floor(rng() * cards.length)];
  return { card, reversed: rng() < 0.5 };
}

function suitOf(card) {
  if (card.id < 22) return "major";
  return SUITS[Math.floor((card.id - 22) / 14)];
}

function orientOf(item) {
  return item.reversed ? "Terbalik" : "Tegak";
}

function meaningOf(item) {
  return item.reversed ? item.card.reversed : item.card.upright;
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function toast(msg) {
  let el = $("#toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "toast";
    el.className = "toast";
    el.setAttribute("role", "status");
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove("show"), 1800);
}

// ---------- Penyimpanan (localStorage dibungkus try/catch) ----------

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    toast("Penyimpanan browser tidak tersedia");
  }
}

// Migrasi sekali dari format v1 (hanya nama kartu) ke format v2 (id kartu)
function loadHistory() {
  const stored = readJSON(HISTORY_KEY, null);
  if (stored) return stored;

  const legacy = readJSON(LEGACY_KEY, null);
  if (!legacy || legacy.length === 0) return [];

  const migrated = legacy.map((e) => ({
    id: uid(),
    time: e.time,
    spread: e.mode === "spread" ? "three" : "one",
    note: "",
    cards: e.cards
      .map((c) => ({ id: (cards.find((card) => card.nameId === c.name) || {}).id, reversed: c.reversed }))
      .filter((c) => c.id !== undefined),
  }));
  writeJSON(HISTORY_KEY, migrated);
  try { localStorage.removeItem(LEGACY_KEY); } catch { /* abaikan */ }
  return migrated;
}

function addHistory(key, items, question, topic) {
  const entry = {
    id: uid(),
    time: new Date().toISOString(),
    spread: key,
    question: question || "",
    topic: topic || "umum",
    note: "",
    cards: items.map((it) => ({ id: it.card.id, reversed: it.reversed })),
  };
  writeJSON(HISTORY_KEY, [entry, ...loadHistory()].slice(0, MAX_HISTORY));
  return entry.id;
}

function updateEntry(id, patch) {
  writeJSON(HISTORY_KEY, loadHistory().map((e) => (e.id === id ? { ...e, ...patch } : e)));
}

function deleteEntry(id) {
  writeJSON(HISTORY_KEY, loadHistory().filter((e) => e.id !== id));
}

// ---------- Render kartu ----------

function slotHtml(item, index, label, delay) {
  const { card, reversed } = item;
  return `
    <div class="slot" style="--d:${delay}ms">
      <div class="pos">${label ? escapeHtml(label) : ""}</div>
      <div class="flip ${reversed ? "reversed" : ""}" data-index="${index}" data-id="${card.id}"
           role="button" tabindex="0" aria-label="${escapeHtml(card.nameId)}, ${orientOf(item)}. Ketuk untuk membuka, ketuk lagi untuk detail.">
        <div class="face back"></div>
        <div class="face front">
          <img src="${escapeHtml(card.image)}" alt="" onerror="this.remove()">
          <span class="fallback">${escapeHtml(card.name)}</span>
        </div>
      </div>
      <div class="cap">${escapeHtml(card.nameId)}<span class="orient">${orientOf(item)}</span></div>
    </div>`;
}

function renderStage(items, spread) {
  const stage = $("#stage");
  const isCeltic = spread.layout === "celtic";
  stage.classList.toggle("celtic", isCeltic);

  if (isCeltic) {
    const slots = items.map((item, i) => slotHtml(item, i, spread.labels[i], 150 + i * 140));
    stage.innerHTML = [
      `<div class="cross-cell" style="grid-column:2;grid-row:2">${slots[0]}${slots[1]}</div>`,
      ...items.slice(2).map((_, k) => {
        const i = k + 2;
        const [col, row] = CELTIC_GRID[i];
        return `<div style="grid-column:${col};grid-row:${row}">${slots[i]}</div>`;
      }),
    ].join("");
  } else {
    stage.innerHTML = items
      .map((item, i) => slotHtml(item, i, spread.labels[i], 150 + i * 140))
      .join("");
  }

  // Buka kartu satu per satu setelah muncul
  $$(".flip", stage).forEach((el, i) => {
    setTimeout(() => el.classList.add("is-open"), reduceMotion ? 0 : 350 + i * 200);
  });
}

// Kalimat konteks sesuai topik (tidak ada untuk "umum")
function topicNoteOf(item, topic) {
  if (!topic || topic === "umum" || !topicNotes[topic]) return "";
  return topicNotes[topic][item.card.id][item.reversed ? 1 : 0];
}

// ---------- Jawaban ya/tidak ----------

const YES_NO_RE = /^\s*(apakah|akankah|haruskah|bolehkah|benarkah|apa\s+dia)\b/i;

function isYesNoQuestion(question) {
  return YES_NO_RE.test(question || "");
}

// Jawaban singkat dari polaritas kartu; kartu terbalik membalik "pos" dan "neg"
function verdictOf(items) {
  const score = items.reduce((sum, item) => {
    let p = cardPolarity[item.card.id];
    if (item.reversed) p = p === "pos" ? "neg" : p === "neg" ? "pos" : p;
    return sum + (p === "pos" ? 1 : p === "neg" ? -1 : 0);
  }, 0);
  if (score > 0) return "Cenderung ya";
  if (score < 0) return "Cenderung tidak";
  return "Belum jelas";
}

function renderReading(items, spread, topic, question) {
  const list = $("#reading-list");
  const yesNo = isYesNoQuestion(question);
  const resolved = yesNo ? "singkat" : "lengkap";

  $("#verdict").innerHTML = yesNo
    ? `<div class="verdict">
         <span class="verdict-label">Jawaban singkat</span>
         <strong>${escapeHtml(verdictOf(items))}</strong>
         <small>Ini cara membaca kartu, bukan kepastian. Keputusan tetap ada di tanganmu.</small>
       </div>`
    : "";

  list.innerHTML = items
    .map((item, i) => {
      const label = spread.labels[i] || `Kartu ${i + 1}`;
      const note = topicNoteOf(item, topic);
      const noteHtml = note
        ? `<p class="topic-note"><span class="topic-tag">${escapeHtml(topicLabels[topic])}</span>${escapeHtml(note)}</p>`
        : "";
      return `
        <li style="--d:${i * 120 + 300}ms">
          <div class="pos-label">${escapeHtml(label)}</div>
          <div class="card-name">${escapeHtml(item.card.nameId)} · ${orientOf(item)}</div>
          ${resolved === "singkat"
            ? `<details class="more"><summary>Lihat penjelasan</summary><p class="card-meaning">${escapeHtml(meaningOf(item))}</p>${noteHtml}</details>`
            : `<p class="card-meaning">${escapeHtml(meaningOf(item))}</p>${noteHtml}`}
        </li>`;
    })
    .join("");
  $("#reading").hidden = false;
}

function setControlsDisabled(disabled) {
  $$(".spread-btn").forEach((b) => (b.disabled = disabled));
}

// ---------- Aksi baca ----------

async function performReading(key) {
  if (busy) return;
  const spread = SPREADS[key];
  busy = true;
  setControlsDisabled(true);
  lastSpread = key;

  $("#reading").hidden = true;
  $("#stage").classList.remove("celtic");
  $("#stage").innerHTML = `
    <div class="deck" aria-hidden="true">
      <div class="card-shadow"></div><div class="card-shadow"></div>
      <div class="card-shadow"></div><div class="card-shadow"></div>
    </div>`;

  await sleep(spread.count >= 10 ? 1500 : 1000);

  // Pengguna memilih kartunya sendiri dari kipas; Kartu Harian tetap otomatis
  if (!spread.seeded) {
    startPick(key, spread);
    return; // busy tetap true sampai semua kartu dipilih atau dibatalkan
  }

  const question = $("#question").value.trim();
  const topic = currentTopic;
  const items = spread.seeded ? [dailyDraw()] : drawCards(spread.count);
  revealReading(key, spread, items, question, topic);
  busy = false;
  setControlsDisabled(false);
}

// Menampilkan hasil bacaan dan menyimpannya ke riwayat
function revealReading(key, spread, items, question, topic) {
  current = { key, items, question, topic, entryId: addHistory(key, items, question, topic) };

  renderStage(items, spread);
  renderReading(items, spread, topic, question);
  $("#journal-note").value = "";
  $("#reading-question").textContent = question ? `Pertanyaan: ${question}` : "";

  $$(".spread-btn").forEach((b) => b.classList.toggle("is-active", b.dataset.spread === key));
}

// ---------- Pilih kartu sendiri ----------

function startPick(key, spread) {
  // Dek diacak dulu; kartu yang dipilih baru diketahui saat dibuka
  pick = {
    key,
    spread,
    deck: shuffle(cards),
    need: spread.count,
    picked: [],
    question: $("#question").value.trim(),
    topic: currentTopic,
  };

  const dots = Array.from({ length: spread.count }, () => `<span class="pick-dot"></span>`).join("");
  $("#stage").innerHTML = `
    <div class="pick-wrap">
      <p class="pick-title">Ketuk kartu yang kamu rasakan</p>
      <div class="pick-dots" aria-hidden="true">${dots}</div>
      <p class="pick-hint"><span id="pick-count">0</span> dari ${spread.count} kartu dipilih</p>
      <div class="fan" role="group" aria-label="Kipas kartu tertutup">
        ${pick.deck
          .map((_, i) => `
            <button class="fan-card" style="--i:${Math.min(i, 40)}" data-i="${i}" aria-label="Kartu tertutup ${i + 1}">
              <span class="fan-face"></span><span class="pick-num"></span>
            </button>`)
          .join("")}
      </div>
      <button id="btn-pick-cancel" class="ghost small">Batal</button>
    </div>`;

  // Mulai dari tengah kipas supaya kartu di sekitarnya terlihat
  const fan = $(".fan");
  requestAnimationFrame(() => {
    fan.scrollLeft = (fan.scrollWidth - fan.clientWidth) / 2;
  });
}

function pickCard(el) {
  if (!pick || el.disabled) return;
  pick.picked.push(pick.deck[Number(el.dataset.i)]);
  const order = pick.picked.length;
  el.disabled = true;
  el.classList.add("picked");
  el.querySelector(".pick-num").textContent = order;
  $$(".pick-dot")[order - 1].classList.add("filled");
  $("#pick-count").textContent = order;
  if (pick.picked.length === pick.need) finishPick();
}

function finishPick() {
  const { key, spread, picked, question, topic } = pick;
  pick = null;
  // Posisi tegak atau terbalik tetap acak
  const items = picked.map((card) => ({ card, reversed: randomInt(2) === 1 }));
  revealReading(key, spread, items, question, topic);
  busy = false;
  setControlsDisabled(false);
}

function cancelPick() {
  pick = null;
  busy = false;
  setControlsDisabled(false);
  $("#stage").innerHTML = `<p class="stage-empty">Pilih spread di atas untuk mulai membaca.</p>`;
}

// ---------- Modal detail ----------

function openDetail(card, reversed = false, topic = "umum") {
  const modal = $("#card-modal");
  const note = topicNoteOf({ card, reversed }, topic);
  const noteHtml = note
    ? `<div class="lbl">Untuk ${escapeHtml(topicLabels[topic])}</div><p>${escapeHtml(note)}</p>`
    : "";
  $("#modal-body").innerHTML = `
    <div class="detail">
      <div class="big">
        <img src="${escapeHtml(card.image)}" alt="${escapeHtml(card.name)}"
             style="${reversed ? "transform:rotate(180deg)" : ""}" onerror="this.remove()">
      </div>
      <div>
        <h3 id="modal-title">${escapeHtml(card.name)}</h3>
        <div class="sub">${escapeHtml(card.nameId)}${reversed ? " · posisi terbalik" : ""}</div>
        <div class="lbl">Makna tegak</div>
        <p>${escapeHtml(card.upright)}</p>
        <div class="lbl">Makna terbalik</div>
        <p>${escapeHtml(card.reversed)}</p>
        ${noteHtml}
      </div>
    </div>`;
  if (!modal.open) modal.showModal();
}

// ---------- Galeri ----------

function renderGallery() {
  const q = gallerySearch.trim().toLowerCase();
  const list = cards.filter((c) => {
    const suitOk = galleryFilter === "all" || suitOf(c) === galleryFilter;
    const textOk = !q || [c.name, c.nameId, c.upright, c.reversed].join(" ").toLowerCase().includes(q);
    return suitOk && textOk;
  });

  $("#gallery").innerHTML = list
    .map(
      (c, i) => `
      <button class="gallery-card" data-id="${c.id}" style="--d:${Math.min(i * 14, 500)}ms" aria-label="${escapeHtml(c.nameId)}">
        <span class="thumb"><img src="${escapeHtml(c.image)}" alt="" loading="lazy" onerror="this.remove()"></span>
        <span class="label">${escapeHtml(c.nameId)}</span>
      </button>`
    )
    .join("");

  $("#gallery-count").textContent = list.length
    ? `${list.length} dari ${cards.length} kartu`
    : "Tidak ada kartu yang cocok.";
}

// ---------- Riwayat ----------

function renderHistory() {
  const ul = $("#history");
  const list = loadHistory();

  if (list.length === 0) {
    ul.innerHTML = `<li class="empty">Belum ada riwayat. Mulai membaca di tab Baca.</li>`;
    return;
  }

  ul.innerHTML = list
    .map((e) => {
      const date = new Date(e.time).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
      const spread = SPREADS[e.spread];
      const names = e.cards
        .map((c) => `${escapeHtml(cards[c.id].nameId)} (${c.reversed ? "terbalik" : "tegak"})`)
        .join(", ");
      const question = e.question ? `<p class="q-echo">Pertanyaan: ${escapeHtml(e.question)}</p>` : "";
      const note = e.note ? `<p class="note">${escapeHtml(e.note)}</p>` : "";
      return `
        <li>
          <div class="meta"><span>${escapeHtml(date)}</span><span>${escapeHtml(spread ? spread.title : "Bacaan")}${e.topic && e.topic !== "umum" ? " · " + escapeHtml(topicLabels[e.topic] || e.topic) : ""}</span></div>
          ${question}
          <div class="names">${names}</div>
          ${note}
          <div class="row-actions">
            <button class="ghost small danger" data-action="delete" data-id="${e.id}">Hapus</button>
          </div>
        </li>`;
    })
    .join("");
}

// ---------- Tema ----------

function isDarkNow() {
  const attr = document.documentElement.dataset.theme;
  if (attr) return attr === "dark";
  return !window.matchMedia("(prefers-color-scheme: light)").matches;
}

function updateThemeIcon() {
  $("#btn-theme").textContent = isDarkNow() ? "☀" : "☾";
  $("#btn-theme").setAttribute("aria-label", isDarkNow() ? "Ganti ke tema terang" : "Ganti ke tema gelap");
}

function toggleTheme() {
  const next = isDarkNow() ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem(THEME_KEY, next); } catch { /* abaikan */ }
  updateThemeIcon();
}

// ---------- Tab ----------

function switchTab(name) {
  $$("[role=tab]").forEach((t) => {
    const on = t.dataset.tab === name;
    t.setAttribute("aria-selected", String(on));
    t.tabIndex = on ? 0 : -1;
  });
  ["read", "gallery", "history"].forEach((n) => {
    $("#panel-" + n).hidden = n !== name;
  });
  if (name === "gallery") renderGallery();
  if (name === "history") renderHistory();
}

// ---------- Inisialisasi ----------

function makeStars() {
  const field = $(".starfield");
  for (let i = 0; i < 40; i++) {
    const s = document.createElement("span");
    s.style.left = Math.random() * 100 + "%";
    s.style.top = Math.random() * 100 + "%";
    s.style.width = s.style.height = 1 + Math.random() * 2 + "px";
    s.style.setProperty("--dur", 3 + Math.random() * 4 + "s");
    s.style.setProperty("--delay", -Math.random() * 6 + "s");
    field.appendChild(s);
  }
}

function bindEvents() {
  $$(".spread-btn").forEach((btn) =>
    btn.addEventListener("click", () => performReading(btn.dataset.spread))
  );

  // Buka kartu lalu ketuk lagi untuk detail
  const stage = $("#stage");
  stage.addEventListener("click", (e) => {
    const fanCard = e.target.closest(".fan-card");
    if (fanCard) return pickCard(fanCard);
    if (e.target.closest("#btn-pick-cancel")) return cancelPick();

    const flip = e.target.closest(".flip");
    if (!flip) return;
    if (!flip.classList.contains("is-open")) {
      flip.classList.add("is-open");
      return;
    }
    const item = current && current.items[Number(flip.dataset.index)];
    if (item) openDetail(item.card, item.reversed, current.topic);
  });
  stage.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && e.target.classList.contains("flip")) {
      e.preventDefault();
      e.target.click();
    }
  });

  // Pilihan topik pertanyaan
  $(".topic-picker").addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    currentTopic = chip.dataset.topic;
    $$(".topic-picker .chip").forEach((c) => c.classList.toggle("is-active", c === chip));
  });

  // Catatan jurnal tersimpan otomatis
  let noteTimer;
  $("#journal-note").addEventListener("input", (e) => {
    clearTimeout(noteTimer);
    noteTimer = setTimeout(() => {
      if (current) updateEntry(current.entryId, { note: e.target.value });
    }, 300);
  });

  // Tab
  const tablist = $(".tabs");
  tablist.addEventListener("click", (e) => {
    const btn = e.target.closest("[role=tab]");
    if (btn) switchTab(btn.dataset.tab);
  });
  tablist.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const tabs = $$("[role=tab]");
    const idx = tabs.indexOf(document.activeElement);
    if (idx < 0) return;
    const next = tabs[(idx + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
    next.focus();
    switchTab(next.dataset.tab);
  });

  // Galeri
  $("#gallery").addEventListener("click", (e) => {
    const btn = e.target.closest(".gallery-card");
    if (btn) openDetail(cards[Number(btn.dataset.id)]);
  });
  $("#gallery-search").addEventListener("input", (e) => {
    gallerySearch = e.target.value;
    renderGallery();
  });
  $(".chips").addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    galleryFilter = chip.dataset.filter;
    $$(".chip").forEach((c) => c.classList.toggle("is-active", c === chip));
    renderGallery();
  });

  // Riwayat
  $("#history").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action='delete']");
    if (!btn) return;
    if (!confirm("Hapus bacaan ini?")) return;
    deleteEntry(btn.dataset.id);
    renderHistory();
  });

  $("#btn-export").addEventListener("click", () => {
    const list = loadHistory();
    if (list.length === 0) return toast("Riwayat masih kosong");
    const blob = new Blob([JSON.stringify(list, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "tarot-riwayat.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });

  $("#btn-clear").addEventListener("click", () => {
    if (loadHistory().length === 0) return;
    if (!confirm("Hapus semua riwayat bacaan?")) return;
    writeJSON(HISTORY_KEY, []);
    renderHistory();
    toast("Riwayat dihapus");
  });

  // Modal
  const modal = $("#card-modal");
  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.closest("[data-close]")) modal.close();
  });

  $("#btn-theme").addEventListener("click", toggleTheme);

  // Pintasan keyboard
  document.addEventListener("keydown", (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey || $("#card-modal").open) return;
    if (e.target.closest("input, textarea")) return;
    if ($("#panel-read").hidden) return;

    if (e.key === " " && e.target === document.body) {
      e.preventDefault();
      performReading(lastSpread && lastSpread !== "daily" ? lastSpread : "one");
    }
  });
}

try {
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme) document.documentElement.dataset.theme = savedTheme;
} catch { /* abaikan */ }

makeStars();
updateThemeIcon();
bindEvents();
switchTab("read");
