// Polaritas tiap kartu untuk jawaban ya/tidak.
// "pos" = cenderung ya, "neg" = cenderung tidak, "neu" = belum jelas / tergantung.
// Kartu terbalik membalik polaritas "pos" dan "neg"; "neu" tetap.
// Urutan sama dengan id kartu (0..77).

const cardPolarity = [
  // Arcana Mayor 0-21
  "pos", "pos", "neu", "pos", "pos", "neu", "pos", "pos", "neu", "neu", "neu",
  "pos", "neu", "neu", "pos", "neg", "neg", "pos", "neg", "pos", "pos", "pos",
  // Tongkat 22-35
  "pos", "neu", "pos", "pos", "neg", "pos", "neu", "pos", "neg", "neg", "neu", "pos", "pos", "pos",
  // Cawan 36-49
  "pos", "pos", "pos", "neg", "neg", "neu", "neu", "neg", "pos", "pos", "neu", "neu", "pos", "pos",
  // Pedang 50-63
  "neu", "neu", "neg", "neu", "neg", "neu", "neg", "neg", "neg", "neg", "neu", "neu", "neu", "neu",
  // Koin 64-77
  "pos", "neu", "pos", "neu", "neg", "pos", "neu", "pos", "pos", "pos", "neu", "neu", "pos", "pos",
];
