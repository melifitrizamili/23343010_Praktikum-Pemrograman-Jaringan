// API Keys (Ganti dengan API key Anda)
const WEATHER_API_KEY = "your_openweather_api_key_here";
const MEDIASTACK_API_KEY = "your_mediastack_api_key_here";

// Weather API Functions
async function getWeather() {
  const cityInput = document.getElementById("cityInput");
  const weatherResult = document.getElementById("weatherResult");

  if (!cityInput || !weatherResult) return;

  const city = cityInput.value.trim();

  if (!city) {
    weatherResult.innerHTML = '<p style="color: red;">Masukkan nama kota terlebih dahulu!</p>';
    return;
  }

  try {
    weatherResult.innerHTML = "<p>Memuat data cuaca...</p>";

    const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Kota tidak ditemukan");
    }

    const data = await response.json();

    const weatherHTML = `
            <h3>Cuaca di ${data.name}, ${data.sys.country}</h3>
            <p><strong>Suhu:</strong> ${Math.round(data.main.temp)}°C</p>
            <p><strong>Kondisi:</strong> ${data.weather[0].description}</p>
            <p><strong>Kelembaban:</strong> ${data.main.humidity}%</p>
            <p><strong>Kecepatan Angin:</strong> ${data.wind.speed} m/s</p>
            <p><strong>Tekanan:</strong> ${data.main.pressure} hPa</p>
        `;

    weatherResult.innerHTML = weatherHTML;
  } catch (error) {
    weatherResult.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
  }
}

// News API Functions
async function fetchNews(category = "id") {
  const newsContainer = document.getElementById("newsContainer");
  const loading = document.getElementById("loading");
  const errorMessage = document.getElementById("errorMessage");

  if (!newsContainer || !loading || !errorMessage) return;

  // Hide previous content
  newsContainer.innerHTML = "";
  errorMessage.style.display = "none";
  loading.style.display = "block";

  try {
    const response = await fetch(`/api/news?category=${category}`);

    if (!response.ok) {
      throw new Error("Gagal mengambil data berita");
    }

    const data = await response.json();

    if (!data.news || data.news.length === 0) {
      throw new Error("Tidak ada berita ditemukan");
    }

    displayNews(data.news);
  } catch (error) {
    console.error("Error fetching news:", error);
    newsContainer.innerHTML = "";
    errorMessage.style.display = "block";
  } finally {
    loading.style.display = "none";
  }
}

function displayNews(news) {
  const newsContainer = document.getElementById("newsContainer");

  if (!newsContainer) return;

  if (!news || news.length === 0) {
    newsContainer.innerHTML = "<p>Tidak ada berita ditemukan.</p>";
    return;
  }

  const newsHTML = news
    .map(
      (article) => `
        <div class="news-card">
            <h3>${article.title || "Judul tidak tersedia"}</h3>
            <p>${article.description || "Deskripsi tidak tersedia"}</p>
            <div class="news-meta">
                <span>Source: ${article.source || "Tidak diketahui"}</span>
                <span>${new Date(article.published_at).toLocaleDateString("id-ID")}</span>
            </div>
            ${article.url ? `<a href="${article.url}" target="_blank" style="color: #667eea; text-decoration: none;">Baca selengkapnya →</a>` : ""}
        </div>
    `
    )
    .join("");

  newsContainer.innerHTML = newsHTML;
}

// Event listener untuk Enter key pada input cuaca
document.addEventListener("DOMContentLoaded", function () {
  const cityInput = document.getElementById("cityInput");
  if (cityInput) {
    cityInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        getWeather();
      }
    });
  }

  // Load default news when page loads
  if (window.location.pathname.includes("/berita")) {
    fetchNews("id");
  }
});
