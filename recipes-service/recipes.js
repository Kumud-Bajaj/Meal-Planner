const express = require('express');
const axios = require('axios');
const router = express.Router();
const API_KEY = process.env.SPOONACULAR_API_KEY;
const cors = require('cors');
router.use(cors());

router.get('/search', async (req, res) => {
  try {
    const query = req.query.q;
    const response = await axios.get(`https://api.spoonacular.com/recipes/complexSearch`, {
      params: { apiKey: API_KEY, query }
    });
    res.json(response.data.results);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`https://api.spoonacular.com/recipes/${id}/information`, {
      params: { apiKey: API_KEY }
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch recipe info' });
  }
});

module.exports = router;
