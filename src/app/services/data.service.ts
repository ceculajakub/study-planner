import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, updateDoc, deleteDoc, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Task {
  id?: string;
  title: string;
  description: string;
  dueDate: Date;
  completed: boolean;
  userId: string;
}

export interface Goal {
  id?: string;
  title: string;
  description: string;
  targetDate: Date;
  progress: number;
  userId: string;
}

export interface Note {
  id?: string;
  title: string;
  content: string;
  type: 'text' | 'photo' | 'audio';
  photoUrl?: string;
  audioData?: string;
  createdAt: Date;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private firestore: Firestore) {}

  // Tasks Collection
  getTasks(userId: string): Observable<Task[]> {
    const tasksRef = collection(this.firestore, 'tasks');
    const q = query(tasksRef, where('userId', '==', userId));
    return collectionData(q, { idField: 'id' }) as Observable<Task[]>;
  }

  async addTask(task: Task) {
    try {
      console.log('DataService: Adding task to Firestore:', task);
      const tasksRef = collection(this.firestore, 'tasks');
      const docRef = await addDoc(tasksRef, {
        ...task,
        dueDate: task.dueDate.toISOString() // Convert Date to string for Firestore
      });
      console.log('DataService: Task added with ID:', docRef.id);
      return docRef;
    } catch (error) {
      console.error('DataService: Error adding task:', error);
      throw error;
    }
  }

  updateTask(taskId: string, task: Partial<Task>) {
    const taskRef = doc(this.firestore, `tasks/${taskId}`);
    return updateDoc(taskRef, task);
  }

  deleteTask(taskId: string) {
    const taskRef = doc(this.firestore, `tasks/${taskId}`);
    return deleteDoc(taskRef);
  }

  // Goals Collection
  getGoals(userId: string): Observable<Goal[]> {
    const goalsRef = collection(this.firestore, 'goals');
    const q = query(goalsRef, where('userId', '==', userId));
    return collectionData(q, { idField: 'id' }) as Observable<Goal[]>;
  }

  addGoal(goal: Goal) {
    const goalsRef = collection(this.firestore, 'goals');
    return addDoc(goalsRef, goal);
  }

  updateGoal(goalId: string, goal: Partial<Goal>) {
    const goalRef = doc(this.firestore, `goals/${goalId}`);
    return updateDoc(goalRef, goal);
  }

  deleteGoal(goalId: string) {
    const goalRef = doc(this.firestore, `goals/${goalId}`);
    return deleteDoc(goalRef);
  }

  // Notes Collection
  getNotes(userId: string): Observable<Note[]> {
    const notesRef = collection(this.firestore, 'notes');
    const q = query(notesRef, where('userId', '==', userId));
    return collectionData(q, { idField: 'id' }) as Observable<Note[]>;
  }

  addNote(note: Note) {
    const notesRef = collection(this.firestore, 'notes');
    return addDoc(notesRef, note);
  }

  updateNote(noteId: string, note: Partial<Note>) {
    const noteRef = doc(this.firestore, `notes/${noteId}`);
    return updateDoc(noteRef, note);
  }

  deleteNote(noteId: string) {
    const noteRef = doc(this.firestore, `notes/${noteId}`);
    return deleteDoc(noteRef);
  }
} 