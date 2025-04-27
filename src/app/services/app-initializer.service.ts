import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AppInitializerService {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async initializeApp(): Promise<void> {
    try {
      // Wait for the auth state to be initialized
      const user = await this.authService.getCurrentUser();
      const currentPath = window.location.pathname;
      
      // If we're on a protected route and not authenticated
      if (!user && ['/tasks', '/goals', '/notes', '/dashboard'].includes(currentPath)) {
        await this.router.navigate(['/login'], {
          queryParams: { returnUrl: currentPath }
        });
        return;
      }
      
      // If we're authenticated and trying to access login/register
      if (user && ['/login', '/register'].includes(currentPath)) {
        await this.router.navigate(['/dashboard']);
        return;
      }
      
      // If we're authenticated and on root path
      if (user && currentPath === '/') {
        await this.router.navigate(['/dashboard']);
        return;
      }
      
      // If we're not authenticated and on root path
      if (!user && currentPath === '/') {
        await this.router.navigate(['/login']);
        return;
      }
    } catch (error) {
      console.error('Error during app initialization:', error);
      // Only navigate to login if we're on a protected route
      const currentPath = window.location.pathname;
      if (['/tasks', '/goals', '/notes', '/dashboard'].includes(currentPath)) {
        await this.router.navigate(['/login'], {
          queryParams: { returnUrl: currentPath }
        });
      }
    }
  }
} 