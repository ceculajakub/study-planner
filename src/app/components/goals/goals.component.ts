import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DataService, Goal } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSliderModule } from '@angular/material/slider';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { NavigationComponent } from '../navigation/navigation.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSliderModule,
    MatListModule,
    MatDividerModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatIconModule,
    NavigationComponent,
    MatButtonModule
  ],
  template: `
    <app-navigation>
      <main class="goals-content">
        <!-- Add Goal Form -->
        <mat-card class="goal-form-card">
          <mat-card-header>
            <mat-card-title>Add New Goal</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <form (ngSubmit)="addGoal()" class="goal-form" [class.loading]="isLoading">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Title</mat-label>
                <input matInput type="text" [(ngModel)]="newGoal.title" name="title" required [disabled]="isLoading">
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Description</mat-label>
                <textarea matInput [(ngModel)]="newGoal.description" name="description" rows="3" [disabled]="isLoading"></textarea>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Target Date</mat-label>
                <input matInput [matDatepicker]="picker" [(ngModel)]="newGoal.targetDate" name="targetDate" required [disabled]="isLoading">
                <mat-datepicker-toggle matSuffix [for]="picker" [disabled]="isLoading"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
              </mat-form-field>

              <div class="progress-container">
                <label>Progress</label>
                <mat-slider min="0" max="100" step="1" [formControl]="progressControl" [disabled]="isLoading">
                  <input matSliderThumb>
                </mat-slider>
                <span class="progress-value">{{ progressControl.value }}%</span>
              </div>

              <div class="form-actions">
                <button mat-raised-button color="primary" type="submit" [disabled]="isLoading">
                  <span *ngIf="!isLoading">Add Goal</span>
                  <mat-spinner *ngIf="isLoading" diameter="20"></mat-spinner>
                </button>
              </div>
            </form>
          </mat-card-content>
        </mat-card>

        <!-- Goals List -->
        <mat-card class="goals-list-card">
          <mat-card-header>
            <mat-card-title>Your Goals</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div *ngIf="isLoading" class="loading-spinner">
              <mat-spinner diameter="30"></mat-spinner>
            </div>
            <mat-list *ngIf="!isLoading">
              <mat-list-item *ngFor="let goal of goals">
                <div class="goal-item">
                  <div class="goal-content">
                    <div class="goal-title">{{ goal.title }}</div>
                    <div class="goal-description">{{ goal.description }}</div>
                    <div class="goal-target-date">Target: {{ goal.targetDate | date }}</div>
                    <div class="goal-progress">
                      <mat-progress-bar mode="determinate" [value]="goal.progress"></mat-progress-bar>
                      <span class="progress-value">{{ goal.progress }}%</span>
                    </div>
                  </div>
                  <button mat-icon-button color="warn" (click)="deleteGoal(goal)" matTooltip="Delete goal">
                    <mat-icon svgIcon="delete"></mat-icon>
                  </button>
                </div>
                <mat-divider></mat-divider>
              </mat-list-item>
              <mat-list-item *ngIf="goals.length === 0">
                <div class="no-goals">No goals yet. Add your first goal above!</div>
              </mat-list-item>
            </mat-list>
          </mat-card-content>
        </mat-card>
      </main>
    </app-navigation>
  `,
  styles: [`
    .goals-content {
      padding: 20px;
      margin-top: 64px;
    }

    .goal-form-card, .goals-list-card {
      margin-bottom: 20px;
    }

    .goal-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .full-width {
      width: 100%;
    }

    .progress-container {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .progress-value {
      text-align: right;
      color: rgba(0, 0, 0, 0.6);
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
    }

    .goal-item {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 16px 0;
    }

    .goal-content {
      flex: 1;
      margin-right: 16px;
    }

    .goal-title {
      font-weight: 500;
    }

    .goal-description {
      color: rgba(0, 0, 0, 0.6);
      font-size: 0.9em;
      margin: 4px 0;
    }

    .goal-target-date {
      color: rgba(0, 0, 0, 0.6);
      font-size: 0.8em;
      margin: 4px 0;
    }

    .goal-progress {
      margin-top: 8px;
    }

    .no-goals {
      color: rgba(0, 0, 0, 0.6);
      font-style: italic;
      text-align: center;
      width: 100%;
    }

    .loading-spinner {
      display: flex;
      justify-content: center;
      padding: 20px;
    }

    @media (max-width: 599px) {
      .goals-content {
        margin-top: 56px;
      }
    }
  `]
})
export class GoalsComponent implements OnInit {
  goals: Goal[] = [];
  newGoal: Partial<Goal> = {
    title: '',
    description: '',
    targetDate: new Date(),
    progress: 0
  };
  progressControl = new FormControl(0);
  isLoading = false;

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadGoals();
    this.progressControl.valueChanges.subscribe(value => {
      this.newGoal.progress = value || 0;
    });
  }

  async loadGoals() {
    try {
      this.isLoading = true;
      console.log('Loading goals...');
      const user = await this.authService.getCurrentUser();
      
      if (user) {
        this.dataService.getGoals(user.uid).subscribe({
          next: (goals) => {
            console.log('Goals loaded:', goals);
            this.goals = goals.sort((a, b) => a.targetDate.getTime() - b.targetDate.getTime());
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error loading goals:', error);
            this.showError('Failed to load goals');
            this.isLoading = false;
          }
        });
      }
    } catch (error) {
      console.error('Error in loadGoals:', error);
      this.showError('Failed to load goals');
      this.isLoading = false;
    }
  }

  async addGoal() {
    try {
      if (!this.newGoal.title || !this.newGoal.targetDate) {
        this.showError('Please fill in all required fields');
        return;
      }

      this.isLoading = true;
      const user = await this.authService.getCurrentUser();
      
      if (user) {
        const goal: Goal = {
          ...this.newGoal as Goal,
          userId: user.uid
        };

        await this.dataService.addGoal(goal);
        this.showSuccess('Goal added successfully');
        
        // Reset form
        this.newGoal = {
          title: '',
          description: '',
          targetDate: new Date(),
          progress: 0
        };
      }
    } catch (error) {
      console.error('Error adding goal:', error);
      this.showError('Failed to add goal');
    } finally {
      this.isLoading = false;
    }
  }

  async updateProgress(goal: Goal, event: any) {
    try {
      const newProgress = event.value;
      if (newProgress === goal.progress) return;

      this.isLoading = true;
      await this.dataService.updateGoal(goal.id!, { progress: newProgress });
      this.showSuccess('Progress updated');
    } catch (error) {
      console.error('Error updating progress:', error);
      this.showError('Failed to update progress');
    } finally {
      this.isLoading = false;
    }
  }

  async deleteGoal(goal: Goal) {
    try {
      this.isLoading = true;
      await this.dataService.deleteGoal(goal.id!);
      this.showSuccess('Goal deleted successfully');
    } catch (error) {
      console.error('Error deleting goal:', error);
      this.showError('Failed to delete goal');
    } finally {
      this.isLoading = false;
    }
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }

  private showSuccess(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }
} 