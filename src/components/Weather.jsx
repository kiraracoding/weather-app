import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Weather.scss'

const Weather = () => {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [unit, setUnit] = useState('metric');
    const [iconUrl, setIconUrl] = useState('');
    const [currentTime, setCurrentTime] = useState('');

    const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
    const DEFAULT_CITY = "LONDON";

    const weatherId = {
      thunderstormId: [200, 201, 202, 210, 211, 212, 221, 230, 231, 232],
      drizzleId: [300, 301, 302, 310, 311, 312, 313, 314, 321],
      rainId: [500, 501, 502, 503, 504, 511, 520, 521, 522, 531],
      snowId: [600, 601, 602, 611, 612, 613, 615, 616, 620, 621, 622],
      athmosphereId: [701, 711, 721, 731, 741, 751, 761, 762, 771, 781],
      clearId: 800,
      cloudsId: [801, 802, 803, 804],
      extremeId: [900, 901, 902, 903, 904, 905, 906],
      additionalId: [951, 952, 953, 954, 955, 956, 957, 958, 959, 960, 961, 962]
    };

    function findWeatherId(obj, iconId) {
      for (let key in obj) {
        if (Array.isArray(obj[key]) && obj[key].includes(iconId)) {
          return key;
        } else if (obj[key] === iconId) {
          return key;
        }
      }
      return null;
    }

    const getWeatherIconUrl = (weatherType) => {
      switch (weatherType) { 
        case 'thunderstormId' :
          return "https://img.icons8.com/doodle/96/cloud-lighting.png";
        case 'drizzleId' :
          return "https://img.icons8.com/doodle/96/rain--v1.png";
        case 'rainId' :
          return "https://img.icons8.com/doodle/96/rainwater-catchment.png";
        case 'snowId' :
          return "https://img.icons8.com/doodle/96/snow--v2.png";
        case 'athmosphereId' :
          return "https://img.icons8.com/doodle/96/cloud--v1.png";
        case 'clearId' :
          return "https://img.icons8.com/doodle/96/sun--v1.png";
        case 'cloudsId' :
          return "https://img.icons8.com/doodle/96/partly-cloudy-day--v1.png";
        case 'extremeId' :
          return "https://img.icons8.com/doodle/96/windsock--v2.png";
        case 'additionalId' :
          return "https://img.icons8.com/doodle/96/wind.png";
        default: 
          return "https://img.icons8.com/doodle/96/sun--v1.png";
      }
    };

    useEffect(() => {
      if (weatherData) {
        const iconId = weatherData?.weather?.[0]?.id;
        if (iconId !== undefined) {
          const weatherType = findWeatherId(weatherId, iconId);
          if (weatherType) {
            const iconLink = getWeatherIconUrl(weatherType);
            setIconUrl(iconLink);
            console.log(`Icon id is ${iconId} and weatherType is ${weatherType}`);
          } else {
            console.log(`Icon id ${iconId} is not found`);
            setIconUrl("https://img.icons8.com/doodle/96/sun--v1.png"); // Set default icon
          }
        }
      }
    }, [weatherData]);


    const getDayOfWeek = () => {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const today = new Date();
      return days[today.getDay()];
    };

    const getCurrentTime = () => {
      if (!weatherData) return '';
    
      const now = new Date(); // Get current local time
      const utcTime = now.getTime() + now.getTimezoneOffset() * 60000; // Convert local time to UTC
      const localTime = new Date(utcTime + weatherData.timezone * 1000); // Add the API timezone offset
    
      return localTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    useEffect(() => {
      if (weatherData) {
        setCurrentTime(getCurrentTime());

        const intervalId = setInterval(() => {
            setCurrentTime(getCurrentTime());
        }, 60000);

        return () => clearInterval(intervalId);
      }
    }, [weatherData]);

    const formatTime = (unixTimestamp) => {
      if (!weatherData) return '';
      const timezoneOffset = weatherData.timezone;
      const date = new Date((unixTimestamp + timezoneOffset) * 1000);
      return date.toLocaleTimeString();
    };

    const getWeatherByCoordinates = async (lat, lon) => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        setWeatherData(response.data);
        console.log(response.data);
        setError('');
        getWeatherIconUrl();
      } catch (err) {
        setError('Unable to fetch weather data.');
        setWeatherData(null);
        setIconUrl('');
      } finally {
        setLoading(false);
      }
    };

    const getWeatherByCity = async () => {
      if (!city) return;
  
      setLoading(true);
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        setWeatherData(response.data);
        console.log(response.data);
        setError('');
        setCity(''); // Clear the input field
        getWeatherIconUrl();
      } catch (err) {
        setError('City not found. Please enter a valid city.');
        setWeatherData(null);
        setIconUrl('');
      } finally {
        setLoading(false);
      }
    };

    const getWeatherByGeolocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            getWeatherByCoordinates(latitude, longitude);
          },
          () => {
            getWeatherByCity(DEFAULT_CITY);
          }
        );
      } else {
        getWeatherByCity(DEFAULT_CITY);
      }
    };

    useEffect(() => {
      getWeatherByGeolocation();
    }, []);

    const celsiusToFahrenheit = (celsius) => (celsius * 9/5) + 32;

    const toggleUnit = () => {
      setUnit((prevUnit) => {
        const newUnit = prevUnit === 'metric' ? 'imperial' : 'metric';
        return newUnit;
      });
    };

    const getCityName = () => {
      const currentCity = weatherData.name.toUpperCase();
      return currentCity;
    }

    return (
      <div className="weather-app">
        <div className='top-bar'>
          <div className='search-bar'>
            <input className='input-field'
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city name"
            />
            <button className='search-btn' onClick={getWeatherByCity}>Search</button>
          </div>
          <button className='toggle-unit-btn' onClick={toggleUnit}>
          {unit === 'metric' ? 'Fahrenheit' : 'Celsius'}
          </button>
        </div>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {weatherData && (
          <div className="weather-info">
            <div className='main-content'>
              <h2 className='city-name'>{getCityName()}</h2>
              <div className='date-time'>
                <p className='date-time-txt'>{getDayOfWeek()} {getCurrentTime()}</p>
              </div>
              <img width="96" height="96" src={iconUrl} alt="icon-images"/>
              <p className='main-description'>{weatherData.weather[0].description}</p>
              <p className='main-temp'>{unit === 'metric' ? weatherData.main.temp : celsiusToFahrenheit(weatherData.main.temp).toFixed(1)}°{unit === 'metric' ? 'C' : 'F'}</p>
              <p className='feels-like-txt'>feels like: {unit === 'metric' ? weatherData.main.feels_like : celsiusToFahrenheit(weatherData.main.feels_like).toFixed(1)}°{unit === 'metric' ? 'C' : 'F'}</p>
            </div>
            <div className='sub-content'>
              <div className='sun-divset'>
                <p className='sunrise-txt'> &gt; Sunrise: {formatTime(weatherData.sys.sunrise)}</p>
                <p className='sunset-txt'> &gt; Sunset: {formatTime(weatherData.sys.sunset)}</p>
                <img className='sun-icon' width="96" height="96" src="https://img.icons8.com/doodle/96/sunrise.png" alt="sunrise"/>
              </div>
              <div className='temp-divset'>
                <p className='min-temp-txt'> &gt; Minimum Temperature: {unit === 'metric' ? weatherData.main.temp_min : celsiusToFahrenheit(weatherData.main.temp_min).toFixed(1)}°{unit === 'metric' ? 'C' : 'F'}</p>
                <p className='max-temp-txt'> &gt; Maximum Temperature: {unit === 'metric' ? weatherData.main.temp_max : celsiusToFahrenheit(weatherData.main.temp_max).toFixed(1)}°{unit === 'metric' ? 'C' : 'F'}</p>
                <img className='temp-icon' width="96" height="96" src="https://img.icons8.com/doodle/96/thermometer--v3.png" alt="thermometer--v3"/>
              </div>
              <div className='others-divset'>
                <p className='humidity-txt'> &gt; Humidity: {weatherData.main.humidity}%</p>
                <p className='wind-speed-txt'> &gt; Wind Speed: {weatherData.wind.speed} {unit === 'metric' ? 'm/s' : 'mph'}</p>
                <p className='pressure-txt'> &gt; Pressure: {weatherData.main.pressure} hPa</p>
                <p className='cloudiness-txt'> &gt; Cloudiness: {weatherData.clouds.all}%</p>
                <img className='rainbow-icon' width="96" height="96" src="https://img.icons8.com/doodle/96/rainbow--v1.png" alt="rainbow--v1"/>
              </div>
            </div>
          </div>
        )}
      </div>
    );
};

export default Weather;