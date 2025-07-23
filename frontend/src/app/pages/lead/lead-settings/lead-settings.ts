import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lead-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lead-settings.html',
  styleUrls: ['./lead-settings.css']
})
export class LeadSettings {
  // These would be loaded from and saved to a user preferences service
  notificationPrefs = {
    emailOnTaskAssignment: true,
    pushOnMention: true,
    dailySummaryEmail: false
  };
  
  securityPrefs = {
    twoFactorAuth: false
  };

  saveSettings() {
    // In a real app, this would call a service to save preferences.
    console.log('Saving settings:', { notifications: this.notificationPrefs, security: this.securityPrefs });
    // Add a toast message for user feedback
  }
}
