import React, { useEffect, useState, useCallback } from 'react';
import "./css/style.css";

const Tempapp = () => {
    const [city, setCity] = useState(null);  
    const [search, setSearch] = useState("Bangalore");
    const [breachCount, setBreachCount] = useState(0); 
    const temperatureThreshold = 35; 

    const getLastUpdateTime = (timestamp) => {
        const date = new Date(timestamp * 1000); 
        return date.toLocaleString(); 
    };

    const fetchWeatherData = useCallback(async () => {
        try {
            const url = `http://api.openweathermap.org/data/2.5/weather?q=${search}&units=metric&APPID=67fc818b3306fdb6a4ff90845a93273f`;
            const res = await fetch(url);
            const data = await res.json();

            if (res.ok) {
                setCity(data);  
                checkThresholds(data.main.temp); 
            } else {
                setCity(null); 
                console.error(data.message); 
            }
        } catch (error) {
            console.error("Error fetching weather data:", error);
        }
    }, [search]); 


    const checkThresholds = (currentTemp) => {
        
        if (currentTemp > temperatureThreshold) {
            setBreachCount(prevCount => {
                const newCount = prevCount + 1;
                
                if (newCount === 2) {
                    alert(`Alert! The temperature has exceeded ${temperatureThreshold}°C. Current temperature: ${currentTemp}°C.`);
                    console.log(`Alert! Current temperature: ${currentTemp}°C. Threshold: ${temperatureThreshold}°C.`);
                }
                return newCount; 
            });
        } else {
            setBreachCount(0); 
        }
    };

    useEffect(() => {
        
        fetchWeatherData();

        
        const intervalId = setInterval(() => {
            fetchWeatherData();
        }, 300000); 

        
        return () => clearInterval(intervalId);
    }, [fetchWeatherData]); 

    return (
        <>
            <div className='box'>
                <div className='inputData'>
                    <input
                        type='search'
                        className='inputField'
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search city"
                    />
                </div>

                {!city ? (
                    <h1 className='data'>No Data Found</h1>
                ) : (
                    <div className='info'>
                        <h2 className='location'>
                            <i className="fa-solid fa-street-view"></i>{search}
                        </h2>
                        <h1 className='temp'>
                            {city.main.feels_like}°C
                        </h1>
                        <h4 className='temp1'>
                           Feels Like: {city.weather[0].main}
                        </h4>
                        <h3 className='tempmin_max'>
                            Min: {city.main.temp_min}°C | Max: {city.main.temp_max}°C
                        </h3>
                        <h4 className='last-update'>
                            Last Update: {getLastUpdateTime(city.dt)}
                        </h4>
                    </div>
                )}

                <div className='wave -one'></div>
                <div className='wave -two'></div>
                <div className='wave -three'></div>
            </div>
        </>
    );
}

export default Tempapp;
