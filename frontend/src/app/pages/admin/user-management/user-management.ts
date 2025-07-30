import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { 
  faUsers, faProjectDiagram, faSearch, faFilter, faPlus, 
  faEye, faEdit, faTrashAlt, faTimes, faPhoneAlt, 
  faInfoCircle, faUserFriends, faChevronRight, faTimesCircle, faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { User, Team, UserRole, Project } from '../../../model/user.model';
import { LocalStorageService } from '../../../core/services/local-storage/local-storage';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ToastService } from '../../../core/services/toast/toast';
import { DialogService } from '../../../core/services/dialog/dialog';
import { Auth } from '../../../core/services/auth/auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './user-management.html',
  styleUrls: ['./user-management.css'],
  animations: [
    trigger('toastAnimation', [
      state('void', style({
        opacity: 0,
        transform: 'translate(-50%, calc(-50% + 20px))'
      })),
      state('*', style({
        opacity: 1,
        transform: 'translate(-50%, -50%)'
      })),
      transition('void <=> *', animate('300ms ease-in-out')),
    ])
  ]
})
export class UserManagement implements OnInit, OnDestroy {
  // Icons used in the component
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
  faTimesCircle = faTimesCircle;
  faCheckCircle = faCheckCircle;

  // Manages the active tab between 'users' and 'teams'
  activeTab: 'users' | 'teams' = 'users';

  // User data arrays for display and filtering
  users: User[] = [];
  filteredUsers: User[] = [];
  paginatedUsers: User[] = [];

  // Team data arrays for display and filtering
  teams: Team[] = [];
  filteredTeams: Team[] = [];
  expandedTeams: string[] = [];

  // Search and filter parameters for users
  searchTerm: string = '';
  selectedRole: string = '';
  selectedStatus: string = '';
  selectedTeamForFilter: Team | null = null; // Holds the selected team object for filtering users
  showFilterDropdown: boolean = false;

  // Search term for teams
  teamSearchTerm: string = '';

  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  // Modal visibility flags
  showUserDetailsModal: boolean = false;
  showEditUserModal: boolean = false;
  showAddUserModal: boolean = false;
  showAddTeamModal: boolean = false;
  showAddSubTeamModal: boolean = false;
  showTeamDetailsModal: boolean = false;
  showEditTeamModal: boolean = false;
  showAddMemberModal: boolean = false;

  // Data models for selected/new items
  selectedUser: User = this.getDefaultUser();
  newUser: User = this.getDefaultUser();
  newTeam: Team = this.getDefaultTeam();
  newSubTeam: Team = this.getDefaultTeam();

  // Stores form validation errors
  userFormErrors: any = {};
  teamFormErrors: any = {};

  // Loading states for async operations
  isSubmitting: boolean = false;
  isAddingMembers: boolean = false;

  // Properties for adding members to a team
  availableMembers: User[] = [];
  memberSearchTerm: string = '';
  selectedMembers: User[] = []; // Users currently selected to be added to a team

  // Dialog properties for confirmation and messages
  showConfirmDialog: boolean = false;
  confirmDialogTitle: string = '';
  confirmDialogMessage: string = '';
  confirmButtonText: string = '';
  cancelButtonText: string = '';
  confirmButtonClass: string = 'custom-dialog-btn-primary';
  confirmAction: () => void = () => {}; // Function to execute on confirmation

  showMessageDialog: boolean = false;
  messageDialogTitle: string = '';
  messageDialogMessage: string = '';
  messageType: 'success' | 'error' | 'info' = 'success';

  // Subscriptions
  private teamsRefreshSubscription?: Subscription;

  constructor(
    private localStorage: LocalStorageService,
    private dialogService: DialogService,
    private toastService: ToastService,
    private authService: Auth,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
    
    // Subscribe to teams refresh events from other components
    this.teamsRefreshSubscription = this.authService.refreshTeams$.subscribe(() => {
      console.log('UserManagement: Received teams refresh event');
      this.loadTeams();
    });
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    if (this.teamsRefreshSubscription) {
      this.teamsRefreshSubscription.unsubscribe();
    }
  }

  private loadInitialData(): void {
    this.loadUsers();
    this.loadTeams();
  }

  private loadUsers(): void {
    this.authService.adminGetAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.applyFilters();
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.users = this.getSampleUsers();
        this.applyFilters();
        this.toastService.show('Using sample user data', 'warning');
      }
    });
  }

  private loadTeams(): void {
    this.authService.adminGetAllTeams().subscribe({
      next: (teams) => {
        console.log('Raw teams data from backend:', teams);
        
        // Process teams data to handle populated fields correctly
        this.teams = teams.map((team: any) => ({
          id: team._id || team.id,
          name: team.name,
          department: team.department,
          description: team.description,
          lead: team.lead?._id || team.lead,
          leadName: team.lead?.name || 'Unknown',
          members: Array.isArray(team.members) ? team.members.length : 0,
          projects: Array.isArray(team.projects) ? team.projects.length : 0,
          completionRate: team.completionRate || 0,
          parentTeam: team.parentTeam?._id || team.parentTeam,
          subTeams: Array.isArray(team.subTeams) ? team.subTeams.map((subTeam: any) => ({
            id: subTeam._id || subTeam.id,
            name: subTeam.name,
            department: subTeam.department,
            lead: subTeam.lead?._id || subTeam.lead,
            leadName: subTeam.lead?.name || 'Unknown',
            members: Array.isArray(subTeam.members) ? subTeam.members.length : 0,
            projects: Array.isArray(subTeam.projects) ? subTeam.projects.length : 0,
            completionRate: subTeam.completionRate || 0
          })) : [],
          leadDetails: team.lead,
          memberDetails: team.members,
          projectDetails: team.projects,
          createdAt: team.createdAt,
          updatedAt: team.updatedAt
        }));
        
        console.log('Processed teams data:', this.teams);
        this.filterTeams();
      },
      error: (err) => {
        console.error('Error loading teams:', err);
        this.teams = this.getSampleTeams();
        this.filterTeams();
        this.toastService.show('Using sample team data', 'warning');
      }
    });
  }

  // Tab management
  switchTab(tab: 'users' | 'teams'): void {
    this.activeTab = tab;
  }

  // User filtering and search
  applyFilters(): void {
    this.filteredUsers = [...this.users].filter(user => {
      const matchesSearch = !this.searchTerm || 
        user.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
        user.email?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.username?.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesRole = !this.selectedRole || user.role === this.selectedRole;
      const matchesStatus = !this.selectedStatus || user.status === this.selectedStatus;
      const matchesTeam = !this.selectedTeamForFilter || user.team === this.selectedTeamForFilter.id;

      return matchesSearch && matchesRole && matchesStatus && matchesTeam;
    });

    this.currentPage = 1;
    this.updatePagination();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedRole = '';
    this.selectedStatus = '';
    this.selectedTeamForFilter = null;
    this.applyFilters();
    this.showFilterDropdown = false;
  }

  // Team filtering and search
  filterTeams(): void {
    this.filteredTeams = this.teams.filter(team => 
      !this.teamSearchTerm || 
      team.name?.toLowerCase().includes(this.teamSearchTerm.toLowerCase()) ||
      team.department?.toLowerCase().includes(this.teamSearchTerm.toLowerCase())
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
    return Array.from({length: this.totalPages}, (_, i) => i + 1);
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
    this.userFormErrors = {}; // Clear errors on modal open
  }

  // Confirms user deletion
  confirmDeleteUser(user: User): void {
    this.dialogService.open({
      title: 'Confirm Deletion',
      message: `Are you sure you want to delete ${user.name}? This action cannot be undone.`,
      confirmButtonText: 'Delete',
      confirmButtonClass: 'bg-red-600 hover:bg-red-700',
      onConfirm: () => this.executeDeleteUser(user)
    });
  }

  // Executes user deletion via backend API
  private executeDeleteUser(user: User): void {
    this.authService.adminDeleteUser(user.id).subscribe({
      next: () => {
        this.ngZone.run(() => {
          // Remove the user from the local array
          this.users = this.users.filter(u => u.id !== user.id);
          this.applyFilters(); // Re-apply filters to update table
          this.closeModals();
          this.cdr.detectChanges();
          
          // Show toast message after UI updates
          setTimeout(() => {
            this.toastService.show(`User ${user.name} was deleted successfully.`, 'success');
          }, 100);
        });
      },
      error: (err) => {
        this.ngZone.run(() => {
          console.error('Error deleting user:', err);
          this.cdr.detectChanges();
          
          // Show toast message after UI updates
          setTimeout(() => {
            this.toastService.show(`Failed to delete user: ${err.message}`, 'error');
          }, 100);
        });
      }
    });
  }

  // Opens the add user modal
  openAddUserModal(): void {
    this.newUser = this.getDefaultUser();
    this.userFormErrors = {};
    this.showAddUserModal = true;
  }

  // Creates a new user via backend API
  createUser(): void {
    if (this.validateUserForm(this.newUser)) {
      this.isSubmitting = true;

      // Prepare payload, exclude frontend `id` as backend will generate `_id` and `numericalId`
      const userToCreate: Partial<User> = {
        name: this.newUser.name,
        username: this.newUser.username,
        email: this.newUser.email,
        password: this.newUser.password, // Password is required for creation
        role: this.newUser.role,
        phone: this.newUser.phone,
        gender: this.newUser.gender,
        dob: this.newUser.dob,
        department: this.newUser.department,
        team: this.newUser.team, // Send as string ID
        employeeType: this.newUser.employeeType,
        location: this.newUser.location,
        address: this.newUser.address,
        about: this.newUser.about,
        profileImg: this.newUser.profileImg
      };

      this.authService.adminCreateUser(userToCreate).subscribe({
        next: (response) => {
          this.ngZone.run(() => {
            // Map response to User type, filling missing fields if necessary
            const newUser: User = {
              ...this.newUser,
              ...response,
              id: response.id ?? response._id ?? '', // Use backend ID
              password: this.newUser.password ?? '', // Password from form
            };
            this.users.push(newUser); // Add the newly created user (with backend-generated ID and defaults) to local array
            this.isSubmitting = false;
            this.showAddUserModal = false;
            this.applyFilters(); // Re-filter and paginate to show new user
            this.cdr.detectChanges();
            
            // Show toast message after UI updates
            setTimeout(() => {
              this.toastService.show(`User ${newUser.name} created successfully.`, 'success');
            }, 100);
          });
        },
        error: (err) => {
          this.ngZone.run(() => {
            this.isSubmitting = false;
            console.error('Error creating user:', err);
            this.cdr.detectChanges();
            
            // Show toast message after UI updates
            setTimeout(() => {
              this.toastService.show(`Failed to create user: ${err.message}`, 'error');
            }, 100);
          });
        }
      });
    }
  }

  // Initiates user save confirmation
  saveUser(): void {
    if (this.validateUserForm(this.selectedUser, true)) { // Pass true for isEdit
      this.dialogService.open({
        title: 'Confirm Changes',
        message: `Are you sure you want to save changes to ${this.selectedUser.name}?`,
        onConfirm: () => this.executeSaveUser()
      });
    }
  }

  // Executes user save via backend API
  private executeSaveUser(): void {
    this.isSubmitting = true;

    // Prepare payload, exclude sensitive or auto-generated fields
    const userToUpdate: Partial<User> = {
      name: this.selectedUser.name,
      username: this.selectedUser.username,
      email: this.selectedUser.email,
      role: this.selectedUser.role,
      status: this.selectedUser.status,
      phone: this.selectedUser.phone,
      gender: this.selectedUser.gender,
      dob: this.selectedUser.dob,
      department: this.selectedUser.department,
      team: this.selectedUser.team, // Send as string ID
      employeeType: this.selectedUser.employeeType,
      location: this.selectedUser.location,
      address: this.selectedUser.address,
      about: this.selectedUser.about,
      profileImg: this.selectedUser.profileImg
    };

    // If password was entered in the edit form, include it in the update payload
    if (this.selectedUser.password && this.selectedUser.password.length >= 6) { // Check minlength too
      userToUpdate.password = this.selectedUser.password;
    }


    this.authService.adminUpdateUser(this.selectedUser.id, userToUpdate).subscribe({
      next: (updatedUser) => {
        this.ngZone.run(() => {
          const index = this.users.findIndex(u => u.id === updatedUser.id);
          if (index !== -1) {
            this.users[index] = updatedUser; // Update the user in the local array
          }

          this.isSubmitting = false;
          this.closeModals();
          
          // Refresh both users and teams data to ensure proper population
          this.loadUsers();
          this.loadTeams();
          
          this.cdr.detectChanges();
          
          // Show toast message after UI updates
          setTimeout(() => {
            this.toastService.show(`User ${updatedUser.name} updated successfully.`, 'success');
          }, 100);
        });
      },
      error: (err) => {
        this.ngZone.run(() => {
          this.isSubmitting = false;
          console.error('Error saving user changes:', err);
          this.cdr.detectChanges();
          
          // Show toast message after UI updates
          setTimeout(() => {
            this.toastService.show(
              `Failed to update user: ${err.message}`,
              'error'
            );
          }, 100);
        });
      }
    });
  }

  //Team Actions
  viewTeamDetails(team: Team): void {
    const teamId = team._id || team.id;
    if (!teamId) {
      console.error('No team ID available');
      this.toastService.show('Team ID not found', 'error');
      return;
    }
    
    this.authService.adminGetTeamById(teamId).subscribe({
      next: (detailedTeam) => {
        this.selectedTeamForFilter = detailedTeam;
        this.showTeamDetailsModal = true;
        // Use setTimeout to defer change detection and avoid ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
          this.cdr.detectChanges();
        }, 0);
      },
      error: (err) => {
        console.error('Error loading team details:', err);
        // Fallback to basic team data if API fails
        this.selectedTeamForFilter = {
          ...team,
          memberDetails: this.getTeamMembers(teamId),
          projectDetails: this.getTeamProjects(teamId)
        };
        this.showTeamDetailsModal = true;
        this.cdr.detectChanges();
        this.toastService.show('Using basic team data', 'info');
      }
    });
  }

  editTeam(team: Team): void {
    console.log('Editing team:', team);
    
    // Create a deep copy and ensure all properties are set
    this.selectedTeamForFilter = {
      ...team,
      _id: team._id || team.id,
      id: team.id || team._id || '',
      name: team.name || '',
      department: team.department || '',
      lead: team.lead || '',
      description: team.description || ''
    };
    
    console.log('Selected team for filter:', this.selectedTeamForFilter);
    
    // Clear any existing form errors
    this.teamFormErrors = {};
    
    // Show the modal
    this.showEditTeamModal = true;
    
    // Let Angular handle change detection naturally instead of forcing it
    console.log('Edit team modal opened, selectedTeamForFilter:', this.selectedTeamForFilter);
  }

  // Confirms team deletion
  confirmDeleteTeam(team: Team): void {
    this.dialogService.open({
      title: 'Confirm Deletion',
      message: `Are you sure you want to delete the team "${team.name}"? This action cannot be undone.`,
      confirmButtonText: 'Delete',
      confirmButtonClass: 'bg-red-600 hover:bg-red-700',
      onConfirm: () => this.executeDeleteTeam(team)
    });
  }

  // Executes team deletion (Backend)
  private executeDeleteTeam(team: Team): void {
    const teamId = team._id || team.id;
    if (!teamId) {
      console.error('No team ID available for deletion');
      this.toastService.show('Team ID not found', 'error');
      return;
    }

    this.authService.adminDeleteTeam(teamId).subscribe({
      next: () => {
        this.teams = this.teams.filter(t => (t._id || t.id) !== teamId);
        this.filterTeams();
        this.closeModals();
        this.toastService.show(`Team ${team.name} was deleted successfully`, 'success');
      },
      error: (err) => {
        console.error('Error deleting team:', err);
        this.toastService.show(`Failed to delete team: ${err.message}`, 'error');
      }
    });
  }

  // Opens the add team modal
  openAddTeamModal(): void {
    this.newTeam = this.getDefaultTeam();
    this.teamFormErrors = {};
    this.showAddTeamModal = true;
  }

  // Opens the add sub-team modal
  openAddSubTeamModal(): void {
    this.newSubTeam = this.getDefaultTeam();
    this.teamFormErrors = {};
    this.showAddSubTeamModal = true;
  }

  // Creates a new team (Backend)
  createTeam(): void {
    if (this.validateTeamForm(this.newTeam)) {
      this.isSubmitting = true;

      const teamToCreate = {
        name: this.newTeam.name,
        department: this.newTeam.department,
        lead: this.newTeam.lead,
        description: this.newTeam.description,
        parentTeam: this.newTeam.parentTeam
      };

      this.authService.adminCreateTeam(teamToCreate).subscribe({
        next: (createdTeam) => {
          this.teams.push(createdTeam);
          this.isSubmitting = false;
          this.showAddTeamModal = false;
          this.filterTeams();
          
          // Refresh users data to update team assignments
          this.loadUsers();
          
          this.toastService.show(`Team ${createdTeam.name} created successfully`, 'success');
        },
        error: (err) => {
          this.isSubmitting = false;
          console.error('Error creating team:', err);
          this.toastService.show(`Failed to create team: ${err.message}`, 'error');
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    }
  }

  // Creates a new sub-team (Backend)
  createSubTeam(): void {
    if (this.validateTeamForm(this.newSubTeam)) {
      this.isSubmitting = true;

      const subTeamToCreate = {
        name: this.newSubTeam.name,
        department: this.newSubTeam.department,
        lead: this.newSubTeam.lead,
        description: this.newSubTeam.description,
        parentTeam: this.newSubTeam.parentTeam
      };

      this.authService.adminCreateTeam(subTeamToCreate).subscribe({
        next: (createdSubTeam) => {
          this.teams.push(createdSubTeam);
          this.isSubmitting = false;
          this.showAddSubTeamModal = false;
          this.filterTeams();
          
          // Refresh users data to update team assignments
          this.loadUsers();
          
          this.toastService.show(`Sub-team ${createdSubTeam.name} created successfully`, 'success');
        },
        error: (err) => {
          this.isSubmitting = false;
          console.error('Error creating sub-team:', err);
          this.toastService.show(`Failed to create sub-team: ${err.message}`, 'error');
        }
      });
    }
  }

  // Initiates team save confirmation
  saveTeamEdits(): void {
    if (this.selectedTeamForFilter && this.validateTeamForm(this.selectedTeamForFilter)) {
      this.dialogService.open({
        title: 'Confirm Changes',
        message: `Are you sure you want to save changes to ${this.selectedTeamForFilter.name}?`,
        onConfirm: () => this.executeSaveTeam()
      });
    }
  }

  // Executes team save (Backend)
  private executeSaveTeam(): void {
    if (!this.selectedTeamForFilter) return;

    const teamId = this.selectedTeamForFilter._id || this.selectedTeamForFilter.id;
    if (!teamId) {
      console.error('No team ID available for update');
      this.toastService.show('Team ID not found', 'error');
      return;
    }

    this.isSubmitting = true;
    const teamToUpdate = {
      name: this.selectedTeamForFilter.name,
      department: this.selectedTeamForFilter.department,
      lead: this.selectedTeamForFilter.lead,
      description: this.selectedTeamForFilter.description,
      parentTeam: this.selectedTeamForFilter.parentTeam
    };

    this.authService.adminUpdateTeam(teamId, teamToUpdate).subscribe({
      next: (updatedTeam) => {
        const index = this.teams.findIndex(t => (t._id || t.id) === teamId);
        if (index !== -1) {
          this.teams[index] = updatedTeam;
        }
        this.isSubmitting = false;
        this.closeModals();
        this.filterTeams();
        
        // Refresh users data to update team assignments
        this.loadUsers();
        
        this.toastService.show(`Team ${updatedTeam.name} updated successfully`, 'success');
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Error updating team:', err);
        this.toastService.show(`Failed to update team: ${err.message}`, 'error');
      }
    });
  }

  // Toggles the expansion state of a team in the hierarchy view.
  toggleTeamExpansion(teamId: string): void {
    const index = this.expandedTeams.indexOf(teamId);
    if (index === -1) {
      this.expandedTeams.push(teamId);
    } else {
      this.expandedTeams.splice(index, 1);
    }
  }

  // Checks if a team is currently expanded in the hierarchy view.
  isTeamExpanded(teamId: string): boolean {
    return this.expandedTeams.includes(teamId);
  }

  // Retrieves sub-teams for a given parent team ID.
  getSubTeams(parentTeamId: string): Team[] {
    return this.teams.filter(team => team.parentTeam === parentTeamId);
  }

  // Generates the hierarchical path for a given team.
  getTeamHierarchy(team: Team): any[] {
    const hierarchy = [];
    let currentTeam: Team | undefined = team;

    while (currentTeam) {
      hierarchy.unshift({
        ...currentTeam,
        level: hierarchy.length // Indicates depth in hierarchy
      });

      if (currentTeam.parentTeam) {
        currentTeam = this.teams.find(t => t.id === currentTeam?.parentTeam);
      } else {
        currentTeam = undefined; // No more parent teams
      }
    }
    return hierarchy;
  }

  // Triggers the file input for image upload.
  openImageUpload(type: 'edit' | 'new' = 'edit'): void {
    const inputId = type === 'edit' ? 'profileImage' : 'newProfileImage';
    const inputElement = document.getElementById(inputId) as HTMLInputElement;
    if (inputElement) {
      inputElement.click();
    }
  }

  // Handles the image file selected by the user, resizing and setting it as profile image.
  handleImageUpload(event: Event, type: 'edit' | 'new' = 'edit'): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const MAX_WIDTH = 200;
          const MAX_HEIGHT = 200;
          let width = img.width;
          let height = img.height;

          // Resize image while maintaining aspect ratio
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(img, 0, 0, width, height);

          const resizedImage = canvas.toDataURL('image/jpeg'); // Convert to JPEG data URL

          // Assign resized image to the appropriate user object
          if (type === 'edit') {
            this.selectedUser.profileImg = resizedImage;
          } else {
            this.newUser.profileImg = resizedImage;
          }
        };
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  // Displays a custom message dialog.
  showMessage(title: string, message: string, type: 'success' | 'error' | 'info' = 'success'): void {
    this.messageDialogTitle = title;
    this.messageDialogMessage = message;
    this.messageType = type;
    this.showMessageDialog = true;

    // Automatically close the message dialog after 3 seconds
    setTimeout(() => {
      this.closeMessageDialog();
    }, 3000);
  }

  // Closes the message dialog.
  closeMessageDialog(): void {
    this.showMessageDialog = false;
  }

  // Closes the confirmation dialog.
  closeConfirmDialog(): void {
    this.showConfirmDialog = false;
  }

  // Returns a default User object for form initialization.
  getDefaultUser(): User {
    return {
      id: '', // Frontend ID, will be mapped from backend _id
      name: '',
      username: '',
      email: '',
      password: '', // Required for new user, optional for edit
      role: UserRole.USER,
      status: 'active',
      employeeType: 'full-time',
      location: 'office',
      team: null, // Team ID string or null
    };
  }

  // Returns a default Team object for form initialization.
  getDefaultTeam(): Team {
    return {
      id: '', // Client-side generated ID for local teams
      name: '',
      department: '',
      members: 0,
      projects: 0,
      completionRate: 0,
      parentTeam: null,
      subTeams: []
    };
  }

  // Generates a simple client-side ID (for local storage teams).
  generateId(): string {
    return Math.random().toString(36).substring(2, 11);
  }

  // Returns the display ID for a user (numerical ID if available, otherwise regular ID)
  getUserDisplayId(user: User): string | number {
    return user.numericalId ?? user.id;
  }

  // Returns CSS classes based on user status for styling.
  getStatusClass(status: string): string {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'on-leave': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  // Returns CSS classes based on project/task priority for styling.
  getPriorityClass(priority: string | undefined | null): string {
    if (!priority || priority === null || priority === undefined) {
      return 'bg-gray-100 text-gray-800';
    }
    
    const priorityStr = String(priority);
    switch (priorityStr.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  // Generates star symbols for ratings.
  getStars(rating: number): string[] {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push('★'); // Full star
    }

    if (hasHalfStar) {
      stars.push('½'); // Half star
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push('☆'); // Empty star
    }

    return stars;
  }

  // Closes all active modals and clears form errors.
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

  /**
   * Validates the user form data.
   * @param user The user object to validate.
   * @param isEdit Optional. True if validating for an edit operation, allows password to be optional.
   * @returns True if the form is valid, false otherwise.
   */
  validateUserForm(user: User, isEdit: boolean = false): boolean {
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

    // Password is required only for new user creation
    if (!isEdit && !user.password) {
      this.userFormErrors.password = 'Password is required';
      isValid = false;
    } else if (!isEdit && user.password && user.password.length < 6) {
        this.userFormErrors.password = 'Password must be at least 6 characters';
        isValid = false;
    } else if (isEdit && user.password && user.password.length > 0 && user.password.length < 6) {
        this.userFormErrors.password = 'Password must be at least 6 characters if changed';
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

  // Validates the team form data.
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

    // Parent team is required if creating a sub-team
    if (this.showAddSubTeamModal && !team.parentTeam) {
      this.teamFormErrors.parentTeam = 'Parent team is required';
      isValid = false;
    }

    return isValid;
  }

  // Provides sample user data for demo/fallback purposes.
  private getSampleUsers(): User[] {
    return [
      {
        id: '60c72b2f9c1d4a0015f8b4c3', // Example ObjectId
        numericalId: 101,
        name: 'Hema Dharshini DK',
        username: 'hemad',
        email: 'dkhemadharshini2003@gmail.com',
        password: '', // Password is not exposed
        role: UserRole.LEAD,
        status: 'active',
        department: 'Development',
        team: '60c72b2f9c1d4a0015f8b4c1', // Example team ID
        joinDate: '2022-01-15',
        lastActive: new Date().toISOString(),
        performance: {
          taskCompletion: 95,
          onTimeDelivery: 90,
          qualityRating: 4.5,
          projects: ['Project Alpha', 'Project Beta']
        }
      },
      {
        id: '60c72b2f9c1d4a0015f8b4c4', // Example ObjectId
        numericalId: 102,
        name: 'Mithies Ponnusamy',
        username: 'mithies',
        email: 'mithiesofficial@gmail.com',
        password: '',
        role: UserRole.USER,
        status: 'active',
        department: 'Design',
        team: '60c72b2f9c1d4a0015f8b4c2', // Example team ID
        joinDate: '2021-11-10',
        lastActive: new Date().toISOString(),
        performance: {
          taskCompletion: 85,
          onTimeDelivery: 80,
          qualityRating: 4.2,
          projects: ['Project Gamma']
        }
      },
      {
        id: '60c72b2f9c1d4a0015f8b4c5', // Example ObjectId
        numericalId: 103,
        name: 'Abdullah Firdowsi',
        username: 'abdullahf',
        email: 'abdullahfirdowsi@gmail.com',
        password: '',
        role: UserRole.USER,
        status: 'active',
        department: 'Development',
        team: '60c72b2f9c1d4a0015f8b4c1',
        joinDate: '2023-03-01',
        lastActive: new Date().toISOString(),
        performance: {
          taskCompletion: 90,
          onTimeDelivery: 95,
          qualityRating: 4.7,
          projects: ['Project Alpha']
        }
      },
      {
        id: '60c72b2f9c1d4a0015f8b4c6', // Example ObjectId
        numericalId: 104,
        name: 'Kruthika Shanmuganathan',
        username: 'kruthikas',
        email: 'kruthikashan@gmail.com',
        password: '',
        role: UserRole.USER,
        team: null, // No team assigned
        status: 'active',
        joinDate: '2024-01-20',
        lastActive: new Date().toISOString()
      },
      {
        id: '60c72b2f9c1d4a0015f8b4c7', // Example ObjectId
        numericalId: 105,
        name: 'Madhanegha Selvarajoo',
        username: 'madhaneghas',
        email: 'madhaneghaselvarajoo@gmail.com',
        password: '',
        role: UserRole.USER,
        team: null,
        status: 'active',
        joinDate: '2024-02-10',
        lastActive: new Date().toISOString()
      }
    ];
  }

  // Provides sample team data for demo/fallback purposes.
  private getSampleTeams(): Team[] {
    return [
      {
        id: '60c72b2f9c1d4a0015f8b4c1', // Example ObjectId for consistency
        name: 'Frontend',
        department: 'Development',
        lead: 'Hema Dharshini DK', // This should ideally be a user ID string in a real app
        members: 2, // Manually updated for sample data
        projects: 2, // Manually updated for sample data
        completionRate: 75,
        description: 'Handles all frontend development tasks.',
        parentTeam: null,
        subTeams: []
      },
      {
        id: '60c72b2f9c1d4a0015f8b4c2', // Example ObjectId
        name: 'UI/UX',
        department: 'Design',
        lead: 'Mithies Ponnusamy',
        members: 1,
        projects: 1,
        completionRate: 90,
        description: 'Focuses on user interface and user experience design.',
        parentTeam: null,
        subTeams: []
      }
    ];
  }

  // Update the getTeamMembers method to use backend data
  getTeamMembers(teamId: string): User[] {
    const team = this.teams.find(t => t.id === teamId);
    if (!team) return [];
    
    let members: User[] = [];
    
    // Add team members
    if (team.memberDetails && Array.isArray(team.memberDetails)) {
      members = team.memberDetails.map(member => this.mapApiUserToUser(member));
    }
    
    // Add team lead if not already in members and lead exists
    if (team.leadDetails && team.lead) {
      const leadId = team.lead;
      const isLeadInMembers = members.some(member => member.id === leadId);
      
      if (!isLeadInMembers) {
        const leadUser = this.mapApiUserToUser(team.leadDetails);
        members.unshift(leadUser); // Add lead at the beginning
      }
    }
    
    // Remove duplicates based on ID
    const uniqueMembers = members.filter((member, index, self) => 
      index === self.findIndex(m => m.id === member.id)
    );
    
    return uniqueMembers;
  }

  private mapApiUserToUser(apiUser: any): User {
    return {
      id: apiUser._id || apiUser.id,
      _id: apiUser._id || apiUser.id,
      numericalId: apiUser.numericalId,
      name: apiUser.name,
      username: apiUser.username,
      email: apiUser.email,
      role: apiUser.role as UserRole,
      status: apiUser.status,
      phone: apiUser.phone,
      gender: apiUser.gender,
      dob: apiUser.dob,
      department: apiUser.department,
      team: apiUser.team?._id || apiUser.team,
      employeeType: apiUser.employeeType,
      location: apiUser.location,
      joinDate: apiUser.joinDate,
      lastActive: apiUser.lastActive,
      address: apiUser.address,
      about: apiUser.about,
      profileImg: apiUser.profileImg,
      password: '',
      notifications: apiUser.notifications,
      performance: apiUser.performance,
      completionRate: apiUser.completionRate
    };
  }

  // Retrieves projects associated with a specific team (based on team name in sample data).
  getTeamProjects(teamId: string): any[] {
    const team = this.teams.find(t => t.id === teamId);
    if (!team || !team.projectDetails) return [];
    return team.projectDetails;
  }

  // Finds a user by their name.
  getUserByName(name: string): User | undefined {
    return this.users.find(user => user.name === name);
  }

  // Finds a user by their ID.
  getUserById(id: string): User | undefined {
    return this.users.find(user => (user._id || user.id) === id);
  }

  // Gets team name by ID for display purposes
  getTeamNameById(id: string | null | undefined): string {
    if (!id) return 'None';
    const team = this.teams.find(team => (team._id || team.id) === id);
    return team ? team.name : 'Unknown Team';
  }

  // Gets team name for user, using teamName field if available, otherwise lookup by ID
  getUserTeamName(user: User): string {
    // First priority: use the teamName field if it exists (from populated API response)
    if (user.teamName) {
      return user.teamName;
    }
    
    // Second priority: lookup team by ID in teams array
    if (user.team) {
      const team = this.teams.find(team => 
        (team._id || team.id) === user.team || 
        team.id === user.team || 
        team._id === user.team
      );
      if (team) {
        return team.name;
      }
    }
    
    // Fallback
    return user.team ? 'Unknown Team' : 'None';
  }

  // Opens the add sub-team modal and pre-fills parent team information.
  addSubTeam(team: Team): void {
    this.newSubTeam = this.getDefaultTeam();
    this.newSubTeam.parentTeam = team.id; // Set the parent team ID
    this.newSubTeam.department = team.department; // Inherit department from parent
    this.showAddSubTeamModal = true;
  }

  // Filters available members based on search term (not fully integrated with backend for selection).
  filterAvailableMembers(): void {
    if (!this.memberSearchTerm || this.memberSearchTerm.trim() === '') {
      // Show all users not currently in selectedMembers array
      this.availableMembers = this.users.filter(u => !this.selectedMembers.some(sm => sm.id === u.id));
    } else {
      const term = this.memberSearchTerm.toLowerCase();
      this.availableMembers = this.users.filter(member =>
        (member.name?.toLowerCase().includes(term) ||
          member.email?.toLowerCase().includes(term) ||
          member.role?.toLowerCase().includes(term)) &&
        !this.selectedMembers.some(sm => sm.id === member.id)
      );
    }
  }

  // Finds a team by its ID.
  getTeamById(teamId: string | null | undefined): Team | undefined {
    if (!teamId) return undefined;
    return this.teams.find(team => team.id === teamId);
  }

  addSelectedMembers() {
    if (!this.selectedTeamForFilter || !this.selectedMembers.length) return;
    // Example logic: Add selected members to the selected team
    this.selectedMembers.forEach(member => {
      member.team = this.selectedTeamForFilter?.name;
    });
    // Optionally, update the team members list or persist changes
    this.showAddMemberModal = false;
    this.selectedMembers = [];
    // You may want to show a success message or refresh the team members list
  }

  private showToast(message: string, type: 'success' | 'error' | 'warning' | 'info') {
    this.ngZone.run(() => {
      this.toastService.show(message, type);
    });
  }
}