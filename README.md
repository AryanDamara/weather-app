Weather Forecast App
A modern, responsive weather application built with HTML, CSS, and JavaScript. It allows users to search for any city and view current weather conditions using live data from the OpenWeatherMap API.

Features
- Search weather by city name.
- Real-time current weather data.
- Temperature in Celsius.
- Weather condition description and icon.
- Details: humidity, wind speed, pressure, visibility, feels like, cloudiness.
- Dynamic background based on weather conditions.
- Responsive design for desktop, tablet, and mobile.
- Error handling for invalid city names and missing API key.

Tech Stack
- HTML5 – Structure and layout.
- CSS3 – Styling, animations, and responsive design.
- JavaScript (ES6+) – Logic, API calls, and DOM manipulation.
- OpenWeatherMap API – Weather and geocoding data.
- Font Awesome – Icons.

Getting Started
1. Clone or download this repository:
   - Place the files in a folder (for example, weather-app).

2. File structure:
   - index.html
   - styles.css
   - script.js
   - README.md

3. Get an OpenWeatherMap API key:
   - Go to: https://openweathermap.org/api
   - Create a free account and verify your email.
   - Navigate to “My API keys” and copy your key.

4. Configure your API key:
   - Open script.js.
   - Find this line:
     const API_KEY = "REPLACE_WITH_YOUR_API_KEY";
   - Replace REPLACE_WITH_YOUR_API_KEY with your actual key (keep it inside quotes).

5. Run the app:
   - Open index.html in your browser (double-click or use a local server).
   - Type a city name in the search box and click “Search”.

Usage
- Enter a city name (e.g., London, New York, Mumbai).
- Press Enter or click the Search button.
- View current weather, including:
  - City and country
  - Temperature (°C)
  - Description (e.g., clear sky, scattered clouds)
  - Humidity, wind speed, pressure, visibility, feels like, and cloudiness

API Information
- Geocoding endpoint:
  - https://api.openweathermap.org/geo/1.0/direct
- Weather endpoint:
  - https://api.openweathermap.org/data/2.5/weather
- Units:
  - Metric (Celsius) is used via units=metric.

Customization
You can customize:
- Colors and fonts in styles.css (via CSS variables and styles).
- Layout or cards in index.html.
- Additional data fields in script.js (e.g., sunrise/sunset, min/max temperature).

Common Issues
- “Please add your OpenWeatherMap API key”:
  - Make sure you replaced the API_KEY value in script.js.
- “City not found”:
  - Check spelling and try again.
- No data or network error:
  - Check your internet connection and whether the API key is active (it may take a few minutes after creation).

License
This project is for learning and personal use. Respect OpenWeatherMap’s usage terms when using their API.

Credits
- Weather data: OpenWeatherMap (https://openweathermap.org/)
- Icons: Font Awesome (https://fontawesome.com/)