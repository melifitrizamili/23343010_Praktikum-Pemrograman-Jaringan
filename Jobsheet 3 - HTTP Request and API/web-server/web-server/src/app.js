const express = require("express");
const path = require("path");
const hbs = require("hbs");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 4000;

// PATH CONFIGURATION YANG BENAR - SESUAI STRUKTUR FOLDER ANDA
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// Debug: Tampilkan path untuk memastikan benar
console.log("Current directory:", __dirname);
console.log("Views path:", viewsPath);
console.log("Partials path:", partialsPath);
console.log("Public path:", publicDirectoryPath);

// Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

// API Keys
const WEATHER_API_KEY = process.env.WEATHER_API_KEY || "your_openweather_api_key_here";
const NEWS_API_KEY = "cc6ab3f970a2fd1e02f0c20b65952672";

// Routes
app.get("/", (req, res) => {
  res.render("index", {
    title: "Aplikasi Cek Cuaca",
  });
});

app.get("/tentang", (req, res) => {
  res.render("tentang", {
    title: "Tentang Saya",
  });
});

app.get("/berita", async (req, res) => {
  try {
    // Coba ambil berita dari NewsAPI
    const newsResponse = await axios.get(`https://newsapi.org/v2/top-headlines?country=id&pageSize=5&apiKey=${NEWS_API_KEY}`);
    const newsData = newsResponse.data.articles || [];

    res.render("berita", {
      title: "Berita Terkini",
      news: newsData,
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    // Fallback news data jika API error
    const fallbackNews = [
      {
        title: "Aplikasi WeatherApp Berhasil Dibuat!",
        description: "Mahasiswa berhasil membuat aplikasi cek cuaca dengan integrasi API sebagai tugas UTS Pemrograman Jaringan.",
        source: { name: "Tech News" },
        publishedAt: new Date().toISOString(),
        url: "#",
      },
      {
        title: "Teknologi Web Development Terkini",
        description: "JavaScript dan Node.js menjadi teknologi populer untuk pengembangan aplikasi web modern.",
        source: { name: "Development Update" },
        publishedAt: new Date().toISOString(),
        url: "#",
      },
    ];

    res.render("berita", {
      title: "Berita Terkini",
      news: fallbackNews,
    });
  }
});

app.get("/bantuan", (req, res) => {
  res.render("bantuan", {
    title: "Bantuan",
  });
});

// API Routes
app.get("/api/weather", async (req, res) => {
  try {
    const city = req.query.city;

    if (!city) {
      return res.status(400).json({ error: "Kota harus diisi" });
    }

    const demoWeather = {
      name: city,
      sys: { country: "ID" },
      main: {
        temp: Math.floor(Math.random() * 10) + 25,
        humidity: Math.floor(Math.random() * 30) + 60,
        pressure: 1010 + Math.floor(Math.random() * 10),
      },
      weather: [
        {
          description: ["cerah", "berawan", "hujan ringan", "mendung"][Math.floor(Math.random() * 4)],
        },
      ],
      wind: {
        speed: (Math.random() * 5 + 1).toFixed(1),
      },
    };

    res.json(demoWeather);
  } catch (error) {
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

app.get("/api/news", async (req, res) => {
  try {
    const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=id&pageSize=5&apiKey=${NEWS_API_KEY}`);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching news:", error);
    // Fallback data
    const fallbackNews = [
      {
        title: "Aplikasi WeatherApp Berhasil Dibuat!",
        description: "Mahasiswa berhasil membuat aplikasi cek cuaca dengan integrasi API.",
        source: { name: "Tech News" },
        publishedAt: new Date().toISOString(),
        url: "#",
      },
    ];
    res.json({ articles: fallbackNews });
  }
});

// 404 handler
app.get("*", (req, res) => {
  res.render("404", {
    title: "404 - Halaman Tidak Ditemukan",
    errorMessage: "Halaman yang Anda cari tidak ditemukan.",
  });
});

app.listen(port, () => {
  console.log(`🚀 Server berjalan di http://localhost:${port}`);
  console.log(`📰 Halaman Berita: http://localhost:${port}/berita`);
  console.log(`👤 Tentang Saya: http://localhost:${port}/tentang`);
  console.log(`❓ Bantuan: http://localhost:${port}/bantuan`);
  console.log(`🏠 Beranda: http://localhost:${port}/`);
});
