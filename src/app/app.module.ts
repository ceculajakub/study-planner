import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RootComponent } from './root.component';
import { AppInitializerService } from './services/app-initializer.service';

export function initializeApp(appInitializer: AppInitializerService) {
  return () => appInitializer.initializeApp();
}

@NgModule({
  declarations: [
    RootComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      multi: true,
      deps: [AppInitializerService]
    }
  ],
  bootstrap: [RootComponent]
})
export class AppModule { } 