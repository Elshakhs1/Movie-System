import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { HomeComponent } from './home/home.component';
import { MoviesComponent } from './movies/movies.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { MovieDetailComponent } from './movie-detail/movie-detail.component';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard]
  },
  {
    path: 'movies',
    component: MoviesComponent,
    canActivate: [authGuard]
  },
  {
    path: 'movies/:id',
    component: MovieDetailComponent,
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    component: UserProfileComponent,
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];
