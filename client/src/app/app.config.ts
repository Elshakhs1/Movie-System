import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { MovieService } from './services/movie.service';
import { StatsService } from './services/stats.service';
import { UserService } from './services/user.service';
import { RatingService } from './services/rating.service';
import { CommentService } from './services/comment.service';
import { authInterceptor } from './auth/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(
      withInterceptorsFromDi(),
      withInterceptors([authInterceptor])
    ),
    MovieService,
    StatsService,
    UserService,
    RatingService,
    CommentService
  ]
};
