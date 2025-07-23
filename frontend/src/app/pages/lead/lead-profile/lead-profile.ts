import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user/user';
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
  
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.currentUser = this.userService.getCurrentUser();
    this.editableUser = this.currentUser ? { ...this.currentUser } : null;
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
      this.userService.updateUser(this.editableUser);
      this.currentUser = { ...this.editableUser };
      this.isEditing = false;
      // Optionally show a success toast
    }
  }
}
