# VHA Backend API

This is the backend API for the VHA Platform, built with Node.js, Express, and MongoDB.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Set up MongoDB:
   
   Option A: Local MongoDB
   - Install MongoDB Community Server from https://www.mongodb.com/try/download/community
   - Start MongoDB service
   - Use this URI in your `.env` file: `mongodb://localhost:27017/vha_platform`
   
   Option B: MongoDB Atlas (Recommended)
   - Sign up for a free MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
   - Create a new cluster
   - Create a database user
   - Add your IP address to the whitelist (or allow access from anywhere for development)
   - Get your connection string from the 'Connect' button
   - Replace `<username>` and `<password>` with your database credentials
   - Use this URI in your `.env` file: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/vha_platform?retryWrites=true&w=majority`
   
   Update the `.env` file with your chosen MongoDB URI:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   ```

3. Start the development server:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication

- `POST /api/auth/patient/login` - Patient login
- `POST /api/auth/provider/login` - Provider login

### Patients

- `POST /api/patients` - Register a new patient
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get a specific patient
- `PUT /api/patients/:id` - Update a specific patient
- `PUT /api/patients/:id/health` - Update patient health data
- `GET /api/patients/:id/health` - Get patient health data
- `GET /api/patients/:id/health/history` - Get patient health history
- `DELETE /api/patients/:id` - Delete a specific patient

### Providers

- `POST /api/providers` - Register a new provider
- `GET /api/providers` - Get all providers
- `GET /api/providers/:id` - Get a specific provider
- `PUT /api/providers/:id` - Update a specific provider
- `DELETE /api/providers/:id` - Delete a specific provider

## Project Structure

- `server.js` - Main server file
- `models/` - Database models
- `controllers/` - Route handlers
- `routes/` - API routes
- `.env` - Environment variables