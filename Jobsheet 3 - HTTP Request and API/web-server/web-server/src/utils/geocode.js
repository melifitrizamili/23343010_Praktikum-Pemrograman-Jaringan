const request = require("postman-request");

const geocode = (alamat, callback) => {
  const url = `https://geocode.maps.co/search?q=${encodeURIComponent(alamat)}&api_key=YOUR_API_KEY`;

  request({ url, json: true }, (error, { body } = {}) => {
    if (error) {
      callback("Tidak bisa terhubung ke layanan lokasi!", undefined);
    } else if (!body || body.length === 0) {
      callback("Lokasi tidak ditemukan, coba kata lain!", undefined);
    } else {
      const data = body[0];
      callback(undefined, {
        latitude: data.lat,
        longitude: data.lon,
        lokasi: data.display_name,
      });
    }
  });
};

module.exports = geocode;
