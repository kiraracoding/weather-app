import React from 'react';
import WeatherData from './WeatherData'
import './index.css';


const API_KEY = "https://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=ce8f36acb900d60d35e576d797509456";

function App() {
  return (
    <>
      <WeatherData/>
    </>
  );
}

export default App
