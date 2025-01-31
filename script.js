class WeatherApp {
  constructor() {
    this.form = document.getElementById('search-form');
    this.cityInput = document.getElementById('city-input');
    this.loading = document.getElementById('loading');
    this.weatherInfo = document.getElementById('weather-info');

    this.cityName = document.getElementById('city-name');
    this.weatherDescription = document.getElementById('weather-description');
    this.temp = document.getElementById('temp');
    this.feelsLike = document.getElementById('feels-like');
    this.humidity = document.getElementById('humidity');
    this.windSpeed = document.getElementById('wind-speed');
    this.forecast = document.getElementById('forecast');

    this.apiKey = 'ba8604db53dfd8ef8512c433b5e14df6'; 
    this.apiBaseUrl = 'https://api.openweathermap.org/data/2.5';

    this.init();
  }

  init() {
    this.form.addEventListener('submit', (e) => this.handleSearch(e));
  }

  async handleSearch(e) {
    e.preventDefault();
    const city = this.cityInput.value.trim();
    if (!city) return;

    this.showLoading();

    try {
      const weatherData = await this.fetchWeather(city);
      const forecastData = await this.fetchForecast(city);

      this.displayWeather(weatherData);
      this.displayForecast(forecastData);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      alert('Unable to fetch weather data. Please try again.');
    } finally {
      this.hideLoading();
    }
  }

  showLoading() {
    this.loading.classList.remove('hidden');
    this.weatherInfo.classList.add('hidden');
  }

  hideLoading() {
    this.loading.classList.add('hidden');
    this.weatherInfo.classList.remove('hidden');
  }

  async fetchWeather(city) {
    const response = await fetch(
      `${this.apiBaseUrl}/weather?q=${city}&units=metric&appid=${this.apiKey}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch weather for ${city}`);
    }
    const data = await response.json();
    return {
      city: data.name,
      description: data.weather[0].description,
      temp: data.main.temp,
      feelsLike: data.main.feels_like,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
    };
  }

  async fetchForecast(city) {
    const response = await fetch(
      `${this.apiBaseUrl}/forecast?q=${city}&units=metric&appid=${this.apiKey}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch forecast for ${city}`);
    }
    const data = await response.json();
    return data.list.filter((item, index) => index % 8 === 0); 
  }

  displayWeather(data) {
    this.cityName.textContent = data.city;
    this.weatherDescription.textContent = data.description;
    this.temp.textContent = `${data.temp}`;
    this.feelsLike.textContent = `${data.feelsLike}°C`;
    this.humidity.textContent = `${data.humidity}%`;
    this.windSpeed.textContent = `${data.windSpeed} km/h`;
  }

  displayForecast(forecastData) {
    this.forecast.innerHTML = '';

    forecastData.forEach((item) => {
      const date = new Date(item.dt * 1000); 
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const temp = Math.round(item.main.temp);
      const icon = item.weather[0].icon.includes('d') ? 'sun' : 'cloud-moon';
      const iconColor = icon === 'sun' ? '#eab308' : '#3b82f6';

      const forecastItem = document.createElement('div');
      forecastItem.className = 'forecast-item';
      forecastItem.innerHTML = `
        <span class="forecast-day">${dayName}</span>
        <i data-lucide="${icon}" class="forecast-icon" style="color: ${iconColor}"></i>
        <span class="forecast-temp">${temp}°C</span>
      `;

      this.forecast.appendChild(forecastItem);
    });


    lucide.createIcons();
  }
}


new WeatherApp();

