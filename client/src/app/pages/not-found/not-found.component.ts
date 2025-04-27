import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container flex flex-col items-center justify-center min-h-[calc(100vh-64px)] py-12">
      <div class="text-center">
        <h1 class="text-6xl font-bold mb-4">404</h1>
        <p class="text-2xl mb-8">Page not found</p>
        <p class="mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <a routerLink="/" class="btn btn-primary">Go back to home</a>
      </div>
    </div>
  `,
  styles: []
})
export class NotFoundComponent {} 