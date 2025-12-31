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

    // Initialize city from localStorage or default to null (for geolocation)
    const [city, setCity] = useState(() => localStorage.getItem('weather-city') || null);

    const API_KEY = '43171d6f5b1e31e6591ef1af7d8f4a8a';
    const BASE_URL = 'https://api.openweathermap.org/data/2.5';

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
            const weatherRes = await axios.get(`${BASE_URL}/weather?q=${searchCity}&units=metric&appid=${API_KEY}`);
            setWeather(weatherRes.data);

            const forecastRes = await axios.get(`${BASE_URL}/forecast?q=${searchCity}&units=metric&appid=${API_KEY}`);
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
            const weatherRes = await axios.get(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
            setWeather(weatherRes.data);
            setCity(weatherRes.data.name);

            const forecastRes = await axios.get(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
            setForecast(forecastRes.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch weather data');
        } finally {
            setLoading(false);
        }
    };

    const fetchCurrentUserLocation = () => {
        // This function now starts the watch
        stopLocationWatch();

        if (navigator.geolocation) {
            setLoading(true);
            watchIdRef.current = navigator.geolocation.watchPosition(
                (position) => {
                    fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
                },
                (err) => {
                    console.warn("Geolocation error:", err);
                    setLoading(false);
                    // Use stored city or default if geo fails
                    if (city) {
                        fetchWeather(city);
                    } else {
                        fetchWeather('London');
                    }
                },
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );
        } else {
            if (city) fetchWeather(city);
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
