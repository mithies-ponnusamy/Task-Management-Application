import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../../core/services/auth/auth';
import { User } from '../../../model/user.model';

@Component({
  selector: 'app-lead-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lead-profile.html',
  styleUrls: ['./lead-profile.css']
})
export class LeadProfile implements OnInit {
  currentUser: User | null = null;
  isEditing = false;
  editableUser: User | null = null;
  isLoading = false;
  errorMessage = '';
  
  constructor(private authService: Auth) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.authService.leadGetProfile().subscribe({
      next: (profile: any) => {
        this.currentUser = {
          id: profile._id || profile.id,
          _id: profile._id,
          email: profile.email,
          role: profile.role,
          name: profile.name,
          username: profile.username,
          phone: profile.phone,
          gender: profile.gender,
          dob: profile.dob,
          department: profile.department,
          team: profile.team,
          status: profile.status,
          employeeType: profile.employeeType,
          location: profile.location,
          joinDate: profile.joinDate,
          lastActive: profile.lastActive,
          address: profile.address,
          about: profile.about,
          profileImg: profile.profileImg,
          password: '', // Don't expose password
          notifications: profile.notifications,
          performance: profile.performance,
          projects: profile.projects,
          completionRate: profile.completionRate
        };
        this.editableUser = { ...this.currentUser };
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading profile:', error);
        this.errorMessage = error.message || 'Failed to load profile';
        this.isLoading = false;
      }
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      // Reset changes if user cancels
      this.editableUser = this.currentUser ? { ...this.currentUser } : null;
    }
  }

  saveProfile(): void {
    if (this.editableUser) {
      this.isLoading = true;
      this.errorMessage = '';
      
      // Prepare data for backend
      const profileData = {
        name: this.editableUser.name,
        username: this.editableUser.username,
        phone: this.editableUser.phone,
        gender: this.editableUser.gender,
        dob: this.editableUser.dob,
        department: this.editableUser.department,
        location: this.editableUser.location,
        address: this.editableUser.address,
        about: this.editableUser.about
      };
      
      this.authService.leadUpdateProfile(profileData).subscribe({
        next: (updatedProfile: any) => {
          this.currentUser = { ...this.editableUser! };
          this.isEditing = false;
          this.isLoading = false;
          // Profile is automatically updated in auth service
        },
        error: (error: any) => {
          console.error('Error updating profile:', error);
          this.errorMessage = error.message || 'Failed to update profile';
          this.isLoading = false;
        }
      });
    }
  }
}
