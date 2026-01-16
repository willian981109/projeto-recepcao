const fs = require("fs");
const path = require("path");
const readline = require("readline");
const db = require("./src/database/connection");

// =============================
// USO:
// node import-guests.js EVENTO_ID arquivo.csv
// =============================

const eventoId = process.argv[2];
const arquivo = process.argv[3];

if (!eventoId || !arquivo) {
  console.error("❌ Uso correto:");
  console.error("node import-guests.js EVENTO_ID arquivo.csv");
  process.exit(1);
}

const caminhoArquivo = path.resolve(arquivo);

if (!fs.existsSync(caminhoArquivo)) {
  console.error("❌ Arquivo CSV não encontrado:", caminhoArquivo);
  process.exit(1);
}

const rl = readline.createInterface({
  input: fs.createReadStream(caminhoArquivo),
  crlfDelay: Infinity
});

let linha = 0;
let totalInseridos = 0;
let pendentes = 0;

console.log("📥 Iniciando importação...");
console.log("Evento ID:", eventoId);

db.serialize(() => {
  rl.on("line", (conteudo) => {
    linha++;

    const texto = conteudo.replace(/^\uFEFF/, "").trim();

    // pula cabeçalho
    if (linha === 1) return;
    if (!texto) return;

    pendentes++;

    db.run(
      `
      INSERT INTO guests (event_id, name)
      VALUES (?, ?)
      `,
      [eventoId, texto],
      (err) => {
        pendentes--;
        if (!err) totalInseridos++;
      }
    );
  });

  rl.on("close", () => {
    const espera = setInterval(() => {
      if (pendentes === 0) {
        clearInterval(espera);
        console.log("✅ Importação finalizada");
        console.log("Total de convidados importados:", totalInseridos);
        process.exit(0);
      }
    }, 50);
  });
});
