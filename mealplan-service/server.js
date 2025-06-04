require('dotenv').config();
const express = require('express');
const app = express();
const mealplanRouter = require('./mealplan');

app.use(express.json());
app.use('/api/mealplan', mealplanRouter);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🥗 Mealplan service running on http://localhost:${PORT}`);
});
