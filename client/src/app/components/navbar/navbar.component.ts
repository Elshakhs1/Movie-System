import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="navbar bg-base-100 shadow-md">
      <div class="navbar-start">
        <div class="dropdown">
          <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
          </div>
          <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li><a routerLink="/">Movies</a></li>
            <li *ngIf="(user$ | async)?.role === 'admin'"><a routerLink="/admin">Admin Panel</a></li>
          </ul>
        </div>
        <a routerLink="/" class="btn btn-ghost text-xl">Movie System</a>
      </div>
      <div class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal px-1">
          <li><a routerLink="/">Movies</a></li>
          <li *ngIf="(user$ | async)?.role === 'admin'"><a routerLink="/admin">Admin Panel</a></li>
        </ul>
      </div>
      <div class="navbar-end">
        <ng-container *ngIf="!(user$ | async); else loggedIn">
          <a routerLink="/login" class="btn btn-ghost">Login</a>
          <a routerLink="/register" class="btn btn-primary">Register</a>
        </ng-container>
        <ng-template #loggedIn>
          <div class="dropdown dropdown-end">
            <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
              <div class="w-10 rounded-full">
                <div class="flex items-center justify-center h-full bg-primary text-white">
                  {{ (user$ | async)?.name?.charAt(0) }}
                </div>
              </div>
            </div>
            <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li><a routerLink="/profile">Profile</a></li>
              <li><a (click)="logout()">Logout</a></li>
            </ul>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styles: []
})
export class NavbarComponent implements OnInit {
  user$!: Observable<User | null>;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.user$ = this.authService.user$;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
} 