import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faPlus, faEdit, faTrash, faEye, faFilter, faSearch, 
  faTasks, faProjectDiagram, faUsers, faCalendarAlt,
  faClock, faFlag, faSave, faTimes, faUser
} from '@fortawesome/free-solid-svg-icons';
import { Auth } from '../../../core/services/auth/auth';
import { ToastService } from '../../../core/services/toast/toast';
import { DialogService } from '../../../core/services/dialog/dialog';
import { Task, Project, Sprint, User } from '../../../model/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-lead-task-management',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './task-management.html',
  styleUrls: ['./task-management.css']
})
export class TaskManagementComponent implements OnInit, OnDestroy {
  // Font Awesome icons
  faPlus = faPlus;
  faEdit = faEdit;
  faTrash = faTrash;
  faEye = faEye;
  faFilter = faFilter;
  faSearch = faSearch;
  faTasks = faTasks;
  faProjectDiagram = faProjectDiagram;
  faUsers = faUsers;
  faCalendarAlt = faCalendarAlt;
  faClock = faClock;
  faFlag = faFlag;
  faSave = faSave;
  faTimes = faTimes;
  faUser = faUser;

  // Data properties
  tasks: Task[] = [];
  projects: Project[] = [];
  sprints: Sprint[] = [];
  allSprints: Sprint[] = []; // Keep original list of all sprints
  filteredSprints: Sprint[] = []; // Filtered sprints for the selected project
  teamMembers: User[] = [];
  filteredTasks: Task[] = [];

  // Modal states
  showCreateTaskModal = false;
  showEditTaskModal = false;
  showTaskDetailsModal = false;

  // Form data
  newTask: Partial<Task> = this.initializeTask();
  editingTask: Task | null = null;
  selectedTask: Task | null = null;

  // Filter options
  filterProject = '';
  filterSprint = '';
  filterStatus = '';
  filterAssignee = '';
  searchQuery = '';
  
  // Properties expected by HTML template
  selectedProject = '';
  selectedSprint = '';
  selectedStatus = '';
  selectedAssignee = '';
  
  // Task statuses and priorities for HTML template
  taskStatuses = [
    { value: 'todo', label: 'To Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'review', label: 'In Review' },
    { value: 'done', label: 'Done' }
  ];
  
  priorities = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' }
  ];
  
  // Additional properties for template
  isCreatingTask = false;

  // View mode toggle
  viewMode: 'list' | 'board' = 'list';

  // Board Properties
  boardColumns: { id: string; title: string; tasks: Task[] }[] = [
    { id: 'todo', title: 'To Do', tasks: [] },
    { id: 'in-progress', title: 'In Progress', tasks: [] },
    { id: 'review', title: 'Review', tasks: [] },
    { id: 'done', title: 'Done', tasks: [] }
  ];

  // Loading states
  isLoading = false;
  isSubmitting = false;

  // Form errors
  taskFormErrors: any = {};

  private subscriptions: Subscription[] = [];

  constructor(
    private authService: Auth,
    private toastService: ToastService,
    private dialogService: DialogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private loadInitialData(): void {
    this.isLoading = true;
    
    // Load projects first, then load other data
    const projectsSub = this.authService.leadGetProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
        this.loadTasks();
        this.loadTeamMembers();
        this.loadSprints();
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        this.toastService.show('Failed to load projects', 'error');
        this.isLoading = false;
      }
    });

    this.subscriptions.push(projectsSub);
  }

  private loadTasks(): void {
    const tasksSub = this.authService.leadGetTasks().subscribe({
      next: (tasks) => {
        console.log('DEBUG: Raw tasks from API:', tasks);
        this.tasks = tasks;
        
        // Debug first task structure
        if (tasks && tasks.length > 0) {
          console.log('DEBUG: First task structure:', tasks[0]);
          console.log('DEBUG: Task ID fields:', {
            id: tasks[0].id,
            _id: tasks[0]._id,
            assignee: tasks[0].assignee,
            project: tasks[0].project,
            projectId: tasks[0].projectId
          });
        }
        
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        this.toastService.show('Failed to load tasks', 'error');
        this.isLoading = false;
      }
    });

    this.subscriptions.push(tasksSub);
  }

  private loadTeamMembers(): void {
    // Instead of getting all available users, get only the team members
    const teamSub = this.authService.leadGetTeam().subscribe({
      next: (teamData: any) => {
        console.log('DEBUG: Team data:', teamData);
        this.teamMembers = teamData.members || [];
        console.log('DEBUG: Team members for assignee dropdown:', this.teamMembers);
      },
      error: (error: any) => {
        console.error('Error loading team members:', error);
        // Fallback to available users if team loading fails
        const membersSub = this.authService.leadGetAvailableUsers().subscribe({
          next: (members: User[]) => {
            this.teamMembers = members;
          },
          error: (fallbackError: any) => {
            console.error('Error loading available users as fallback:', fallbackError);
          }
        });
        this.subscriptions.push(membersSub);
      }
    });

    this.subscriptions.push(teamSub);
  }

  private loadSprints(): void {
    if (this.projects.length > 0) {
      // For now, load sprints for all projects. In a real app, you might want to optimize this.
      const sprintsSub = this.authService.leadGetSprints().subscribe({
        next: (sprints) => {
          // Process sprints to ensure projectId is available for frontend use
          this.sprints = sprints.map(sprint => ({
            ...sprint,
            id: sprint._id || sprint.id,
            projectId: typeof sprint.project === 'string' ? sprint.project : (sprint.project as any)?._id || (sprint.project as any)?.id
          }));
          
          // Store the complete list for filtering
          this.allSprints = [...this.sprints];
          this.filteredSprints = []; // Initially no project selected, so no sprints shown
        },
        error: (error) => {
          console.error('Error loading sprints:', error);
        }
      });

      this.subscriptions.push(sprintsSub);
    }
  }

  // Task CRUD operations
  createTask(): void {
    if (!this.validateTaskForm(this.newTask)) {
      return;
    }

    this.isSubmitting = true;
    const createSub = this.authService.leadCreateTask(this.newTask).subscribe({
      next: (task) => {
        this.tasks.push(task);
        this.applyFilters();
        this.toastService.show('Task created successfully', 'success');
        this.closeCreateTaskModal();
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Error creating task:', error);
        this.toastService.show('Failed to create task', 'error');
        this.isSubmitting = false;
      }
    });

    this.subscriptions.push(createSub);
  }

  editTask(task: Task): void {
    this.editingTask = { ...task };
    this.showEditTaskModal = true;
  }

  updateTask(): void {
    if (!this.editingTask || !this.validateTaskForm(this.editingTask)) {
      return;
    }

    this.isSubmitting = true;
    const updateSub = this.authService.leadUpdateTask(this.editingTask.id, this.editingTask).subscribe({
      next: (updatedTask) => {
        const index = this.tasks.findIndex(t => t.id === updatedTask.id);
        if (index !== -1) {
          this.tasks[index] = updatedTask;
          this.applyFilters();
        }
        this.toastService.show('Task updated successfully', 'success');
        this.closeEditTaskModal();
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Error updating task:', error);
        this.toastService.show('Failed to update task', 'error');
        this.isSubmitting = false;
      }
    });

    this.subscriptions.push(updateSub);
  }

  confirmDeleteTask(task: Task): void {
    this.dialogService.open({
      title: 'Delete Task',
      message: `Are you sure you want to delete "${task.title}"? This action cannot be undone.`,
      onConfirm: () => this.deleteTask(task._id || task.id)
    });
  }

  deleteTask(taskId: string): void {
    if (!taskId) {
      this.toastService.show('Invalid task ID', 'error');
      return;
    }
    
    const deleteSub = this.authService.leadDeleteTask(taskId).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(t => (t._id || t.id) !== taskId);
        this.applyFilters();
        this.toastService.show('Task deleted successfully', 'success');
      },
      error: (error) => {
        console.error('Error deleting task:', error);
        this.toastService.show('Failed to delete task', 'error');
      }
    });

    this.subscriptions.push(deleteSub);
  }

  viewTaskDetails(task: Task): void {
    this.selectedTask = task;
    this.showTaskDetailsModal = true;
  }

  // Filtering and search
  applyFilters(): void {
    this.filteredTasks = this.tasks.filter(task => {
      const matchesProject = !this.filterProject || task.projectId === this.filterProject;
      const matchesSprint = !this.filterSprint || task.sprintId === this.filterSprint;
      const matchesStatus = !this.filterStatus || task.status === this.filterStatus;
      const matchesAssignee = !this.filterAssignee || task.assignee === this.filterAssignee;
      const matchesSearch = !this.searchQuery || 
        task.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(this.searchQuery.toLowerCase());

      return matchesProject && matchesSprint && matchesStatus && matchesAssignee && matchesSearch;
    });

    // Update board view if in board mode
    if (this.viewMode === 'board') {
      this.organizeBoardTasks();
    }
  }

  clearFilters(): void {
    this.filterProject = '';
    this.filterSprint = '';
    this.filterStatus = '';
    this.filterAssignee = '';
    this.searchQuery = '';
    this.applyFilters();
  }

  // Navigation methods
  openCreateTaskModal(): void {
    // Navigate to create task component instead of opening modal
    this.router.navigate(['/lead/tasks/create']);
  }

  closeCreateTaskModal(): void {
    this.showCreateTaskModal = false;
    this.newTask = this.initializeTask();
    this.taskFormErrors = {};
  }

  closeEditTaskModal(): void {
    this.showEditTaskModal = false;
    this.editingTask = null;
    this.taskFormErrors = {};
  }

  closeTaskDetailsModal(): void {
    this.showTaskDetailsModal = false;
    this.selectedTask = null;
  }

  // Helper methods
  private initializeTask(): Partial<Task> {
    return {
      title: '',
      description: '',
      projectId: '',
      sprintId: '',
      assignee: '',
      priority: 'medium',
      status: 'todo',
      dueDate: undefined,
      storyPoints: 1
    };
  }

  private validateTaskForm(task: Partial<Task>): boolean {
    this.taskFormErrors = {};
    let isValid = true;

    if (!task.title || task.title.trim() === '') {
      this.taskFormErrors.title = 'Title is required';
      isValid = false;
    }

    if (!task.projectId) {
      this.taskFormErrors.projectId = 'Project is required';
      isValid = false;
    } else {
      // Validate that the project is assigned to the team lead
      const assignedProject = this.projects.find(p => p.id === task.projectId);
      if (!assignedProject) {
        this.taskFormErrors.projectId = 'You can only create tasks for assigned projects';
        isValid = false;
      }
    }

    // Validate sprint belongs to selected project
    if (task.sprintId && task.projectId) {
      const sprint = this.sprints.find(s => s.id === task.sprintId);
      if (!sprint || sprint.projectId !== task.projectId) {
        this.taskFormErrors.sprintId = 'Selected sprint does not belong to the selected project';
        isValid = false;
      }
    }

    if (task.dueDate && new Date(task.dueDate) < new Date()) {
      this.taskFormErrors.dueDate = 'Due date cannot be in the past';
      isValid = false;
    }

    return isValid;
  }

  getProjectName(projectData: any): string {
    console.log('DEBUG getProjectName:', { projectData, projects: this.projects });
    
    if (!projectData) return 'Unknown Project';
    
    // If project is populated with project object
    if (typeof projectData === 'object' && projectData.name) {
      return projectData.name;
    }
    
    // If project is a string (ID), look up the project
    if (typeof projectData === 'string') {
      const project = this.projects.find(p => p._id === projectData || p.id === projectData);
      console.log('DEBUG project lookup:', { projectData, foundProject: project });
      return project ? project.name : 'Unknown Project';
    }
    
    return 'Unknown Project';
  }

  getSprintName(sprintId: string): string {
    const sprint = this.sprints.find(s => s.id === sprintId);
    return sprint ? sprint.name : 'No Sprint';
  }

  getMemberName(memberId: string): string {
    const member = this.teamMembers.find(m => m.id === memberId);
    return member ? member.name : 'Unassigned';
  }

  getAssigneeName(task: any): string {
    console.log('DEBUG getAssigneeName:', { task, teamMembers: this.teamMembers });
    
    if (!task) return 'Unassigned';
    
    // Check if assignee is populated with user object
    if (task.assignee && typeof task.assignee === 'object' && task.assignee.name) {
      return task.assignee.name;
    }
    
    // If assignee is a string (ID), look up the member
    if (typeof task.assignee === 'string' && task.assignee) {
      const member = this.teamMembers.find(m => m._id === task.assignee || m.id === task.assignee);
      console.log('DEBUG assignee lookup:', { assignee: task.assignee, foundMember: member });
      return member ? member.name : 'Unknown User';
    }
    
    // Try assigneeId field as fallback
    if (task.assigneeId) {
      const member = this.teamMembers.find(m => m._id === task.assigneeId || m.id === task.assigneeId);
      return member ? member.name : 'Unknown User';
    }
    
    return 'Unassigned';
  }

  getPriorityClass(priority: string): string {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'todo': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-orange-100 text-orange-800';
      case 'review': return 'bg-purple-100 text-purple-800';
      case 'done': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  onProjectChange(): void {
    // When project changes, filter sprints for that project
    if (this.newTask.projectId) {
      this.filteredSprints = this.allSprints.filter(s => s.projectId === this.newTask.projectId);
    } else {
      this.filteredSprints = []; // No project selected, no sprints available
    }
    this.newTask.sprintId = ''; // Reset sprint selection when project changes
    
    // Clear any previous project-related errors
    if (this.taskFormErrors.projectId) {
      delete this.taskFormErrors.projectId;
    }
    if (this.taskFormErrors.sprintId) {
      delete this.taskFormErrors.sprintId;
    }
  }

  // Additional methods expected by HTML template
  applySearch(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  onProjectChangeInModal(): void {
    this.onProjectChange();
  }

  onProjectChangeInEditModal(): void {
    // When project changes in edit modal, update filtered sprints
    if (this.selectedTask?.projectId) {
      this.filteredSprints = this.allSprints.filter(s => s.projectId === this.selectedTask!.projectId);
    } else {
      this.filteredSprints = [];
    }
    // Reset sprint selection if current sprint is not compatible with new project
    if (this.selectedTask?.sprintId) {
      const sprintExists = this.filteredSprints.find(s => s.id === this.selectedTask!.sprintId);
      if (!sprintExists) {
        this.selectedTask!.sprintId = '';
      }
    }
  }

  updateTaskStatus(task: Task, status: string): void {
    if (task.id) {
      const taskStatus = status as 'todo' | 'in-progress' | 'review' | 'done';
      const taskData = { ...task, status: taskStatus };
      this.authService.leadUpdateTask(task.id, taskData).subscribe({
        next: () => {
          task.status = taskStatus;
          this.toastService.show('Task status updated successfully', 'success');
        },
        error: (error) => {
          console.error('Error updating task status:', error);
          this.toastService.show('Failed to update task status', 'error');
        }
      });
    }
  }

  getStatusColor(status: string): string {
    return this.getStatusClass(status);
  }

  getPriorityColor(priority: string): string {
    return this.getPriorityClass(priority);
  }

  openEditTaskModal(task: Task): void {
    this.selectedTask = task;
    this.editingTask = { ...task };
    // Set filtered sprints for the current project
    if (task.projectId) {
      this.filteredSprints = this.allSprints.filter(s => s.projectId === task.projectId);
    } else {
      this.filteredSprints = [];
    }
    this.showEditTaskModal = true;
  }

  closeModals(): void {
    this.showCreateTaskModal = false;
    this.showEditTaskModal = false;
    this.showTaskDetailsModal = false;
    this.selectedTask = null;
    this.editingTask = null;
    this.newTask = this.initializeTask();
  }

  getAvailableSprintsForProject(projectId: string): Sprint[] {
    if (!projectId) return [];
    return this.allSprints.filter(s => s.projectId === projectId);
  }

  getProjectStatusClass(projectId: string): string {
    const project = this.projects.find(p => p.id === projectId);
    if (!project) return 'bg-gray-100 text-gray-800';
    
    switch (project.status) {
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  // View toggle methods
  toggleView(mode: 'list' | 'board'): void {
    this.viewMode = mode;
    if (mode === 'board') {
      this.organizeBoardTasks();
    }
  }

  // Board organization methods
  organizeBoardTasks(): void {
    // Clear existing tasks
    this.boardColumns.forEach(col => col.tasks = []);
    
    // Organize filtered tasks into board columns
    this.filteredTasks.forEach(task => {
      const column = this.boardColumns.find(col => col.id === task.status);
      if (column) column.tasks.push(task);
      else this.boardColumns[0].tasks.push(task); // Default to 'To Do'
    });
  }

  // Utility method for board view
  isOverdue(task: Task): boolean {
    if (!task.dueDate) return false;
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today && task.status !== 'done';
  }
}
