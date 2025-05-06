import React, { useState, useEffect } from 'react';


function WeatherData() {

    const url= 'https://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=ce8f36acb900d60d35e576d797509456'

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => console.error('Error:', error));

    return (
        <>
        <div className="w-full flex flex-row justify-between items-center p4">
            <div className="flex space-x-10 pl-5 pt-5">
                <input 
                    type='text' 
                    className="border-4 black-border w-[500px]"
                    placeholder="Enter city name"
                />
                <button className='p-2 border'>SEARCH</button>
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