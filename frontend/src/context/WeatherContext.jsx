/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';

const WeatherContext = createContext();

export const useWeather = () => useContext(WeatherContext);

export const WeatherProvider = ({ children }) => {
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initialize city as null to force geolocation check first
    const [city, setCity] = useState(null);

    // CHANGED: Generating requests to our OWN Backend now
    // No API Key here anymore! Logic moved to server.js
    const BASE_URL = 'http://localhost:5000/api';

    // Ref to store the watch ID
    const watchIdRef = useRef(null);

    // Persist city to localStorage whenever it changes
    useEffect(() => {
        if (city) {
            localStorage.setItem('weather-city', city);
        }
    }, [city]);

    const stopLocationWatch = () => {
        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }
    };

    const fetchWeather = async (searchCity) => {
        // Stop tracking if user manually searches
        stopLocationWatch();

        setLoading(true);
        setError(null);
        try {
            // Calling OUR Backend
            const weatherRes = await axios.get(`${BASE_URL}/weather?city=${searchCity}`);
            setWeather(weatherRes.data);

            const forecastRes = await axios.get(`${BASE_URL}/forecast?city=${searchCity}`);
            setForecast(forecastRes.data);

            setCity(searchCity);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch weather data');
        } finally {
            setLoading(false);
        }
    };

    const fetchWeatherByCoords = async (lat, lon) => {
        // Note: We don't necessarily clear watch here because this might be CALLED by the watch callback
        setLoading(true);
        setError(null);
        try {
            // Calling OUR Backend
            const weatherRes = await axios.get(`${BASE_URL}/weather?lat=${lat}&lon=${lon}`);
            setWeather(weatherRes.data);
            setCity(weatherRes.data.name);

            const forecastRes = await axios.get(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}`);
            setForecast(forecastRes.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch weather data');
        } finally {
            setLoading(false);
        }
    };

    const fetchCurrentUserLocation = () => {
        stopLocationWatch();

        if (navigator.geolocation) {
            setLoading(true);
            // Use getCurrentPosition for immediate check on load
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
                },
                (err) => {
                    console.warn("Geolocation error:", err);
                    setLoading(false);
                    // Use stored city (fallback) or default if geo fails
                    const savedCity = localStorage.getItem('weather-city');
                    if (savedCity) {
                        fetchWeather(savedCity);
                    } else {
                        fetchWeather('London');
                    }
                },
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );
        } else {
            const savedCity = localStorage.getItem('weather-city');
            if (savedCity) fetchWeather(savedCity);
            else fetchWeather('London');
        }
    };

    // Initial load logic
    useEffect(() => {
        // If we want to prioritize location over stored city on reload:
        fetchCurrentUserLocation();

        // Cleanup on unmount
        return () => stopLocationWatch();
    }, []);

    return (
        <WeatherContext.Provider value={{ weather, forecast, loading, error, city, setCity, fetchWeather, fetchCurrentUserLocation }}>
            {children}
        </WeatherContext.Provider>
    );
};
