# Hotel Booking Application

A full-stack hotel booking application with Vue.js frontend and Node.js/Express/MongoDB backend.

## Project Structure

This project consists of two main parts:

- **Frontend**: Vue.js application in the `front-end` directory
- **Backend**: Node.js/Express API in the `backend` directory

## Features

- User authentication (register, login)
- Room listing with filtering and sorting
- Room details and availability checking
- Booking creation and management
- User dashboard with booking history
- Booking cancellation

## Local Development

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=8000
   MONGODB_URI=mongodb://localhost:27017/hotel_booking_db
   JWT_SECRET=your_jwt_secret_here
   JWT_EXPIRES_IN=30d
   ```

4. Start the development server:
   ```
   npm run dev
   ```

The backend will be available at http://localhost:8000/api

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd front-end
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   VITE_API_URL=http://localhost:8000/api
   ```

4. Start the development server:
   ```
   npm run dev
   ```

The frontend will be available at http://localhost:5173

## Deployment

### Backend Deployment (Render)

1. Sign up for a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account and create a cluster
2. Sign up for [Render](https://render.com)
3. Create a new Web Service and connect your GitHub repository
4. Configure the service:
   - Name: `hotel-booking-api`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Root Directory: `backend` (if your repo contains both frontend and backend)
5. Add environment variables:
   - `PORT`: `8000` (Render will override this with their own port)
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secure random string
   - `JWT_EXPIRES_IN`: `30d`

### Frontend Deployment (Netlify)

1. Update the API URL in your frontend code to point to your Render backend URL
2. Sign up for [Netlify](https://www.netlify.com)
3. Create a new site and connect your GitHub repository
4. Configure the build settings:
   - Base directory: `front-end` (if your repo contains both frontend and backend)
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Add environment variables:
   - `VITE_API_URL`: Your backend API URL (e.g., `https://hotel-booking-api.onrender.com/api`)

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/me` - Get current user profile (protected)

### Room Endpoints

- `GET /api/rooms` - Get all rooms (with filtering and pagination)
- `GET /api/rooms/:id` - Get a specific room
- `GET /api/rooms/:id/check-availability` - Check room availability

### Booking Endpoints

- `POST /api/bookings` - Create a new booking (protected)
- `GET /api/bookings/my-bookings` - Get all bookings for current user (protected)
- `GET /api/bookings/:id` - Get a specific booking (protected)
- `PATCH /api/bookings/:id/cancel` - Cancel a booking (protected)

## Technologies Used

- **Frontend**:
  - Vue.js 3
  - Vue Router
  - Custom CSS (no frameworks)
  - Vite

- **Backend**:
  - Node.js
  - Express.js
  - MongoDB with Mongoose
  - JWT for authentication
  - bcryptjs for password hashing

## License

MIT
