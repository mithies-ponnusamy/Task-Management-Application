// app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LocalStorageService } from './core/services/local-storage/local-storage';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  title = 'Task Management App';
}