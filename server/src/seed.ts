import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './schemas/User.schema';
import { Artist } from './schemas/Artist.schema';
import { Movie } from './schemas/Movie.schema';
import { Rating } from './schemas/Rating.schema';
import { Comment } from './schemas/Comment.schema';

// Seed data for users
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin',
    age: 35,
    gender: 'male',
    country: 'USA',
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user',
    age: 28,
    gender: 'male',
    country: 'Canada',
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'user',
    age: 24,
    gender: 'female',
    country: 'UK',
  },
  {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    password: 'password123',
    role: 'user',
    age: 31,
    gender: 'female',
    country: 'Australia',
  },
  {
    name: 'Bob Brown',
    email: 'bob@example.com',
    password: 'password123',
    role: 'user',
    age: 42,
    gender: 'male',
    country: 'Germany',
  },
];

// Seed data for artists
const artistsData = [
  {
    name: 'Christopher Nolan',
    bio: 'British-American film director known for his cerebral and nonlinear storytelling.',
    dateOfBirth: new Date('1970-07-30'),
    nationality: 'British-American',
    type: 'Director',
  },
  {
    name: 'Leonardo DiCaprio',
    bio: 'American actor and film producer known for his work in biopics and period films.',
    dateOfBirth: new Date('1974-11-11'),
    nationality: 'American',
    type: 'Actor',
  },
  {
    name: 'Scarlett Johansson',
    bio: 'American actress and singer, highest-paid actress since 2018.',
    dateOfBirth: new Date('1984-11-22'),
    nationality: 'American',
    type: 'Actress',
  },
  {
    name: 'Tom Hanks',
    bio: 'American actor and filmmaker, known for both comedic and dramatic roles.',
    dateOfBirth: new Date('1956-07-09'),
    nationality: 'American',
    type: 'Actor',
  },
  {
    name: 'Steven Spielberg',
    bio: 'American filmmaker, considered one of the founding pioneers of the New Hollywood era.',
    dateOfBirth: new Date('1946-12-18'),
    nationality: 'American',
    type: 'Director',
  },
  {
    name: 'Meryl Streep',
    bio: 'American actress, often cited as the best actress of her generation.',
    dateOfBirth: new Date('1949-06-22'),
    nationality: 'American',
    type: 'Actress',
  },
  {
    name: 'Robert Downey Jr.',
    bio: 'American actor known for his roles in the Marvel Cinematic Universe.',
    dateOfBirth: new Date('1965-04-04'),
    nationality: 'American',
    type: 'Actor',
  },
  {
    name: 'Quentin Tarantino',
    bio: 'American filmmaker known for nonlinear storylines and stylized violence.',
    dateOfBirth: new Date('1963-03-27'),
    nationality: 'American',
    type: 'Director',
  },
];

interface ArtistWithId extends Artist {
  _id: any;
  type: string;
}

// Seed data for movies
const getMovies = (directors: ArtistWithId[], actors: ArtistWithId[]) => [
  {
    title: 'Inception',
    releaseYear: 2010,
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    genres: ['Action', 'Sci-Fi', 'Thriller'],
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg',
    director: directors.find(d => d.name === 'Christopher Nolan'),
    artists: [
      actors.find(a => a.name === 'Leonardo DiCaprio'),
    ],
  },
  {
    title: 'The Avengers',
    releaseYear: 2012,
    description: 'Earth\'s mightiest heroes must come together and learn to fight as a team if they are going to stop the mischievous Loki and his alien army from enslaving humanity.',
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BNDYxNjQyMjAtNTdiOS00NGYwLWFmNTAtNThmYjU5ZGI2YTI1XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg',
    director: directors.find(d => d.name === 'Steven Spielberg'),
    artists: [
      actors.find(a => a.name === 'Robert Downey Jr.'),
      actors.find(a => a.name === 'Scarlett Johansson'),
    ],
  },
  {
    title: 'Forrest Gump',
    releaseYear: 1994,
    description: 'The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75.',
    genres: ['Drama', 'Romance'],
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg',
    director: directors.find(d => d.name === 'Steven Spielberg'),
    artists: [
      actors.find(a => a.name === 'Tom Hanks'),
    ],
  },
  {
    title: 'Pulp Fiction',
    releaseYear: 1994,
    description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
    genres: ['Crime', 'Drama'],
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg',
    director: directors.find(d => d.name === 'Quentin Tarantino'),
    artists: [
      actors.find(a => a.name === 'Leonardo DiCaprio'),
    ],
  },
  {
    title: 'The Devil Wears Prada',
    releaseYear: 2006,
    description: 'A smart but sensible new graduate lands a job as an assistant to Miranda Priestly, the demanding editor-in-chief of a high fashion magazine.',
    genres: ['Comedy', 'Drama'],
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BZjQ3ZTIzOTItMGNjNC00MWRmLWJlMGEtMjJmMDM5ZDIzZGM3XkEyXkFqcGdeQXVyMTkzODUwNzk@._V1_.jpg',
    director: directors.find(d => d.name === 'Quentin Tarantino'), // Just using as placeholder
    artists: [
      actors.find(a => a.name === 'Meryl Streep'),
    ],
  },
];

interface UserWithId extends User {
  _id: any;
}

interface MovieWithId extends Movie {
  _id: any;
}

interface RatingWithId extends Rating {
  _id: any;
  score: number;
  movieId: any;
  userId: any;
}

interface CommentWithId extends Comment {
  _id: any;
}

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    // Get model references
    const userModel = app.get<Model<User>>(getModelToken('User'));
    const artistModel = app.get<Model<Artist>>(getModelToken('Artist'));
    const movieModel = app.get<Model<Movie>>(getModelToken('Movie'));
    const ratingModel = app.get<Model<Rating>>(getModelToken('Rating'));
    const commentModel = app.get<Model<Comment>>(getModelToken('Comment'));

    console.log('Clearing existing data...');
    // Clear existing data
    await userModel.deleteMany({});
    await artistModel.deleteMany({});
    await movieModel.deleteMany({});
    await ratingModel.deleteMany({});
    await commentModel.deleteMany({});

    console.log('Creating users...');
    // Create users
    const createdUsers: UserWithId[] = [];
    for (const user of users) {
      try {
        const passwordHash = await bcrypt.hash(user.password, 10);
        const createdUser = await userModel.create({
          ...user,
          passwordHash,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        createdUsers.push(createdUser);
      } catch (error) {
        console.error(`Error creating user ${user.name}:`, error);
      }
    }
    console.log(`Created ${createdUsers.length} users`);

    console.log('Creating artists...');
    // Create artists
    const createdArtists: ArtistWithId[] = [];
    for (const artist of artistsData) {
      try {
        const createdArtist = await artistModel.create({
          name: artist.name,
          bio: artist.bio,
          dateOfBirth: artist.dateOfBirth,
          nationality: artist.nationality,
          type: artist.type,
          featuredIn: [],
        });
        createdArtists.push(createdArtist as ArtistWithId);
      } catch (error) {
        console.error(`Error creating artist ${artist.name}:`, error);
      }
    }
    console.log(`Created ${createdArtists.length} artists`);

    // Filter directors and actors
    const directors = createdArtists.filter((artist) => artist.type === 'Director');
    const actors = createdArtists.filter(
      (artist) => artist.type === 'Actor' || artist.type === 'Actress'
    );

    console.log('Creating movies...');
    // Create movies
    const moviesData = getMovies(directors, actors);
    const createdMovies: MovieWithId[] = [];
    for (const movie of moviesData) {
      try {
        if (movie.director && movie.artists) {
          const movieArtists = movie.artists
            .filter(artist => artist !== undefined)
            .map((artist) => artist?._id);
          
          console.log(`Creating movie: ${movie.title}`);
          const createdMovie = await movieModel.create({
            title: movie.title,
            releaseYear: movie.releaseYear,
            description: movie.description,
            genres: movie.genres,
            posterUrl: movie.posterUrl,
            director: movie.director?._id,
            artists: movieArtists,
            averageRating: 0,
          });
          createdMovies.push(createdMovie as MovieWithId);

          // Update artist's featuredIn
          if (movie.director) {
            const artistIds = [movie.director._id, ...movieArtists].filter(id => id !== undefined);
            for (const artistId of artistIds) {
              await artistModel.findByIdAndUpdate(
                artistId,
                { $push: { featuredIn: createdMovie._id } }
              );
            }
          }
        }
      } catch (error) {
        console.error(`Error creating movie ${movie.title}:`, error);
      }
    }
    console.log(`Created ${createdMovies.length} movies`);

    console.log('Creating ratings...');
    // Create ratings
    const ratings: RatingWithId[] = [];
    for (const movie of createdMovies) {
      try {
        // Each user rates each movie
        for (const user of createdUsers) {
          // Generate a random score between 1 and 5
          const score = Math.floor(Math.random() * 5) + 1;
          const rating = await ratingModel.create({
            movieId: movie._id,
            userId: user._id,
            score,
            createdAt: new Date(),
          });
          ratings.push(rating as RatingWithId);
        }

        // Calculate average rating for movie
        const movieRatings = ratings.filter(
          (r) => r.movieId.toString() === movie._id.toString()
        );
        const ratingSum = movieRatings.reduce((sum, r) => sum + r.score, 0);
        const averageRating = ratingSum / movieRatings.length;

        // Update movie's average rating
        await movieModel.findByIdAndUpdate(movie._id, {
          averageRating,
        });
      } catch (error) {
        console.error(`Error creating ratings for movie ${movie.title}:`, error);
      }
    }
    console.log(`Created ${ratings.length} ratings`);

    console.log('Creating comments...');
    // Create comments
    const comments: CommentWithId[] = [];
    const commentTexts = [
      'Loved this movie!',
      'One of the best films I\'ve ever seen.',
      'Great acting, but the plot was confusing.',
      'Visually stunning but the story was lacking.',
      'Highly recommended for all movie lovers.',
      'Disappointing overall, expected more.',
      'The director did an amazing job with this one.',
      'Can\'t wait for the sequel!',
      'The ending was unexpected and brilliant.',
      'Average movie, nothing special.',
    ];

    for (const movie of createdMovies) {
      try {
        // Add 1-3 comments per user
        for (const user of createdUsers) {
          const commentCount = Math.floor(Math.random() * 3) + 1;
          for (let i = 0; i < commentCount; i++) {
            const randomText = commentTexts[Math.floor(Math.random() * commentTexts.length)];
            const createdAt = new Date();
            createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 30)); // Random date in last month
            
            const comment = await commentModel.create({
              movieId: movie._id,
              userId: user._id,
              text: randomText,
              createdAt,
              updatedAt: createdAt,
            });
            comments.push(comment as CommentWithId);
          }
        }
      } catch (error) {
        console.error(`Error creating comments for movie ${movie.title}:`, error);
      }
    }
    console.log(`Created ${comments.length} comments`);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error in seeding process:', error);
  } finally {
    await app.close();
  }
}

seed().catch((error) => {
  console.error('Error seeding database:', error);
  process.exit(1);
}); 