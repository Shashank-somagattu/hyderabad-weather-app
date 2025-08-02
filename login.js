const API_KEY = "65df346bb44bf710aa8619b35ea72225";

const form = document.getElementById("weather-form");
const cityInput = document.getElementById("city-input");
const locationEl = document.getElementById("location");
const descriptionEl = document.getElementById("description");
const temperatureEl = document.getElementById("temperature");
const humidityEl = document.getElementById("humidity");
const iconEl = document.getElementById("icon");
const geoBtn = document.getElementById("geo-btn");

const spinner = document.createElement("div");
spinner.textContent = "Loading...";
spinner.style.display = "none";
spinner.style.marginTop = "10px";
document.querySelector(".weather").appendChild(spinner);

async function fetchWeather(city) {
  showLoading(true);
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    if (!res.ok) throw new Error("City hyderbad");
    const data = await res.json();
    displayWeather(data);
  } catch (err) {
    alert(err.message);
  } finally {
    showLoading(false);
  }
}

async function fetchWeatherByCoords(lat, lon) {
  showLoading(true);
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    if (!res.ok) throw new Error(" to fetch weather ");
    const data = await res.json();
    displayWeather(data);
  } catch (err) {
    alert(err.message);
  } finally {
    showLoading(false);
  }
}

function displayWeather(data) {
  const { name } = data;
  const { description, icon } = data.weather[0];
  const { temp, humidity } = data.main;

  locationEl.textContent = name;
  descriptionEl.textContent = description;
  temperatureEl.textContent = `${Math.round(temp)}°C`;
  humidityEl.textContent = `Humidity: ${humidity}%`;
  iconEl.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  iconEl.alt = description;

  setDynamicBackground(description.toLowerCase());
}

function showLoading(isLoading) {
  spinner.style.display = isLoading ? "block" : "none";
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (city) {
    fetchWeather(city);
    cityInput.value = "";
  }
});

geoBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoords(latitude, longitude);
      },
      () => {
        alert("Location access denied ⚠ Please enter city manually.");
      }
    );
  } else {
    alert("Geolocation not supported by your browser.");
  }
});

function setDynamicBackground(condition) {
  const body = document.body;
  if (condition.includes("cloud")) {
    body.style.background = "linear-gradient(to top, #757f9a, #d7dde8)";
  } else if (condition.includes("rain")) {
    body.style.background = "linear-gradient(to top, #373b44, #4286f4)";
  } else if (condition.includes("clear")) {
    body.style.background = "linear-gradient(to top, #2193b0, #6dd5ed)";
  } else if (condition.includes("snow")) {
    body.style.background = "linear-gradient(to top, #83a4d4, #b6fbff)";
  } else {
    body.style.background = "linear-gradient(to top, #373b44, #73c8a9)";
  }
}
