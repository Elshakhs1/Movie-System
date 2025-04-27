import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { MovieDetailComponent } from './pages/movie-detail/movie-detail.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'movies/:id', component: MovieDetailComponent },
  // Other routes commented for now
  // { path: 'movies', component: MovieListComponent },
  // { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  // { 
  //   path: 'admin', 
  //   component: AdminDashboardComponent, 
  //   canActivate: [AuthGuard, AdminGuard] 
  // },
  { path: '**', component: NotFoundComponent }
];
