import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatSnackBarModule
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>Sign in to your account</mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <mat-icon matPrefix>email</mat-icon>
              <input matInput type="email" formControlName="email">
              <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
                Email is required
              </mat-error>
              <mat-error *ngIf="loginForm.get('email')?.hasError('email')">
                Please enter a valid email address
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <mat-icon matPrefix>lock</mat-icon>
              <input matInput type="password" formControlName="password">
              <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                Password is required
              </mat-error>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" class="full-width" [disabled]="isLoading || loginForm.invalid">
              <mat-icon>login</mat-icon>
              <span>{{ isLoading ? 'Signing in...' : 'Sign in' }}</span>
            </button>
          </form>

          <div class="register-link">
            <button mat-button (click)="navigateToRegister()">
              <mat-icon>person_add</mat-icon>
              <span>Don't have an account? Register here</span>
            </button>
          </div>

          <mat-divider class="my-3"></mat-divider>

          <button mat-raised-button (click)="signInWithGoogle()" class="full-width google-button" [disabled]="isLoading">
            <mat-icon class="google-icon">g_mobiledata</mat-icon>
            <span>Sign in with Google</span>
          </button>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #f5f5f5;
      padding: 16px;
    }

    .login-card {
      width: 100%;
      max-width: 400px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .my-3 {
      margin: 24px 0;
    }

    mat-card-header {
      margin-bottom: 24px;
    }

    mat-card-title {
      font-size: 24px;
      font-weight: 500;
    }

    .google-button {
      background-color: white;
      color: rgba(0, 0, 0, 0.87);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 0 16px;
      height: 40px;
      border: 1px solid #dadce0;
      box-shadow: none;
    }

    .google-button:hover {
      background-color: #f8f9fa;
    }

    .google-icon {
      color: #4285F4;
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .register-link {
      text-align: center;
      margin: 16px 0;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    try {
      await this.authService.signInWithEmail(
        this.loginForm.get('email')?.value,
        this.loginForm.get('password')?.value
      );
      this.snackBar.open('Login successful! Redirecting to dashboard...', 'Close', {
        duration: 3000
      });
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      this.isLoading = false;
      this.snackBar.open(error.message, 'Close', {
        duration: 5000
      });
    }
  }

  async signInWithGoogle() {
    this.isLoading = true;
    try {
      await this.authService.signInWithGoogle();
      this.snackBar.open('Login successful! Redirecting to dashboard...', 'Close', {
        duration: 3000
      });
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      this.isLoading = false;
      this.snackBar.open(error.message, 'Close', {
        duration: 5000
      });
    }
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
} 