import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="flex min-h-[calc(100vh-64px)] flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 class="mt-6 text-center text-3xl font-bold tracking-tight">Create a new account</h2>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-base-200 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form (ngSubmit)="onSubmit()" class="space-y-6">
            <div>
              <label for="name" class="label">Full name</label>
              <div class="mt-1">
                <input 
                  [(ngModel)]="name" 
                  name="name" 
                  type="text" 
                  required 
                  class="input input-bordered w-full"
                />
              </div>
            </div>

            <div>
              <label for="email" class="label">Email address</label>
              <div class="mt-1">
                <input 
                  [(ngModel)]="email" 
                  name="email" 
                  type="email" 
                  required 
                  class="input input-bordered w-full"
                />
              </div>
            </div>

            <div>
              <label for="password" class="label">Password</label>
              <div class="mt-1">
                <input 
                  [(ngModel)]="password" 
                  name="password" 
                  type="password" 
                  required 
                  class="input input-bordered w-full"
                />
              </div>
              <p class="text-xs mt-1 text-base-content/70">
                Password must be at least 8 characters long.
              </p>
            </div>

            <div>
              <label for="age" class="label">Age</label>
              <div class="mt-1">
                <input 
                  [(ngModel)]="age" 
                  name="age" 
                  type="number" 
                  class="input input-bordered w-full"
                />
              </div>
            </div>

            <div>
              <label for="gender" class="label">Gender</label>
              <div class="mt-1">
                <select [(ngModel)]="gender" name="gender" class="select select-bordered w-full">
                  <option value="" disabled selected>Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label for="country" class="label">Country</label>
              <div class="mt-1">
                <input 
                  [(ngModel)]="country" 
                  name="country" 
                  type="text" 
                  class="input input-bordered w-full"
                />
              </div>
            </div>

            <div *ngIf="error" class="alert alert-error">
              {{ error }}
            </div>

            <div>
              <button 
                type="submit"
                [disabled]="isLoading" 
                class="btn btn-primary w-full"
              >
                {{ isLoading ? 'Registering...' : 'Register' }}
              </button>
            </div>
          </form>

          <div class="mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-base-300"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-base-200">Already have an account?</span>
              </div>
            </div>

            <div class="mt-6">
              <a 
                routerLink="/login" 
                class="btn btn-outline btn-primary w-full"
              >
                Login
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  age: number | null = null;
  gender = '';
  country = '';
  isLoading = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    if (!this.name || !this.email || !this.password) {
      this.error = 'Please enter name, email, and password';
      return;
    }

    if (this.password.length < 8) {
      this.error = 'Password must be at least 8 characters long';
      return;
    }

    this.isLoading = true;
    this.error = '';

    const registerData = {
      name: this.name,
      email: this.email,
      password: this.password,
      ...(this.age ? { age: this.age } : {}),
      ...(this.gender ? { gender: this.gender } : {}),
      ...(this.country ? { country: this.country } : {})
    };

    this.authService.register(registerData).subscribe({
      next: () => {
        // After successful registration, log in the user
        this.authService.login({ email: this.email, password: this.password }).subscribe({
          next: () => {
            this.router.navigate(['/']);
          },
          error: (err) => {
            this.isLoading = false;
            this.error = 'Registration successful, but login failed. Please try logging in manually.';
          }
        });
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
} 