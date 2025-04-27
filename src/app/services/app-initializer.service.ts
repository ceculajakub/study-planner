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
      if (user) {
        // User is logged in, navigate to dashboard
        await this.router.navigate(['/dashboard']);
      } else {
        // User is not logged in, navigate to login
        await this.router.navigate(['/login']);
      }
    } catch (error) {
      console.error('Error during app initialization:', error);
      // In case of error, navigate to login
      await this.router.navigate(['/login']);
    }
  }
} 