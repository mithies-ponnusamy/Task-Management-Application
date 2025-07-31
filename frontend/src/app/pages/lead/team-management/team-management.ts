import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../../core/services/auth/auth';
import { ToastService } from '../../../core/services/toast/toast';

@Component({
  selector: 'app-lead-team-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './team-management.html',
  styleUrls: ['./team-management.css']
})
export class TeamManagementComponent implements OnInit {
  // Data
  teamData: any = null;
  teamMembers: any[] = [];
  availableUsers: any[] = [];
  
  // Loading states
  isLoading = false;
  isAddingMembers = false;
  
  // Modal states
  showAddMembersModal = false;
  showRemoveMembersModal = false;
  
  // Form data
  selectedUsersToAdd: string[] = [];
  selectedUsersToRemove: string[] = [];
  
  // Search
  searchQuery = '';
  filteredAvailableUsers: any[] = [];

  constructor(private authService: Auth, private toastService: ToastService) {}

  ngOnInit(): void {
    this.loadTeamData();
    this.loadAvailableUsers();
  }

  async loadTeamData(): Promise<void> {
    this.isLoading = true;
    try {
      this.teamData = await this.authService.leadGetTeam().toPromise();
      this.teamMembers = this.teamData?.members || [];
    } catch (error) {
      console.error('Error loading team data:', error);
      this.toastService.show(
        '⚠️ Unable to load team data. Please refresh the page or check your connection.',
        'error'
      );
    } finally {
      this.isLoading = false;
    }
  }

  async loadAvailableUsers(): Promise<void> {
    try {
      // Use the new dedicated endpoint that filters users by role automatically
      this.availableUsers = await this.authService.leadGetAvailableUsers().toPromise() || [];
      this.filteredAvailableUsers = [...this.availableUsers];
    } catch (error) {
      console.error('Error loading available users:', error);
      this.availableUsers = [];
      this.filteredAvailableUsers = [];
      this.toastService.show(
        '⚠️ Unable to load available users. Some team management features may be limited.',
        'warning'
      );
    }
  }

  filterAvailableUsers(): void {
    if (!this.searchQuery.trim()) {
      this.filteredAvailableUsers = [...this.availableUsers];
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.filteredAvailableUsers = this.availableUsers.filter(user =>
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.department?.toLowerCase().includes(query)
    );
  }

  openAddMembersModal(): void {
    this.selectedUsersToAdd = [];
    this.showAddMembersModal = true;
  }

  openRemoveMembersModal(): void {
    this.selectedUsersToRemove = [];
    this.showRemoveMembersModal = true;
  }

  closeModals(): void {
    this.showAddMembersModal = false;
    this.showRemoveMembersModal = false;
    this.selectedUsersToAdd = [];
    this.selectedUsersToRemove = [];
    this.searchQuery = '';
    this.filteredAvailableUsers = [...this.availableUsers];
  }

  toggleUserSelection(userId: string, isAdding: boolean): void {
    if (isAdding) {
      const index = this.selectedUsersToAdd.indexOf(userId);
      if (index > -1) {
        this.selectedUsersToAdd.splice(index, 1);
      } else {
        this.selectedUsersToAdd.push(userId);
      }
    } else {
      const index = this.selectedUsersToRemove.indexOf(userId);
      if (index > -1) {
        this.selectedUsersToRemove.splice(index, 1);
      } else {
        this.selectedUsersToRemove.push(userId);
      }
    }
  }

  isUserSelected(userId: string, isAdding: boolean): boolean {
    return isAdding 
      ? this.selectedUsersToAdd.includes(userId)
      : this.selectedUsersToRemove.includes(userId);
  }

  async addSelectedMembers(): Promise<void> {
    if (this.selectedUsersToAdd.length === 0) {
      this.toastService.show(
        'ℹ️ Please select at least one team member to add to your team.',
        'info'
      );
      return;
    }

    this.isAddingMembers = true;
    try {
      const response = await this.authService.leadAddTeamMembers(this.selectedUsersToAdd).toPromise();
      
      // Get the names of added members for the toast message
      const addedMemberNames = this.availableUsers
        .filter(user => this.selectedUsersToAdd.includes(user._id || user.id))
        .map(user => user.name);
      
      const memberCount = addedMemberNames.length;
      const memberList = memberCount <= 3 
        ? addedMemberNames.join(', ')
        : `${addedMemberNames.slice(0, 2).join(', ')} and ${memberCount - 2} others`;
      
      // Show success toast with member details
      this.toastService.show(
        `🎉 Successfully added ${memberCount} team member${memberCount > 1 ? 's' : ''} to your team! Welcome ${memberList} to the team. They can now access team projects and tasks.`,
        'success'
      );
      
      this.closeModals();
      await this.loadTeamData();
      await this.loadAvailableUsers();
    } catch (error) {
      console.error('Error adding team members:', error);
      
      // Show error toast with helpful message
      this.toastService.show(
        '❌ Failed to add team members. Please ensure the selected users are available and try again. If the issue persists, contact your administrator.',
        'error'
      );
    } finally {
      this.isAddingMembers = false;
    }
  }

  async removeSelectedMembers(): Promise<void> {
    if (this.selectedUsersToRemove.length === 0) {
      this.toastService.show(
        'ℹ️ Please select at least one team member to remove from your team.',
        'info'
      );
      return;
    }

    const removedMemberNames = this.teamMembers
      .filter(member => this.selectedUsersToRemove.includes(member._id || member.id))
      .map(member => member.name);

    const memberCount = removedMemberNames.length;
    const memberList = memberCount <= 3 
      ? removedMemberNames.join(', ')
      : `${removedMemberNames.slice(0, 2).join(', ')} and ${memberCount - 2} others`;

    if (!confirm(`Are you sure you want to remove ${memberList} from the team? They will lose access to team projects and tasks.`)) {
      return;
    }

    try {
      await this.authService.leadRemoveTeamMembers(this.selectedUsersToRemove).toPromise();
      
      // Show success toast with member details
      this.toastService.show(
        `👋 Successfully removed ${memberCount} team member${memberCount > 1 ? 's' : ''} from your team. ${memberList} no longer have access to team resources.`,
        'warning'
      );
      
      this.closeModals();
      await this.loadTeamData();
      await this.loadAvailableUsers();
    } catch (error) {
      console.error('Error removing team members:', error);
      
      // Show error toast with helpful message
      this.toastService.show(
        '❌ Failed to remove team members. They might be assigned to active tasks or projects. Please reassign their work before removing them from the team.',
        'error'
      );
    }
  }

  getMemberRoleColor(role: string): string {
    switch (role) {
      case 'team-lead':
        return 'bg-purple-100 text-purple-800';
      case 'user':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'on-leave':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
