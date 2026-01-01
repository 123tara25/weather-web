const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Proxy route for News request
app.get('/api/news', async (req, res) => {
    try {
        const { category } = req.query;
        const apiKey = 'addb060679b3c383a2fe5d617e8cea0b'; // News API Key

        const response = await axios.get('https://newsapi.org/v2/top-headlines', {
            params: {
                country: 'us',
                category: category || 'technology',
                apiKey: apiKey
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching news:', error.message);
        res.status(500).json({ error: 'Failed to fetch news' });
    }
});

// --- NEW WEATHER ROUTES ---

const WEATHER_API_KEY = '43171d6f5b1e31e6591ef1af7d8f4a8a'; // Weather API Key (Secure on Backend)
const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Get Current Weather
app.get('/api/weather', async (req, res) => {
    try {
        const { city, lat, lon } = req.query;
        let apiUrl = '';

        if (lat && lon) {
            apiUrl = `${WEATHER_BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`;
        } else if (city) {
            apiUrl = `${WEATHER_BASE_URL}/weather?q=${city}&units=metric&appid=${WEATHER_API_KEY}`;
        } else {
            return res.status(400).json({ error: 'City or coordinates required' });
        }

        const response = await axios.get(apiUrl);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching weather:', error?.response?.data || error.message);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

// Get Forecast
app.get('/api/forecast', async (req, res) => {
    try {
        const { city, lat, lon } = req.query;
        let apiUrl = '';

        if (lat && lon) {
            apiUrl = `${WEATHER_BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`;
        } else if (city) {
            apiUrl = `${WEATHER_BASE_URL}/forecast?q=${city}&units=metric&appid=${WEATHER_API_KEY}`;
        } else {
            return res.status(400).json({ error: 'City or coordinates required' });
        }

        const response = await axios.get(apiUrl);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching forecast:', error?.response?.data || error.message);
        res.status(500).json({ error: 'Failed to fetch forecast data' });
    }
});

app.listen(PORT, () => {
    console.log(`Backend Server running on port ${PORT}`);
});
