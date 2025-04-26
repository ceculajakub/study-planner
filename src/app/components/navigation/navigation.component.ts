import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule
  ],
  template: `
    <mat-toolbar color="primary">
      <button mat-icon-button (click)="sidenav.toggle()">
        <mat-icon>menu</mat-icon>
      </button>
      <span>Study Planner</span>
    </mat-toolbar>

    <mat-sidenav-container>
      <mat-sidenav #sidenav mode="over" position="start">
        <mat-nav-list>
          <a mat-list-item routerLink="/dashboard" routerLinkActive="active">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>Dashboard</span>
          </a>
          <a mat-list-item routerLink="/tasks" routerLinkActive="active">
            <mat-icon matListItemIcon>task</mat-icon>
            <span matListItemTitle>Tasks</span>
          </a>
          <a mat-list-item routerLink="/goals" routerLinkActive="active">
            <mat-icon matListItemIcon>flag</mat-icon>
            <span matListItemTitle>Goals</span>
          </a>
          <a mat-list-item routerLink="/notes" routerLinkActive="active">
            <mat-icon matListItemIcon>note</mat-icon>
            <span matListItemTitle>Notes</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content>
        <ng-content></ng-content>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    mat-toolbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 2;
    }

    mat-sidenav-container {
      position: absolute;
      top: 64px;
      bottom: 0;
      left: 0;
      right: 0;
    }

    mat-sidenav {
      width: 250px;
    }

    .active {
      background-color: rgba(0, 0, 0, 0.04);
    }

    @media (max-width: 599px) {
      mat-sidenav-container {
        top: 56px;
      }
    }
  `]
})
export class NavigationComponent {} 