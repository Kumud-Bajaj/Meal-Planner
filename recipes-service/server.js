require('dotenv').config();
const express = require('express');
const app = express();
const recipesRouter = require('./recipes');

app.use(express.json());
app.use('/api/recipes', recipesRouter);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🍽️ Recipes service running on http://localhost:${PORT}`);
});
