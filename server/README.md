# Movie System API

This is a RESTful API for a movie management system, built with NestJS and MongoDB.

## Features

- Authentication (Register/Login)
- User management
- Movie management with search functionality
- Artist details
- Rating and comments
- Statistics on ratings

## Prerequisites

- Node.js (v18+)
- MongoDB

## Setup

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following content:

```
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/movie-system

# JWT Configuration
JWT_SECRET=your-secret-key

# Server Settings
PORT=3000
BASE_URL=http://localhost:3000/api

# Upload Settings
UPLOAD_DESTINATION=./uploads
```

4. Start the development server:

```bash
npm run start:dev
```

## API Documentation

The API follows RESTful principles. Here are the available endpoints:

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user

### Users

- `PATCH /api/users/me` - Update current user profile
- `PATCH /api/users/:id/promote` - Promote a user to admin (Admin only)

### Movies

- `GET /api/movies` - Get all movies with optional search parameters
- `POST /api/movies` - Add a new movie (Admin only)
- `POST /api/movies/:id/poster` - Upload a movie poster (Admin only)
- `DELETE /api/movies/:id` - Delete a movie (Admin only)

### Artists

- `GET /api/artists` - Search artists
- `POST /api/artists` - Add a new artist (Admin only)

### Ratings and Comments

- `POST /api/movies/:movieId/ratings` - Rate a movie (Authenticated)
- `POST /api/movies/:movieId/comments` - Comment on a movie (Authenticated)

### Statistics

- `GET /api/stats/ratings` - Get movie rating statistics by demographic

## License

MIT
