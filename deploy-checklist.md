# Deployment Checklist for Hotel Booking Application

## Backend Deployment (Render)

### Step 1: Prepare MongoDB Atlas
- [ ] Sign up for MongoDB Atlas (https://www.mongodb.com/cloud/atlas)
- [ ] Create a new cluster (free tier)
- [ ] Set up database access (username and password)
- [ ] Set up network access (allow access from anywhere)
- [ ] Get your connection string (should look like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/hotel_booking_db?retryWrites=true&w=majority`)

### Step 2: Prepare Your Backend Code
- [ ] Ensure your backend code is in a GitHub repository
- [ ] Make sure your package.json has the correct start script: `"start": "node src/index.js"`
- [ ] Verify that your code uses environment variables for configuration

### Step 3: Deploy to Render
- [ ] Sign up for Render (https://render.com)
- [ ] Create a new Web Service
- [ ] Connect your GitHub repository
- [ ] Configure the service:
  - [ ] Name: `hotel-booking-api`
  - [ ] Environment: `Node`
  - [ ] Build Command: `npm install`
  - [ ] Start Command: `npm start`
- [ ] Add environment variables:
  - [ ] `PORT`: `8000` (Render will override this with their own port)
  - [ ] `MONGODB_URI`: Your MongoDB Atlas connection string
  - [ ] `JWT_SECRET`: A secure random string
  - [ ] `JWT_EXPIRES_IN`: `30d`
- [ ] Deploy
- [ ] Note your backend URL (e.g., `https://hotel-booking-api.onrender.com`)

## Frontend Deployment (Netlify)

### Step 1: Prepare Your Frontend Code
- [ ] Update API endpoint URLs in the frontend to point to your Render backend URL
- [ ] Create a `.env` file in the frontend directory with:
  ```
  VITE_API_URL=https://your-render-backend-url.onrender.com/api
  ```
- [ ] Make sure your frontend code is in the same GitHub repository or a separate one

### Step 2: Deploy to Netlify
- [ ] Sign up for Netlify (https://www.netlify.com)
- [ ] Connect your GitHub repository
- [ ] Configure the build settings:
  - [ ] Base directory: `front-end` (or your frontend directory name)
  - [ ] Build command: `npm run build`
  - [ ] Publish directory: `dist`
- [ ] Add environment variables:
  - [ ] `VITE_API_URL`: Your backend API URL
- [ ] Deploy
- [ ] Note your frontend URL (e.g., `https://hotel-booking-app.netlify.app`)

## Post-Deployment Tasks
- [ ] Test user registration and login
- [ ] Test room listing and details
- [ ] Test booking creation and management
- [ ] Set up custom domain (optional)
- [ ] Set up HTTPS (should be automatic with Render and Netlify)
