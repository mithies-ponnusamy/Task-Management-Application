// project-management.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { forkJoin } from 'rxjs';
import { 
  faSearch, faFilter, faPlus, faTimes, faExclamationCircle, 
  faExclamationTriangle, faInfoCircle, faFilePdf, faFileWord,
  faTrashAlt, faEdit, faEye, faUsers, faProjectDiagram, faTasks
} from '@fortawesome/free-solid-svg-icons';
import { LocalStorageService } from '../../../core/services/local-storage/local-storage';
import { DialogService } from '../../../core/services/dialog/dialog';
import { ToastService } from '../../../core/services/toast/toast';
import { Auth } from '../../../core/services/auth/auth';

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

  // Tasks for sprint assignment
  availableTasks: any[] = [];
  projectTasks: any[] = [];

  // Loading state
  isLoading: boolean = false;

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
    private authService: Auth
  ) {
    console.log('ProjectManagement constructor - authService:', this.authService);
    // Initialize form groups
    this.projectForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      description: new FormControl('', [Validators.required, Validators.minLength(10)]),
      startDate: new FormControl('', Validators.required),
      endDate: new FormControl('', Validators.required),
      team: new FormControl('', Validators.required),
      manager: new FormControl('', Validators.required),
      priority: new FormControl('medium'),
      budget: new FormControl(10000, [Validators.required, Validators.min(0)]),
      files: new FormControl([]),
      links: new FormControl('')
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
      budget: new FormControl(0, [Validators.required, Validators.min(0)]),
      files: new FormControl([]),
      links: new FormControl('')
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
    this.isLoading = true;
    this.loadInitialData();
    this.applyProjectsFilters();
    this.applySprintsFilters();

    // Add team change listeners for auto-selecting team lead as manager
    this.setupTeamChangeListeners();
  }

  private setupTeamChangeListeners(): void {
    // Listen for team changes in project form
    this.projectForm.get('team')?.valueChanges.subscribe(teamId => {
      if (teamId) {
        this.autoSelectTeamLead(teamId, this.projectForm);
      }
    });

    // Listen for team changes in edit project form
    this.editProjectForm.get('team')?.valueChanges.subscribe(teamId => {
      if (teamId) {
        this.autoSelectTeamLead(teamId, this.editProjectForm);
      }
    });

    // Listen for project changes in sprint forms to load available tasks
    this.sprintForm.get('project')?.valueChanges.subscribe(projectId => {
      if (projectId) {
        this.loadProjectTasks(projectId);
      }
    });

    this.editSprintForm.get('project')?.valueChanges.subscribe(projectId => {
      if (projectId) {
        this.loadProjectTasks(projectId);
      }
    });
  }

  private autoSelectTeamLead(teamId: string, form: FormGroup): void {
    const selectedTeam = this.teams.find(team => (team._id || team.id) === teamId);
    if (selectedTeam && selectedTeam.lead) {
      // Auto-select the team lead as the project manager
      const leadId = selectedTeam.lead._id || selectedTeam.lead.id || selectedTeam.lead;
      form.get('manager')?.setValue(leadId);
    }
  }

  onTeamChange(event: any, form: FormGroup): void {
    const teamId = event.target.value;
    if (teamId) {
      this.autoSelectTeamLead(teamId, form);
    } else {
      // Clear manager selection if no team is selected
      form.get('manager')?.setValue('');
    }
  }

  private loadProjectTasks(projectId: string): void {
    // In a real application, you would load tasks from backend
    // For now, using sample tasks based on project
    const selectedProject = this.projects.find(p => (p.id || p._id) === projectId);
    
    if (selectedProject) {
      // Sample tasks - in production, fetch from backend API
      this.availableTasks = [
        { id: '1', name: 'Design Homepage', projectId: projectId },
        { id: '2', name: 'Develop Frontend', projectId: projectId },
        { id: '3', name: 'API Integration', projectId: projectId },
        { id: '4', name: 'Content Migration', projectId: projectId },
        { id: '5', name: 'UI Design', projectId: projectId },
        { id: '6', name: 'Backend Setup', projectId: projectId },
        { id: '7', name: 'Testing & QA', projectId: projectId },
        { id: '8', name: 'Deployment Setup', projectId: projectId }
      ];
    } else {
      this.availableTasks = [];
    }
  }

  private loadInitialData(): void {
    console.log('Loading initial data for project management...');
    
    // Load data from backend APIs using forkJoin
    forkJoin({
      users: this.authService.adminGetAllUsers(),
      teams: this.authService.adminGetAllTeams(),
      projects: this.authService.adminGetAllProjects(),
      sprints: this.authService.adminGetAllSprints()
    }).subscribe({
      next: (data: any) => {
        console.log('Data loaded successfully:', data);
        
        // Process users
        this.users = data.users.map((user: any) => ({
          id: user._id || user.id,
          _id: user._id || user.id, // Ensure both formats are available
          name: user.name,
          email: user.email,
          role: user.role,
          profileImg: user.profileImg
        }));
        
        // Process teams
        this.teams = data.teams.map((team: any) => ({
          id: team._id || team.id,
          name: team.name,
          department: team.department,
          lead: team.lead?._id || team.lead,
          leadName: team.lead?.name || 'Unknown', // Extract lead name
          members: Array.isArray(team.members) ? team.members.length : (team.memberCount || 0),
          projects: Array.isArray(team.projects) ? team.projects.length : (team.projectCount || 0),
          completionRate: team.completionRate || 0,
          description: team.description,
          leadDetails: team.lead, // Keep full lead details
          memberDetails: team.members, // Keep full member details
          projectDetails: team.projects // Keep full project details
        }));
        
        // Process projects
        this.projects = data.projects.map((project: any) => ({
          id: project._id || project.id,
          name: project.name,
          description: project.description,
          status: project.status,
          priority: project.priority,
          startDate: project.startDate,
          endDate: project.deadline, // Backend uses 'deadline', frontend uses 'endDate'
          deadline: project.deadline,
          team: project.team?._id || project.team,
          teamName: project.team?.name || project.teamDetails?.name || 'Unassigned',
          lead: project.lead?._id || project.lead,
          manager: project.lead?._id || project.lead, // Map lead to manager for frontend
          progress: project.progress || 0,
          teamMembers: project.teamMembers || [],
          createdAt: project.createdAt,
          updatedAt: project.updatedAt
        }));
        
        // Process sprints
        this.sprints = data.sprints.map((sprint: any) => ({
          id: sprint._id || sprint.id,
          name: sprint.name,
          description: sprint.description,
          status: sprint.status,
          startDate: sprint.startDate,
          endDate: sprint.endDate,
          project: sprint.project?._id || sprint.project,
          projectName: sprint.project?.name || 'Unassigned',
          goal: sprint.goal || '', // Backend sends 'goal' (singular)
          goals: sprint.goal ? [sprint.goal] : [], // Frontend compatibility
          progress: sprint.progress || 0,
          tasks: sprint.tasks || [],
          createdAt: sprint.createdAt,
          updatedAt: sprint.updatedAt
        }));

        // Initialize filtered lists
        this.filteredProjects = [...this.projects];
        this.filteredSprints = [...this.sprints];
        
        this.isLoading = false;
        console.log('Processed data:', {
          users: this.users.length,
          teams: this.teams.length,
          projects: this.projects.length,
          sprints: this.sprints.length
        });
      },
      error: (error: any) => {
        console.error('Error loading initial data:', error);
        this.isLoading = false;
        
        // Fallback to localStorage and sample data
        console.log('Falling back to localStorage...');
        this.loadFromLocalStorage();
        
        // Initialize filtered lists
        this.filteredProjects = [...this.projects];
        this.filteredSprints = [...this.sprints];
      }
    });
  }

  private loadFromLocalStorage(): void {
    // Load users from localStorage or initialize with empty array
    this.users = this.localStorage.getUsers<any[]>() || [];
    
    // Load teams (keeping existing method as fallback)
    this.loadTeamsFromAPI();
    
    // Load projects and sprints from localStorage with sample data fallback
    const storedProjects = this.localStorage.getProjects<any[]>();
    const storedSprints = this.localStorage.getSprints<any[]>();
    
    this.projects = storedProjects || this.getSampleProjects();
    this.sprints = storedSprints || this.getSampleSprints();
    
    console.log('Loaded from localStorage:', {
      users: this.users.length,
      projects: this.projects.length,
      sprints: this.sprints.length
    });
  }

  private loadTeamsFromAPI(): void {
    this.authService.adminGetAllTeams().subscribe({
      next: (teams) => {
        this.teams = teams;
        console.log('Teams loaded successfully:', teams);
      },
      error: (err) => {
        console.error('Error loading teams:', err);
        // Fallback to sample data if API fails
        this.teams = [
          { _id: '1', name: 'Development Team', description: 'Frontend and Backend developers' },
          { _id: '2', name: 'Design Team', description: 'UI/UX designers and graphic artists' }
        ];
        this.toastService.show('Using sample team data', 'warning');
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
      const matchesTeam = !this.teamFilter || this.getTeamNameById(project.team) === this.teamFilter;
      
      return matchesSearch && matchesStatus && matchesPriority && matchesTeam;
    });

    this.updateProjectsPagination();
  }

  // Gets team name by ID for display purposes
  getTeamNameById(teamId: string | null | undefined): string {
    if (!teamId) return 'No Team';
    const team = this.teams.find(t => (t._id || t.id) === teamId);
    return team ? team.name : teamId; // Fallback to original value if not found
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

  editProject(projectId: string): void {
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
      this.editSprintForm.patchValue({
        name: this.selectedSprint.name,
        description: this.selectedSprint.description,
        project: this.selectedSprint.project,
        status: this.selectedSprint.status,
        startDate: this.selectedSprint.startDate,
        endDate: this.selectedSprint.endDate,
        goal: this.selectedSprint.goal,
        selectedTasks: this.selectedSprint.tasks.map((task: any) => task.name)
      });
      this.showSprintDetailsModal = true;
    }
  }

  editSprint(sprintId: string): void {
    this.selectedSprint = this.sprints.find(s => s.id === sprintId);
    if (this.selectedSprint) {
      this.editSprintForm.patchValue({
        name: this.selectedSprint.name,
        description: this.selectedSprint.description,
        project: this.selectedSprint.project,
        status: this.selectedSprint.status,
        startDate: this.selectedSprint.startDate,
        endDate: this.selectedSprint.endDate,
        goal: this.selectedSprint.goal,
        selectedTasks: this.selectedSprint.tasks.map((task: any) => task.name)
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
    
    // Use task completion percentage instead of time-based progress to avoid constant recalculation
    if (sprint.tasks && sprint.tasks.length > 0) {
      const completedTasks = sprint.tasks.filter((task: any) => task.status === 'done').length;
      return Math.round((completedTasks / sprint.tasks.length) * 100);
    }
    
    // Fallback to time-based calculation but round to avoid decimal precision issues
    const today = new Date();
    const start = new Date(sprint.startDate);
    const end = new Date(sprint.endDate);
    
    if (today < start) return 0;
    if (today > end) return 100;
    
    const totalDuration = end.getTime() - start.getTime();
    const elapsedDuration = today.getTime() - start.getTime();
    return Math.round((elapsedDuration / totalDuration) * 100);
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
      const filesArray = Array.from(input.files);
      this.projectForm.get('files')?.setValue(filesArray);
    }
  }

  onEditFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const filesArray = Array.from(input.files);
      this.editProjectForm.get('files')?.setValue(filesArray);
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
  }

  // CRUD Operations
  createNewProject(): void {
    if (this.projectForm.invalid) {
      this.markFormGroupTouched(this.projectForm);
      return;
    }
    
    const newProjectData: any = {
      name: this.projectForm.value.name,
      description: this.projectForm.value.description,
      startDate: this.projectForm.value.startDate,
      deadline: this.projectForm.value.endDate, // Backend expects 'deadline' not 'endDate'
      status: 'not-started', // Use backend enum value
      priority: this.projectForm.value.priority
    };

    // Only add team if it's selected
    if (this.projectForm.value.team) {
      newProjectData.team = this.projectForm.value.team;
    }

    // Only add lead if it's selected
    if (this.projectForm.value.manager) {
      newProjectData.lead = this.projectForm.value.manager; // Backend expects 'lead' not 'manager'
    }

    // Only add teamMembers if they exist
    if (this.projectForm.value.teamMembers && this.projectForm.value.teamMembers.length > 0) {
      newProjectData.teamMembers = this.projectForm.value.teamMembers;
    }
    
    console.log('Creating new project with data:', newProjectData);
    console.log('Available users for lead selection:', this.users);
    
    this.authService.adminCreateProject(newProjectData).subscribe({
      next: (createdProject: any) => {
        console.log('Project created successfully:', createdProject);
        
        // Add the new project to local array
        const newProject = {
          id: createdProject._id || createdProject.id,
          name: createdProject.name,
          description: createdProject.description,
          startDate: createdProject.startDate,
          endDate: createdProject.deadline, // Backend sends 'deadline', frontend uses 'endDate'
          deadline: createdProject.deadline,
          team: createdProject.team,
          teamName: createdProject.teamDetails?.name || 'Unassigned',
          lead: createdProject.lead,
          manager: createdProject.lead, // Map lead to manager for frontend compatibility
          status: createdProject.status,
          priority: createdProject.priority,
          progress: createdProject.progress || 0,
          teamMembers: createdProject.teamMembers || [],
          createdAt: createdProject.createdAt,
          updatedAt: createdProject.updatedAt
        };
        
        this.projects.push(newProject);
        this.filteredProjects = [...this.projects];
        this.applyProjectsFilters();
        
        // Trigger teams refresh across all components
        console.log('About to trigger teams refresh via auth service');
        this.authService.triggerTeamsRefresh();
        
        this.showAddProjectModal = false;
        this.projectForm.reset();
        
        // Use setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
          this.toastService.show('Project created successfully!');
        }, 0);
      },
      error: (error: any) => {
        console.error('Error creating project:', error);
        
        // Use setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
          this.toastService.show(error.message || 'Failed to create project', 'error');
        }, 0);
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
    
    const index = this.projects.findIndex(p => p.id === this.selectedProject.id);
    if (index !== -1) {
      const oldTeam = this.projects[index].team;
      const newTeam = this.editProjectForm.value.team;
      
      // Update team project counts if team changed
      if (oldTeam !== newTeam) {
        const teams = this.localStorage.getTeams<any[]>() || [];
        
        // Decrement count for old team
        const oldTeamIndex = teams.findIndex(t => t.name === oldTeam);
        if (oldTeamIndex !== -1) {
          teams[oldTeamIndex].projects = Math.max(0, teams[oldTeamIndex].projects - 1);
        }
        
        // Increment count for new team
        const newTeamIndex = teams.findIndex(t => t.name === newTeam);
        if (newTeamIndex !== -1) {
          teams[newTeamIndex].projects += 1;
        }
        
        this.localStorage.saveTeams(teams);
      }
      
      this.projects[index] = {
        ...this.projects[index],
        name: this.editProjectForm.value.name,
        description: this.editProjectForm.value.description,
        startDate: this.editProjectForm.value.startDate,
        deadline: this.editProjectForm.value.deadline,
        team: newTeam,
        manager: this.editProjectForm.value.manager,
        status: this.editProjectForm.value.status,
        priority: this.editProjectForm.value.priority,
        progress: this.editProjectForm.value.progress,
        budget: this.editProjectForm.value.budget
      };
      
      this.localStorage.saveProjects(this.projects);
      this.filteredProjects = [...this.projects];
      this.applyProjectsFilters();
      this.showEditProjectModal = false;
      this.showProjectDetailsModal = false;
    }

    
  }

  deleteProject(project: any): void {
    if (!project) {
      console.error('Project is null or undefined');
      this.toastService.show('Error: Project not found', 'error');
      return;
    }

    // Ensure project has a valid ID
    const projectId = project.id || project._id;
    if (!projectId) {
      console.error('Project has no valid ID');
      this.toastService.show('Error: Invalid project ID', 'error');
      return;
    }

    this.dialogService.open({
      title: 'Confirm Deletion',
      message: `Are you sure you want to delete project "${project.name}"? This action cannot be undone.`,
      confirmButtonText: 'Delete Project',
      confirmButtonClass: 'bg-red-600 hover:bg-red-700',
      onConfirm: () => this.executeDeleteProject(project)
    });
  }

  private executeDeleteProject(project: any): void {
      const projectId = project.id || project._id;
      this.projects = this.projects.filter(p => (p.id || p._id) !== projectId);
      this.localStorage.saveProjects(this.projects);
      this.applyProjectsFilters();
      this.closeAllModals();
      this.toastService.show(`Project "${project.name}" deleted successfully.`);
  }

  createNewSprint(): void {
    if (this.sprintForm.invalid) {
      this.markFormGroupTouched(this.sprintForm);
      return;
    }
    
    const newSprintData = {
      name: this.sprintForm.value.name,
      description: this.sprintForm.value.description,
      project: this.sprintForm.value.project,
      status: this.sprintForm.value.status || 'upcoming',
      startDate: this.sprintForm.value.startDate,
      endDate: this.sprintForm.value.endDate,
      goal: this.sprintForm.value.goal || '', // Backend expects 'goal' (singular)
      tasks: [] // Start with empty tasks array
    };
    
    console.log('Creating new sprint:', newSprintData);
    
    this.authService.adminCreateSprint(newSprintData).subscribe({
      next: (createdSprint: any) => {
        console.log('Sprint created successfully:', createdSprint);
        
        // Add the new sprint to local array
        const newSprint = {
          id: createdSprint._id || createdSprint.id,
          name: createdSprint.name,
          description: createdSprint.description,
          project: createdSprint.project?._id || createdSprint.project,
          projectName: createdSprint.project?.name || 'Unassigned',
          status: createdSprint.status,
          startDate: createdSprint.startDate,
          endDate: createdSprint.endDate,
          goal: createdSprint.goal || '', // Backend sends 'goal' (singular)
          goals: createdSprint.goal ? [createdSprint.goal] : [], // Frontend compatibility
          progress: createdSprint.progress || 0,
          tasks: createdSprint.tasks || [],
          createdAt: createdSprint.createdAt,
          updatedAt: createdSprint.updatedAt
        };
        
        this.sprints.push(newSprint);
        this.filteredSprints = [...this.sprints];
        this.applySprintsFilters();
        
        this.showAddSprintModal = false;
        this.sprintForm.reset();
        
        // Use setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
          this.toastService.show('Sprint created successfully!');
        }, 0);
      },
      error: (error: any) => {
        console.error('Error creating sprint:', error);
        
        // Use setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
          this.toastService.show(error.message || 'Failed to create sprint', 'error');
        }, 0);
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
    
    const index = this.sprints.findIndex(s => s.id === this.selectedSprint.id);
    if (index !== -1) {
      this.sprints[index] = {
        ...this.sprints[index],
        name: this.editSprintForm.value.name,
        description: this.editSprintForm.value.description,
        project: this.editSprintForm.value.project,
        status: this.editSprintForm.value.status,
        startDate: this.editSprintForm.value.startDate,
        endDate: this.editSprintForm.value.endDate,
        goal: this.editSprintForm.value.goal,
        tasks: this.editSprintForm.value.selectedTasks.map((taskName: string) => ({
          id: 'T' + Math.floor(100 + Math.random() * 900),
          name: taskName,
          assignee: 'Unassigned',
          dueDate: this.editSprintForm.value.endDate,
          status: 'todo',
          priority: 'medium',
          estimatedHours: 0
        }))
      };
      
      this.localStorage.saveSprints(this.sprints);
      this.filteredSprints = [...this.sprints];
      this.applySprintsFilters();
      this.showEditSprintModal = false;
      this.showSprintDetailsModal = false;
    }
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
      this.sprints = this.sprints.filter(s => s.id !== sprint.id);
      this.localStorage.saveSprints(this.sprints);
      this.applySprintsFilters();
      this.closeAllModals();
      this.toastService.show(`Sprint "${sprint.name}" deleted successfully.`);
  }
}