// project-management.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faSearch, faFilter, faPlus, faTimes, faExclamationCircle, 
  faExclamationTriangle, faInfo, faFileWord, faInfoCircle, faFilePdf,
  faTrashAlt, faEdit, faEye, faUsers, faProjectDiagram, faTasks
} from '@fortawesome/free-solid-svg-icons';
import { LocalStorageService } from '../../../core/services/local-storage/local-storage';
import { DialogService } from '../../../core/services/dialog/dialog';
import { ToastService } from '../../../core/services/toast/toast';
import { Auth } from '../../../core/services/auth/auth';
import { Project, User, Team } from '../../../model/user.model';

interface SprintTask {
  id: string;
  name: string;
  assignee: string;
  dueDate: string;
  status: string;
  priority: string;
  estimatedHours: number;
}

@Component({
  selector: 'app-project-management',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule
  ],
  templateUrl: './project-management.html',
  styleUrls: ['./project-management.css']
})
export class ProjectManagement implements OnInit {
  // Font Awesome Icons
  faSearch = faSearch;
  faFilter = faFilter;
  faPlus = faPlus;
  faTimes = faTimes;
  faExclamationCircle = faExclamationCircle;
  faExclamationTriangle = faExclamationTriangle;
  faInfoCircle = faInfoCircle;
  faFilePdf = faFilePdf;
  faFileWord = faFileWord;
  faTrashAlt = faTrashAlt;
  faEye = faEye;
  faEdit = faEdit;
  faUsers = faUsers;
  faProjectDiagram = faProjectDiagram;
  faTasks = faTasks;

  // Form Groups
  projectForm: FormGroup;
  sprintForm: FormGroup;
  editProjectForm: FormGroup;
  editSprintForm: FormGroup;

  // Tabs
  activeTab: string = 'projects';

  // Projects
  projects: any[] = [];
  filteredProjects: any[] = [];
  paginatedProjects: any[] = [];
  
  // Sprints
  sprints: any[] = [];
  filteredSprints: any[] = [];

  // Users and Teams
  users: any[] = [];
  teams: any[] = [];
  teamMembers: any[] = [];

  // Project Filtering
  searchProjectsTerm: string = '';
  statusFilter: string = '';
  priorityFilter: string = '';
  teamFilter: string = '';
  filterProjectsDropdown: boolean = false;

  // Sprint Filtering
  searchSprintsTerm: string = '';
  sprintStatusFilter: string = '';
  sprintProjectFilter: string = '';
  sprintDueDateFilter: string = '';
  filterSprintsDropdown: boolean = false;

  // Enhanced Task Management
  showTaskInput: boolean = false;
  currentSprintTasks: any[] = [];
  newTaskInput: any = {
    name: '',
    assignee: '',
    priority: 'medium',
    estimatedHours: 0,
    description: ''
  };
  presetTasks: string[] = [
    'Design Homepage', 'Develop Frontend', 'API Integration', 
    'Content Migration', 'UI Design', 'Backend Setup',
    'Database Setup', 'Testing', 'Documentation', 'Code Review'
  ];

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  // Modals
  showAddProjectModal: boolean = false;
  showAddSprintModal: boolean = false;
  showProjectDetailsModal: boolean = false;
  showEditProjectModal: boolean = false;
  showSprintDetailsModal: boolean = false;
  showEditSprintModal: boolean = false;

  // Selected Project/Sprint
  selectedProject: any = null;
  selectedSprint: any = null;

  constructor(
    private localStorage: LocalStorageService,
    private dialogService: DialogService,
    private toastService: ToastService,
    private authService: Auth,
    private router: Router
  ) {
    // Initialize form groups
    this.projectForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      description: new FormControl('', [Validators.required, Validators.minLength(10)]),
      startDate: new FormControl('', Validators.required),
      endDate: new FormControl('', Validators.required),
      team: new FormControl('', Validators.required),
      manager: new FormControl('', Validators.required),
      priority: new FormControl('medium'),
      budget: new FormControl(10000, [Validators.required, Validators.min(0)])
    });

    this.sprintForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      description: new FormControl(''),
      project: new FormControl('', Validators.required),
      status: new FormControl('upcoming'),
      startDate: new FormControl('', Validators.required),
      endDate: new FormControl('', Validators.required),
      goal: new FormControl(''),
      selectedTasks: new FormControl([])
    });

    this.editProjectForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      description: new FormControl('', [Validators.required, Validators.minLength(10)]),
      startDate: new FormControl('', Validators.required),
      deadline: new FormControl('', Validators.required),
      team: new FormControl('', Validators.required),
      manager: new FormControl('', Validators.required),
      status: new FormControl('planning'),
      priority: new FormControl('medium'),
      progress: new FormControl(0, [Validators.min(0), Validators.max(100)]),
      budget: new FormControl(0, [Validators.required, Validators.min(0)])
    });

    this.editSprintForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      description: new FormControl(''),
      project: new FormControl('', Validators.required),
      status: new FormControl('upcoming'),
      startDate: new FormControl('', Validators.required),
      endDate: new FormControl('', Validators.required),
      goal: new FormControl(''),
      selectedTasks: new FormControl([])
    });
  }

  ngOnInit(): void {
    this.loadInitialData();
    this.applyProjectsFilters();
    this.applySprintsFilters();
  }

  private loadInitialData(): void {
    // Load users and teams from backend
    this.loadUsers();
    this.loadTeams();
    this.loadProjects();
    
    // Initialize filtered lists
    this.filteredProjects = [...this.projects];
    this.filteredSprints = [...this.sprints];

    // Load sprints from backend
    this.loadSprints();
  }

  private loadSprints(): void {
    this.authService.adminGetAllSprints().subscribe({
      next: (sprints) => {
        this.sprints = sprints;
        this.filteredSprints = [...this.sprints];
        this.applySprintsFilters();
      },
      error: (err) => {
        console.error('Error loading sprints:', err);
        if (err.status === 401) {
          setTimeout(() => {
            this.toastService.show('Session expired. Please log in again.');
            this.router.navigate(['/login']);
          });
          return;
        }
        this.toastService.show(`Failed to load sprints: ${err.message}`, 'error');
        // Fallback to sample data if API fails
        this.sprints = this.getSampleSprints();
        this.filteredSprints = [...this.sprints];
      }
    });
  }

  private loadUsers(): void {
    this.authService.adminGetAllUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (err) => {
        console.error('Error loading users:', err);
        if (err.status === 401) {
          setTimeout(() => {
            this.toastService.show('Session expired. Please log in again.');
            this.router.navigate(['/login']);
          });
          return;
        }
        this.users = this.localStorage.getUsers<any[]>() || [];
        setTimeout(() => {
          this.toastService.show('Using cached user data', 'warning');
        });
      }
    });
  }

  private loadTeams(): void {
    this.authService.adminGetAllTeams().subscribe({
      next: (teams) => {
        this.teams = teams;
      },
      error: (err) => {
        console.error('Error loading teams:', err);
        if (err.status === 401) {
          setTimeout(() => {
            this.toastService.show('Session expired. Please log in again.');
            this.router.navigate(['/login']);
          });
          return;
        }
        this.teams = this.localStorage.getTeams<any[]>() || [];
        setTimeout(() => {
          this.toastService.show('Using cached team data', 'warning');
        });
      }
    });
  }

  private loadProjects(): void {
    this.authService.adminGetAllProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
        this.filteredProjects = [...this.projects];
        this.applyProjectsFilters();
      },
      error: (err) => {
        console.error('Error loading projects:', err);
        if (err.status === 401) {
          setTimeout(() => {
            this.toastService.show('Session expired. Please log in again.');
            this.router.navigate(['/login']);
          });
          return;
        }
        this.projects = this.getSampleProjects();
        this.filteredProjects = [...this.projects];
        setTimeout(() => {
          this.toastService.show('Using sample project data', 'warning');
        });
      }
    });
  }

  

  private getSampleProjects(): any[] {
    return [
      {
        id: 'P1001',
        name: 'Website Redesign',
        description: 'Complete redesign of company website with modern UI/UX and improved performance',
        startDate: '2023-05-01',
        deadline: '2023-07-15',
        team: 'Development Team',
        manager: 'John Doe',
        status: 'in-progress',
        priority: 'high',
        progress: 65,
        budget: 10000,
        stats: {
          tasksCompleted: 1,
          totalTasks: 4,
          timeSpent: 120,
          estimatedTime: 200,
          budgetUsed: 5000,
          totalBudget: 10000
        },
        sprints: [
          {
            id: 'S101',
            name: 'UI Design',
            project: 'Website Redesign',
            startDate: '2023-05-01',
            endDate: '2023-05-14',
            status: 'completed',
            goal: 'Complete all UI designs for the website',
            description: 'This sprint focuses on creating all the UI designs for the website redesign project.',
            tasks: [
              { id: 'T101', name: 'Design Homepage', assignee: 'Jane Smith', dueDate: '2023-05-05', status: 'done', priority: 'high', estimatedHours: 20 },
              { id: 'T102', name: 'Design Product Pages', assignee: 'Jane Smith', dueDate: '2023-05-10', status: 'done', priority: 'medium', estimatedHours: 15 },
              { id: 'T103', name: 'Design Admin Dashboard', assignee: 'Mike Johnson', dueDate: '2023-05-12', status: 'done', priority: 'low', estimatedHours: 10 }
            ],
            stats: {
              tasksCompleted: 3,
              totalTasks: 3,
              timeSpent: 45,
              estimatedTime: 45
            }
          },
          {
            id: 'S102',
            name: 'Frontend Development',
            project: 'Website Redesign',
            startDate: '2023-05-15',
            endDate: '2023-05-28',
            status: 'active',
            goal: 'Implement all frontend components',
            description: 'This sprint focuses on developing the frontend based on the designs.',
            tasks: [
              { id: 'T201', name: 'Develop Homepage', assignee: 'Emily Davis', dueDate: '2023-05-20', status: 'in-progress', priority: 'high', estimatedHours: 30 },
              { id: 'T202', name: 'Develop Product Pages', assignee: 'Emily Davis', dueDate: '2023-05-25', status: 'todo', priority: 'medium', estimatedHours: 25 }
            ],
            stats: {
              tasksCompleted: 0,
              totalTasks: 2,
              timeSpent: 15,
              estimatedTime: 55
            }
          }
        ]
      },
      {
        id: 'P1002',
        name: 'Mobile App Development',
        description: 'Development of a cross-platform mobile application for iOS and Android',
        startDate: '2023-06-01',
        deadline: '2023-09-30',
        team: 'Development Team',
        manager: 'John Doe',
        status: 'planning',
        priority: 'medium',
        progress: 10,
        budget: 15000,
        stats: {
          tasksCompleted: 2,
          totalTasks: 15,
          timeSpent: 40,
          estimatedTime: 400,
          budgetUsed: 2000,
          totalBudget: 15000
        },
        sprints: []
      }
    ];
  }

  private getSampleSprints(): any[] {
    return [
      {
        id: 'S101',
        name: 'UI Design',
        project: 'Website Redesign',
        startDate: '2023-05-01',
        endDate: '2023-05-14',
        status: 'completed',
        goal: 'Complete all UI designs for the website',
        description: 'This sprint focuses on creating all the UI designs for the website redesign project.',
        tasks: [
          { id: 'T101', name: 'Design Homepage', assignee: 'Jane Smith', dueDate: '2023-05-05', status: 'done', priority: 'high', estimatedHours: 20 },
          { id: 'T102', name: 'Design Product Pages', assignee: 'Jane Smith', dueDate: '2023-05-10', status: 'done', priority: 'medium', estimatedHours: 15 },
          { id: 'T103', name: 'Design Admin Dashboard', assignee: 'Mike Johnson', dueDate: '2023-05-12', status: 'done', priority: 'low', estimatedHours: 10 }
        ],
        stats: {
          tasksCompleted: 3,
          totalTasks: 3,
          timeSpent: 45,
          estimatedTime: 45
        }
      },
      {
        id: 'S102',
        name: 'Frontend Development',
        project: 'Website Redesign',
        startDate: '2023-05-15',
        endDate: '2023-05-28',
        status: 'active',
        goal: 'Implement all frontend components',
        description: 'This sprint focuses on developing the frontend based on the designs.',
        tasks: [
          { id: 'T201', name: 'Develop Homepage', assignee: 'Emily Davis', dueDate: '2023-05-20', status: 'in-progress', priority: 'high', estimatedHours: 30 },
          { id: 'T202', name: 'Develop Product Pages', assignee: 'Emily Davis', dueDate: '2023-05-25', status: 'todo', priority: 'medium', estimatedHours: 25 }
        ],
        stats: {
          tasksCompleted: 0,
          totalTasks: 2,
          timeSpent: 15,
          estimatedTime: 55
        }
      }
    ];
  }

  // Tab Navigation
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  // Project Methods
  applyProjectsFilters(): void {
    this.filteredProjects = this.projects.filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(this.searchProjectsTerm.toLowerCase()) || 
                          project.description.toLowerCase().includes(this.searchProjectsTerm.toLowerCase());
      const matchesStatus = !this.statusFilter || project.status === this.statusFilter;
      const matchesPriority = !this.priorityFilter || project.priority === this.priorityFilter;
      const matchesTeam = !this.teamFilter || project.team === this.teamFilter;
      
      return matchesSearch && matchesStatus && matchesPriority && matchesTeam;
    });

    this.updateProjectsPagination();
  }

  toggleProjectsFilter(): void {
    this.filterProjectsDropdown = !this.filterProjectsDropdown;
  }

  resetProjectsFilters(): void {
    this.searchProjectsTerm = '';
    this.statusFilter = '';
    this.priorityFilter = '';
    this.teamFilter = '';
    this.applyProjectsFilters();
  }

  openAddProjectModal(): void {
    this.projectForm.reset({
      priority: 'medium',
      budget: 10000
    });
    this.showAddProjectModal = true;
  }

  viewProjectDetails(projectId: string): void {
    this.selectedProject = this.projects.find(p => p.id === projectId);
    if (this.selectedProject) {
      this.editProjectForm.patchValue({
        name: this.selectedProject.name,
        description: this.selectedProject.description,
        startDate: this.selectedProject.startDate,
        deadline: this.selectedProject.deadline,
        team: this.selectedProject.team,
        manager: this.selectedProject.manager,
        status: this.selectedProject.status,
        priority: this.selectedProject.priority,
        progress: this.selectedProject.progress,
        budget: this.selectedProject.budget
      });
      this.showProjectDetailsModal = true;
    }
  }

  viewProject(projectId: string): void {
    this.selectedProject = this.projects.find(p => p.id === projectId);
    if (this.selectedProject) {
      this.editProjectForm.patchValue({
        name: this.selectedProject.name,
        description: this.selectedProject.description,
        startDate: this.selectedProject.startDate,
        deadline: this.selectedProject.deadline,
        team: this.selectedProject.team,
        manager: this.selectedProject.lead,
        status: this.selectedProject.status,
        priority: this.selectedProject.priority,
        progress: this.selectedProject.progress,
        budget: this.selectedProject.budget
      });
      this.showProjectDetailsModal = true;
    }
  }

  editProject(projectId: string): void {
    this.selectedProject = this.projects.find(p => p.id === projectId);
    if (this.selectedProject) {
      this.editProjectForm.patchValue({
        name: this.selectedProject.name,
        description: this.selectedProject.description,
        startDate: this.selectedProject.startDate,
        deadline: this.selectedProject.deadline,
        team: this.selectedProject.team,
        manager: this.selectedProject.lead,
        status: this.selectedProject.status,
        priority: this.selectedProject.priority,
        progress: this.selectedProject.progress,
        budget: this.selectedProject.budget
      });
      this.showEditProjectModal = true;
    }
  }

  // Sprint Methods
  applySprintsFilters(): void {
    this.filteredSprints = this.sprints.filter(sprint => {
      const matchesSearch = sprint.name.toLowerCase().includes(this.searchSprintsTerm.toLowerCase()) || 
                          sprint.description?.toLowerCase().includes(this.searchSprintsTerm.toLowerCase());
      const matchesStatus = !this.sprintStatusFilter || sprint.status === this.sprintStatusFilter;
      const matchesProject = !this.sprintProjectFilter || sprint.project === this.sprintProjectFilter;
      
      let matchesDueDate = true;
      if (this.sprintDueDateFilter) {
        const today = new Date();
        const endDate = new Date(sprint.endDate);
        
        if (this.sprintDueDateFilter === 'today') {
          matchesDueDate = endDate.toDateString() === today.toDateString();
        } else if (this.sprintDueDateFilter === 'week') {
          const nextWeek = new Date(today);
          nextWeek.setDate(today.getDate() + 7);
          matchesDueDate = endDate >= today && endDate <= nextWeek;
        } else if (this.sprintDueDateFilter === 'overdue') {
          matchesDueDate = endDate < today && sprint.status !== 'completed';
        }
      }
      
      return matchesSearch && matchesStatus && matchesProject && matchesDueDate;
    });
  }

  resetSprintsFilters(): void {
    this.searchSprintsTerm = '';
    this.sprintStatusFilter = '';
    this.sprintProjectFilter = '';
    this.sprintDueDateFilter = '';
    this.applySprintsFilters();
  }

  viewSprintDetails(sprintId: string): void {
    this.selectedSprint = this.sprints.find(s => s.id === sprintId);
    if (this.selectedSprint) {
      this.currentSprintTasks = [...(this.selectedSprint.tasks || [])];
      this.editSprintForm.patchValue({
        name: this.selectedSprint.name,
        description: this.selectedSprint.description,
        project: this.selectedSprint.project,
        status: this.selectedSprint.status,
        startDate: this.selectedSprint.startDate,
        endDate: this.selectedSprint.endDate,
        goal: this.selectedSprint.goal
      });
      this.showSprintDetailsModal = true;
    }
  }

  editSprint(sprintId: string): void {
    this.selectedSprint = this.sprints.find(s => s.id === sprintId);
    if (this.selectedSprint) {
      this.currentSprintTasks = [...(this.selectedSprint.tasks || [])];
      this.editSprintForm.patchValue({
        name: this.selectedSprint.name,
        description: this.selectedSprint.description,
        project: this.selectedSprint.project,
        status: this.selectedSprint.status,
        startDate: this.selectedSprint.startDate,
        endDate: this.selectedSprint.endDate,
        goal: this.selectedSprint.goal
      });
      this.showEditSprintModal = true;
    }
  }

  // Pagination Methods
  updateProjectsPagination(): void {
    this.totalPages = Math.ceil(this.filteredProjects.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProjects = this.filteredProjects.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateProjectsPagination();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  getToEntryNumber(): number {
    const end = this.currentPage * this.itemsPerPage;
    return end > this.filteredProjects.length ? this.filteredProjects.length : end;
  }

  // Utility Methods
  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'planning':
        return 'bg-yellow-100 text-yellow-800';
      case 'on-hold':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getPriorityIcon(priority: string): string {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  }

  getInitials(name: string): string {
    if (!name) return '';
    const parts = name.split(' ');
    return parts.map(part => part[0]).join('').toUpperCase();
  }

  calculateDaysRemaining(endDate: string): number {
    if (!endDate) return 0;
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  calculateSprintProgress(sprint: any): number {
    if (!sprint) return 0;
    const today = new Date();
    const start = new Date(sprint.startDate);
    const end = new Date(sprint.endDate);
    
    if (today < start) return 0;
    if (today > end) return 100;
    
    const totalDuration = end.getTime() - start.getTime();
    const elapsedDuration = today.getTime() - start.getTime();
    return (elapsedDuration / totalDuration) * 100;
  }

  // Form Helper Methods
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // File Handling
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      // Handle file upload logic here
    }
  }

  // Modal Methods
  closeAllModals(): void {
    this.showAddProjectModal = false;
    this.showAddSprintModal = false;
    this.showProjectDetailsModal = false;
    this.showEditProjectModal = false;
    this.showSprintDetailsModal = false;
    this.showEditSprintModal = false;
    // Reset task-related state
    this.currentSprintTasks = [];
    this.showTaskInput = false;
    this.resetTaskInput();
  }

  // CRUD Operations
  createNewProject(): void {
    if (this.projectForm.invalid) {
      this.markFormGroupTouched(this.projectForm);
      return;
    }
    
    // Find team by name to get its ID
    const selectedTeamName = this.projectForm.value.team;
    const selectedTeam = this.teams.find(team => team.name === selectedTeamName);
    if (!selectedTeam) {
      setTimeout(() => {
        this.toastService.show('Selected team not found. Please refresh and try again.');
      });
      return;
    }

    // Find lead by name to get their ID
    const selectedLeadName = this.projectForm.value.manager;
    const selectedLead = this.users.find(user => user.name === selectedLeadName);
    if (!selectedLead) {
      setTimeout(() => {
        this.toastService.show('Selected manager not found. Please refresh and try again.');
      });
      return;
    }
    
    const newProject = {
      name: this.projectForm.value.name,
      description: this.projectForm.value.description,
      startDate: this.projectForm.value.startDate,
      deadline: this.projectForm.value.endDate,
      team: selectedTeam.id, // Send team ID instead of name
      lead: selectedLead.id, // Send lead ID instead of name
      status: 'not-started' as const,
      priority: this.projectForm.value.priority,
      progress: 0,
      budget: this.projectForm.value.budget || 0
    };
    
    this.authService.adminCreateProject(newProject).subscribe({
      next: (createdProject) => {
        const mappedProject = this.authService.mapApiProjectToProject(createdProject);
        this.projects.push(mappedProject);
        this.filteredProjects = [...this.projects];
        this.applyProjectsFilters();
        this.showAddProjectModal = false;
        this.projectForm.reset();
        // Defer toast notification to avoid ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
          this.toastService.show('Project created successfully!');
        });
      },
      error: (error) => {
        console.error('Error creating project:', error);
        const errorMessage = error.error?.message || 'Error creating project. Please try again.';
        // Defer error toast as well
        setTimeout(() => {
          this.toastService.show(errorMessage);
        });
      }
    });
  }

  updateProject(): void {
    if (this.editProjectForm.invalid) {
      this.markFormGroupTouched(this.editProjectForm);
      return;
    }
    
    this.dialogService.open({
        title: 'Confirm Project Update',
        message: `Are you sure you want to save changes to "${this.selectedProject.name}"?`,
        onConfirm: () => this.executeProjectUpdate()
    });
  }


  executeProjectUpdate(): void {
    if (this.editProjectForm.invalid) {
      this.markFormGroupTouched(this.editProjectForm);
      return;
    }
    
    // Find team by name to get its ID
    const selectedTeamName = this.editProjectForm.value.team;
    const selectedTeam = this.teams.find(team => team.name === selectedTeamName);
    if (!selectedTeam) {
      setTimeout(() => {
        this.toastService.show('Selected team not found. Please refresh and try again.');
      });
      return;
    }

    // Find lead by name to get their ID
    const selectedLeadName = this.editProjectForm.value.manager;
    const selectedLead = this.users.find(user => user.name === selectedLeadName);
    if (!selectedLead) {
      setTimeout(() => {
        this.toastService.show('Selected manager not found. Please refresh and try again.');
      });
      return;
    }
    
    const updateData = {
      name: this.editProjectForm.value.name,
      description: this.editProjectForm.value.description,
      startDate: this.editProjectForm.value.startDate,
      deadline: this.editProjectForm.value.deadline,
      team: selectedTeam.id, // Send team ID instead of name
      lead: selectedLead.id, // Send lead ID instead of name
      status: this.editProjectForm.value.status,
      priority: this.editProjectForm.value.priority,
      progress: this.editProjectForm.value.progress,
      budget: this.editProjectForm.value.budget
    };
    
    this.authService.adminUpdateProject(this.selectedProject.id, updateData).subscribe({
      next: (updatedProject) => {
        const mappedProject = this.authService.mapApiProjectToProject(updatedProject);
        const index = this.projects.findIndex(p => p.id === this.selectedProject.id);
        if (index !== -1) {
          this.projects[index] = mappedProject;
          this.filteredProjects = [...this.projects];
          this.applyProjectsFilters();
          this.showEditProjectModal = false;
          this.showProjectDetailsModal = false;
          // Defer toast notification to avoid ExpressionChangedAfterItHasBeenCheckedError
          setTimeout(() => {
            this.toastService.show('Project updated successfully!');
          });
        }
      },
      error: (error) => {
        console.error('Error updating project:', error);
        const errorMessage = error.error?.message || 'Error updating project. Please try again.';
        // Defer error toast as well
        setTimeout(() => {
          this.toastService.show(errorMessage);
        });
      }
    });
  }

  deleteProject(project: any): void {
      this.dialogService.open({
          title: 'Confirm Deletion',
          message: `Are you sure you want to delete project "${project.name}"? This action cannot be undone.`,
          confirmButtonText: 'Delete Project',
          confirmButtonClass: 'bg-red-600 hover:bg-red-700',
          onConfirm: () => this.executeDeleteProject(project)
      });
  }

  private executeDeleteProject(project: any): void {
    this.authService.adminDeleteProject(project.id).subscribe({
      next: () => {
        this.projects = this.projects.filter(p => p.id !== project.id);
        this.filteredProjects = [...this.projects];
        this.applyProjectsFilters();
        this.closeAllModals();
        // Defer toast notification to avoid ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
          this.toastService.show(`Project "${project.name}" deleted successfully.`);
        });
      },
      error: (error) => {
        console.error('Error deleting project:', error);
        const errorMessage = error.error?.message || 'Error deleting project. Please try again.';
        // Defer error toast as well
        setTimeout(() => {
          this.toastService.show(errorMessage);
        });
      }
    });
  }

  createNewSprint(): void {
    if (this.sprintForm.invalid) {
      this.markFormGroupTouched(this.sprintForm);
      return;
    }
    
    const sprintData = {
      name: this.sprintForm.value.name,
      description: this.sprintForm.value.description,
      project: this.sprintForm.value.project,
      status: this.sprintForm.value.status,
      startDate: this.sprintForm.value.startDate,
      endDate: this.sprintForm.value.endDate,
      goal: this.sprintForm.value.goal,
      tasks: this.currentSprintTasks.map(task => ({
        id: task.id || `T${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: task.name,
        assignee: task.assignee || (this.users[0]?.id || ''),
        dueDate: this.sprintForm.value.endDate,
        status: task.status || 'todo' as 'todo' | 'in-progress' | 'done',
        priority: task.priority || 'medium' as 'low' | 'medium' | 'high',
        estimatedHours: task.estimatedHours || 0,
        description: task.description || ''
      }))
    };
    
    this.authService.adminCreateSprint(sprintData).subscribe({
      next: (newSprint) => {
        this.sprints.push(newSprint);
        this.filteredSprints = [...this.sprints];
        this.applySprintsFilters();
        this.showAddSprintModal = false;
        this.sprintForm.reset();
        this.currentSprintTasks = []; // Reset task list
        setTimeout(() => {
          this.toastService.show(`Sprint "${newSprint.name}" created successfully.`);
        });
      },
      error: (error) => {
        console.error('Error creating sprint:', error);
        const errorMessage = error.message || 'Error creating sprint. Please try again.';
        setTimeout(() => {
          this.toastService.show(errorMessage, 'error');
        });
      }
    });
  }

  updateSprint(): void {
    if (this.editSprintForm.invalid) { /* ... */ return; }
    
    this.dialogService.open({
        title: 'Confirm Sprint Update',
        message: `Are you sure you want to save changes to "${this.selectedSprint.name}"?`,
        onConfirm: () => this.executeSprintUpdate()
    });
  }

  executeSprintUpdate(): void {
    if (this.editSprintForm.invalid) {
      this.markFormGroupTouched(this.editSprintForm);
      return;
    }
    
    const sprintData = {
      name: this.editSprintForm.value.name,
      description: this.editSprintForm.value.description,
      project: this.editSprintForm.value.project,
      status: this.editSprintForm.value.status,
      startDate: this.editSprintForm.value.startDate,
      endDate: this.editSprintForm.value.endDate,
      goal: this.editSprintForm.value.goal,
      tasks: this.currentSprintTasks.map(task => ({
        id: task.id || `T${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: task.name,
        assignee: task.assignee || (this.users[0]?.id || ''),
        dueDate: this.editSprintForm.value.endDate,
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        estimatedHours: task.estimatedHours || 0,
        description: task.description || ''
      }))
    };
    
    this.authService.adminUpdateSprint(this.selectedSprint.id, sprintData).subscribe({
      next: (updatedSprint) => {
        const index = this.sprints.findIndex(s => s.id === this.selectedSprint.id);
        if (index !== -1) {
          this.sprints[index] = updatedSprint;
          this.filteredSprints = [...this.sprints];
          this.applySprintsFilters();
          this.showEditSprintModal = false;
          this.showSprintDetailsModal = false;
          this.currentSprintTasks = []; // Reset task list
          setTimeout(() => {
            this.toastService.show(`Sprint "${updatedSprint.name}" updated successfully.`);
          });
        }
      },
      error: (error) => {
        console.error('Error updating sprint:', error);
        const errorMessage = error.message || 'Error updating sprint. Please try again.';
        setTimeout(() => {
          this.toastService.show(errorMessage, 'error');
        });
      }
    });
  }

  deleteSprint(sprint: any): void {
      this.dialogService.open({
          title: 'Confirm Deletion',
          message: `Are you sure you want to delete sprint "${sprint.name}"?`,
          confirmButtonText: 'Delete Sprint',
          confirmButtonClass: 'bg-red-600 hover:bg-red-700',
          onConfirm: () => this.executeDeleteSprint(sprint)
      });
  }
  
  private executeDeleteSprint(sprint: any): void {
    this.authService.adminDeleteSprint(sprint.id).subscribe({
      next: () => {
        this.sprints = this.sprints.filter(s => s.id !== sprint.id);
        this.filteredSprints = [...this.sprints];
        this.applySprintsFilters();
        this.closeAllModals();
        setTimeout(() => {
          this.toastService.show(`Sprint "${sprint.name}" deleted successfully.`);
        });
      },
      error: (error) => {
        console.error('Error deleting sprint:', error);
        const errorMessage = error.message || 'Error deleting sprint. Please try again.';
        setTimeout(() => {
          this.toastService.show(errorMessage, 'error');
        });
      }
    });
  }

  // Team selection handlers for auto-populating project manager
  onTeamSelected(event: any): void {
    const selectedTeamName = event.target.value;
    if (selectedTeamName) {
      const selectedTeam = this.teams.find(team => team.name === selectedTeamName);
      if (selectedTeam && selectedTeam.leadDetails) {
        // Auto-select the team lead as project manager
        this.projectForm.patchValue({
          manager: selectedTeam.leadDetails.name
        });
      }
    } else {
      // Clear manager field if no team is selected
      this.projectForm.patchValue({
        manager: ''
      });
    }
  }

  onEditTeamSelected(event: any): void {
    const selectedTeamName = event.target.value;
    if (selectedTeamName) {
      const selectedTeam = this.teams.find(team => team.name === selectedTeamName);
      if (selectedTeam && selectedTeam.leadDetails) {
        // Auto-select the team lead as project manager
        this.editProjectForm.patchValue({
          manager: selectedTeam.leadDetails.name
        });
      }
    } else {
      // Clear manager field if no team is selected
      this.editProjectForm.patchValue({
        manager: ''
      });
    }
  }

  // Enhanced Task Management Methods
  addNewTask(): void {
    this.showTaskInput = true;
    this.resetTaskInput();
  }

  cancelTaskInput(): void {
    this.showTaskInput = false;
    this.resetTaskInput();
  }

  saveNewTask(): void {
    if (!this.newTaskInput.name.trim()) return;

    const task = {
      id: `T${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: this.newTaskInput.name.trim(),
      assignee: this.newTaskInput.assignee || '',
      priority: this.newTaskInput.priority,
      estimatedHours: this.newTaskInput.estimatedHours || 0,
      description: this.newTaskInput.description.trim(),
      status: 'todo'
    };

    this.currentSprintTasks.push(task);
    this.showTaskInput = false;
    this.resetTaskInput();
  }

  removeSprintTask(index: number): void {
    this.currentSprintTasks.splice(index, 1);
  }

  addPresetTask(taskName: string): void {
    const task = {
      id: `T${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: taskName,
      assignee: '',
      priority: 'medium',
      estimatedHours: 0,
      description: '',
      status: 'todo'
    };
    this.currentSprintTasks.push(task);
  }

  resetTaskInput(): void {
    this.newTaskInput = {
      name: '',
      assignee: '',
      priority: 'medium',
      estimatedHours: 0,
      description: ''
    };
  }

  getUserName(userId: string): string {
    const user = this.users.find(u => u.id === userId);
    return user ? user.name : '';
  }
}