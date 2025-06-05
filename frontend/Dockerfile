# frontend/Dockerfile

FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy app files
COPY . .

# Build React with env vars
ARG REACT_APP_RECIPES_API
ARG REACT_APP_MEALPLAN_API
ENV REACT_APP_RECIPES_API=$REACT_APP_RECIPES_API
ENV REACT_APP_MEALPLAN_API=$REACT_APP_MEALPLAN_API

RUN npm run build

# Use nginx to serve static files
FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
