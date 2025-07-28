// profile.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user/user';
import { Auth } from '../../../core/services/auth/auth';
import { User } from '../../../model/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class Profile implements OnInit, OnDestroy {
  currentUser: User | null = null;
  editMode: boolean = false;
  loading: boolean = true;
  saving: boolean = false;
  editedUser: Partial<User> = {};
  private profileSubscription: Subscription | null = null;
  private updateSubscription: Subscription | null = null;

  constructor(
    private userService: UserService, 
    private authService: Auth
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  private loadUserProfile(): void {
    this.loading = true;
    this.currentUser = this.authService.getCurrentUser();
    
    // Fetch fresh data from backend
    this.profileSubscription = this.authService.getUserProfile().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.resetEditedUser();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
        this.loading = false;
      }
    });
  }

  toggleEditMode(): void {
    if (this.editMode) {
      this.resetEditedUser();
    } else {
      this.initEditedUser();
    }
    this.editMode = !this.editMode;
  }

  private initEditedUser(): void {
    if (this.currentUser) {
      this.editedUser = {
        name: this.currentUser.name,
        username: this.currentUser.username,
        phone: this.currentUser.phone,
        gender: this.currentUser.gender,
        dob: this.currentUser.dob,
        department: this.currentUser.department,
        employeeType: this.currentUser.employeeType,
        location: this.currentUser.location,
        address: this.currentUser.address,
        about: this.currentUser.about,
        profileImg: this.currentUser.profileImg
      };
    }
  }

  private resetEditedUser(): void {
    this.editedUser = {};
  }

  saveProfile(): void {
    if (!this.editedUser || this.saving) return;

    this.saving = true;
    this.updateSubscription = this.authService.updateUserProfile(this.editedUser).subscribe({
      next: (updatedUser) => {
        this.currentUser = updatedUser;
        this.editMode = false;
        this.resetEditedUser();
        this.saving = false;
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        this.saving = false;
      }
    });
  }

  cancelEdit(): void {
    this.editMode = false;
    this.resetEditedUser();
  }

  ngOnDestroy(): void {
    if (this.profileSubscription) {
      this.profileSubscription.unsubscribe();
    }
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }
}