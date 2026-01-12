const request = require("postman-request");

const prediksiCuaca = (latitude, longitude, callback) => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weathercode`;

  request({ url, json: true }, (error, { body } = {}) => {
    if (error) {
      callback("Tidak dapat menghubungi layanan cuaca!", undefined);
    } else if (!body || !body.current) {
      callback("Data cuaca tidak ditemukan!", undefined);
    } else {
      const suhu = body.current.temperature_2m;
      const kode = body.current.weathercode;

      let kondisi = "Cerah";
      if (kode >= 45 && kode <= 48) kondisi = "Berkabut";
      else if (kode >= 51 && kode <= 67) kondisi = "Gerimis";
      else if (kode >= 80 && kode <= 99) kondisi = "Hujan Lebat";

      callback(undefined, `Kondisi: ${kondisi}, Suhu: ${suhu}°C`);
    }
  });
};

module.exports = prediksiCuaca;
