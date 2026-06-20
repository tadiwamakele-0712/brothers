const form = document.getElementById("weatherForm");
  const cityInput = document.getElementById("cityInput");
  const weatherResult = document.getElementById("weatherResult");
  const cityName = document.getElementById("cityName");
  const temperature = document.getElementById("temperature");
  const description = document.getElementById("description");
  const humidity = document.getElementById("humidity");
  const errorMsg = document.getElementById("errorMsg");
  const loading = document.getElementById("loading");
  // API key - nyora yako pa https://openweathermap.org/api (free)
  const API_KEY = "YOUR_API_KEY_HERE";
  form.addEventListener("submit", function(event) {
      event.preventDefault();
      const city = cityInput.value.trim();
      if (city === "") return;
      showLoading(true);
      hideError();
      weatherResult.classList.add("hidden");
      const url = "https://api.openweathermap.org/data/2.5/weather?q="
          + encodeURIComponent(city)
          + "&appid=" + API_KEY
          + "&units=metric&lang=en";
      fetch(url)
          .then(function(response) {
              if (!response.ok) {
                  throw new Error("Guta harina kuwanikwa");
              }
              return response.json();
          })
          .then(function(data) {
              showWeather(data);
          })
          .catch(function(error) {
              showError(error.message);
          })
          .finally(function() {
              showLoading(false);
          });
  });
  function showWeather(data) {
      cityName.textContent = data.name + ", " + data.sys.country;
      temperature.textContent = Math.round(data.main.temp) + "°C";
      description.textContent = data.weather[0].description;
      humidity.textContent = "Humidity: " + data.main.humidity + "%";
      weatherResult.classList.remove("hidden");
  }
  function showError(message) {
      errorMsg.textContent = message;
      errorMsg.classList.remove("hidden");
  }
  function hideError() {
      errorMsg.classList.add("hidden");
  }
  function showLoading(show) {
      if (show) {
          loading.classList.remove("hidden");
      } else {
          loading.classList.add("hidden");
      }
  }