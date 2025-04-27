import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="flex min-h-[calc(100vh-64px)] flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 class="mt-6 text-center text-3xl font-bold tracking-tight">Login to your account</h2>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-base-200 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form (ngSubmit)="onSubmit()" class="space-y-6">
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
              <label for="password" class="label">
                <span class="label-text">Password</span>
              </label>
              <div class="mt-1">
                <input 
                  [(ngModel)]="password" 
                  name="password" 
                  type="password" 
                  required 
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
                {{ isLoading ? 'Logging in...' : 'Login' }}
              </button>
            </div>
          </form>

          <div class="mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-base-300"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-base-200">Don't have an account?</span>
              </div>
            </div>

            <div class="mt-6">
              <a 
                routerLink="/register" 
                class="btn btn-outline btn-primary w-full"
              >
                Register
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent {
  email = '';
  password = '';
  isLoading = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.error = 'Please enter both email and password';
      return;
    }

    this.isLoading = true;
    this.error = '';

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.error?.message || 'Invalid credentials. Please try again.';
      }
    });
  }
} 