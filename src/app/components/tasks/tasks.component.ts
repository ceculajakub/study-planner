import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DataService, Task } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { DeviceService } from '../../services/device.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { NavigationComponent } from '../navigation/navigation.component';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatListModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatIconModule,
    MatSliderModule,
    MatButtonModule,
    NavigationComponent
  ],
  template: `
    <app-navigation>
      <main class="tasks-content">
        <!-- Add Task Form -->
        <mat-card class="task-form-card">
          <mat-card-header>
            <mat-card-title>Add New Task</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <form (ngSubmit)="addTask()" class="task-form" [class.loading]="isLoading">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Title</mat-label>
                <input matInput type="text" [(ngModel)]="newTask.title" name="title" required [disabled]="isLoading">
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Description</mat-label>
                <textarea matInput [(ngModel)]="newTask.description" name="description" rows="3" [disabled]="isLoading"></textarea>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Due Date</mat-label>
                <input matInput [matDatepicker]="picker" [(ngModel)]="newTask.dueDate" name="dueDate" required [disabled]="isLoading">
                <mat-datepicker-toggle matSuffix [for]="picker" [disabled]="isLoading"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
              </mat-form-field>

              <div class="form-actions">
                <button mat-raised-button color="primary" type="submit" [disabled]="isLoading">
                  <span *ngIf="!isLoading">Add Task</span>
                  <mat-spinner *ngIf="isLoading" diameter="20"></mat-spinner>
                </button>
              </div>
            </form>
          </mat-card-content>
        </mat-card>

        <!-- Tasks List -->
        <mat-card class="tasks-list-card">
          <mat-card-header>
            <mat-card-title>Your Tasks</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div *ngIf="isLoading" class="loading-spinner">
              <mat-spinner diameter="30"></mat-spinner>
            </div>
            <mat-list *ngIf="!isLoading">
              <mat-list-item *ngFor="let task of tasks">
                <div class="task-item">
                  <mat-checkbox [checked]="task.completed" (change)="toggleTask(task)"></mat-checkbox>
                  <div class="task-content">
                    <div class="task-title">{{ task.title }}</div>
                    <div class="task-description">{{ task.description }}</div>
                    <div class="task-due-date">Due: {{ task.dueDate | date }}</div>
                  </div>
                  <button mat-icon-button color="warn" (click)="deleteTask(task)" matTooltip="Delete task">
                    <mat-icon svgIcon="delete"></mat-icon>
                  </button>
                </div>
                <mat-divider></mat-divider>
              </mat-list-item>
              <mat-list-item *ngIf="tasks.length === 0">
                <div class="no-tasks">No tasks yet. Add your first task above!</div>
              </mat-list-item>
            </mat-list>
          </mat-card-content>
        </mat-card>
      </main>
    </app-navigation>
  `,
  styles: [`
    .tasks-content {
      padding: 20px;
      margin-top: 64px;
    }

    .task-form-card, .tasks-list-card {
      margin-bottom: 20px;
    }

    .task-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .full-width {
      width: 100%;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
    }

    .task-item {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 8px 0;
    }

    .task-content {
      flex: 1;
      margin-left: 16px;
    }

    .task-title {
      font-weight: 500;
    }

    .task-description {
      color: rgba(0, 0, 0, 0.6);
      font-size: 0.9em;
      margin: 4px 0;
    }

    .task-due-date {
      color: rgba(0, 0, 0, 0.6);
      font-size: 0.8em;
    }

    .no-tasks {
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
      .tasks-content {
        margin-top: 56px;
      }
    }
  `]
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  newTask: Partial<Task> = {
    title: '',
    description: '',
    dueDate: new Date(),
    completed: false
  };
  isLoading = false;

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private deviceService: DeviceService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadTasks();
  }

  async loadTasks() {
    try {
      console.log('Loading tasks...');
      const user = await this.authService.getCurrentUser();
      console.log('User in loadTasks:', user);
      
      if (user) {
        console.log('User ID:', user.uid);
        this.dataService.getTasks(user.uid).subscribe({
          next: (tasks) => {
            console.log('Tasks loaded:', tasks);
            this.tasks = tasks.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
          },
          error: (error) => {
            console.error('Error loading tasks:', error);
          }
        });
      } else {
        console.error('No user found when loading tasks');
      }
    } catch (error) {
      console.error('Error in loadTasks:', error);
    }
  }

  async addTask() {
    try {
      this.isLoading = true;
      console.log('Starting to add task...');
      
      const user = await this.authService.getCurrentUser();
      console.log('Current user:', user);
      
      if (!user) {
        console.error('No user logged in');
        this.isLoading = false;
        return;
      }

      console.log('Creating task with data:', this.newTask);
      const task: Task = {
        ...this.newTask,
        userId: user.uid,
        dueDate: new Date(this.newTask.dueDate!),
        completed: false
      } as Task;

      console.log('Sending task to data service:', task);
      await this.dataService.addTask(task);
      console.log('Task added successfully');
      
      // Reset the form
      this.newTask = {
        title: '',
        description: '',
        dueDate: new Date(),
        completed: false
      };

      // Reload tasks to show the new one
      await this.loadTasks();
      this.showSuccess('Task added successfully');
    } catch (error) {
      console.error('Error adding task:', error);
      this.showError('An error occurred while adding the task');
    } finally {
      this.isLoading = false;
    }
  }

  async toggleTask(task: Task) {
    task.completed = !task.completed;
    await this.dataService.updateTask(task.id!, task);
    if (task.completed) {
      await this.deviceService.vibrate();
    }
  }

  async deleteTask(task: Task) {
    await this.dataService.deleteTask(task.id!);
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
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