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
  private authInitialized = false;

  constructor(
    private auth: Auth,
    private router: Router
  ) {
    // Listen to auth state changes
    onAuthStateChanged(this.auth, (user) => {
      console.log('Auth state changed:', user);
      this.userSubject.next(user);
      this.authInitialized = true;
    });
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      // Wait for auth to be initialized
      if (!this.authInitialized) {
        await new Promise(resolve => setTimeout(resolve, 100));
        return this.getCurrentUser();
      }

      // First check if we have a current user in the auth instance
      const currentUser = this.auth.currentUser;
      if (currentUser) {
        return currentUser;
      }
      
      // If not, try to get it from the BehaviorSubject
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
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw {
        code: error.code,
        message: this.getErrorMessage(error.code)
      };
    }
  }

  async signUpWithEmail(email: string, password: string) {
    try {
      const result = await createUserWithEmailAndPassword(this.auth, email, password);
      return result;
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw {
        code: error.code,
        message: this.getErrorMessage(error.code)
      };
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
      throw {
        code: error.code,
        message: this.getErrorMessage(error.code)
      };
    }
  }

  async signOut() {
    try {
      await signOut(this.auth);
      this.router.navigate(['/login']);
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw {
        code: error.code,
        message: this.getErrorMessage(error.code)
      };
    }
  }

  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      // Common errors
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/user-disabled':
        return 'This account has been disabled. Please contact support.';
      case 'auth/user-not-found':
        return 'No account found with this email.';
      case 'auth/invalid-credential':
        return 'Incorrect password. Please try again.';
      case 'auth/email-already-in-use':
        return 'This email is already registered. Please sign in.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters long.';
      case 'auth/operation-not-allowed':
        return 'Email/password accounts are not enabled. Please contact support.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please try again later.';
      
      // Google Sign-in specific errors
      case 'auth/popup-closed-by-user':
        return 'Sign-in was cancelled.';
      case 'auth/popup-blocked':
        return 'Popup was blocked by the browser. Please allow popups for this site.';
      case 'auth/operation-not-supported-in-this-environment':
        return 'Google Sign-In is not supported in this environment.';
      case 'auth/cancelled-popup-request':
        return 'Another sign-in attempt is in progress.';
      
      default:
        return 'An error occurred. Please try again.';
    }
  }
} 