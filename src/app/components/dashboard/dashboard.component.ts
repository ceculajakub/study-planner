import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataService, Task, Goal, Note } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { Timestamp } from '@angular/fire/firestore';
import { firstValueFrom, Subscription } from 'rxjs';
import { NavigationComponent } from '../navigation/navigation.component';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatListModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatButtonModule,
    NavigationComponent
  ],
  template: `
    <app-navigation>
      <main class="dashboard-content">
        <div class="dashboard-grid">
          <mat-card class="dashboard-card">
            <mat-card-header>
              <mat-card-title>Recent Tasks</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div *ngIf="isLoading" class="loading-spinner">
                <mat-spinner diameter="30"></mat-spinner>
              </div>
              <mat-list *ngIf="!isLoading">
                <mat-list-item *ngFor="let task of recentTasks">
                  <div class="task-item">
                    <mat-checkbox [checked]="task.completed" (change)="toggleTask(task)"></mat-checkbox>
                    <div class="task-content">
                      <div class="task-title">{{ task.title }}</div>
                      <div class="task-due-date">Due: {{ formatDate(task.dueDate) }}</div>
                    </div>
                  </div>
                </mat-list-item>
                <mat-list-item *ngIf="recentTasks.length === 0">
                  <div class="no-items">No recent tasks</div>
                </mat-list-item>
              </mat-list>
            </mat-card-content>
          </mat-card>

          <mat-card class="dashboard-card">
            <mat-card-header>
              <mat-card-title>Active Goals</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div *ngIf="isLoading" class="loading-spinner">
                <mat-spinner diameter="30"></mat-spinner>
              </div>
              <mat-list *ngIf="!isLoading">
                <mat-list-item *ngFor="let goal of activeGoals" class="goal-item">
                  <div class="goal-content">
                    <div class="goal-header">
                      <div class="goal-title">{{ goal.title }}</div>
                      <div class="goal-target-date">Target: {{ formatDate(goal.targetDate) }}</div>
                    </div>
                    <div class="goal-progress">
                      <div class="progress-header">
                        <span class="progress-label">Progress</span>
                        <span class="progress-value">{{ goal.progress }}%</span>
                      </div>
                      <mat-progress-bar mode="determinate" [value]="goal.progress"></mat-progress-bar>
                    </div>
                  </div>
                </mat-list-item>
                <mat-list-item *ngIf="activeGoals.length === 0">
                  <div class="no-items">No active goals</div>
                </mat-list-item>
              </mat-list>
            </mat-card-content>
          </mat-card>

          <mat-card class="dashboard-card">
            <mat-card-header>
              <mat-card-title>Recent Notes</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div *ngIf="isLoading" class="loading-spinner">
                <mat-spinner diameter="30"></mat-spinner>
              </div>
              <mat-list *ngIf="!isLoading">
                <mat-list-item *ngFor="let note of recentNotes" class="note-item">
                  <div class="note-content">
                    <div class="note-title">{{ note.title }}</div>
                    <div class="note-date">{{ formatDate(note.createdAt) }}</div>
                    <div *ngIf="note.type === 'photo' && note.photoUrl" class="note-photo">
                      <img [src]="note.photoUrl" alt="Note photo">
                    </div>
                    <div *ngIf="note.type === 'text'" class="note-text">
                      {{ note.content }}
                    </div>
                    <div *ngIf="note.type === 'audio' && note.audioData" class="note-audio">
                      <audio [src]="note.audioData" controls></audio>
                    </div>
                  </div>
                </mat-list-item>
                <mat-list-item *ngIf="recentNotes.length === 0">
                  <div class="no-items">No recent notes</div>
                </mat-list-item>
              </mat-list>
            </mat-card-content>
          </mat-card>
        </div>
      </main>
    </app-navigation>
  `,
  styles: [`
    .dashboard-content {
      padding: 20px;
      margin-top: 64px;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }

    .dashboard-card {
      height: 100%;
    }

    .task-item {
      display: flex;
      align-items: center;
      width: 100%;
    }

    .task-content {
      margin-left: 16px;
      flex: 1;
    }

    .task-title {
      font-weight: 500;
    }

    .task-due-date {
      font-size: 0.8em;
      color: rgba(0, 0, 0, 0.6);
    }

    .no-items {
      color: rgba(0, 0, 0, 0.6);
      font-style: italic;
    }

    .loading-spinner {
      display: flex;
      justify-content: center;
      padding: 20px;
    }

    @media (max-width: 599px) {
      .dashboard-content {
        margin-top: 56px;
      }
    }

    .note-item {
      height: auto !important;
      padding: 16px 0;
    }
    .note-content {
      width: 100%;
    }
    .note-title {
      font-weight: 500;
      margin-bottom: 4px;
    }
    .note-date {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.6);
      margin-bottom: 8px;
    }
    .note-photo {
      margin-top: 8px;
    }
    .note-photo img {
      max-width: 100%;
      max-height: 150px;
      border-radius: 4px;
      cursor: pointer;
      transition: transform 0.2s;
    }
    .note-photo img:hover {
      transform: scale(1.05);
    }
    .note-text {
      color: rgba(0, 0, 0, 0.6);
      font-size: 14px;
      margin-top: 8px;
      white-space: pre-wrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }
    .note-audio {
      margin-top: 8px;
    }
    .note-audio audio {
      width: 100%;
      margin-top: 8px;
    }

    .goal-item {
      height: auto !important;
      padding: 16px 0;
    }

    .goal-content {
      width: 100%;
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
    }

    .goal-target-date {
      color: rgba(0, 0, 0, 0.6);
      font-size: 14px;
    }

    .goal-progress {
      margin-top: 8px;
    }

    .progress-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }

    .progress-label {
      color: rgba(0, 0, 0, 0.6);
      font-size: 14px;
    }

    .progress-value {
      color: rgba(0, 0, 0, 0.6);
      font-size: 14px;
    }

    @media (max-width: 599px) {
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
export class DashboardComponent implements OnInit, OnDestroy {
  recentTasks: Task[] = [];
  activeGoals: Goal[] = [];
  recentNotes: Note[] = [];
  isLoading = false;
  private authSubscription!: Subscription;

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.authSubscription = this.authService.user$.subscribe(async (user: User | null) => {
      if (user) {
        await this.loadData();
      } else {
        this.recentTasks = [];
        this.activeGoals = [];
        this.recentNotes = [];
      }
    });
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  async loadData() {
    this.isLoading = true;
    try {
      const user = await this.authService.getCurrentUser();
      if (!user?.uid) {
        throw new Error('No user found');
      }

      const tasksPromise = firstValueFrom(this.dataService.getTasks(user.uid));
      const goalsPromise = firstValueFrom(this.dataService.getGoals(user.uid));
      const notesPromise = firstValueFrom(this.dataService.getNotes(user.uid));

      const [tasks, goals, notes] = await Promise.all([
        tasksPromise,
        goalsPromise,
        notesPromise
      ]);

      this.recentTasks = tasks
        .map(task => ({
          ...task,
          dueDate: this.convertToDate(task.dueDate)
        }))
        .sort((a, b) => {
          const dateA = a.dueDate instanceof Date ? a.dueDate.getTime() : 0;
          const dateB = b.dueDate instanceof Date ? b.dueDate.getTime() : 0;
          return dateA - dateB;
        })
        .slice(0, 5);

      this.activeGoals = goals
        .filter(goal => goal.progress < 100)
        .slice(0, 5);

      this.recentNotes = notes
        .map(note => ({
          ...note,
          createdAt: this.convertToDate(note.createdAt)
        }))
        .sort((a, b) => {
          const dateA = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
          const dateB = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
          return dateB - dateA;
        })
        .slice(0, 5);

    } catch (error) {
      console.error('Error loading data:', error);
      this.showError('Failed to load data. Please try again.');
    } finally {
      this.isLoading = false;
    }
  }

  private convertToDate(date: Date | Timestamp | undefined): Date {
    if (!date) return new Date(0);
    return date instanceof Timestamp ? date.toDate() : date;
  }

  formatDate(date: Date | Timestamp | string | undefined): string {
    if (!date) return '';
    
    let dateObj: Date;
    if (date instanceof Timestamp) {
      dateObj = date.toDate();
    } else if (date instanceof Date) {
      dateObj = date;
    } else if (typeof date === 'string') {
      dateObj = new Date(date);
    } else {
      console.error('Invalid date format:', date);
      return '';
    }

    return dateObj.toLocaleDateString();
  }

  async toggleTask(task: Task) {
    try {
      const updatedTask = { ...task, completed: !task.completed };
      await this.dataService.updateTask(task.id!, updatedTask);
      this.showSuccess('Task updated successfully');
    } catch (error) {
      this.showError('Failed to update task');
    }
  }

  async toggleGoalProgress(goal: Goal) {
    try {
      const newProgress = goal.progress >= 100 ? 0 : goal.progress + 10;
      await this.dataService.updateGoal(goal.id!, { progress: newProgress });
      this.showSuccess('Goal progress updated successfully');
    } catch (error) {
      this.showError('Failed to update goal progress');
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

  async signOut() {
    try {
      await this.authService.signOut();
    } catch (error) {
      this.showError('Failed to sign out');
    }
  }
} 