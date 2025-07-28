import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User, UserRole } from '../../../model/user.model';
import { ModalService } from '../../../core/services/modal/modal';
import { Auth } from '../../../core/services/auth/auth';

@Component({
  selector: 'app-manage-team',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-team.html',
  styleUrls: ['./manage-team.css']
})
export class ManageTeam implements OnInit {
  showModal = false;
  currentUser: User | null = null;
  teamMembers: User[] = [];
  availableMembers: User[] = [];
  selectedMemberIdToAdd: string = '';
  isLoading = false;

  constructor(
    private modalService: ModalService,
    private authService: Auth
  ) {
    // Initialize selectedMemberIdToAdd as empty string to prevent undefined
    this.selectedMemberIdToAdd = '';
  }

  ngOnInit(): void {
    this.modalService.showManageTeam$.subscribe(show => {
      this.showModal = show;
      if (show) {
        this.selectedMemberIdToAdd = ''; // Reset selection when modal opens
        console.log('Modal opened, reset selectedMemberIdToAdd to empty string');
        this.loadData();
      }
    });
  }

  loadData(): void {
    this.isLoading = true;
    
    // Load team data
    this.authService.leadGetTeam().subscribe({
      next: (teamData) => {
        this.teamMembers = teamData?.members || [];
        this.loadAvailableUsers();
      },
      error: (error) => {
        console.error('Error loading team data:', error);
        this.isLoading = false;
      }
    });
  }

  loadAvailableUsers(): void {
    console.log('Loading available users...');
    // Get available users that can be added to team (backend already filters by role and team status)
    this.authService.leadGetAvailableUsers().subscribe({
      next: (users: any[]) => {
        console.log('Available users received:', users);
        console.log('Users count:', users.length);
        
        // Log each user's ID properties to debug the issue
        users.forEach((user, index) => {
          console.log(`User[${index}]:`, {
            _id: user._id,
            id: user.id,
            name: user.name,
            idForSelect: user._id || user.id
          });
        });
        
        // Filter out users with invalid IDs
        const validUsers = users.filter(user => {
          const hasValidId = user._id && 
                           typeof user._id === 'string' && 
                           user._id !== 'undefined' && 
                           user._id !== 'null' && 
                           user._id.trim() !== '' &&
                           /^[0-9a-fA-F]{24}$/.test(user._id);
          console.log(`User ${user.name} has valid ID:`, hasValidId, 'ID:', user._id);
          return hasValidId;
        });
        
        console.log('Valid users after filtering:', validUsers);
        
        this.availableMembers = validUsers;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading available users:', error);
        this.availableMembers = [];
        this.isLoading = false;
      }
    });
  }

  addTeamMember(): void {
    console.log('=== addTeamMember START ===');
    console.log('selectedMemberIdToAdd:', this.selectedMemberIdToAdd);
    console.log('selectedMemberIdToAdd type:', typeof this.selectedMemberIdToAdd);
    console.log('selectedMemberIdToAdd JSON:', JSON.stringify(this.selectedMemberIdToAdd));
    
    // EMERGENCY FIX: Prevent any "undefined" strings from being processed
    if (this.selectedMemberIdToAdd === "undefined" || 
        this.selectedMemberIdToAdd === 'undefined' ||
        String(this.selectedMemberIdToAdd) === "undefined") {
      console.error('BLOCKED: Detected "undefined" string value');
      alert('Please select a valid team member from the dropdown.');
      return;
    }
    
    // Convert to string and trim to handle any type issues
    const memberId = String(this.selectedMemberIdToAdd || '').trim();
    console.log('Processed memberId:', memberId);
    
    // Validate that a member is selected and has a valid ID
    if (!memberId || 
        memberId === '' || 
        memberId === 'undefined' ||
        memberId === 'null' ||
        memberId === 'NaN') {
      console.error('No valid member selected. Processed ID:', memberId);
      alert('Please select a valid team member to add.');
      return;
    }
    
    // Additional validation for ObjectId format (24 character hex string)
    if (!/^[0-9a-fA-F]{24}$/.test(memberId)) {
      console.error('Invalid ObjectId format:', memberId);
      alert('Invalid user ID format. Please try selecting the user again.');
      return;
    }
    
    console.log('Adding team member with ID:', memberId);
    console.log('Calling authService.leadAddTeamMembers with:', [memberId]);
    
    this.isLoading = true;
    this.authService.leadAddTeamMembers([memberId]).subscribe({
      next: (response) => {
        console.log('Team member added successfully:', response);
        this.loadData(); // Refresh data
        this.selectedMemberIdToAdd = ''; // Reset selection
        this.isLoading = false;
        alert('Team member added successfully!');
      },
      error: (error) => {
        console.error('Failed to add team members:', error);
        console.error('Error adding team member:', error);
        this.isLoading = false;
        alert('Failed to add team member. Please try again.');
      }
    });
  }

  removeTeamMember(memberId: string): void {
    this.isLoading = true;
    this.authService.leadRemoveTeamMembers([memberId]).subscribe({
      next: (response) => {
        console.log('Team member removed successfully');
        this.loadData(); // Refresh data
      },
      error: (error) => {
        console.error('Error removing team member:', error);
        this.isLoading = false;
      }
    });
  }

  close(): void {
    this.modalService.closeAllModals();
  }
}