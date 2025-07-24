import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../../core/services/auth/auth';
import { User } from '../../../model/user.model';

@Component({
  selector: 'app-lead-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lead-settings.html',
  styleUrls: ['./lead-settings.css']
})
export class LeadSettings implements OnInit {
  currentUser: User | null = null;
  isLoading = false;
  isSaving = false;

  // Profile form data
  profileForm = {
    name: '',
    email: '',
    phone: '',
    bio: '',
    skills: [] as string[],
    experience: '',
    education: ''
  };

  // These would be loaded from and saved to a user preferences service
  notificationPrefs = {
    emailOnTaskAssignment: true,
    pushOnMention: true,
    dailySummaryEmail: false
  };
  
  securityPrefs = {
    twoFactorAuth: false
  };

  constructor(private authService: Auth) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.authService.leadGetProfile().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.profileForm = {
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          bio: user.bio || '',
          skills: user.skills || [],
          experience: user.experience || '',
          education: user.education || ''
        };
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading user profile:', err);
        this.isLoading = false;
      }
    });
  }

  saveProfile(): void {
    this.isSaving = true;
    this.authService.leadUpdateProfile(this.profileForm).subscribe({
      next: (updatedUser) => {
        this.currentUser = updatedUser;
        this.isSaving = false;
        // Show success message
        console.log('Profile updated successfully');
      },
      error: (err) => {
        console.error('Error updating profile:', err);
        this.isSaving = false;
        // Show error message
      }
    });
  }

  saveSettings(): void {
    // In a real app, this would call a service to save preferences.
    console.log('Saving settings:', { 
      notifications: this.notificationPrefs, 
      security: this.securityPrefs 
    });
    // Add a toast message for user feedback
  }

  addSkill(skillInput: HTMLInputElement): void {
    const skill = skillInput.value.trim();
    if (skill && !this.profileForm.skills.includes(skill)) {
      this.profileForm.skills.push(skill);
      skillInput.value = '';
    }
  }

  removeSkill(index: number): void {
    this.profileForm.skills.splice(index, 1);
  }
}
