const fs = require("fs");
const chalk = require("chalk");

/* =========================
   Ambil Catatan
========================= */
const ambilCatatan = function () {
  return "Ini Catatan Meli Fitri Zamili";
};

/* =========================
   Tambah Catatan (DIPERBAIKI)
   Judul BOLEH sama
========================= */
const tambahCatatan = function (judul, isi) {
  const catatan = muatCatatan();

  // LANGSUNG TAMBAH TANPA CEK JUDUL GANDA
  catatan.push({ judul, isi });
  simpanCatatan(catatan);

  console.log(chalk.green.inverse("Catatan baru ditambahkan!"));
};

/* =========================
   Simpan & Muat Catatan (JSON)
========================= */
const simpanCatatan = function (catatan) {
  const dataJSON = JSON.stringify(catatan, null, 2);
  fs.writeFileSync("catatan.json", dataJSON);
};

const muatCatatan = function () {
  try {
    const dataBuffer = fs.readFileSync("catatan.json");
    const dataJSON = dataBuffer.toString();
    return JSON.parse(dataJSON);
  } catch (error) {
    return [];
  }
};

/* =========================
   Hapus Catatan
========================= */
const hapusCatatan = function (judul) {
  const catatan = muatCatatan();
  const catatanUntukDisimpan = catatan.filter((note) => note.judul !== judul);

  if (catatan.length > catatanUntukDisimpan.length) {
    simpanCatatan(catatanUntukDisimpan);
    console.log(chalk.green.inverse("Catatan dihapus!"));
  } else {
    console.log(chalk.red.inverse("Catatan tidak ditemukan!"));
  }
};

/* =========================
   Baca Semua Catatan
========================= */
const bacaSemua = function () {
  const semuaCatatan = muatCatatan();

  if (semuaCatatan.length === 0) {
    console.log(chalk.red.inverse("Catatan kosong!"));
    return;
  }

  semuaCatatan.forEach(({ judul, isi }, index) => {
    console.log(`${index + 1}. ${judul}`);
    console.log(isi);
    console.log("-------------------");
  });

  console.log(chalk.green.inverse("Semua catatan berhasil ditampilkan!"));
};

/* =========================
   Baca Catatan Berdasarkan Judul
========================= */
const bacaJudul = function (judulDicari) {
  const semuaCatatan = muatCatatan();
  const target = semuaCatatan.find((catatan) => catatan.judul === judulDicari);

  if (!target) {
    console.log(chalk.red.inverse(`Catatan dengan judul "${judulDicari}" tidak ditemukan!`));
    return;
  }

  console.log(chalk.blue.inverse(target.judul));
  console.log(target.isi);
  console.log(chalk.green.inverse("Sebuah catatan berhasil ditampilkan"));
};

/* =========================
   Buat File catatan.txt
========================= */
const buatCatatanTxt = function () {
  const semuaCatatan = muatCatatan();

  if (semuaCatatan.length === 0) {
    console.log(chalk.red.inverse("Tidak ada catatan untuk ditulis ke file txt"));
    return;
  }

  let isiTxt = "DAFTAR CATATAN PRAKTIKUM NODE.JS\n";
  isiTxt += "Nama : Meli Fitri Zamili\n";
  isiTxt += "NIM  : 23343010\n\n";

  semuaCatatan.forEach((catatan, index) => {
    isiTxt += `${index + 1}. ${catatan.judul}\n`;
    isiTxt += `${catatan.isi}\n\n`;
  });

  fs.writeFileSync("catatan.txt", isiTxt);
  console.log(chalk.green.inverse("catatan.txt berhasil dibuat"));
};

/* =========================
   Export Module
========================= */
module.exports = {
  ambilCatatan,
  tambahCatatan,
  hapusCatatan,
  bacaSemua,
  bacaJudul,
  buatCatatanTxt,
};
