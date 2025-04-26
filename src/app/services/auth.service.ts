import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(
    private auth: Auth,
    private router: Router
  ) {
    onAuthStateChanged(this.auth, (user) => {
      console.log('Auth state changed:', user);
      this.userSubject.next(user);
    });
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const user = await firstValueFrom(this.user$);
      console.log('Current user from getCurrentUser:', user);
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  async signInWithEmail(email: string, password: string) {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async signUpWithEmail(email: string, password: string) {
    try {
      const result = await createUserWithEmailAndPassword(this.auth, email, password);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      provider.addScope('profile');
      provider.addScope('email');
      
      console.log('Starting Google Sign-In process...');
      const result = await signInWithPopup(this.auth, provider);
      console.log('Google Sign-In successful:', result);
      return result;
    } catch (error: any) {
      console.error('Google Sign-In error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in was cancelled');
      } else if (error.code === 'auth/popup-blocked') {
        throw new Error('Popup was blocked by the browser. Please allow popups for this site.');
      } else if (error.code === 'auth/operation-not-supported-in-this-environment') {
        throw new Error('Google Sign-In is not supported in this environment');
      } else {
        throw error;
      }
    }
  }

  async signOut() {
    try {
      await signOut(this.auth);
      this.router.navigate(['/login']);
    } catch (error) {
      throw error;
    }
  }
} 