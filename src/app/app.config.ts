import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MatIconRegistry } from '@angular/material/icon';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { ErrorHandler } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { provideServiceWorker } from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
    {
      provide: MatIconRegistry,
      useFactory: (httpClient: HttpClient, sanitizer: DomSanitizer, document: Document, errorHandler: ErrorHandler) => {
        const iconRegistry = new MatIconRegistry(httpClient, sanitizer, document, errorHandler);
        
        // Register Material Icons
        iconRegistry.setDefaultFontSetClass('material-icons');
        
        // Register custom SVG icons
        iconRegistry.addSvgIcon(
          'google-logo',
          sanitizer.bypassSecurityTrustResourceUrl('assets/icons/google-logo.svg')
        );
        
        iconRegistry.addSvgIcon(
          'delete',
          sanitizer.bypassSecurityTrustResourceUrl('assets/icons/delete.svg')
        );
        
        iconRegistry.addSvgIcon(
          'study',
          sanitizer.bypassSecurityTrustResourceUrl('assets/icons/study.svg')
        );
        
        iconRegistry.addSvgIcon(
          'task',
          sanitizer.bypassSecurityTrustResourceUrl('assets/icons/task.svg')
        );
        
        iconRegistry.addSvgIcon(
          'goal',
          sanitizer.bypassSecurityTrustResourceUrl('assets/icons/goal.svg')
        );
        
        iconRegistry.addSvgIcon(
          'note',
          sanitizer.bypassSecurityTrustResourceUrl('assets/icons/note.svg')
        );
        
        return iconRegistry;
      },
      deps: [HttpClient, DomSanitizer, DOCUMENT, ErrorHandler]
    },
    { provide: DOCUMENT, useValue: document }
  ]
};
