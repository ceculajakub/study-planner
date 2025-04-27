import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule
  ],
  template: `
    <div class="register-container">
      <mat-card class="register-card">
        <mat-card-header>
          <mat-card-title class="mat-card-title">Create your account</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email address</mat-label>
              <mat-icon matPrefix>email</mat-icon>
              <input matInput type="email" formControlName="email">
              <mat-error *ngIf="registerForm.get('email')?.hasError('required')">
                Email is required
              </mat-error>
              <mat-error *ngIf="registerForm.get('email')?.hasError('email')">
                Please enter a valid email address
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <mat-icon matPrefix>lock</mat-icon>
              <input matInput type="password" formControlName="password">
              <mat-error *ngIf="registerForm.get('password')?.hasError('required')">
                Password is required
              </mat-error>
              <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">
                Password must be at least 6 characters long
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Confirm Password</mat-label>
              <mat-icon matPrefix>lock_outline</mat-icon>
              <input matInput type="password" formControlName="confirmPassword">
              <mat-error *ngIf="registerForm.get('confirmPassword')?.hasError('required')">
                Please confirm your password
              </mat-error>
              <mat-error *ngIf="registerForm.hasError('passwordMismatch')">
                Passwords do not match
              </mat-error>
            </mat-form-field>

            <div class="form-actions">
              <button mat-raised-button color="primary" type="submit" [disabled]="isLoading || registerForm.invalid">
                <mat-icon>person_add</mat-icon>
                <span>{{ isLoading ? 'Registering...' : 'Register' }}</span>
              </button>
            </div>
          </form>

          <div class="login-link">
            <a routerLink="/login" class="link-text">
              <mat-icon>login</mat-icon>
              <span>Already have an account? Sign in</span>
            </a>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .register-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background-color: #f5f5f5;
    }

    .register-card {
      width: 100%;
      max-width: 400px;
    }

    .register-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .full-width {
      width: 100%;
    }

    .form-actions {
      display: flex;
      justify-content: center;
      margin-top: 16px;
    }

    .login-link {
      text-align: center;
      margin-top: 24px;
    }

    .link-text {
      color: #1976d2;
      text-decoration: none;
      font-weight: 500;
    }

    .link-text:hover {
      text-decoration: underline;
    }
    .mat-card-title{
      margin-bottom: 24px;
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  private passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null
      : { passwordMismatch: true };
  }

  async onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading = true;
    try {
      await this.authService.signUpWithEmail(
        this.registerForm.get('email')?.value,
        this.registerForm.get('password')?.value
      );
      this.snackBar.open('Registration successful! Redirecting to dashboard...', 'Close', {
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
} 