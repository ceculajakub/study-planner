import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DataService, Note } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { DeviceService } from '../../services/device.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NavigationComponent } from '../navigation/navigation.component';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatSelectModule,
    MatTooltipModule,
    NavigationComponent
  ],
  template: `
    <app-navigation>
      <main class="notes-content">
        <!-- Add Note Form -->
        <mat-card class="note-form-card">
          <mat-card-header>
            <mat-card-title>Add New Note</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <form (ngSubmit)="addNote()" class="note-form" [class.loading]="isLoading">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Title</mat-label>
                <input matInput type="text" [(ngModel)]="newNote.title" name="title" required [disabled]="isLoading">
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Note Type</mat-label>
                <mat-select [(ngModel)]="newNote.type" name="type" required [disabled]="isLoading">
                  <mat-option value="text">Text Note</mat-option>
                  <mat-option value="photo">Photo Note</mat-option>
                  <mat-option value="audio">Audio Note</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field *ngIf="newNote.type === 'text'" appearance="outline" class="full-width">
                <mat-label>Content</mat-label>
                <textarea matInput [(ngModel)]="newNote.content" name="content" rows="4" [disabled]="isLoading"></textarea>
              </mat-form-field>

              <div *ngIf="newNote.type === 'photo'" class="photo-section">
                <button mat-raised-button color="primary" type="button" (click)="takePhoto()" [disabled]="isLoading || isCapturing">
                  <mat-icon>camera_alt</mat-icon>
                  {{ isCapturing ? 'Capturing...' : 'Take Photo' }}
                </button>
                <div *ngIf="isCapturing" class="loading-spinner">
                  <mat-spinner diameter="20"></mat-spinner>
                </div>
                <img *ngIf="newNote.photoUrl" [src]="newNote.photoUrl" alt="Captured photo" class="photo-preview">
              </div>

              <div *ngIf="newNote.type === 'audio'" class="audio-section">
                <button mat-raised-button color="primary" type="button" (click)="recordAudio()" [disabled]="isLoading || isCapturing">
                  <mat-icon>{{ isRecording ? 'stop' : 'mic' }}</mat-icon>
                  {{ isRecording ? 'Stop Recording' : 'Record Audio' }}
                </button>
                <div *ngIf="isRecording" class="recording-indicator">
                  <mat-spinner diameter="20"></mat-spinner>
                  <span>Recording...</span>
                </div>
                <audio *ngIf="newNote.audioData" [src]="newNote.audioData" controls class="audio-preview"></audio>
              </div>

              <div class="form-actions">
                <button mat-raised-button color="primary" type="submit" [disabled]="isLoading || isCapturing || isRecording">
                  <span *ngIf="!isLoading">Add Note</span>
                  <mat-spinner *ngIf="isLoading" diameter="20"></mat-spinner>
                </button>
              </div>
            </form>
          </mat-card-content>
        </mat-card>

        <!-- Notes List -->
        <mat-card class="notes-list-card">
          <mat-card-header>
            <mat-card-title>Your Notes</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div *ngIf="isLoading" class="loading-spinner">
              <mat-spinner diameter="30"></mat-spinner>
            </div>
            <mat-list *ngIf="!isLoading">
              <mat-list-item *ngFor="let note of notes" class="note-item">
                <div class="note-content">
                  <div class="note-header">
                    <div class="note-title">{{ note.title }}</div>
                    <div class="note-date">{{ formatDate(note.createdAt) }}</div>
                  </div>
                  <div class="note-body">
                    <div *ngIf="note.type === 'text'" class="note-text">
                      {{ note.content }}
                    </div>
                    <div *ngIf="note.type === 'photo' && note.photoUrl" class="note-photo">
                      <img [src]="note.photoUrl" alt="Note photo" (click)="openFullscreen(note.photoUrl)">
                    </div>
                    <div *ngIf="note.type === 'audio' && note.audioData" class="note-audio">
                      <audio [src]="note.audioData" controls></audio>
                    </div>
                  </div>
                </div>
                <div class="note-actions">
                  <button mat-icon-button color="warn" (click)="deleteNote(note)" [disabled]="isLoading" matTooltip="Delete note">
                    <mat-icon svgIcon="delete"></mat-icon>
                  </button>
                </div>
                <mat-divider></mat-divider>
              </mat-list-item>
              <mat-list-item *ngIf="notes.length === 0">
                <div class="no-notes">No notes found. Add your first note!</div>
              </mat-list-item>
            </mat-list>
          </mat-card-content>
        </mat-card>
      </main>
    </app-navigation>
  `,
  styles: [`
    .notes-content {
      padding: 20px;
      margin-top: 64px;
    }

    .note-form-card, .notes-list-card {
      margin-bottom: 20px;
    }

    .note-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .full-width {
      width: 100%;
    }

    .photo-section, .audio-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
      align-items: flex-start;
    }

    .photo-preview {
      max-width: 300px;
      border-radius: 4px;
      cursor: pointer;
      transition: transform 0.2s;
    }

    .photo-preview:hover {
      transform: scale(1.05);
    }

    .audio-preview {
      width: 100%;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
    }

    .note-item {
      height: auto !important;
      padding: 16px 0;
    }

    .note-content {
      flex: 1;
      margin-right: 16px;
    }

    .note-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .note-title {
      font-weight: 500;
    }

    .note-date {
      color: rgba(0, 0, 0, 0.6);
      font-size: 14px;
    }

    .note-body {
      margin-top: 8px;
    }

    .note-text {
      color: rgba(0, 0, 0, 0.87);
      white-space: pre-wrap;
    }

    .note-photo img {
      max-width: 300px;
      border-radius: 4px;
      cursor: pointer;
      transition: transform 0.2s;
    }

    .note-photo img:hover {
      transform: scale(1.05);
    }

    .note-audio {
      margin-top: 8px;
    }

    .note-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .delete-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background-color: #f5f5f5;
      transition: background-color 0.2s;
    }

    .delete-button:hover {
      background-color: #e0e0e0;
    }

    .delete-button mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      color: #f44336;
    }

    .loading {
      opacity: 0.7;
      pointer-events: none;
    }

    .recording-indicator {
      display: flex;
      align-items: center;
      gap: 8px;
      color: rgba(0, 0, 0, 0.6);
    }

    .no-notes {
      text-align: center;
      width: 100%;
      color: rgba(0, 0, 0, 0.6);
    }

    @media (max-width: 599px) {
      .notes-content {
        margin-top: 56px;
      }
    }
  `]
})
export class NotesComponent implements OnInit {
  notes: Note[] = [];
  newNote: Partial<Note> = {
    title: '',
    content: '',
    type: 'text',
    createdAt: new Date()
  };
  isLoading = false;
  isCapturing = false;
  isRecording = false;
  userId: string = '';

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private deviceService: DeviceService,
    private snackBar: MatSnackBar
  ) {}

  async ngOnInit() {
    const user = await this.authService.getCurrentUser();
    if (user) {
      this.userId = user.uid;
      this.loadNotes();
    }
  }

  loadNotes() {
    this.isLoading = true;
    this.dataService.getNotes(this.userId).subscribe({
      next: (notes) => {
        this.notes = notes.sort((a, b) => {
          const timeA = a.createdAt instanceof Date ? a.createdAt.getTime() : (a.createdAt as Timestamp).toMillis();
          const timeB = b.createdAt instanceof Date ? b.createdAt.getTime() : (b.createdAt as Timestamp).toMillis();
          return timeB - timeA;
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading notes:', error);
        this.showError('Failed to load notes');
        this.isLoading = false;
      }
    });
  }

  async addNote() {
    try {
      if (!this.newNote.title || !this.newNote.type) {
        this.showError('Please fill in all required fields');
        return;
      }

      if (this.newNote.type === 'text' && !this.newNote.content) {
        this.showError('Please enter note content');
        return;
      }

      if (this.newNote.type === 'photo' && !this.newNote.photoUrl) {
        this.showError('Please capture a photo');
        return;
      }

      if (this.newNote.type === 'audio' && !this.newNote.audioData) {
        this.showError('Please record audio');
        return;
      }

      this.isLoading = true;
      const user = await this.authService.getCurrentUser();
      
      if (user) {
        const note: Note = {
          ...this.newNote as Note,
          userId: user.uid,
          createdAt: new Date()
        };

        await this.dataService.addNote(note);
        this.showSuccess('Note added successfully');
        
        // Reset form
        this.newNote = {
          title: '',
          content: '',
          type: 'text',
          createdAt: new Date()
        };
      }
    } catch (error) {
      console.error('Error adding note:', error);
      this.showError('Failed to add note');
    } finally {
      this.isLoading = false;
    }
  }

  async takePhoto() {
    try {
      this.isCapturing = true;
      const photoUrl = await this.deviceService.takePhoto();
      if (photoUrl) {
        this.newNote.photoUrl = photoUrl;
        this.showSuccess('Photo captured successfully');
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
      this.showError('Failed to capture photo');
    } finally {
      this.isCapturing = false;
    }
  }

  async recordAudio() {
    try {
      if (!this.isRecording) {
        this.isRecording = true;
        await this.deviceService.startRecording();
        this.showSuccess('Recording started');
      } else {
        const audioBlob = await this.deviceService.stopRecording();
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          this.newNote.audioData = reader.result as string;
        };
        this.isRecording = false;
        this.showSuccess('Recording stopped');
      }
    } catch (error) {
      console.error('Error recording audio:', error);
      this.showError('Failed to record audio');
      this.isRecording = false;
    }
  }

  openFullscreen(imageUrl: string) {
    window.open(imageUrl, '_blank');
  }

  async deleteNote(note: Note) {
    try {
      this.isLoading = true;
      await this.dataService.deleteNote(note.id!);
      this.showSuccess('Note deleted successfully');
    } catch (error) {
      console.error('Error deleting note:', error);
      this.showError('Failed to delete note');
    } finally {
      this.isLoading = false;
    }
  }

  formatDate(date: Date | Timestamp): string {
    if (!date) return '';
    
    let dateObj: Date;
    if (date instanceof Timestamp) {
      dateObj = date.toDate();
    } else if (date instanceof Date) {
      dateObj = date;
    } else {
      console.error('Invalid date format:', date);
      return '';
    }

    return dateObj.toLocaleString();
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