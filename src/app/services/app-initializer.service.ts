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
      const user = await this.authService.getCurrentUser();
      const currentPath = window.location.pathname;
      
      if (!user && ['/tasks', '/goals', '/notes', '/dashboard'].includes(currentPath)) {
        await this.router.navigate(['/login'], {
          queryParams: { returnUrl: currentPath }
        });
        return;
      }
      
      if (user && ['/login', '/register'].includes(currentPath)) {
        await this.router.navigate(['/dashboard']);
        return;
      }
      
      if (user && currentPath === '/') {
        await this.router.navigate(['/dashboard']);
        return;
      }
      
      if (!user && currentPath === '/') {
        await this.router.navigate(['/login']);
        return;
      }
    } catch (error) {
      console.error('Error during app initialization:', error);
      const currentPath = window.location.pathname;
      if (['/tasks', '/goals', '/notes', '/dashboard'].includes(currentPath)) {
        await this.router.navigate(['/login'], {
          queryParams: { returnUrl: currentPath }
        });
      }
    }
  }
} 