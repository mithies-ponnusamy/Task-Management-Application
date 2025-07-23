import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User, UserRole } from '../../../model/user.model';
import { ModalService } from '../../../core/services/modal/modal';
import { UserService } from '../../../core/services/user/user';

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

  constructor(
    private modalService: ModalService,
    private userService: UserService
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
    this.currentUser = this.userService.getCurrentUser();
    if (this.currentUser && this.currentUser.team) {
      const allUsers = this.userService.getUsers();
      this.teamMembers = allUsers.filter(u => u.team === this.currentUser!.team);
      this.availableMembers = allUsers.filter(u => !u.team && u.role === UserRole.USER);
    }
  }

  addTeamMember(): void {
    if (!this.selectedMemberIdToAdd || !this.currentUser || !this.currentUser.team) return;
    
    const user = this.userService.getUserById(this.selectedMemberIdToAdd);
    if (user) {
      user.team = this.currentUser.team;
      this.userService.updateUser(user);
      this.loadData(); // Refresh lists
      this.selectedMemberIdToAdd = '';
    }
  }

  removeTeamMember(memberId: string): void {
    if (confirm('Are you sure you want to remove this member from the team?')) {
      const user = this.userService.getUserById(memberId);
      if (user) {
        user.team = undefined; // Unassign from team
        this.userService.updateUser(user);
        this.loadData(); // Refresh lists
      }
    }
  }

  close(): void {
    this.modalService.closeAllModals();
  }
}