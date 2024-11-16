document.addEventListener('DOMContentLoaded', () => {
  const cityInput = document.getElementById('city-input');
  const searchButton = document.getElementById('search-button');
  const weatherInfo = document.querySelector('.weather-info');
  const weatherIcon = document.querySelector('.weather-icon');
  const temperatureElem = document.querySelector('.temperature');
  const descriptionElem = document.querySelector('.description');
  const errorMessage = document.querySelector('.error-message');

  const fetchWeatherData = (latitude, longitude) => {
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.current_weather) {
          const { temperature, weathercode } = data.current_weather;

          // Update UI with weather data
          temperatureElem.textContent = `${temperature}°C`;
          descriptionElem.textContent = getWeatherDescription(weathercode);
          weatherIcon.src = getWeatherIconUrl(weathercode);
          weatherIcon.alt = getWeatherDescription(weathercode); // Add alt text for accessibility

          weatherInfo.style.display = 'block';
          errorMessage.textContent = '';
        } else {
          throw new Error('No weather data found.');
        }
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
        errorMessage.textContent = 'Unable to fetch weather data.';
        weatherInfo.style.display = 'none';
      });
  };

  const fetchCoordinates = (city) => {
    const url = `/api/geocode?city=${city}`; // Proxy request to the server

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.results && data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry;

          // Fetch weather data with the latitude and longitude
          fetchWeatherData(lat, lng);
        } else {
          throw new Error('No coordinates found for the city.');
        }
      })
      .catch((error) => {
        console.error('Error fetching coordinates:', error);
        errorMessage.textContent = 'Unable to find the location.';
      });
  };

  searchButton.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
      fetchCoordinates(city);
    } else {
      alert('Please enter a city name.');
    }
  });

  const getWeatherDescription = (code) => {
    const descriptions = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      61: 'Slight rain',
      80: 'Rain showers',
      95: 'Thunderstorm',
    };
    return descriptions[code] || 'Unknown weather condition';
  };

  const getWeatherIconUrl = (code) => {
    const iconBaseUrl = './icons/'; // Path to the "icons" folder
    const icons = {
      0: 'clear_sky.png',
      1: 'mainly_clear.png',
      2: 'partly_cloudy.png',
      3: 'overcast.png',
      45: 'fog.png',
      61: 'rain.png',
      95: 'thunderstorm.png',
    };
    return iconBaseUrl + (icons[code] || 'default.png'); // Default fallback
  };
});
