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
        // API Key hardcoded for MVP speed, ideally should be in .env
        const apiKey = 'addb060679b3c383a2fe5d617e8cea0b';

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
        res.status(500).json({ error: 'Failed to fetch news from upstream provider' });
    }
});

app.listen(PORT, () => {
    console.log(`Backend Server running on port ${PORT}`);
});
