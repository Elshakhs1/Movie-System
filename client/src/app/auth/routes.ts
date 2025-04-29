import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RegisterAdminComponent } from './register-admin/register-admin.component';

export const AUTH_ROUTES: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'register-admin', component: RegisterAdminComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
]; 