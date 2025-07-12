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
  notificationPrefs = {
    email: true,
    push: true,
    sms: false
  };
  
  teamManagementPrefs = {
    approveRequests: true,
    dailyReports: true
  };
  
  securityPrefs = {
    twoFactorAuth: false,
    passwordChangeRequired: false
  };
}