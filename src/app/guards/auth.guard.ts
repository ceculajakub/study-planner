import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take, filter } from 'rxjs/operators';

export const AuthGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.user$.pipe(
    filter(user => user !== null),
    take(1),
    map(user => {
      if (user) {
        return true;
      } else {
        const currentUrl = window.location.pathname;
        router.navigate(['/login'], { 
          queryParams: { returnUrl: currentUrl },
          replaceUrl: true
        });
        return false;
      }
    })
  );
}; 