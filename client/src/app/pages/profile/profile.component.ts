import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container py-8">
      <div class="max-w-2xl mx-auto">
        <h1 class="text-3xl font-bold mb-6">Your Profile</h1>
        
        <div class="bg-base-200 shadow rounded-lg p-6">
          <form (ngSubmit)="onSubmit()" class="space-y-6">
            <div>
              <label for="name" class="label">Full name</label>
              <input 
                [(ngModel)]="updatedUser.name" 
                name="name" 
                type="text" 
                class="input input-bordered w-full"
              />
            </div>

            <div>
              <label for="email" class="label">Email address</label>
              <input 
                [value]="user?.email" 
                name="email" 
                type="email" 
                disabled
                class="input input-bordered w-full cursor-not-allowed opacity-70"
              />
              <p class="text-xs mt-1 text-base-content/70">
                Email cannot be changed.
              </p>
            </div>

            <div>
              <label for="age" class="label">Age</label>
              <input 
                [(ngModel)]="updatedUser.age" 
                name="age" 
                type="number" 
                class="input input-bordered w-full"
              />
            </div>

            <div>
              <label for="gender" class="label">Gender</label>
              <select [(ngModel)]="updatedUser.gender" name="gender" class="select select-bordered w-full">
                <option value="" disabled>Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label for="country" class="label">Country</label>
              <input 
                [(ngModel)]="updatedUser.country" 
                name="country" 
                type="text" 
                class="input input-bordered w-full"
              />
            </div>

            <div *ngIf="success" class="alert alert-success">
              {{ success }}
            </div>

            <div *ngIf="error" class="alert alert-error">
              {{ error }}
            </div>

            <div class="flex justify-end">
              <button 
                type="submit"
                [disabled]="isLoading" 
                class="btn btn-primary"
              >
                {{ isLoading ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </form>
        </div>

        <div *ngIf="user?.role === 'admin'" class="mt-6 bg-base-200 shadow rounded-lg p-6">
          <h2 class="text-xl font-semibold mb-4">Admin Status</h2>
          <div class="alert alert-info">
            Your account has admin privileges. You can access the admin panel to manage movies, artists, and users.
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  updatedUser: {
    name?: string;
    age?: number;
    gender?: string;
    country?: string;
  } = {};
  isLoading = false;
  success = '';
  error = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
      if (user) {
        this.updatedUser = {
          name: user.name,
          age: user.age,
          gender: user.gender,
          country: user.country
        };
      }
    });
  }

  onSubmit(): void {
    this.isLoading = true;
    this.success = '';
    this.error = '';

    // Only include fields that have values
    const updateData = {
      ...(this.updatedUser.name ? { name: this.updatedUser.name } : {}),
      ...(this.updatedUser.age ? { age: this.updatedUser.age } : {}),
      ...(this.updatedUser.gender ? { gender: this.updatedUser.gender } : {}),
      ...(this.updatedUser.country ? { country: this.updatedUser.country } : {})
    };

    this.authService.updateProfile(updateData).subscribe({
      next: () => {
        this.isLoading = false;
        this.success = 'Profile updated successfully';
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.error?.message || 'Failed to update profile. Please try again.';
      }
    });
  }
} 