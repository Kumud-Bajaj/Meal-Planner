# 🥗 Meal Planner Web App

A full-stack meal planning application that allows users to search for recipes, plan meals throughout the week, and generate a dynamic grocery list—all in a modern and responsive interface.

## 🚀 Features

- 🔍 **Recipe Search** using Spoonacular API  
- 📅 **Weekly Meal Planning** with day-wise scheduling  
- 🛒 **Auto-generated Grocery List** from your planned meals  
- 🌗 **Light/Dark Mode Toggle**  
- 🐳 **Dockerized Architecture** with separate services for frontend, recipe API, and meal planner API

## 🛠️ Tech Stack

- **Frontend:** React, HTML/CSS, JavaScript  
- **Backend Services:** Node.js, Express  
- **API:** Spoonacular (for fetching real recipes)  
- **Containerization:** Docker & Docker Compose  
- **Deployment:** Local (via Docker)

## 📦 Project Structure
```
my-mealplanner-project/
├── frontend/             # React frontend
│   ├── Dockerfile
│   └── src/
│       └── App.js        # Main React component
├── recipes-service/      # Node.js backend for recipe search
│   └── index.js
├── mealplan-service/     # Node.js backend for meal planning and grocery list
│   └── index.js
├── docker-compose.yml    # Docker Compose file for multi-container setup

```

## 🧪 Use Cases

- **Daily Meal Organization** for individuals or families  
- **Smart Grocery Planning** for budget-conscious users  
- **Healthy Eating Tracking** with custom recipe selection  
- **Educational Demos** of full-stack development and API integration
