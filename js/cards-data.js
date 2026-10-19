// Data 78 kartu Tarot (22 Arcana Mayor + 56 Arcana Minor)
// upright = makna tegak, reversed = makna terbalik
// image: letakkan file gambar di folder images/ (opsional, lihat app.js untuk fallback)

const majorArcana = [
  { id: 0, name: "The Fool", nameId: "Sang Orang Bodoh", upright: "Awal baru, petualangan, kebebasan, potensi.", reversed: "Kecerobohan, risiko berlebih, kurang persiapan." },
  { id: 1, name: "The Magician", nameId: "Sang Pesulap", upright: "Manifestasi, keterampilan, fokus, aksi.", reversed: "Manipulasi, kurang fokus, potensi terbuang." },
  { id: 2, name: "The High Priestess", nameId: "Sang Pendeta Wanita", upright: "Intuisi, misteri, kebijaksanaan batin, ketenangan.", reversed: "Mengabaikan intuisi, rahasia tersembunyi, kebingungan." },
  { id: 3, name: "The Empress", nameId: "Sang Permaisuri", upright: "Kesuburan, kelimpahan, kasih sayang, kreativitas.", reversed: "Ketergantungan, kurang kreativitas, tekanan berlebih." },
  { id: 4, name: "The Emperor", nameId: "Sang Kaisar", upright: "Struktur, otoritas, stabilitas, disiplin.", reversed: "Kontrol berlebihan, kekakuan, penyalahgunaan kuasa." },
  { id: 5, name: "The Hierophant", nameId: "Sang Pemimpin Spiritual", upright: "Tradisi, kepercayaan, bimbingan, pembelajaran.", reversed: "Pemberontakan terhadap aturan, dogma kosong, pandangan sempit." },
  { id: 6, name: "The Lovers", nameId: "Dua Kekasih", upright: "Cinta, pilihan selaras, kemitraan, nilai bersama.", reversed: "Ketidakselarasan, pilihan sulit, konflik nilai." },
  { id: 7, name: "The Chariot", nameId: "Kereta", upright: "Tekad, kemenangan, kendali diri, kemajuan.", reversed: "Kehilangan arah, agresi, hambatan." },
  { id: 8, name: "Justice", nameId: "Keadilan", upright: "Kejujuran, sebab-akibat, keseimbangan.", reversed: "Ketidakadilan, bias, tanggung jawab dihindari." },
  { id: 9, name: "The Hermit", nameId: "Sang Pertapa", upright: "Refleksi, introspeksi, pencarian makna.", reversed: "Isolasi, menutup diri, terjebak masa lalu." },
  { id: 10, name: "Wheel of Fortune", nameId: "Roda Nasib", upright: "Perubahan, siklus, takdir, peluang.", reversed: "Kemalangan sementara, menolak perubahan, siklus berulang." },
  { id: 11, name: "Strength", nameId: "Kekuatan", upright: "Keberanian, kesabaran, welas asih, kekuatan batin.", reversed: "Keraguan diri, emosi tak terkendali, kelemahan." },
  { id: 12, name: "The Hanged Man", nameId: "Orang Tergantung", upright: "Jeda, perspektif baru, pengorbanan, menunggu.", reversed: "Penundaan, keengganan berubah, pengorbanan sia-sia." },
  { id: 13, name: "Death", nameId: "Kematian", upright: "Akhir, transformasi, pelepasan, awal baru.", reversed: "Takut berubah, stagnan, sulit melepaskan." },
  { id: 14, name: "Temperance", nameId: "Penahanan Diri", upright: "Keseimbangan, moderasi, kesabaran, harmoni.", reversed: "Ketidakseimbangan, berlebihan, kurang sabar." },
  { id: 15, name: "The Devil", nameId: "Iblis", upright: "Keterikatan, godaan, kecanduan, bayangan.", reversed: "Pembebasan, melepas belenggu, kesadaran." },
  { id: 16, name: "The Tower", nameId: "Menara", upright: "Perubahan mendadak, kehancuran, wahyu, kebenaran.", reversed: "Menghindari bencana, penundaan perubahan, krisis tertahan." },
  { id: 17, name: "The Star", nameId: "Bintang", upright: "Harapan, inspirasi, kedamaian, penyembuhan.", reversed: "Keputusasaan, kurang iman, kelelahan." },
  { id: 18, name: "The Moon", nameId: "Bulan", upright: "Ilusi, ketakutan, intuisi, alam bawah sadar.", reversed: "Kebingungan mulai terangkat, kejelasan, menghadapi ketakutan." },
  { id: 19, name: "The Sun", nameId: "Matahari", upright: "Kebahagiaan, kesuksesan, vitalitas, kehangatan.", reversed: "Kesuksesan tertunda, optimisme berlebih, kelelahan." },
  { id: 20, name: "Judgement", nameId: "Penghakiman", upright: "Kebangkitan, panggilan, refleksi, pengampunan.", reversed: "Meragukan diri, menolak panggilan, penyesalan." },
  { id: 21, name: "The World", nameId: "Dunia", upright: "Penyelesaian, pencapaian, integrasi, kesempurnaan.", reversed: "Penyelesaian tertunda, kurang penutupan, stagnasi." }
];

// Arcana Minor: [makna tegak, makna terbalik] untuk Ace..10, Page, Knight, Queen, King
const rankNames = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Page", "Knight", "Queen", "King"];
const rankNamesId = ["As", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Pelayan", "Kesatria", "Ratu", "Raja"];

const minorSuits = [
  {
    name: "Wands", nameId: "Tongkat", slug: "wands",
    meanings: [
      ["Inspirasi baru, semangat, peluang kreatif.", "Energi tertahan, kurang motivasi, ide terhambat."],
      ["Perencanaan, keputusan, pandangan ke depan.", "Ragu-ragu, takut melangkah, rencana macet."],
      ["Ekspansi, peluang berkembang, visi jauh.", "Penundaan, rencana belum matang, frustrasi."],
      ["Perayaan, harmoni, pencapaian di rumah.", "Ketidakstabilan, konflik keluarga, perubahan tak nyaman."],
      ["Persaingan, konflik kecil, perbedaan pendapat.", "Menghindari konflik, perdebatan berkepanjangan."],
      ["Kemenangan, pengakuan, kepercayaan diri.", "Kesombongan, pengakuan palsu, gagal meraih pengakuan."],
      ["Keberanian mempertahankan diri, tantangan.", "Menyerah, merasa kewalahan, tekanan terlalu besar."],
      ["Kecepatan, kabar cepat, kemajuan pesat.", "Terburu-buru, komunikasi terhambat, kekacauan."],
      ["Ketahanan, kewaspadaan, sisa tenaga.", "Kelelahan, paranoia, sulit percaya."],
      ["Beban berat, tanggung jawab, kerja keras.", "Melepas beban, mendelegasikan, kelelahan ekstrem."],
      ["Antusias, pesan baru, petualangan kecil.", "Ide tak matang, kurang fokus, kabar tidak benar."],
      ["Energi, gairah, bergerak cepat.", "Impulsif, tergesa-gesa, frustrasi."],
      ["Percaya diri, karisma, kehangatan.", "Cemburu, posesif, kurang percaya diri."],
      ["Visi kuat, kepemimpinan, inspirasi.", "Otoriter, arogan, kurang kendali."]
    ]
  },
  {
    name: "Cups", nameId: "Cawan", slug: "cups",
    meanings: [
      ["Cinta baru, emosi mendalam, awal hubungan.", "Emosi tertutup, kekosongan, cinta tak tersampaikan."],
      ["Kemitraan, ketertarikan timbal balik, harmoni.", "Ketidakseimbangan, perpisahan, salah paham."],
      ["Persahabatan, perayaan, kebersamaan.", "Gosip, pesta berlebihan, kesepian di tengah kelompok."],
      ["Kebosanan, apatis, peluang terlewat.", "Bangkit dari apatis, membuka diri, kesadaran baru."],
      ["Penyesalan, kesedihan, fokus pada kehilangan.", "Menerima, bangkit, melihat yang masih tersisa."],
      ["Nostalgia, kenangan manis, kebaikan hati.", "Terjebak masa lalu, idealisme naif."],
      ["Banyak pilihan, khayalan, angan-angan.", "Kejelasan, memilih dengan bijak, berpijak pada kenyataan."],
      ["Meninggalkan sesuatu, pencarian makna, perpisahan.", "Takut pergi, bertahan terlalu lama, kebingungan."],
      ["Kepuasan, keinginan terkabul, kebahagiaan.", "Ketidakpuasan, keserakahan, kesenangan semu."],
      ["Kebahagiaan keluarga, harmoni, kepenuhan.", "Keretakan keluarga, ketidakharmonisan."],
      ["Kabar emosional, kreativitas, kepekaan.", "Terlalu sensitif, drama, emosi yang belum dewasa."],
      ["Romantis, ajakan, mengikuti hati.", "Suasana hati berubah, janji palsu, kecewa."],
      ["Empati, intuisi, kasih sayang.", "Emosi berlebihan, terlalu bergantung pada orang lain."],
      ["Kematangan emosi, kebijaksanaan, ketenangan.", "Manipulasi emosi, tertekan, emosi tak terkendali."]
    ]
  },
  {
    name: "Swords", nameId: "Pedang", slug: "swords",
    meanings: [
      ["Kejelasan, kebenaran, terobosan pikiran.", "Kebingungan, keputusan keliru, pikiran kacau."],
      ["Dilema, keseimbangan rapuh, penolakan.", "Keputusan dipaksakan, informasi disembunyikan."],
      ["Patah hati, kesedihan, kebenaran yang menyakitkan.", "Pemulihan, memaafkan, melepas luka."],
      ["Istirahat, pemulihan, merenung.", "Kelelahan, kegelisahan, sulit beristirahat."],
      ["Konflik, kemenangan semu, perselisihan.", "Rekonsiliasi, penyesalan, berdamai."],
      ["Transisi, meninggalkan masalah, perjalanan.", "Terjebak masalah, sulit bergerak, kebiasaan lama."],
      ["Strategi, kelicikan, bertindak sendiri.", "Kejujuran, mengaku, rencana terbongkar."],
      ["Terjebak, batasan diri, ketakutan.", "Kebebasan, keberanian, melihat jalan keluar."],
      ["Kecemasan, mimpi buruk, kekhawatiran.", "Harapan, mulai pulih, rasa takut mereda."],
      ["Akhir yang menyakitkan, titik terendah.", "Bangkit, pemulihan, mengakhiri penderitaan."],
      ["Rasa ingin tahu, kewaspadaan, kabar baru.", "Gosip, kecerobohan, komunikasi buruk."],
      ["Tindakan cepat, ambisi, kebenaran yang tegas.", "Sembrono, agresif, tidak sabar."],
      ["Ketajaman, kejujuran, pikiran mandiri.", "Dingin, terlalu kritis, kepahitan."],
      ["Logika, otoritas, keadilan.", "Kekejaman, penyalahgunaan kuasa, kaku."]
    ]
  },
  {
    name: "Pentacles", nameId: "Koin", slug: "pentacles",
    meanings: [
      ["Peluang baru, kemakmuran, awal finansial.", "Peluang hilang, kurang perencanaan, ketidakpastian."],
      ["Keseimbangan, fleksibilitas, multitasking.", "Kewalahan, kacau, prioritas keliru."],
      ["Kerja tim, keahlian, pengakuan.", "Kurang kerja sama, mutu buruk, tidak dihargai."],
      ["Kehati-hatian, menggenggam, stabilitas.", "Keserakahan, pelit, takut kehilangan."],
      ["Kesulitan, kesepian, kehilangan.", "Pemulihan, bantuan datang, bangkit kembali."],
      ["Kemurahan hati, berbagi, memberi dan menerima.", "Utang, syarat berat, ketidakadilan."],
      ["Kesabaran, evaluasi, hasil bertahap.", "Kurang sabar, hasil tidak sesuai, stagnan."],
      ["Ketekunan, keterampilan, dedikasi.", "Perfeksionisme, kurang fokus, kemalasan."],
      ["Kemandirian, menikmati hasil, kemewahan.", "Ketergantungan, ketidakamanan finansial."],
      ["Warisan, keluarga, kestabilan jangka panjang.", "Konflik keluarga, kehilangan warisan."],
      ["Ambisi belajar, peluang kecil, ketekunan.", "Kurang fokus, pemborosan, kemalasan."],
      ["Tekun, dapat diandalkan, bertahap.", "Lambat, bosan, terjebak rutinitas."],
      ["Praktis, hangat, mandiri secara finansial.", "Terlalu protektif, cemas soal uang."],
      ["Kemakmuran, kepemimpinan bisnis, stabil.", "Keras kepala, materialistis, pengendalian berlebih."]
    ]
  }
];

const minorArcana = [];
minorSuits.forEach((suit, s) => {
  suit.meanings.forEach((m, r) => {
    minorArcana.push({
      id: 22 + s * 14 + r,
      name: `${rankNames[r]} of ${suit.name}`,
      nameId: `${rankNamesId[r]} ${suit.nameId}`,
      upright: m[0],
      reversed: m[1]
    });
  });
});

// Gabungan 78 kartu
const cards = [...majorArcana, ...minorArcana].map((card) => {
  const pad = String(card.id).padStart(2, "0");
  return { ...card, image: `images/${pad}.jpg` };
});
