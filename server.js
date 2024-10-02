const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();

require('dotenv').config();


const apiKey = process.env.API_KEY;
const port = process.env.PORT || 3000;
const apiBaseUrl = process.env.API_BASE_URL;

// Middleware
app.use(bodyParser.json({ limit: '20mb' }));
app.use(cors());
app.use(express.static('public')); // Serve static files from the 'public' directory

// Endpoint to detect moderation labels
app.post('/api/detect-moderation', async (req, res) => {
    const { image } = req.body;

    try {
        const response = await axios.post(`${apiBaseUrl}/detectmoderationlabels`, {
            image
        }, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error detecting moderation labels:', error);
        res.status(500).json({ error: 'Failed to detect moderation labels' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

