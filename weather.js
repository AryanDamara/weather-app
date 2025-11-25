/* ===========================
   WEATHER APP - MAIN SCRIPT
   =========================== */

// ===========================
// CONFIGURATION
// ===========================

const API_KEY = "aaa754c90b0e36da5c8b699906caaa4f"; // Get from https://openweathermap.org/api
const GEOCODE_API = "https://api.openweathermap.org/geo/1.0/direct";
const WEATHER_API = "https://api.openweathermap.org/data/2.5/weather";

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
    
    // Check if API key is set
    if (API_KEY === "REPLACE_WITH_YOUR_API_KEY") {
        showError("⚠️ Please add your OpenWeatherMap API key in script.js");
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
            displayWeather(weatherData);
            
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
        const url = `${GEOCODE_API}?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.length === 0) {
            return null;
        }
        
        return {
            lat: data[0].lat,
            lon: data[0].lon,
            name: data[0].name,
            country: data[0].country
        };
    } catch (error) {
        console.error("Error getting coordinates:", error);
        throw error;
    }
}

/**
 * Get weather data from OpenWeatherMap API
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Object|null} - Weather data object or null
 */
async function getWeatherData(lat, lon) {
    try {
        const url = `${WEATHER_API}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
        
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
 * Display weather data on the page
 * @param {Object} data - Weather data from API
 */
function displayWeather(data) {
    try {
        // Hide placeholder and show current weather
        placeholder.classList.add("hidden");
        currentWeather.classList.remove("hidden");
        
        // Extract data
        const temp = Math.round(data.main.temp);
        const feelsLikeTemp = Math.round(data.main.feels_like);
        const description = data.weather[0].description;
        const icon = data.weather[0].icon;
        const humidityValue = data.main.humidity;
        const windSpeedValue = data.wind.speed;
        const pressureValue = data.main.pressure;
        const visibilityValue = (data.visibility / 1000).toFixed(1);
        const cloudinessValue = data.clouds.all;
        const country = data.sys.country;
        
        // Update DOM elements
        cityName.textContent = `${data.name}, ${country}`;
        currentDate.textContent = getCurrentDate();
        weatherIcon.src = `https://openweathermap.org/img/wn/${icon}@4x.png`;
        weatherIcon.alt = description;
        temperature.textContent = temp;
        weatherDescription.textContent = description;
        humidity.textContent = `${humidityValue}%`;
        windSpeed.textContent = `${windSpeedValue} m/s`;
        pressure.textContent = `${pressureValue} hPa`;
        visibility.textContent = `${visibilityValue} km`;
        feelsLike.textContent = `${feelsLikeTemp}°C`;
        cloudiness.textContent = `${cloudinessValue}%`;
        
        // Change background based on weather condition
        updateBackgroundByWeather(data.weather[0].main);
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
 * @param {string} weatherMain - Main weather condition
 */
function updateBackgroundByWeather(weatherMain) {
    const body = document.body;
    
    // Remove existing weather classes
    body.classList.remove('clear', 'cloudy', 'rainy', 'snowy', 'stormy');
    
    switch (weatherMain.toLowerCase()) {
        case 'clear':
            body.style.background = 'linear-gradient(135deg, #1e3a8a 0%, #0ea5e9 100%)';
            break;
        case 'clouds':
            body.style.background = 'linear-gradient(135deg, #4b5563 0%, #78909c 100%)';
            break;
        case 'rain':
        case 'drizzle':
            body.style.background = 'linear-gradient(135deg, #2c3e50 0%, #546e7a 100%)';
            break;
        case 'thunderstorm':
            body.style.background = 'linear-gradient(135deg, #1a237e 0%, #3f51b5 100%)';
            break;
        case 'snow':
            body.style.background = 'linear-gradient(135deg, #eceff1 0%, #b0bec5 100%)';
            break;
        case 'mist':
        case 'smoke':
        case 'haze':
        case 'dust':
        case 'fog':
        case 'sand':
        case 'ash':
        case 'squall':
        case 'tornado':
            body.style.background = 'linear-gradient(135deg, #757575 0%, #9e9e9e 100%)';
            break;
        default:
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
handleSearch = async function() {
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
