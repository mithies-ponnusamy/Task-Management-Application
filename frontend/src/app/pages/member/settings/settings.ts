// settings.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.html',
  styleUrls: ['./settings.css']
})
export class Settings {
  notificationPrefs = {
    email: true,
    push: true,
    sms: false
  };
  
  themePrefs = {
    darkMode: false,
    primaryColor: 'indigo'
  };
  
  securityPrefs = {
    twoFactorAuth: false,
    passwordChangeRequired: false
  };
}