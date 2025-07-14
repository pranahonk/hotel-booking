# Hotel Booking Frontend

This is the frontend for the Hotel Booking application, built with Vue 3 and Vite. It integrates with the Hotel Booking API hosted at https://hotel-booking-api-zx9t.onrender.com/.

## Features

- User authentication (register, login)
- Room listing and details
- Room availability checking
- Booking creation
- Booking management (view, cancel)
- User profile management

## API Integration

This frontend is integrated with the Hotel Booking API. The API provides endpoints for:
- User authentication
- Room management
- Booking operations

## Project Setup

### Prerequisites

- Node.js (v14 or higher)

### Installation

1. Install dependencies:
```sh
npm install
```

2. Set up environment variables:
Create a `.env` file in the root directory based on the `.env.example` file:
```
VITE_API_URL=https://hotel-booking-api-zx9t.onrender.com/api
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

## Authentication

The application uses JWT for authentication. When a user logs in or registers, a token is stored in localStorage and used for all subsequent API requests that require authentication.
