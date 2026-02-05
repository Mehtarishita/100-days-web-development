async function getWeather() {

    const city = document.getElementById("cityInput").value;
    const result = document.getElementById("result");

    try {

        // Step 1: Convert city name → coordinates
        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
        );

        const geoData = await geoResponse.json();

        const latitude = geoData.results[0].latitude;
        const longitude = geoData.results[0].longitude;

        // Step 2: Get weather using coordinates
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
        );

        const weatherData = await weatherResponse.json();

        const temperature = weatherData.current_weather.temperature;

        result.textContent = `Temperature in ${city}: ${temperature}°C`;

    } catch(error) {

        result.textContent = "City not found ";

    }
}
