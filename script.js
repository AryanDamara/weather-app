/* ===========================
   WEATHER APP - MAIN SCRIPT
   =========================== */

// ===========================
// CONFIGURATION
// ===========================

const GEOCODE_API = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_API = "https://api.open-meteo.com/v1/forecast";

// ===========================
// DOM ELEMENTS
// ===========================

const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const errorMessage = document.getElementById("error-message");
const placeholder = document.getElementById("placeholder");
const currentWeather = document.getElementById("current-weather");

// Weather display elements
const cityName = document.getElementById("city-name");
const currentDate = document.getElementById("current-date");
const weatherIcon = document.getElementById("weather-icon");
const temperature = document.getElementById("temperature");
const weatherDescription = document.getElementById("weather-description");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");
const pressure = document.getElementById("pressure");
const visibility = document.getElementById("visibility");
const feelsLike = document.getElementById("feels-like");
const cloudiness = document.getElementById("cloudiness");

// ===========================
// EVENT LISTENERS
// ===========================

searchBtn.addEventListener("click", handleSearch);
searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        handleSearch();
    }
});

// ===========================
// MAIN FUNCTIONS
// ===========================

/**
 * Handle search button click
 */
async function handleSearch() {
    const city = searchInput.value.trim();

    // Clear previous errors
    clearError();

    // Validate input
    if (!city) {
        showError("Please enter a city name");
        return;
    }

    try {
        // Show loading state
        showLoading();

        // Get coordinates from city name
        const coordinates = await getCoordinates(city);

        if (!coordinates) {
            showError(`City "${city}" not found. Please try again.`);
            return;
        }

        // Get weather data using coordinates
        const weatherData = await getWeatherData(coordinates.lat, coordinates.lon);
        
        if (weatherData) {
            // Display weather data
            displayWeather(weatherData, coordinates);
            
            // Clear search input
            searchInput.value = "";
        }
    } catch (error) {
        console.error("Error:", error);
        showError("Something went wrong. Please try again later.");
    }
}

/**
 * Get coordinates (latitude and longitude) from city name
 * @param {string} city - City name
 * @returns {Object|null} - Object with lat and lon, or null if not found
 */
async function getCoordinates(city) {
    try {
        const url = `${GEOCODE_API}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.results || data.results.length === 0) {
            return null;
        }
        
        return {
            lat: data.results[0].latitude,
            lon: data.results[0].longitude,
            name: data.results[0].name,
            country: data.results[0].country || ''
        };
    } catch (error) {
        console.error("Error getting coordinates:", error);
        throw error;
    }
}

/**
 * Get weather data from Open-Meteo API
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Object|null} - Weather data object or null
 */
async function getWeatherData(lat, lon) {
    try {
        const params = new URLSearchParams({
            latitude: lat,
            longitude: lon,
            current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,cloud_cover,surface_pressure,wind_speed_10m',
            wind_speed_unit: 'ms',
            timezone: 'auto'
        });
        
        const url = `${WEATHER_API}?${params.toString()}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error getting weather data:", error);
        throw error;
    }
}

/**
 * Get weather description from WMO weather code
 */
function getWeatherDetails(wmoCode, isDay) {
    const isDayBool = isDay === 1;
    let description = "Unknown";
    let iconUrl = "01d";
    
    // WMO Weather interpretation codes
    if (wmoCode === 0) { description = "Clear Sky"; iconUrl = isDayBool ? "01d" : "01n"; }
    else if (wmoCode === 1) { description = "Mainly Clear"; iconUrl = isDayBool ? "02d" : "02n"; }
    else if (wmoCode === 2) { description = "Partly Cloudy"; iconUrl = isDayBool ? "03d" : "03n"; }
    else if (wmoCode === 3) { description = "Overcast"; iconUrl = isDayBool ? "04d" : "04n"; }
    else if ([45, 48].includes(wmoCode)) { description = "Fog"; iconUrl = isDayBool ? "50d" : "50n"; }
    else if ([51, 53, 55, 56, 57].includes(wmoCode)) { description = "Drizzle"; iconUrl = "09d"; }
    else if ([61, 63, 65, 66, 67].includes(wmoCode)) { description = "Rain"; iconUrl = "10d"; }
    else if ([71, 73, 75, 77, 85, 86].includes(wmoCode)) { description = "Snow"; iconUrl = "13d"; }
    else if ([80, 81, 82].includes(wmoCode)) { description = "Rain Showers"; iconUrl = "09d"; }
    else if ([95, 96, 99].includes(wmoCode)) { description = "Thunderstorm"; iconUrl = "11d"; }
    
    return { description, iconUrl };
}

/**
 * Display weather data on the page
 * @param {Object} data - Weather data from API
 * @param {Object} coordinates - Location info
 */
function displayWeather(data, coordinates) {
    try {
        // Hide placeholder and show current weather
        placeholder.classList.add("hidden");
        currentWeather.classList.remove("hidden");
        
        const current = data.current;
        const { description, iconUrl } = getWeatherDetails(current.weather_code, current.is_day);
        
        // Extract data
        const temp = Math.round(current.temperature_2m);
        const feelsLikeTemp = Math.round(current.apparent_temperature);
        const humidityValue = current.relative_humidity_2m;
        const windSpeedValue = current.wind_speed_10m.toFixed(1);
        const pressureValue = Math.round(current.surface_pressure);
        const cloudinessValue = current.cloud_cover;
        
        // Note: Open-Meteo current response doesn't provide visibility by default.
        const visibilityValue = "N/A";
        
        // Update DOM elements
        cityName.textContent = `${coordinates.name}${coordinates.country ? ', ' + coordinates.country : ''}`;
        currentDate.textContent = getCurrentDate();
        weatherIcon.src = `https://openweathermap.org/img/wn/${iconUrl}@4x.png`;
        weatherIcon.alt = description;
        temperature.textContent = temp;
        weatherDescription.textContent = description;
        humidity.textContent = `${humidityValue}%`;
        windSpeed.textContent = `${windSpeedValue} m/s`;
        pressure.textContent = `${pressureValue} hPa`;
        visibility.textContent = visibilityValue !== "N/A" ? `${visibilityValue} km` : visibilityValue;
        feelsLike.textContent = `${feelsLikeTemp}°C`;
        cloudiness.textContent = `${cloudinessValue}%`;
        
        // Change background based on weather condition
        updateBackgroundByWeather(description);
    } catch (error) {
        console.error("Error displaying weather:", error);
        showError("Error displaying weather data");
    }
}

/**
 * Get current date formatted
 * @returns {string} - Formatted current date
 */
function getCurrentDate() {
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    return new Date().toLocaleDateString('en-US', options);
}

/**
 * Update background based on weather condition
 * @param {string} weatherDesc - Main weather condition
 */
function updateBackgroundByWeather(weatherDesc) {
    const body = document.body;
    
    // Remove existing weather classes
    body.classList.remove('clear', 'cloudy', 'rainy', 'snowy', 'stormy');
    
    const desc = weatherDesc.toLowerCase();
    
    if (desc.includes('clear')) {
        body.style.background = 'linear-gradient(135deg, #1e3a8a 0%, #0ea5e9 100%)';
    } else if (desc.includes('cloud') || desc.includes('overcast')) {
        body.style.background = 'linear-gradient(135deg, #4b5563 0%, #78909c 100%)';
    } else if (desc.includes('rain') || desc.includes('drizzle')) {
        body.style.background = 'linear-gradient(135deg, #2c3e50 0%, #546e7a 100%)';
    } else if (desc.includes('thunderstorm')) {
        body.style.background = 'linear-gradient(135deg, #1a237e 0%, #3f51b5 100%)';
    } else if (desc.includes('snow')) {
        body.style.background = 'linear-gradient(135deg, #eceff1 0%, #b0bec5 100%)';
    } else if (desc.includes('fog') || desc.includes('mist')) {
        body.style.background = 'linear-gradient(135deg, #757575 0%, #9e9e9e 100%)';
    } else {
        body.style.background = 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)';
    }
}

/**
 * Show error message
 * @param {string} message - Error message
 */
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add("show");

    // Hide current weather and show placeholder
    currentWeather.classList.add("hidden");
    placeholder.classList.remove("hidden");
}

/**
 * Clear error message
 */
function clearError() {
    errorMessage.textContent = "";
    errorMessage.classList.remove("show");
}

/**
 * Show loading state
 */
function showLoading() {
    searchBtn.disabled = true;
    searchBtn.textContent = "Loading...";
    searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
}

/**
 * Hide loading state
 */
function hideLoading() {
    searchBtn.disabled = false;
    searchBtn.innerHTML = '<i class="fas fa-search"></i> Search';
}

// Update hideLoading call in handleSearch
const originalHandleSearch = handleSearch;
handleSearch = async function () {
    await originalHandleSearch.call(this);
    hideLoading();
};

// ===========================
// INITIALIZATION
// ===========================

// Show placeholder on page load
window.addEventListener("load", () => {
    placeholder.classList.remove("hidden");
    currentWeather.classList.add("hidden");
});

console.log("Weather App Loaded Successfully!");
