import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DataService, Task } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { DeviceService } from '../../services/device.service';
import { NotificationService } from '../../services/notification.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { NavigationComponent } from '../navigation/navigation.component';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '@angular/fire/auth';

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

        <mat-card class="tasks-list-card">
          <mat-card-header>
            <mat-card-title>Your Tasks</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div *ngIf="isLoading" class="loading-spinner">
              <mat-spinner diameter="30"></mat-spinner>
            </div>
            <mat-list *ngIf="!isLoading">
              <mat-list-item *ngFor="let task of tasks" class="task-item">
                <div class="task-content">
                  <mat-checkbox [checked]="task.completed" (change)="toggleTask(task)" color="primary"></mat-checkbox>
                  <div class="task-details" [class.completed]="task.completed">
                    <div class="task-header">
                      <span class="task-title">{{ task.title }}</span>
                      <span class="task-due-date">
                        <mat-icon class="due-date-icon">event</mat-icon>
                        {{ task.dueDate | date:'mediumDate' }}
                      </span>
                    </div>
                    <div class="task-description">{{ task.description }}</div>
                  </div>
                  <div class="task-actions">
                    <button mat-icon-button color="warn" (click)="deleteTask(task)" matTooltip="Delete task">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                </div>
                <mat-divider></mat-divider>
              </mat-list-item>
              <mat-list-item *ngIf="tasks.length === 0">
                <div class="no-tasks">
                  <p>No tasks yet.</p>
                </div>
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
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
      margin-top: 16px;
    }
    mat-card-header{
      margin-bottom: 12px;
    }
    .task-item {
      height: auto !important;
      padding: 16px 0;
    }

    .task-content {
      display: flex;
      align-items: flex-start;
      width: 100%;
      gap: 16px;
    }

    .task-details {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .task-details.completed {
      opacity: 0.6;
      text-decoration: line-through;
    }

    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
    }

    .task-title {
      font-weight: 500;
      font-size: 16px;
      color: rgba(0, 0, 0, 0.87);
    }

    .task-description {
      color: rgba(0, 0, 0, 0.6);
      font-size: 14px;
      line-height: 1.5;
    }

    .task-due-date {
      display: flex;
      align-items: center;
      gap: 4px;
      color: rgba(0, 0, 0, 0.6);
      font-size: 14px;
    }

    .due-date-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .task-actions {
      display: flex;
      gap: 8px;
      margin-left: auto;
    }

    .no-tasks {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 32px;
      text-align: center;
      color: rgba(0, 0, 0, 0.6);
    }

    .no-tasks-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      color: rgba(0, 0, 0, 0.3);
    }

    .loading-spinner {
      display: flex;
      justify-content: center;
      padding: 32px;
    }

    mat-divider {
      margin: 8px 0;
    }

    @media (max-width: 599px) {
      .tasks-content {
        margin-top: 56px;
      }

      .task-content {
        flex-direction: row;
        align-items: center;
        gap: 8px;
      }

      .task-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
      }

      .task-due-date {
        font-size: 12px;
      }

      .task-actions {
        margin-left: auto;
        min-width: 40px;
      }
    }
  `]
})
export class TasksComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  newTask: Partial<Task> = {
    title: '',
    description: '',
    dueDate: new Date(),
    completed: false
  };
  isLoading = false;
  userId: string | null = null;
  private authSubscription!: Subscription;
  private lastDeletedTask: Task | null = null;
  private motionHandler: ((event: DeviceMotionEvent) => void) | null = null;

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private deviceService: DeviceService,
    private notificationService: NotificationService  ) {}

  ngOnInit() {
    this.authSubscription = this.authService.user$.subscribe(async (user: User | null) => {
      if (user) {
        this.userId = user.uid;
        await this.loadTasks();
        this.setupShakeDetection();
      } else {
        this.tasks = [];
        this.userId = null;
        this.removeShakeDetection();
      }
    });
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    this.removeShakeDetection();
  }

  private setupShakeDetection() {
    if (window.DeviceMotionEvent) {
      let lastX = 0;
      let lastY = 0;
      let lastZ = 0;
      let lastTime = 0;
      const threshold = 15;
      const timeout = 1000;

      this.motionHandler = (event: DeviceMotionEvent) => {
        const currentTime = Date.now();
        if (currentTime - lastTime < timeout) return;

        const acceleration = event.accelerationIncludingGravity;
        if (!acceleration) return;

        const deltaX = Math.abs(acceleration.x! - lastX);
        const deltaY = Math.abs(acceleration.y! - lastY);
        const deltaZ = Math.abs(acceleration.z! - lastZ);

        if (deltaX > threshold || deltaY > threshold || deltaZ > threshold) {
          this.handleShake();
          lastTime = currentTime;
        }

        lastX = acceleration.x!;
        lastY = acceleration.y!;
        lastZ = acceleration.z!;
      };

      window.addEventListener('devicemotion', this.motionHandler);
    }
  }

  private removeShakeDetection() {
    if (this.motionHandler) {
      window.removeEventListener('devicemotion', this.motionHandler);
      this.motionHandler = null;
    }
  }

  private async handleShake() {
    if (this.lastDeletedTask) {
      try {
        await this.dataService.addTask(this.lastDeletedTask);
        this.notificationService.showSuccess('Task restored');
        this.lastDeletedTask = null;
        await this.loadTasks();
      } catch (error) {
        this.notificationService.showError('Failed to restore task');
      }
    }
  }

  async loadTasks() {
    try {
      this.isLoading = true;
      this.dataService.getTasks(this.userId!).subscribe({
        next: (tasks) => {
          this.tasks = tasks;
        },
        error: (error) => {
          console.error('Error loading tasks:', error);
          this.notificationService.showError('Failed to load tasks');
        }
      });
    } catch (error) {
      console.error('Error loading tasks:', error);
      this.notificationService.showError('Failed to load tasks');
    } finally {
      this.isLoading = false;
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
      
      this.newTask = {
        title: '',
        description: '',
        dueDate: new Date(),
        completed: false
      };

      await this.loadTasks();
      this.notificationService.showSuccess('Task added successfully');
    } catch (error) {
      console.error('Error adding task:', error);
      this.notificationService.showError('An error occurred while adding the task');
    } finally {
      this.isLoading = false;
    }
  }

  async toggleTask(task: Task) {
    try {
      task.completed = !task.completed;
      await this.dataService.updateTask(task.id!, task);
      if (task.completed) {
        this.deviceService.vibrate(200);
        this.notificationService.showSuccess('Task completed!');
      }
    } catch (error) {
      console.error('Error toggling task:', error);
      this.notificationService.showError('Failed to update task');
    }
  }

  async deleteTask(task: Task) {
    try {
      this.lastDeletedTask = { ...task };
      await this.dataService.deleteTask(task.id!);
      this.notificationService.showSuccess('Task deleted. Shake to undo');
    } catch (error) {
      console.error('Error deleting task:', error);
      this.notificationService.showError('Failed to delete task');
    }
  }
} 