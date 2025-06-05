import React, { useState, useEffect } from 'react';

// Replace localhost ports accordingly (optional)
//const RECIPES_BASE_URL = 'http://localhost:4000/api/recipes';
//const MEALPLAN_BASE_URL = 'http://localhost:5000/api/mealplan';

const RECIPES_BASE_URL = process.env.REACT_APP_RECIPES_API;
const MEALPLAN_BASE_URL = process.env.REACT_APP_MEALPLAN_API;



function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [mealPlan, setMealPlan] = useState({});
  const [groceryList, setGroceryList] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedDay, setSelectedDay] = useState('Monday');

  const user = 'Sara'; // Hardcoded user for now

  // Search Recipes
async function searchRecipes() {
  if (!query) return;
  try {
    const res = await fetch(`${RECIPES_BASE_URL}/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('Recipe service failed');
    const data = await res.json();
    setRecipes(data);
  } catch (err) {
    console.error('Fetch error:', err.message);
    setMessage('Could not fetch recipes.');
  }
}

// Add to Meal Plan
async function addToMealPlan(recipe) {
  const res = await fetch(`${MEALPLAN_BASE_URL}/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user, recipe, day: selectedDay }),
  });
  const data = await res.json();
  if (res.ok) {
    setMessage(data.message);
    await fetchMealPlan();
    await fetchGroceryList();
  } else {
    setMessage('Failed to add to meal plan');
  }
  setTimeout(() => setMessage(''), 3000);
}


async function removeFromMealPlan(recipeId) {
  const res = await fetch(`${MEALPLAN_BASE_URL}/remove`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user, recipeId }),
  });
  const data = await res.json();
  if (res.ok) {
    setMessage(data.message);
    await fetchMealPlan();
    await fetchGroceryList();
  } else {
    setMessage('Failed to remove from meal plan');
  }
  setTimeout(() => setMessage(''), 3000);
}


async function fetchMealPlan() {
  try {
    const resPlan = await fetch(`${MEALPLAN_BASE_URL}/${user}`);
    if (!resPlan.ok) throw new Error('Failed to fetch meal plan');
    const dataPlan = await resPlan.json();
    setMealPlan(dataPlan);
  } catch (error) {
    console.error(error);
  }
}


async function fetchGroceryList() {
  try {
    const resGrocery = await fetch(`${MEALPLAN_BASE_URL}/${user}/grocery-list`);
    if (!resGrocery.ok) throw new Error('Failed to fetch grocery list');
    const dataGrocery = await resGrocery.json();
    setGroceryList(dataGrocery);
  } catch (error) {
    console.error(error);
  }
}


  useEffect(() => {
    fetchMealPlan();
    fetchGroceryList();
  }, []);

return (
  <div style={{
    backgroundColor: darkMode ? '#121212' : '#f7f7f7',
    color: darkMode ? '#f7f7f7' : '#121212',
    minHeight: '100vh',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h1>🍽️ My Meal Planner</h1>
      <button
        onClick={() => setDarkMode(!darkMode)}
        style={{
          padding: '8px 12px',
          background: darkMode ? '#333' : '#ddd',
          color: darkMode ? '#fff' : '#000',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>
    </div>

    <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
      {/* Column 1: Recipe Search */}
      <div style={{ flex: 1, backgroundColor: darkMode ? '#1e1e1e' : '#ffffff', padding: '20px', borderRadius: '10px' }}>
        <h2>🔍 Recipe Search</h2>

        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Search recipes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ width: '70%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <button onClick={searchRecipes} style={{ padding: '8px', marginLeft: '10px' }}>
            Search
          </button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label>Select Day: </label>
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            style={{ padding: '6px', marginLeft: '10px', borderRadius: '5px' }}
          >
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>

        {message && <p style={{ color: 'green' }}>{message}</p>}

        <ul style={{ paddingLeft: '20px' }}>
          {recipes.map((recipe) => (
            <li key={recipe.id} style={{ marginBottom: '12px' }}>
              {recipe.title}{' '}
              <button onClick={() => addToMealPlan(recipe)}>Add to Meal Plan</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Column 2: Weekly Meal Plan */}
      <div style={{ flex: 1, backgroundColor: darkMode ? '#1e1e1e' : '#ffffff', padding: '20px', borderRadius: '10px' }}>
        <h2>📋 Weekly Meal Plan</h2>
        {Object.keys(mealPlan).length === 0 ? (
          <p>No meals planned yet.</p>
        ) : (
          Object.entries(mealPlan).map(([day, meals]) => (
            <div key={day} style={{ marginBottom: '20px' }}>
              <h3>{day}</h3>
              <ul>
                {meals.map((item) => (
                  <li key={item.id} style={{ marginBottom: '8px' }}>
                    <strong>{item.title}</strong>{' '}
                    <button
                      onClick={() => removeFromMealPlan(item.id)}
                      style={{ marginLeft: '10px', color: 'red' }}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>

      {/* Column 3: Grocery List */}
      <div style={{ flex: 1, backgroundColor: darkMode ? '#1e1e1e' : '#ffffff', padding: '20px', borderRadius: '10px' }}>
        <h2>🛒 Grocery List</h2>
        {groceryList.length === 0 ? (
          <p>Your grocery list is empty.</p>
        ) : (
          <ul>
            {groceryList.map((item, idx) => (
              <li key={idx} style={{ marginBottom: '8px' }}>
                <input type="checkbox" id={`item-${idx}`} />
                <label htmlFor={`item-${idx}`} style={{ marginLeft: '8px' }}>{item}</label>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  </div>
);


}

export default App;
