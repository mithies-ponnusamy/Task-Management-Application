// core/services/user/user.ts
import { Injectable } from '@angular/core';
import { User, UserRole } from '../../../model/user.model';
import { LocalStorageService } from '../local-storage/local-storage';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Using a hardcoded current user ID for simulation purposes.
  // In a real app, this would come from an authentication service after login.
  private currentUserId = '1'; 

  constructor(private localStorage: LocalStorageService) {
    // Demo Setup: Initialize with some sample data if none exists.
    // The admin panel would be responsible for creating this data.
    if (!this.localStorage.getUsers()) {
      this.addSampleDataForDemo();
    }
  }

  getUsers(): User[] {
    return this.localStorage.getUsers<User[]>() || [];
  }

  getUserById(id: string): User | undefined {
    return this.getUsers().find(u => u.id === id);
  }

  getCurrentUser(): User | null {
    return this.getUserById(this.currentUserId) ?? null;
  }

  // Gets members of the specified team. If no team ID, gets members of the current lead's team.
  getTeamMembers(teamId?: string): User[] {
    const currentUser = this.getCurrentUser();
    const targetTeamId = teamId || currentUser?.team;
    if (!targetTeamId) return [];
    return this.getUsers().filter(user => user.team === targetTeamId && user.role === UserRole.USER);
  }

  // Gets users with the 'user' role who are not yet assigned to any team.
  getAvailableUsersForTeamAssignment(): User[] {
    return this.getUsers().filter(user => user.role === UserRole.USER && !user.team);
  }

  updateUser(updatedUser: User): void {
    let users = this.getUsers();
    const index = users.findIndex(user => user.id === updatedUser.id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updatedUser };
      this.localStorage.saveUsers(users);
    }
  }

  private addSampleDataForDemo(): void {
    const sampleUsers: User[] = [
      { id: '1', name: 'Hema Dharshini', email: 'dkhemadharshini@gmail.com', role: UserRole.LEAD, team: 'team-alpha', profileImg: 'public/assets/user-images/hema.jpg', status: 'active', password: '@Hema1511' },
      { id: '2', name: 'Mithies Ponnusmay', email: 'mithiesofficial@gmail.com', role: UserRole.USER, team: 'team-alpha', profileImg: 'public/assets/user-images/mithies.JPG', status: 'active', password: '@Mithies2315' },
      { id: '3', name: 'Abdullah Firdowsi', email: 'abdullahfirdowsi@gmail.com', role: UserRole.USER, team: 'team-alpha', profileImg: 'public/assets/user-images/sandeep.png', status: 'active', password: '@Abdullah52' },
      { id: '4', name: 'Kruthika Shanmuganathan', email: 'kruthikashan@gmail.com', role: UserRole.USER, team: '', profileImg: 'public/assets/profile1.JPG', status: 'active', password: '@Kruthika23' }, // Available user
      { id: '5', name: 'Madhanegha Selvarajoo', email: 'madhaneghaselvarajoo@gmail.com', role: UserRole.USER, team: '', profileImg: 'public/assets/default-avatar.png', status: 'active', password: '@Madhanegha17' } // Available user
    ];
    this.localStorage.saveUsers(sampleUsers);
  }
}