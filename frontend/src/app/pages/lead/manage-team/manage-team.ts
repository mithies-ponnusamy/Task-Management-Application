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
  selectedMemberIdToAdd = '';
  isLoading = false;

  constructor(
    private modalService: ModalService,
    private authService: Auth
  ) {}

  ngOnInit(): void {
    this.modalService.showManageTeam$.subscribe(show => {
      this.showModal = show;
      if (show) {
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
        this.availableMembers = users;
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
    if (!this.selectedMemberIdToAdd) return;
    
    this.isLoading = true;
    this.authService.leadAddTeamMembers([this.selectedMemberIdToAdd]).subscribe({
      next: (response) => {
        console.log('Team member added successfully');
        this.loadData(); // Refresh data
        this.selectedMemberIdToAdd = '';
      },
      error: (error) => {
        console.error('Error adding team member:', error);
        this.isLoading = false;
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