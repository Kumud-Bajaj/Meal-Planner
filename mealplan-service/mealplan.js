const express = require('express');
const axios = require('axios');
const router = express.Router();
const cors = require('cors');
router.use(cors());

const API_KEY = process.env.SPOONACULAR_API_KEY; // make sure this env variable is set

const mealPlans = {};

router.post('/add', async (req, res) => {
  const { user, recipe, day } = req.body;

  if (!user || !recipe || !recipe.id || !day) {
    return res.status(400).json({ error: 'Missing data' });
  }

  try {
    // Fetch full recipe details from Spoonacular API
    const response = await axios.get(`https://api.spoonacular.com/recipes/${recipe.id}/information`, {
      params: { apiKey: API_KEY },
    });

    const fullRecipe = response.data;

    if (!mealPlans[user]) mealPlans[user] = {};
    if (!mealPlans[user][day]) mealPlans[user][day] = [];

    // Store the full recipe object (with extendedIngredients)
    mealPlans[user][day].push(fullRecipe);

    console.log('Added recipe:', fullRecipe.title);
    console.log('Ingredients:', fullRecipe.extendedIngredients?.map(i => i.name));

    res.json({ message: 'Recipe added to meal plan' });
  } catch (error) {
    console.error('Error fetching full recipe details:', error.message);
    res.status(500).json({ error: 'Failed to fetch recipe details' });
  }
});

router.get('/:user', (req, res) => {
  const user = req.params.user;
  res.json(mealPlans[user] || {});
});

router.delete('/remove', (req, res) => {
  const { user, recipeId } = req.body;

  if (!user || !recipeId) {
    return res.status(400).json({ message: 'Missing data' });
  }

  if (!mealPlans[user]) {
    return res.status(404).json({ message: 'User not found' });
  }

  for (const day in mealPlans[user]) {
    mealPlans[user][day] = mealPlans[user][day].filter(r => r.id !== recipeId);
  }

  res.json({ message: 'Recipe removed' });
});

router.get('/:user/grocery-list', (req, res) => {
  const user = req.params.user;
  const plan = mealPlans[user];

  if (!plan) return res.json([]);

  const grocerySet = new Set();

  Object.values(plan).forEach(meals => {
    meals.forEach(recipe => {
      if (recipe.extendedIngredients) {
        recipe.extendedIngredients.forEach(ingredient => {
          grocerySet.add(ingredient.name);  // add just the ingredient name, no amount or units
        });
      }
    });
  });

  res.json(Array.from(grocerySet));
});

module.exports = router;
