import React from 'react';
import WeatherData from './WeatherData'
import './index.css';
import weatherAppBg from './assets/weatherapp-bg.jpg';


const API_KEY = "https://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=ce8f36acb900d60d35e576d797509456";

function App() {
  return (
    <>
      <div style={{ backgroundImage: `url(${weatherAppBg})` }} 
           className=' flex flex-col items-center w-screen h-screen bg-cover bg-center bg-norepeat'>
            <div className='flex flex-col justify-between h-full min-w-[768px]'>
              <WeatherData/>
            </div>
      </div>
    </>
  );
}

export default App
