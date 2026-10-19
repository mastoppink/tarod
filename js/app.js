const STORAGE_KEY = "tarot-history";
const MAX_HISTORY = 20;
const SPREAD_LABELS = ["Masa Lalu", "Masa Kini", "Masa Depan"];

let lastMode = null; // "daily" | "spread"

// ---------- Utilitas ----------

// Fisher-Yates shuffle
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Tarik n kartu acak, tiap kartu bisa tegak atau terbalik (50:50)
function drawCards(n) {
  return shuffle(cards).slice(0, n).map((card) => ({
    card,
    reversed: Math.random() < 0.5,
  }));
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ---------- Render kartu ----------

function cardHtml(item, label) {
  const { card, reversed } = item;
  const meaning = reversed ? card.reversed : card.upright;
  const orient = reversed ? "Terbalik" : "Tegak";
  const pos = label ? `<div class="pos">${escapeHtml(label)}</div>` : "";

  // Gambar opsional dari folder images/. Jika belum ada, tampil wajah teks.
  return `
    <div class="card-wrap">
      ${pos}
      <div class="card ${reversed ? "reversed" : ""}">
        <img src="${escapeHtml(card.image)}" alt="${escapeHtml(card.name)}"
             onerror="this.remove()">
        <div class="face">
          <div class="symbol">✦</div>
          <div>${escapeHtml(card.name)}</div>
        </div>
      </div>
      <div class="card-caption">
        <div class="name">${escapeHtml(card.nameId)}</div>
        <div class="orient">${orient}</div>
      </div>
      <p class="meaning">${escapeHtml(meaning)}</p>
    </div>`;
}

function renderResult(items, labels) {
  const el = document.getElementById("result");
  el.innerHTML = items
    .map((item, i) => cardHtml(item, labels ? labels[i] : null))
    .join("");
}

// ---------- Riwayat (localStorage, dibungkus try/catch) ----------

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveHistory(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // penyimpanan tidak tersedia; aplikasi tetap berjalan
  }
}

function addHistory(mode, items) {
  const entry = {
    time: new Date().toISOString(),
    mode,
    cards: items.map((it) => ({
      name: it.card.nameId,
      reversed: it.reversed,
    })),
  };
  const list = [entry, ...loadHistory()].slice(0, MAX_HISTORY);
  saveHistory(list);
  renderHistory();
}

function renderHistory() {
  const ul = document.getElementById("history");
  const list = loadHistory();

  if (list.length === 0) {
    ul.innerHTML = `<li class="empty">Belum ada riwayat.</li>`;
    return;
  }

  ul.innerHTML = list
    .map((entry) => {
      const date = new Date(entry.time).toLocaleString("id-ID");
      const label = entry.mode === "spread" ? "Spread 3 Kartu" : "1 Kartu";
      const names = entry.cards
        .map((c) => `${escapeHtml(c.name)} (${c.reversed ? "terbalik" : "tegak"})`)
        .join(", ");
      return `<li><div class="time">${escapeHtml(date)} · ${label}</div>${names}</li>`;
    })
    .join("");
}

// ---------- Aksi ----------

function doDaily() {
  lastMode = "daily";
  const items = drawCards(1);
  renderResult(items, null);
  addHistory("daily", items);
}

function doSpread() {
  lastMode = "spread";
  const items = drawCards(3);
  renderResult(items, SPREAD_LABELS);
  addHistory("spread", items);
}

// Acak ulang: ulangi mode terakhir (default 1 kartu)
function doReshuffle() {
  if (lastMode === "spread") doSpread();
  else doDaily();
}

// ---------- Init ----------

document.getElementById("btn-daily").addEventListener("click", doDaily);
document.getElementById("btn-spread").addEventListener("click", doSpread);
document.getElementById("btn-reshuffle").addEventListener("click", doReshuffle);
document.getElementById("btn-clear").addEventListener("click", () => {
  saveHistory([]);
  renderHistory();
});

renderHistory();
