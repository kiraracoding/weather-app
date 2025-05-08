import React, { useState, useEffect } from 'react';
import axios from 'axios';
import cloudImg from './assets/cloud.png';
import fallbackImg from './assets/fallback.png';
import fireImg from './assets/fire.png';
import rainImg from './assets/rain.png';
import rainbowImg from './assets/rainbow.png';
import snowImg from './assets/snow.png';
import sunImg from './assets/sun.png';
import sunriseImg from './assets/sunrise.png';
import thermometerImg from './assets/thermometer.png';
import thunderstormImg from './assets/thunderstorm.png';
import weatherAppBg from './assets/weatherapp-bg.jpg';

function WeatherData() {

    const [weatherData, setWeatherData] = useState(null);
    const [city, setCity] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [unit, setUnit] = useState('metric');
    const [currentTime, setCurrentTime] = useState(Date.now());

    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

    const fetchWeather = (lat, lon, cityName = "") => {        
        setLoading(true);
        setError(null);
        
        const url = cityName
        ? `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&APPID=${API_KEY}&units=${unit}`
        : `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${API_KEY}&units=${unit}`;

        axios.get(url)
        .then(response => {
            setWeatherData(response.data);
            setLoading(false);

            if (cityName) {
                console.log("Weather data from searched city:", response.data);
            } else {
                console.log("Weather data from user location (lat/lon):", response.data);
            }
    })
        .catch(error => {
        setError('Failed to fetch weather data. Please try again');
        setLoading(false);
        });
    };

    useEffect (() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    fetchWeather(latitude, longitude);
                },
                error => {
                    console.error("Geolocation error:", error);
                    setError("Unable to retrieve your location");
                    setLoading(false);
                }
            );
        } else {
            console.error("Geolocation is not supported.");
            setError("Geolocation us not supported by your browser");
            setLoading(false);
        }
    }, []);

    const handleCityChange = (e) => {
        setCity(e.target.value);
    };

    const handleSearch = () => {
        if (city) {
            fetchWeather(null, null, city);
        } else {
            setError("Please enter a city name");
        }
    };

    const formatLocalDateTime = (timestamp, timezoneOffset) => {
        const date = new Date(timestamp * 1000);
        const options = {
            weekday: 'long',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone: 'UTC',
        };
        const shiftedDate = new Date(date.getTime() + timezoneOffset * 1000);
        return shiftedDate.toLocaleString('en-US', options);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(Date.now());
        }, 60 * 1000); 
    
        return () => clearInterval(interval); 
    }, []);

    const formatLocalTime = (timestamp, timezoneOffset) => {
        const date = new Date(timestamp * 1000);
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone: 'UTC',
        };
        const shiftedDate = new Date(date.getTime() + timezoneOffset * 1000);
        return shiftedDate.toLocaleString('en-US', options);
    };

    const toggleUnit = () => {
        setUnit(prev => (prev === 'metric' ? 'imperial' : 'metric'));
    };

    const cToF = (celsius) => (celsius * 9/5 + 32).toFixed(1);

    const weatherIconMap = {
        "clear sky": sunImg,
        "few clouds": cloudImg,
        "scattered clouds": cloudImg,
        "broken clouds": cloudImg,
        "overcast clouds": cloudImg,

        "light rain": rainImg,
        "moderate rain": rainImg,
        "heavy intensity rain": rainImg,
        "very heavy rain": rainImg,
        "extreme rain": rainImg,
        "freezing rain": rainImg,
        "light intensity shower rain": rainImg,
        "shower rain": rainImg,
        "heavy intensity shower rain": rainImg,
        "ragged shower rain": rainImg,
        "light drizzle": rainImg,
        "drizzle": rainImg,
        "heavy intensity drizzle": rainImg,

        "thunderstorm": thunderstormImg,
        "thunderstorm with light rain": thunderstormImg,
        "thunderstorm with heavy rain": thunderstormImg,
        "thunderstorm with drizzle": thunderstormImg,

        "light snow": snowImg,
        "snow": snowImg,
        "heavy snow": snowImg,
        "sleet": snowImg,
        "light shower snow": snowImg,
        "shower snow": snowImg,
        "heavy shower snow": snowImg,

        "mist": fireImg,
        "smoke": fireImg,
        "haze": fireImg,
        "fog": fireImg,
        "sand": fireImg, 
        "dust": fireImg,
        "ash": fireImg,
        "squalls": fireImg,
        "tornado": fireImg,
    };

    const description = weatherData?.weather?.[0]?.description || '';
    const iconSrc = weatherIconMap[description.toLowerCase()] || fallbackImg;

    return (
        <>
        <div className="w-full flex flex-row justify-between items-center">
            <div className="flex space-x-10 pt-5">
                <input 
                    type='text' 
                    className="border-3 black-border w-[400px] jersey-10-regular text-2xl tracking-wide pl-4 mr-2 rounded-full bg-white"
                    placeholder="Enter city or country name"
                    value={city}
                    onChange={handleCityChange}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSearch();
                        }  
                    }}
                />
                <button className='p-1 pl-6 pr-6 rounded-full border-3 jersey-10-regular text-2xl bg-[#92F830] ' onClick={handleSearch}>SEARCH</button>
            </div>

            <button className="mt-5 pl-6 pr-6 pt-1 pb-1 border rounded-full border-3 jersey-10-regular text-2xl bg-[#AF81E4]" onClick={toggleUnit}> {unit === 'metric' ? 'FAHRENHEIT' : 'CELCIUS'}
            </button>
        </div>
        
        <div className="flex flex-col w-full h-[450px] items-center justify-around">
            <h4 className='uppercase jersey-10-regular text-9xl text-[#050761]'>{weatherData?.name}</h4>
            <p className='-mt-15 text-5xl jersey-10-regular uppercase text-[#050761]'> 
                {weatherData ? formatLocalDateTime(weatherData.dt + Math.floor((Date.now()/1000) - weatherData.dt), weatherData.timezone) : ''}</p>
            
            <div className='pb-10 flex flex-row w-full justify-around'>
                <div className='w-[350px] flex flex-col items-end'>
                    <img className='h-[180px] pr-15' src={iconSrc} alt={description}/>
                </div>
            
                <div className='w-[350px] flex flex-col justify-center'>
                    <h1 className='uppercase jersey-10-regular text-4xl text-[#0000FF]'>
                        {weatherData?.weather[0].description}</h1>
                    <h3 className='jersey-10-regular text-8xl text-[#0000FF]'>
                        {weatherData ? 
                        (unit === 'metric' 
                            ? weatherData.main.temp.toFixed(1) + " °C" 
                            : cToF(weatherData.main.temp) + " °F") 
                        : ''}
                    </h3>
                    <p className='jersey-10-regular text-4xl text-[#0000FF]'>
                        FEELS LIKE {weatherData ? 
                        (unit === 'metric' 
                            ? weatherData.main.feels_like.toFixed(1) + " °C" 
                            : cToF(weatherData.main.feels_like) + " °F") 
                        : ''}
                    </p>
                </div>
            </div>
   
        </div>


        <div className="mb-10 flex flex-col justify-between h-[380px]">
            <div className="w-full flex flex-row justify-between">
                <div className="h-[180px] w-[370px] pl-5 pt-20 bg-[#FABE47] flex flex-col justify-center border-t-2 border-l-2 border-r-6 border-b-6 rounded-2xl">
                    <p className='jersey-10-regular text-4xl'> 
                        &gt; SUNRISE: {weatherData? formatLocalTime(weatherData.sys.sunrise, weatherData.timezone) : ''}</p>
                    <p className='jersey-10-regular text-4xl'>
                        &gt; SUNSET: {weatherData? formatLocalTime(weatherData.sys.sunset, weatherData.timezone) : ''}</p>
                    <img className='relative left-62 bottom-12 h-[80px] w-[80px]' src={sunriseImg}/>
                </div>
                <div className="h-[180px] w-[370px] pl-5 pt-20 bg-[#40FFE2] flex flex-col justify-center border-t-2 border-l-2 border-r-6 border-b-6 rounded-2xl">
                    <p className='jersey-10-regular text-4xl'>
                        &gt; MIN: {weatherData ?
                         (unit === 'metric' 
                            ? weatherData.main.temp_min.toFixed(1) + " °C" 
                            : cToF(weatherData.main.temp_min) + " °F") 
                          : ''}
                     </p>
                    <p className='jersey-10-regular text-4xl'>
                        &gt; MAX: {weatherData ?
                        (unit === 'metric' 
                            ? weatherData.main.temp_max.toFixed(1) + " °C" 
                            : cToF(weatherData.main.temp_max) + " °F") 
                        : ''}
                     </p>
                    <img className='relative left-65 bottom-12 h-[80px] w-[80px]' src={thermometerImg}/>
                </div>
            </div>
            <div className="h-[180px] w-[370px] bg-[#FF5BC3] border-t-2 border-l-2 border-r-6 border-b-6 rounded-2xl flex flex-row w-full justify-between">
                <div className="pl-5 w-[360px] flex flex-col justify-center">
                    <p className='jersey-10-regular text-4xl'>
                        &gt; HUMIDITY: {weatherData?.main.humidity}%</p>
                    <p className='jersey-10-regular text-4xl'>
                        &gt; WIND SPEED: {(weatherData?.wind.speed * 3.6).toFixed(1)} km/h</p>
                </div>
                <div className="w-[360px] flex flex-col justify-center">
                    <p className='jersey-10-regular text-4xl pt-20'>
                        &gt; PRESSURE: {weatherData?.main.pressure} HPA</p>
                    <p className='jersey-10-regular text-4xl'>
                        &gt; CLOUDINESS: {weatherData?.clouds.all}%</p>
                    <img className='relative bottom-12 left-65 h-[80px] w-[80px]' src={rainbowImg}></img>
                </div>
            </div>
        </div>
        </>
    )
}

export default WeatherData