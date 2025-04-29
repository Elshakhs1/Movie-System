# Movie System Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Technologies Used](#technologies-used)
4. [Frontend-Backend Connection](#frontend-backend-connection)
5. [Algorithms](#algorithms)
6. [Business Logic](#business-logic)
7. [Design Patterns](#design-patterns)
8. [Test Cases](#test-cases)
9. [User Manual](#user-manual)
10. [API Documentation](#api-documentation)
11. [Database Schema](#database-schema)
12. [Deployment](#deployment)

## Project Overview
The Movie System is a web application for browsing, rating, and reviewing movies. It features user authentication, movie management, artist information, and an admin dashboard for content control. The system uses a MongoDB database with NestJS backend and Angular frontend.

### Key Features
- User authentication and role-based access control
- Movie browsing with filtering by genres, year, and more
- Movie details with cast and crew information
- Rating and review system
- Admin dashboard for content management
- Artist/director information
- User profiles with demographics (age, gender, country)

## System Architecture
The system implements a standard client-server architecture:

- **Frontend**: Angular-based single-page application
- **Backend**: NestJS REST API server
- **Database**: MongoDB document database

### Frontend Architecture
- **Presentation Layer**: Angular components for UI
- **Service Layer**: API communication services
- **Routing Layer**: Navigation between pages with route guards

### Backend Architecture
- **API Layer**: NestJS controllers with route protection
- **Service Layer**: Business logic implementation
- **Data Access Layer**: Mongoose schemas and models
- **Authentication Layer**: JWT-based authentication and role protection

### Connection Flow
1. Frontend makes HTTP requests to backend endpoints
2. Backend validates requests using guards and DTOs
3. Backend processes requests and interacts with MongoDB
4. Backend sends responses back to the frontend
5. Frontend updates UI based on response data

## Technologies Used

### Frontend Technologies
- **Angular**: Component-based framework for building SPAs
  - *Usage*: Creates modular UI components for the movie interface
  - *Function*: Provides routing, form handling, and HTTP client

- **TypeScript**: Strongly typed JavaScript
  - *Usage*: Used throughout the frontend codebase
  - *Function*: Enables static type checking for better maintainability

- **Angular Router**: Client-side routing
  - *Usage*: Manages navigation between different views
  - *Function*: Handles route guards for protected pages

### Backend Technologies
- **NestJS**: Progressive Node.js framework
  - *Usage*: Creates scalable backend API
  - *Function*: Provides decorators, dependency injection, and modules

- **MongoDB/Mongoose**: NoSQL database and ODM
  - *Usage*: Stores and retrieves application data
  - *Function*: Provides schema validation and document querying

- **JWT Authentication**: JSON Web Token implementation
  - *Usage*: Secures API endpoints based on user roles
  - *Function*: Implements stateless authentication

- **Multer**: File upload handling
  - *Usage*: Processes movie poster uploads
  - *Function*: Manages file storage and retrieval

## Frontend-Backend Connection

### API Communication
The frontend communicates with the backend through RESTful endpoints:

1. Angular services make HTTP requests to the NestJS API
2. JWT tokens are included in request headers for authentication
3. Server validates requests and returns appropriate responses
4. Success/failure responses follow a consistent format

### Authentication Flow
1. User registers or logs in via the auth endpoints
2. Server validates credentials and generates a JWT token
3. Token is stored on the client side
4. Token is included in subsequent request headers
5. Server middleware validates token on protected routes
6. Role-based guards restrict access to admin features

### Code Example - Response Format
The backend consistently returns responses in this format:
```typescript
{
  success: boolean,
  data?: any,
  message?: string
}
```

## Algorithms

### Movie Search Algorithm
The system implements basic search functionality:

1. **Text Search**
   - MongoDB text index on movie titles
   - Client-side filtering for additional criteria

2. **Filtering Options**
   - Genre-based filtering
   - Release year filtering
   - Rating-based filtering

### Rating System
The rating implementation includes:

1. **Average Rating Calculation**
   - Simple arithmetic mean of user ratings
   - Updates when new ratings are added

2. **User-specific Rating**
   - Users can rate movies on a scale (likely 1-5)
   - Users can update their rating

## Business Logic

### Movie Management
The system implements these movie operations:

1. **Movie CRUD Operations**
   - Creating new movies (admin only)
   - Reading movie details
   - Updating movie information (admin only)
   - Deleting movies (admin only)

2. **Poster Management**
   - Upload movie posters
   - Store files on the server
   - Serve static files via dedicated endpoint

3. **Movie-Artist Relationships**
   - Connect movies with directors
   - Associate movies with cast members

### User Management
User-related business logic includes:

1. **Authentication**
   - Registration with email/password
   - Secure password hashing with bcrypt
   - Login with JWT token generation

2. **Role-based Access**
   - Admin role for content management
   - User role for standard features
   - Route protection based on roles

3. **User Demographics**
   - Age, gender, and country tracking
   - Potential for demographic-based analytics

### Comments and Ratings
The system handles user feedback:

1. **Movie Ratings**
   - Users can rate movies
   - System calculates average ratings
   - Ratings linked to specific users and movies

2. **Movie Comments/Reviews**
   - Users can write comments on movies
   - Comments are linked to users and movies
   - Potential moderation by admins

## Design Patterns

### Frontend Design Patterns

1. **Component Pattern**
   - Separation of page components and reusable UI elements
   - Example: Movie card components used in lists

2. **Service Pattern**
   - API communication encapsulated in services
   - Example: MovieService handling all movie-related API calls

3. **Guard Pattern**
   - Route protection based on authentication and roles
   - Example: AuthGuard and AdminGuard protecting routes

### Backend Design Patterns

1. **Dependency Injection**
   - NestJS services injected into controllers
   - Example: MoviesService injected into MoviesController

2. **Repository/Model Pattern**
   - Database interactions through Mongoose models
   - Example: Movie model handling database operations

3. **DTO Pattern**
   - Data Transfer Objects for API input validation
   - Example: CreateMovieDto validating movie creation requests

4. **Guard/Interceptor Pattern**
   - Request processing pipeline
   - Example: JwtAuthGuard and RolesGuard protecting routes

## Test Cases

### Frontend Tests

1. **Component Tests**
   - Testing UI components render correctly
   - Verifying component interactions

2. **Service Tests**
   - Testing API service methods
   - Mocking HTTP responses

3. **Integration Tests**
   - Testing component communication
   - Verifying route navigation

### Backend Tests

1. **Unit Tests**
   - Testing service methods
   - Testing controller endpoints

2. **Integration Tests**
   - Testing end-to-end API flows
   - Testing database interactions

## User Manual

### Getting Started

1. **Registration**
   - Navigate to the registration page
   - Fill in required information (name, email, password)
   - Submit the form to create an account

2. **Login**
   - Enter email and password
   - System authenticates and redirects to the home page

3. **Browsing Movies**
   - View the movie list on the home page
   - Use filters to narrow down results
   - Click on a movie poster to view details

### Features Guide

1. **Movie Details**
   - View comprehensive information about a movie
   - See director and cast information
   - Check average ratings and user comments

2. **Rating Movies**
   - Click on the rating component to rate a movie
   - Your rating contributes to the average score
   - You can update your rating at any time

3. **Commenting on Movies**
   - Add comments on the movie detail page
   - See other users' comments

4. **Admin Features** (Admin users only)
   - Add new movies to the system
   - Upload movie posters
   - Delete movies from the system

### Troubleshooting

1. **Login Issues**
   - Ensure email and password are correct
   - Contact an administrator if you cannot access your account

2. **Content Not Loading**
   - Check your internet connection
   - Refresh the page to reload content

## API Documentation
The system provides the following core API endpoints:

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate a user and receive token

### Movie Endpoints
- `GET /api/movies` - List movies with filtering options
- `GET /api/movies/:id` - Get detailed movie information
- `POST /api/movies` - Create a new movie (admin only)
- `POST /api/movies/:id/poster` - Upload movie poster (admin only)
- `DELETE /api/movies/:id` - Delete a movie (admin only)

### User Endpoints
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Rating and Comment Endpoints
- `POST /api/ratings` - Add a rating to a movie
- `POST /api/comments` - Add a comment to a movie

## Database Schema
The system uses MongoDB with the following main collections:

### Main Collections
- **users**: User account information (name, email, passwordHash, role)
- **movies**: Movie details (title, releaseYear, description, genres, posterUrl)
- **artists**: People involved in movies (name, bio, dateOfBirth, nationality, type)
- **ratings**: User ratings for movies (score, userId, movieId)
- **comments**: User comments on movies (content, userId, movieId)

### Key Relationships
- Movies reference a director (artist)
- Movies contain arrays of cast members (artists)
- Ratings link users to movies
- Comments link users to movies

## Deployment
The system can be deployed using various methods:

### Environment Variables
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for signing JWT tokens
- `PORT`: Server port (default: 3000)

### Deployment Steps
1. Set up MongoDB instance
2. Configure environment variables
3. Build Angular frontend
4. Build NestJS backend
5. Serve static frontend files from backend
6. Connect to MongoDB database
