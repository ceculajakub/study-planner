import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DataService, Goal } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { DeviceService } from '../../services/device.service';
import { NotificationService } from '../../services/notification.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { NavigationComponent } from '../navigation/navigation.component';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

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
    MatSelectModule,
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
        <mat-card class="goal-form-card" id="goalForm" #goalForm>
          <mat-card-header>
            <mat-card-title>{{ editingGoal ? 'Edit Goal' : 'Add New Goal' }}</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <form (ngSubmit)="editingGoal ? saveEdit() : addGoal()" class="goal-form" [class.loading]="isLoading">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Title</mat-label>
                <input matInput type="text" [(ngModel)]="(editingGoal || newGoal).title" name="title" required [disabled]="isLoading">
                <mat-error *ngIf="!(editingGoal || newGoal).title">Title is required</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Description</mat-label>
                <textarea matInput [(ngModel)]="(editingGoal || newGoal).description" name="description" rows="3" [disabled]="isLoading"></textarea>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Target Date</mat-label>
                <input matInput [matDatepicker]="picker" [(ngModel)]="(editingGoal || newGoal).targetDate" name="targetDate" required [disabled]="isLoading">
                <mat-datepicker-toggle matSuffix [for]="picker" [disabled]="isLoading"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
                <mat-error *ngIf="!(editingGoal || newGoal).targetDate">Target date is required</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Progress</mat-label>
                <mat-select [(ngModel)]="(editingGoal || newGoal).progress" name="progress" [disabled]="isLoading">
                  <mat-option *ngFor="let option of progressOptions" [value]="option.value">
                    {{ option.label }}
                  </mat-option>
                </mat-select>
              </mat-form-field>

              <div class="form-actions">
                <button mat-button type="button" (click)="editingGoal ? cancelEdit() : null" *ngIf="editingGoal">
                  Cancel
                </button>
                <button mat-raised-button color="primary" type="submit" [disabled]="isLoading || !(editingGoal || newGoal).title || !(editingGoal || newGoal).targetDate">
                  <span *ngIf="!isLoading">{{ editingGoal ? 'Save Changes' : 'Add Goal' }}</span>
                  <mat-spinner *ngIf="isLoading" diameter="20"></mat-spinner>
                </button>
              </div>
            </form>
          </mat-card-content>
        </mat-card>

        <mat-card class="goals-list-card">
          <mat-card-header>
            <mat-card-title>Your Goals</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div *ngIf="isLoading" class="loading-spinner">
              <mat-spinner diameter="30"></mat-spinner>
            </div>
            <mat-list *ngIf="!isLoading">
              <mat-list-item *ngFor="let goal of goals" class="goal-list-item">
                <div class="goal-item">
                  <div class="goal-content">
                    <div class="goal-header">
                      <div class="goal-title">{{ goal.title }}</div>
                      <div class="goal-target-date">Target: {{ formatDate(goal.targetDate) }}</div>
                    </div>
                    <div class="goal-description">{{ goal.description }}</div>
                    <div class="goal-progress">
                      <div class="progress-header">
                        <span class="progress-label">Progress</span>
                        <span class="progress-value">{{ goal.progress }}%</span>
                      </div>
                      <mat-progress-bar mode="determinate" [value]="goal.progress"></mat-progress-bar>
                    </div>
                  </div>
                  <div class="goal-actions">
                    <button mat-icon-button color="primary" (click)="editGoal(goal)" matTooltip="Edit goal">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button color="warn" (click)="deleteGoal(goal)" matTooltip="Delete goal">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                </div>
                <mat-divider></mat-divider>
              </mat-list-item>
              <mat-list-item *ngIf="goals.length === 0">
                <div class="no-goals">No goals yet.</div>
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
      max-width: 1200px;
      margin-left: auto;
      margin-right: auto;
    }

    .goal-form-card, .goals-list-card {
      margin-bottom: 20px;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .goal-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px;
    }

    .full-width {
      width: 100%;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 16px;
    }

    .goal-list-item {
      height: auto !important;
      padding: 16px 0;
    }

    .goal-item {
      display: flex;
      align-items: flex-start;
      width: 100%;
      padding: 16px;
    }

    .goal-content {
      flex: 1;
      margin-right: 16px;
    }

    .goal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .goal-title {
      font-weight: 500;
      font-size: 16px;
      color: rgba(0, 0, 0, 0.87);
    }

    .goal-target-date {
      color: rgba(0, 0, 0, 0.6);
      font-size: 14px;
    }

    .goal-description {
      color: rgba(0, 0, 0, 0.6);
      font-size: 14px;
      margin: 8px 0;
      white-space: pre-wrap;
    }

    .goal-progress {
      margin-top: 16px;
    }

    .progress-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .progress-label {
      color: rgba(0, 0, 0, 0.6);
      font-size: 14px;
    }

    .progress-value {
      color: rgba(0, 0, 0, 0.6);
      font-size: 14px;
    }

    .progress-select {
      margin-top: 8px;
      width: 100%;
    }

    .no-goals {
      color: rgba(0, 0, 0, 0.6);
      font-style: italic;
      text-align: center;
      width: 100%;
      padding: 16px;
    }

    .loading-spinner {
      display: flex;
      justify-content: center;
      padding: 20px;
    }

    .goal-actions {
      display: flex;
      gap: 8px;
    }

    .goal-form-card {
      scroll-margin-top: 100px;
    }
  
    @media (max-width: 599px) {
      .goals-content {
        margin-top: 56px;
        padding: 16px;
      }

      .goal-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
      }

      .goal-target-date {
        font-size: 12px;
      }
    }
  `]
})
export class GoalsComponent implements OnInit, OnDestroy {
  goals: Goal[] = [];
  newGoal: Partial<Goal> = {
    title: '',
    description: '',
    targetDate: new Date(),
    progress: 0
  };
  editingGoal: Goal | null = null;
  progressOptions = [
    { value: 0, label: 'Not Started (0%)' },
    { value: 25, label: 'Started (25%)' },
    { value: 50, label: 'Halfway (50%)' },
    { value: 75, label: 'Almost There (75%)' },
    { value: 100, label: 'Completed (100%)' }
  ];
  isLoading = false;
  userId: string = '';

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private deviceService: DeviceService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  async ngOnInit() {
    try {
      const user = await this.authService.getCurrentUser();
      if (!user) {
        this.router.navigate(['/login']);
        return;
      }
      this.userId = user.uid;
      this.loadGoals();
    } catch (error) {
      console.error('Error initializing goals component:', error);
      this.router.navigate(['/login']);
    }
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
            this.goals = goals.sort((a, b) => {
              const dateA = a.targetDate instanceof Date ? a.targetDate : new Date(a.targetDate);
              const dateB = b.targetDate instanceof Date ? b.targetDate : new Date(b.targetDate);
              return dateA.getTime() - dateB.getTime();
            });
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error loading goals:', error);
            this.notificationService.showError('Failed to load goals');
            this.isLoading = false;
          }
        });
      }
    } catch (error) {
      console.error('Error in loadGoals:', error);
      this.notificationService.showError('Failed to load goals');
      this.isLoading = false;
    }
  }

  async addGoal() {
    try {
      this.isLoading = true;
      
      const user = await this.authService.getCurrentUser();
      
      if (!user) {
        console.error('No user logged in');
        this.isLoading = false;
        return;
      }

      const goal: Goal = {
        ...this.newGoal,
        userId: user.uid,
        targetDate: new Date(this.newGoal.targetDate!),
        progress: this.newGoal.progress || 0
      } as Goal;

      await this.dataService.addGoal(goal);
      
      this.newGoal = {
        title: '',
        description: '',
        targetDate: new Date(),
        progress: 0
      };

      await this.loadGoals();
      this.notificationService.showSuccess('Goal added successfully');
    } catch (error) {
      console.error('Error adding goal:', error);
      this.notificationService.showError('An error occurred while adding the goal');
    } finally {
      this.isLoading = false;
    }
  }

  async updateGoalProgress(goal: Goal, progress: number) {
    try {
      goal.progress = progress;
      await this.dataService.updateGoal(goal.id!, goal);
      if (progress === 100) {
        this.deviceService.vibrate(200);
        this.notificationService.showSuccess('Goal completed!');
      } else {
        this.notificationService.showInfo('Progress updated');
      }
    } catch (error) {
      console.error('Error updating goal progress:', error);
      this.notificationService.showError('Failed to update goal progress');
    }
  }

  async deleteGoal(goal: Goal) {
    try {
      await this.dataService.deleteGoal(goal.id!);
      this.notificationService.showSuccess('Goal deleted successfully');
    } catch (error) {
      console.error('Error deleting goal:', error);
      this.notificationService.showError('Failed to delete goal');
    }
  }

  async editGoal(goal: Goal) {
    this.editingGoal = { ...goal };
    setTimeout(() => {
      const element = document.getElementById('goalForm');
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  }

  async saveEdit() {
    try {
      if (!this.editingGoal) return;

      this.isLoading = true;
      await this.dataService.updateGoal(this.editingGoal.id!, {
        title: this.editingGoal.title,
        description: this.editingGoal.description,
        targetDate: this.editingGoal.targetDate,
        progress: this.editingGoal.progress
      });
      
      this.notificationService.showSuccess('Goal updated successfully');
      this.editingGoal = null;
      this.loadGoals();
    } catch (error) {
      console.error('Error updating goal:', error);
      this.notificationService.showError('Failed to update goal');
    } finally {
      this.isLoading = false;
    }
  }

  cancelEdit() {
    this.editingGoal = null;
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'No date set';
    
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      if (isNaN(dateObj.getTime())) {
        return 'Invalid date';
      }
      return dateObj.toLocaleDateString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  }

  ngOnDestroy() {
  }
} 