// user-management.ts
import { Component, OnInit } from '@angular/core';
import { 
  faUsers, faProjectDiagram, faSearch, faFilter, faPlus, 
  faEye, faEdit, faTrashAlt, faTimes, faPhoneAlt, 
  faInfoCircle, faUserFriends, faChevronRight 
} from '@fortawesome/free-solid-svg-icons';
import { User, Team, UserRole } from '../../../model/user.model';
import { LocalStorageService } from '../../../core/services/local-storage/local-storage';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-management',
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './user-management.html',
})
export class UserManagement implements OnInit {
  // Icons
  faUsers = faUsers;
  faProjectDiagram = faProjectDiagram;
  faSearch = faSearch;
  faFilter = faFilter;
  faPlus = faPlus;
  faEye = faEye;
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  faTimes = faTimes;
  faPhoneAlt = faPhoneAlt;
  faInfoCircle = faInfoCircle;
  faUserFriends = faUserFriends;
  faChevronRight = faChevronRight;

  // Tab management
  activeTab: 'users' | 'teams' = 'users';

  // User management
  users: User[] = [];
  filteredUsers: User[] = [];
  paginatedUsers: User[] = [];
  teams: Team[] = [];
  filteredTeams: Team[] = [];
  expandedTeams: string[] = [];

  // Search and filters
  searchTerm: string = '';
  selectedRole: string = '';
  selectedStatus: string = '';
  selectedTeamFilter: string = '';
  showFilterDropdown: boolean = false;

  // Team search
  teamSearchTerm: string = '';

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  // Modals
  showUserDetailsModal: boolean = false;
  showEditUserModal: boolean = false;
  showAddUserModal: boolean = false;
  showAddTeamModal: boolean = false;
  showAddSubTeamModal: boolean = false;
  showTeamDetailsModal: boolean = false;
  showEditTeamModal: boolean = false;
  showAddMemberModal: boolean = false;

  // Selected items
  selectedUser: User = this.getDefaultUser();
  selectedTeam: Team | null = null;
  newUser: User = this.getDefaultUser();
  newTeam: Team = this.getDefaultTeam();
  newSubTeam: Team = this.getDefaultTeam();

  // Form errors
  userFormErrors: any = {};
  teamFormErrors: any = {};

  // Loading states
  isSubmitting: boolean = false;
  isAddingMembers: boolean = false;

  // Member selection
  availableMembers: User[] = [];
  memberSearchTerm: string = '';
  selectedMembers: User[] = [];

  constructor(private localStorage: LocalStorageService) {}

  ngOnInit(): void {
    this.loadInitialData();
    this.applyFilters();
    this.filterTeams();
  }

  private loadInitialData(): void {
    this.users = this.localStorage.getUsers<User[]>() || this.getSampleUsers();
    this.teams = this.localStorage.getTeams<Team[]>() || this.getSampleTeams();
  }

  // Tab management
  switchTab(tab: 'users' | 'teams'): void {
    this.activeTab = tab;
  }

  // User filtering and search
  applyFilters(): void {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = !this.searchTerm || 
        user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesRole = !this.selectedRole || user.role === this.selectedRole;
      const matchesStatus = !this.selectedStatus || user.status === this.selectedStatus;
      const matchesTeam = !this.selectedTeamFilter || user.team === this.selectedTeamFilter;

      return matchesSearch && matchesRole && matchesStatus && matchesTeam;
    });

    this.currentPage = 1;
    this.updatePagination();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedRole = '';
    this.selectedStatus = '';
    this.selectedTeamFilter = '';
    this.applyFilters();
    this.showFilterDropdown = false;
  }

  // Team filtering and search
  filterTeams(): void {
    this.filteredTeams = this.teams.filter(team => 
      !this.teamSearchTerm || 
      team.name.toLowerCase().includes(this.teamSearchTerm.toLowerCase()) ||
      team.department.toLowerCase().includes(this.teamSearchTerm.toLowerCase())
    );
  }

  // Pagination
  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedUsers = this.filteredUsers.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  getPageNumbers(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  getToEntryNumber(): number {
    const end = this.currentPage * this.itemsPerPage;
    return end > this.filteredUsers.length ? this.filteredUsers.length : end;
  }

  // User actions
  viewUserDetails(user: User): void {
    this.selectedUser = { ...user };
    this.showUserDetailsModal = true;
  }

  editUser(user: User): void {
    this.selectedUser = { ...user };
    this.showEditUserModal = true;
  }

  deleteUser(user: User): void {
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      this.users = this.users.filter(u => u.id !== user.id);
      this.localStorage.saveUsers(this.users);
      this.applyFilters();
      this.closeModals();
    }
  }

  openAddUserModal(): void {
    this.newUser = this.getDefaultUser();
    this.showAddUserModal = true;
  }

  createUser(): void {
    if (this.validateUserForm(this.newUser)) {
        this.isSubmitting = true;
        
        // Generate sequential numeric ID
        const maxId = this.users.length > 0 ? Math.max(...this.users.map(u => parseInt(u.id) || 0)) : 0;
        this.newUser.id = (maxId + 1).toString();
        
        this.newUser.joinDate = new Date().toISOString();
        this.newUser.lastActive = new Date().toISOString();
        
        this.users.push({ ...this.newUser });
        this.localStorage.saveUsers(this.users);
        
        this.isSubmitting = false;
        this.showAddUserModal = false;
        this.applyFilters();
    }
  }

  saveUser(): void {
    if (this.validateUserForm(this.selectedUser)) {
      this.isSubmitting = true;
      
      const index = this.users.findIndex(u => u.id === this.selectedUser.id);
      if (index !== -1) {
        this.users[index] = { ...this.selectedUser };
        this.localStorage.saveUsers(this.users);
      }
      
      this.isSubmitting = false;
      this.showEditUserModal = false;
      this.applyFilters();
    }
  }

  // Team actions
  viewTeamDetails(team: Team): void {
    this.selectedTeam = { ...team };
    this.showTeamDetailsModal = true;
  }

  editTeam(team: Team): void {
    this.selectedTeam = { ...team };
    this.showEditTeamModal = true;
  }

  deleteTeam(team: Team): void {
    if (confirm(`Are you sure you want to delete ${team.name}?`)) {
      this.teams = this.teams.filter(t => t.id !== team.id);
      this.localStorage.saveTeams(this.teams);
      this.filterTeams();
      this.closeModals();
    }
  }

  openAddTeamModal(): void {
    this.newTeam = this.getDefaultTeam();
    this.showAddTeamModal = true;
  }

  openAddSubTeamModal(): void {
    this.newSubTeam = this.getDefaultTeam();
    this.showAddSubTeamModal = true;
  }

  createTeam(): void {
    if (this.validateTeamForm(this.newTeam)) {
      this.isSubmitting = true;
      
      this.newTeam.id = this.generateId();
      this.newTeam.members = 0;
      this.newTeam.projects = 0;
      this.newTeam.completionRate = 0;
      this.newTeam.subTeams = [];
      
      this.teams.push({ ...this.newTeam });
      this.localStorage.saveTeams(this.teams);
      
      this.isSubmitting = false;
      this.showAddTeamModal = false;
      this.filterTeams();
    }
  }

  createSubTeam(): void {
    if (this.validateTeamForm(this.newSubTeam)) {
      this.isSubmitting = true;
      
      this.newSubTeam.id = this.generateId();
      this.newSubTeam.members = 0;
      this.newSubTeam.projects = 0;
      this.newSubTeam.completionRate = 0;
      this.newSubTeam.subTeams = [];
      
      // Find parent team and add this sub-team to its subTeams array
      const parentTeamIndex = this.teams.findIndex(t => t.id === this.newSubTeam.parentTeam);
      if (parentTeamIndex !== -1) {
        if (!this.teams[parentTeamIndex].subTeams) {
          this.teams[parentTeamIndex].subTeams = [];
        }
        this.teams[parentTeamIndex].subTeams?.push({ ...this.newSubTeam });
      }
      
      this.teams.push({ ...this.newSubTeam });
      this.localStorage.saveTeams(this.teams);
      
      this.isSubmitting = false;
      this.showAddSubTeamModal = false;
      this.filterTeams();
    }
  }

  saveTeamEdits(): void {
    if (this.selectedTeam && this.validateTeamForm(this.selectedTeam)) {
      this.isSubmitting = true;
      
      const index = this.teams.findIndex(t => t.id === this.selectedTeam?.id);
      if (index !== -1) {
        this.teams[index] = { ...this.selectedTeam };
        this.localStorage.saveTeams(this.teams);
      }
      
      this.isSubmitting = false;
      this.showEditTeamModal = false;
      this.filterTeams();
    }
  }

  // Team hierarchy
  toggleTeamExpansion(teamId: string): void {
    const index = this.expandedTeams.indexOf(teamId);
    if (index === -1) {
      this.expandedTeams.push(teamId);
    } else {
      this.expandedTeams.splice(index, 1);
    }
  }

  isTeamExpanded(teamId: string): boolean {
    return this.expandedTeams.includes(teamId);
  }

  getSubTeams(parentTeamId: string): Team[] {
    return this.teams.filter(team => team.parentTeam === parentTeamId);
  }

  getTeamHierarchy(team: Team): any[] {
    const hierarchy = [];
    let currentTeam: Team | undefined = team;
    
    while (currentTeam) {
      hierarchy.unshift({
        ...currentTeam,
        level: hierarchy.length
      });
      
      if (currentTeam.parentTeam) {
        currentTeam = this.teams.find(t => t.id === currentTeam?.parentTeam);
      } else {
        currentTeam = undefined;
      }
    }
    
    return hierarchy;
  }

  // Member management
  addMemberToTeam(team: Team): void {
    this.selectedTeam = team;
    this.availableMembers = this.users.filter(user => !user.team || user.team !== team.name);
    this.memberSearchTerm = '';
    this.selectedMembers = [];
    this.showAddMemberModal = true;
  }

  filterAvailableMembers(): void {
    if (!this.memberSearchTerm) {
      this.availableMembers = this.users.filter(user => !user.team || user.team !== this.selectedTeam?.name);
    } else {
      this.availableMembers = this.users.filter(user => 
        (!user.team || user.team !== this.selectedTeam?.name) &&
        (user.name.toLowerCase().includes(this.memberSearchTerm.toLowerCase()) ||
         user.email.toLowerCase().includes(this.memberSearchTerm.toLowerCase()))
      );
    }
  }

  toggleMemberSelection(member: User): void {
    member.selected = !member.selected;
    if (member.selected) {
      this.selectedMembers.push(member);
    } else {
      this.selectedMembers = this.selectedMembers.filter(m => m.id !== member.id);
    }
  }

  addSelectedMembers(): void {
    this.isAddingMembers = true;
    
    this.selectedMembers.forEach(member => {
      const userIndex = this.users.findIndex(u => u.id === member.id);
      if (userIndex !== -1) {
        this.users[userIndex].team = this.selectedTeam?.name || '';
      }
    });
    
    if (this.selectedTeam) {
      const teamIndex = this.teams.findIndex(t => t.id === this.selectedTeam?.id);
      if (teamIndex !== -1) {
        this.teams[teamIndex].members += this.selectedMembers.length;
      }
    }
    
    this.localStorage.saveUsers(this.users);
    this.localStorage.saveTeams(this.teams);
    
    this.isAddingMembers = false;
    this.showAddMemberModal = false;
  }

  // Helper methods
  getDefaultUser(): User {
    return {
      id: '',
      name: '',
      username: '',
      email: '',
      password: '',
      role: UserRole.USER,
      status: 'active',
      employeeType: 'full-time',
      location: 'office'
    };
  }

  getDefaultTeam(): Team {
    return {
      id: '',
      name: '',
      department: '',
      members: 0,
      projects: 0,
      completionRate: 0,
      parentTeam: null,
      subTeams: []
    };
  }

  generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'on-leave': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getStars(rating: number): string[] {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push('★');
    }
    
    if (hasHalfStar) {
      stars.push('½');
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push('☆');
    }
    
    return stars;
  }

  closeModals(): void {
    this.showUserDetailsModal = false;
    this.showEditUserModal = false;
    this.showAddUserModal = false;
    this.showAddTeamModal = false;
    this.showAddSubTeamModal = false;
    this.showTeamDetailsModal = false;
    this.showEditTeamModal = false;
    this.showAddMemberModal = false;
    this.userFormErrors = {};
    this.teamFormErrors = {};
  }

  // Form validation
  validateUserForm(user: User): boolean {
    this.userFormErrors = {};
    let isValid = true;

    if (!user.name) {
      this.userFormErrors.name = 'Name is required';
      isValid = false;
    }

    if (!user.username) {
      this.userFormErrors.username = 'Username is required';
      isValid = false;
    }

    if (!user.email) {
      this.userFormErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(user.email)) {
      this.userFormErrors.email = 'Invalid email format';
      isValid = false;
    }

    if (this.showAddUserModal && !user.password) {
      this.userFormErrors.password = 'Password is required';
      isValid = false;
    }

    if (!user.role) {
      this.userFormErrors.role = 'Role is required';
      isValid = false;
    }

    if (!user.status) {
      this.userFormErrors.status = 'Status is required';
      isValid = false;
    }

    return isValid;
  }

  validateTeamForm(team: Team): boolean {
    this.teamFormErrors = {};
    let isValid = true;

    if (!team.name) {
      this.teamFormErrors.name = 'Team name is required';
      isValid = false;
    }

    if (!team.department) {
      this.teamFormErrors.department = 'Department is required';
      isValid = false;
    }

    if (this.showAddSubTeamModal && !team.parentTeam) {
      this.teamFormErrors.parentTeam = 'Parent team is required';
      isValid = false;
    }

    return isValid;
  }

  // Sample data for initial setup
  private getSampleUsers(): User[] {
    return [
      {
        id: '1',
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com',
        role: UserRole.USER,
        status: 'active',
        department: 'Development',
        team: 'Frontend',
        joinDate: '2022-01-15',
        lastActive: new Date().toISOString(),
        performance: {
          taskCompletion: 95,
          onTimeDelivery: 90,
          qualityRating: 4.5,
          projects: ['Project A', 'Project B']
        }
      },
      {
        id: '2',
        name: 'Jane Smith',
        username: 'janesmith',
        email: 'jane@example.com',
        role: UserRole.LEAD,
        status: 'active',
        department: 'Design',
        team: 'UI/UX',
        joinDate: '2021-11-10',
        lastActive: new Date().toISOString(),
        performance: {
          taskCompletion: 85,
          onTimeDelivery: 80,
          qualityRating: 4.2,
          projects: ['Project C']
        }
      }
    ];
  }

  private getSampleTeams(): Team[] {
    return [
      {
        id: '1',
        name: 'Frontend',
        department: 'Development',
        lead: 'John Doe',
        members: 5,
        projects: 3,
        completionRate: 75,
        parentTeam: null,
        subTeams: []
      },
      {
        id: '2',
        name: 'UI/UX',
        department: 'Design',
        lead: 'Jane Smith',
        members: 3,
        projects: 2,
        completionRate: 90,
        parentTeam: null,
        subTeams: []
      }
    ];
  }

  // Team member and project helpers
  getTeamMembers(teamName: string): User[] {
    return this.users.filter(user => user.team === teamName);
  }

  getTeamProjects(teamName: string): any[] {
    // This is a placeholder - in a real app, you'd have a projects service
    return [
      {
        name: 'Website Redesign',
        startDate: '2023-01-01',
        deadline: '2023-06-30',
        priority: 'High',
        progress: 65
      },
      {
        name: 'Mobile App',
        startDate: '2023-02-15',
        deadline: '2023-08-15',
        priority: 'Medium',
        progress: 30
      }
    ];
  }

  getUserByName(name: string): User | undefined {
    return this.users.find(user => user.name === name);
  }

  addSubTeam(team: Team): void {
    this.newSubTeam = this.getDefaultTeam();
    this.newSubTeam.parentTeam = team.id;
    this.newSubTeam.department = team.department;
    this.showAddSubTeamModal = true;
  }
}