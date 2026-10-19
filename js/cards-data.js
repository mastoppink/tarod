// Data 78 kartu Tarot (22 Arcana Mayor + 56 Arcana Minor)
// upright = makna tegak, reversed = makna terbalik
// Bahasa dibuat sederhana dan langsung, supaya mudah dipahami pemula.
// image: letakkan file gambar di folder images/ (opsional, lihat app.js untuk fallback)

const majorArcana = [
  { id: 0, name: "The Fool", nameId: "Sang Orang Bodoh",
    upright: "Mulai hal baru dengan hati terbuka. Ini waktu yang baik untuk berani mencoba.",
    reversed: "Terlalu nekat atau ceroboh. Pikirkan dulu risikonya sebelum melangkah." },
  { id: 1, name: "The Magician", nameId: "Sang Pesulap",
    upright: "Kamu punya kemampuan untuk mewujudkan impian. Fokus dan mulai bertindak.",
    reversed: "Kemampuanmu belum dipakai dengan baik. Kembali fokus pada satu tujuan." },
  { id: 2, name: "The High Priestess", nameId: "Sang Pendeta Wanita",
    upright: "Dengarkan kata hatimu dan jangan terburu-buru. Jawabannya sering ada di dalam dirimu.",
    reversed: "Mengabaikan perasaan sendiri atau ada hal yang belum terungkap. Cari tahu lebih jauh." },
  { id: 3, name: "The Empress", nameId: "Sang Permaisuri",
    upright: "Waktu yang baik untuk kasih sayang, kreativitas, dan kenyamanan. Rawat dirimu.",
    reversed: "Terlalu bergantung pada orang lain atau lupa merawat diri. Ambil waktu untuk dirimu." },
  { id: 4, name: "The Emperor", nameId: "Sang Kaisar",
    upright: "Dibutuhkan aturan, disiplin, dan rencana yang jelas. Pegang kendali dengan tenang.",
    reversed: "Terlalu mengatur atau terlalu keras. Coba lebih fleksibel dan dengarkan orang lain." },
  { id: 5, name: "The Hierophant", nameId: "Sang Pemimpin Spiritual",
    upright: "Ikuti nasihat yang sudah terbukti, dari guru atau tradisi yang baik.",
    reversed: "Ingin menentang aturan atau nasihat yang ada. Tetap sopan dan pikirkan dampaknya." },
  { id: 6, name: "The Lovers", nameId: "Dua Kekasih",
    upright: "Pilihan yang sesuai dengan nilai dan kata hatimu. Bisa juga tanda cinta atau kerja sama yang baik.",
    reversed: "Pilihan terasa sulit atau nilai-nilai tidak cocok. Pikirkan lagi apa yang paling penting." },
  { id: 7, name: "The Chariot", nameId: "Kereta",
    upright: "Kamu bisa maju dengan tekad dan kendali diri. Fokus pada tujuan dan terus jalan.",
    reversed: "Arah jadi kabur atau mudah emosi. Tenangkan diri lalu atur ulang arahmu." },
  { id: 8, name: "Justice", nameId: "Keadilan",
    upright: "Kebenaran akan terlihat. Bertindaklah jujur dan adil, dan konsekuensinya akan jelas.",
    reversed: "Merasa tidak adil, atau ada yang menghindar dari tanggung jawab. Lihat lagi dengan jujur." },
  { id: 9, name: "The Hermit", nameId: "Sang Pertapa",
    upright: "Waktunya menyendiri dan merenung. Cari arti dari apa yang sedang kamu jalani.",
    reversed: "Terlalu menutup diri atau terus terpaku pada masa lalu. Coba buka diri sedikit." },
  { id: 10, name: "Wheel of Fortune", nameId: "Roda Nasib",
    upright: "Perubahan sedang datang. Keadaan bisa berbalik ke arah yang lebih baik.",
    reversed: "Keadaan terasa tidak berpihak. Ini biasanya sementara, dan perubahan tetap bisa terjadi." },
  { id: 11, name: "Strength", nameId: "Kekuatan",
    upright: "Kekuatan datang dari sabar dan hati yang lembut, bukan dari paksaan.",
    reversed: "Merasa tidak percaya diri atau emosi meledak. Ingat lagi kekuatanmu sendiri." },
  { id: 12, name: "The Hanged Man", nameId: "Orang Tergantung",
    upright: "Waktunya berhenti sebentar dan melihat dari sudut pandang yang baru. Mungkin perlu menunggu.",
    reversed: "Menunda terlalu lama atau enggan berubah. Coba terima keadaan dan bergerak pelan-pelan." },
  { id: 13, name: "Death", nameId: "Kematian",
    upright: "Ini akhir dari sesuatu, dan itu membuka ruang untuk awal yang baru. Relakan yang sudah selesai.",
    reversed: "Sulit melepaskan hal lama. Perubahan memang berat, tapi kadang perlu." },
  { id: 14, name: "Temperance", nameId: "Penahanan Diri",
    upright: "Jaga keseimbangan dan sabar. Jangan terlalu berlebihan, jangan juga terlalu kurang.",
    reversed: "Hidup terasa tidak seimbang. Coba kembali ke ritme yang lebih tenang." },
  { id: 15, name: "The Devil", nameId: "Iblis",
    upright: "Hati-hati dengan hal yang membuatmu terikat, seperti kebiasaan buruk atau godaan.",
    reversed: "Mulai bisa lepas dari yang menahanmu. Sadari apa yang selama ini membebani." },
  { id: 16, name: "The Tower", nameId: "Menara",
    upright: "Kejadian tiba-tiba bisa mengguncang. Ini bisa menyakitkan, tapi membuka kebenaran.",
    reversed: "Perubahan yang keras tertunda atau dihindari. Kebenaran tetap akan datang." },
  { id: 17, name: "The Star", nameId: "Bintang",
    upright: "Ada harapan dan rasa tenang. Keadaan akan membaik, percayalah pada dirimu.",
    reversed: "Merasa putus asa atau lelah. Ingat, selalu ada cahaya di ujung jalan." },
  { id: 18, name: "The Moon", nameId: "Bulan",
    upright: "Keadaan terasa samar dan bikin takut. Jangan percaya semua yang terlihat di permukaan.",
    reversed: "Kebingungan mulai terang. Hadapi ketakutanmu pelan-pelan." },
  { id: 19, name: "The Sun", nameId: "Matahari",
    upright: "Hari-hari bahagia, berhasil, dan penuh semangat. Nikmati momen ini.",
    reversed: "Kebahagiaan tertunda, atau terlalu optimis. Istirahat sebentar juga penting." },
  { id: 20, name: "Judgement", nameId: "Penghakiman",
    upright: "Panggilan untuk bangkit dan memulai babak baru. Maafkan dirimu sendiri.",
    reversed: "Ragu menjawab panggilan atau terus menyesali masa lalu. Lepaskan rasa bersalah." },
  { id: 21, name: "The World", nameId: "Dunia",
    upright: "Sebuah perjalanan sudah selesai dengan baik. Kamu siap untuk babak berikutnya.",
    reversed: "Ada yang belum selesai. Tutup dengan baik supaya bisa maju." }
];

// Arcana Minor: [makna tegak, makna terbalik] untuk Ace..10, Page, Knight, Queen, King
const rankNames = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Page", "Knight", "Queen", "King"];
const rankNamesId = ["As", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Pelayan", "Kesatria", "Ratu", "Raja"];

const minorSuits = [
  {
    name: "Wands", nameId: "Tongkat", slug: "wands",
    meanings: [
      ["Ide dan semangat baru muncul. Ini saat yang tepat untuk mulai sesuatu.", "Semangat sedang hilang atau ide sulit dimulai. Coba mulai dari langkah kecil."],
      ["Kamu punya pilihan dan sedang merencanakan langkah berikutnya.", "Ragu-ragu soal rencana. Putuskan dulu arah yang ingin dituju."],
      ["Usahamu mulai berkembang. Peluang baru mulai terlihat di depan.", "Rencana belum berjalan sesuai harapan. Bersabar dan perbaiki langkahnya."],
      ["Saatnya merayakan dan senang bersama orang terdekat. Ada rasa aman di rumah.", "Suasana rumah atau kelompok sedang tidak stabil. Ada perubahan yang bikin tidak nyaman."],
      ["Ada persaingan atau beda pendapat. Ini ujian kecil, bukan masalah besar.", "Ingin menghindari konflik. Tetap jujur, tapi jangan terlalu keras."],
      ["Kamu mendapat pengakuan atau kemenangan. Rasa percaya dirimu sedang naik.", "Pujian belum datang, atau kamu terlalu membanggakan diri. Tetap rendah hati."],
      ["Kamu harus mempertahankan posisimu. Kamu mampu menghadapi tantangan ini.", "Merasa kewalahan oleh tekanan. Jangan menyerah, minta bantuan kalau perlu."],
      ["Kabar atau kejadian datang cepat. Bergeraklah, waktunya sudah pas.", "Terburu-buru dan kacau. Perlambat dan cek lagi sebelum bertindak."],
      ["Kamu hampir sampai, tapi sudah lelah. Tetap waspada, sebentar lagi selesai.", "Lelah dan terlalu curiga. Coba percaya pada orang yang bisa membantu."],
      ["Beban terasa berat karena tanggung jawabnya banyak. Pikirkan cara membagi tugas.", "Melepas beban yang tidak perlu. Minta bantuan, jangan memikul semuanya sendiri."],
      ["Ada kabar baru atau semangat untuk belajar. Coba hal yang menarik minatmu.", "Ide belum matang atau sering berubah-ubah. Fokus pada satu hal dulu."],
      ["Penuh energi dan semangat. Kamu sedang mengejar sesuatu dengan tekad.", "Terlalu buru-buru dan impulsif. Pelan-pelan agar tidak salah langkah."],
      ["Percaya diri dan hangat. Kamu bisa menarik perhatian orang dengan cara yang baik.", "Kurang percaya diri atau mudah cemburu. Ingat lagi nilai dirimu sendiri."],
      ["Pemimpin dengan tujuan yang jelas. Kamu bisa mengarahkan orang dengan baik.", "Keras kepala atau suka memerintah. Dengarkan pendapat orang lain."]
    ]
  },
  {
    name: "Cups", nameId: "Cawan", slug: "cups",
    meanings: [
      ["Perasaan baru yang tulus, seperti cinta atau rasa senang yang datang.", "Perasaan tertutup atau sedih. Beri waktu untuk dirimu sendiri."],
      ["Hubungan yang saling mengerti dan saling suka. Kerja sama yang baik.", "Salah paham atau hubungan sedang renggang. Bicarakan dengan jujur."],
      ["Waktunya bersenang-senang bersama teman. Kebersamaan membuat hati senang.", "Terlalu banyak gosip atau pesta. Jaga diri supaya tidak ikut-ikutan."],
      ["Sedang bosan atau tidak tertarik apa pun. Coba lihat lagi kesempatan di sekitarmu.", "Mulai bangkit dari rasa bosan. Ada peluang baru yang bisa kamu ambil."],
      ["Fokus pada rasa sedih atau sesal. Ada yang hilang, tapi belum semuanya hilang.", "Mulai menerima dan bangkit. Lihat hal-hal yang masih kamu punya."],
      ["Kenangan manis dan kebaikan dari masa lalu. Bisa juga datang bantuan dari teman lama.", "Terlalu larut di masa lalu. Coba lihat ke depan juga."],
      ["Banyak pilihan dan angan-angan. Pikirkan mana yang benar-benar kamu mau.", "Mulai bisa memilih dengan kepala dingin. Fokus pada satu pilihan yang nyata."],
      ["Kamu memilih meninggalkan sesuatu yang tidak lagi membuatmu bahagia.", "Takut pergi, padahal sudah waktunya. Beranikan diri untuk melangkah."],
      ["Keinginanmu hampir terkabul. Nikmati rasa puas ini.", "Merasa belum puas meski sudah punya banyak. Coba syukuri yang ada."],
      ["Bahagia bersama keluarga atau orang terdekat. Suasananya hangat dan damai.", "Ada keretakan dalam keluarga. Bicara baik-baik supaya akur lagi."],
      ["Ada kabar perasaan atau ide kreatif. Dengarkan kata hatimu.", "Terlalu sensitif atau dramatis. Coba tenangkan diri dulu."],
      ["Ada ajakan atau tawaran dari hati. Ikuti perasaanmu dengan bijak.", "Suasana hati naik-turun. Hati-hati dengan janji yang belum jelas."],
      ["Penuh kasih dan peka pada perasaan orang lain. Kamu bisa menenangkan orang.", "Terlalu memikirkan perasaan orang lain sampai lupa diri sendiri. Jaga batasmu."],
      ["Tenang dan bijak mengelola perasaan. Kamu bisa jadi tempat bersandar.", "Emosi sulit dikendalikan atau suka memanipulasi. Pelan-pelan belajar tenang."]
    ]
  },
  {
    name: "Swords", nameId: "Pedang", slug: "swords",
    meanings: [
      ["Pikiran jadi jernih. Kamu bisa melihat kebenaran dengan lebih jelas.", "Pikiran kacau atau keputusan keliru. Tenangkan diri sebelum memutuskan."],
      ["Sedang bimbang di antara dua pilihan. Mungkin perlu waktu untuk memutuskan.", "Menutup mata dari kenyataan. Coba lihat semua informasi dulu."],
      ["Hati sedang sedih atau terluka. Rasa sakit ini wajar dan akan berlalu.", "Mulai sembuh dan bisa memaafkan. Pelan-pelan lepaskan luka itu."],
      ["Waktunya istirahat dan menenangkan pikiran. Jangan buru-buru.", "Sulit beristirahat dan pikiran terus gelisah. Coba tidur cukup dan tenangkan diri."],
      ["Ada konflik atau perselisihan. Menang pun bisa terasa tidak enak.", "Ingin berdamai dan memperbaiki hubungan. Lepaskan ego."],
      ["Sedang bergerak meninggalkan masalah menuju keadaan yang lebih tenang.", "Sulit lepas dari masalah lama. Butuh waktu untuk pindah ke keadaan baru."],
      ["Hati-hati, ada yang mungkin menghindar atau tidak jujur. Cek ulang rencanamu.", "Mulai jujur dan mengakui kesalahan. Keadaan bisa membaik."],
      ["Merasa terjebak, padahal sebenarnya ada jalan keluar. Rasa takut membuatmu merasa terkurung.", "Mulai melihat jalan keluar. Kamu lebih bebas dari yang kamu kira."],
      ["Sering khawatir dan susah tidur. Pikiran cemas sering lebih besar dari kenyataan.", "Mulai merasa lega. Rasa takut perlahan mereda."],
      ["Keadaan terasa sangat berat dan mencapai titik terendah. Ini akan berlalu.", "Mulai bangkit dari keterpurukan. Ada harapan setelah masa berat ini."],
      ["Rasa ingin tahu besar. Pelajari hal baru, tapi tetap waspada.", "Sering bicara tanpa berpikir atau suka menggosip. Hati-hati dengan kata-kata."],
      ["Bertindak cepat dan tegas. Kamu sedang mengejar tujuan dengan semangat.", "Terlalu agresif atau tidak sabar. Pelan-pelan agar tidak melukai orang lain."],
      ["Cerdas, jujur, dan mandiri dalam berpikir. Kamu bisa bicara apa adanya dengan baik.", "Terlalu keras atau dingin. Coba lebih lembut saat bicara."],
      ["Berpikir logis dan adil. Kamu bisa memimpin dengan aturan yang jelas.", "Kaku atau memakai kekuasaan dengan semena-mena. Tetap adil pada semua orang."]
    ]
  },
  {
    name: "Pentacles", nameId: "Koin", slug: "pentacles",
    meanings: [
      ["Peluang baru soal uang, pekerjaan, atau kesehatan. Mulai dengan langkah nyata.", "Peluang bisa terlewat. Rencanakan dengan lebih matang."],
      ["Kamu sedang mengurus banyak hal sekaligus. Jaga keseimbangannya.", "Kewalahan dan berantakan. Pilih prioritas yang paling penting."],
      ["Kerja sama dan keahlian dihargai. Hasil bagus bisa datang dari kerja tim.", "Kurang kerja sama atau hasilnya kurang bagus. Perbaiki komunikasi dalam tim."],
      ["Berhati-hati dengan uang dan barang. Menjaga apa yang kamu punya itu penting.", "Terlalu pelit atau takut kehilangan. Coba lebih terbuka."],
      ["Sedang sulit atau merasa sendirian. Bantuan bisa datang kalau kamu mencarinya.", "Keadaan mulai membaik. Bangkit kembali pelan-pelan."],
      ["Berbagi dan membantu orang lain. Kebaikan akan kembali padamu.", "Ada utang atau syarat yang berat. Cek lagi apakah sudah adil untuk semua pihak."],
      ["Sabar menunggu hasil. Kerja kerasmu mulai terlihat pelan-pelan.", "Tidak sabar dan ingin cepat. Evaluasi hasil yang belum sesuai harapan."],
      ["Rajin dan teliti dalam belajar atau bekerja. Latihan terus membuatmu makin mahir.", "Terlalu ingin sempurna atau malas. Fokus pada hal yang benar-benar penting."],
      ["Mandiri dan bisa menikmati hasil kerja sendiri. Kamu pantas merasa nyaman.", "Bergantung pada orang lain atau keuangan belum stabil. Mulai rencanakan uangmu."],
      ["Keluarga dan warisan yang stabil. Hal yang dibangun untuk jangka panjang.", "Konflik keluarga soal harta atau tanggung jawab. Bicarakan dengan terbuka."],
      ["Semangat belajar hal baru soal uang atau keterampilan. Mulai dari yang kecil.", "Kurang fokus atau boros. Catat pengeluaran dan selesaikan satu hal dulu."],
      ["Bekerja pelan tapi pasti dan bisa diandalkan. Konsisten itu kuncinya.", "Terlalu lambat atau bosan dengan rutinitas. Coba cari tantangan kecil."],
      ["Hangat dan praktis. Kamu bisa mengurus rumah dan keuangan dengan baik.", "Terlalu khawatir soal uang atau terlalu mengatur. Coba santai sedikit."],
      ["Stabil dan sukses dalam pekerjaan. Kamu bisa memimpin dengan bijak.", "Terlalu mementingkan uang atau keras kepala. Ingat hal lain yang juga penting."]
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
