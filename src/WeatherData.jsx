import React, { useState, useEffect } from 'react';
import axios from 'axios';

function WeatherData() {

    const [weatherData, setWeatherData] = useState(null);
    const [city, setCity] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

    const fetchWeather = (lat, lon, cityName = "") => {        
        setLoading(true);
        setError(null);
        
        const url = cityName
        ? `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&APPID=${API_KEY}`
        : `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${API_KEY}`;

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

    return (
        <>
        <div className="w-full flex flex-row justify-between items-center p4">
            <div className="flex space-x-10 pl-5 pt-5">
                <input 
                    type='text' 
                    className="border-4 black-border w-[500px]"
                    placeholder="Enter city name"
                    value={city}
                    onChange={handleCityChange}
                />
                <button className='p-2 border' onClick={handleSearch}>SEARCH</button>
            </div>

            <button className="mt-5 p-2 border"> FAHRENHEIT
            </button>
            </div>
        
        <div className="flex flex-col w-full h-[400px] items-center justify-around">
            <h4>LOCATION</h4>
            <p>WEEKDAY  00 : 00 PM</p>
            <img src='#'/>
            <h1>WEATHER REPORT</h1>
            <h3>DEGREES</h3>
            <p>FEELS LIKE</p>
        </div>


        <div className="flex flex-col justify-between h-[400px]">
            <div className="w-full flex flex-row justify-between">
                <div className="pl-5">
                    <p>SUNRISE: 00:00 AM/PM</p>
                    <p>SUNSET: 00:00 AM/PM</p>
                    <img src='#'/>
                </div>
                <div className="pr-5">
                    <p>MIN: 00 C</p>
                    <p>MAX: 00 C</p>
                    <img src='#'/>
                </div>
            </div>
            <div className="flex flex-row w-full justify-between">
                <div className="pl-5">
                    <p>HUMIDITY: 0%</p>
                    <p>WIND SPEED: 00.M/S</p>
                </div>
                <div className="pr-5">
                    <p>PRESSURE: 0000 HPA</p>
                    <p>CLOUDINESS: 0%</p>
                </div>
            </div>
        </div>
        </>
    )
}

export default WeatherData