import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../../core/services/auth/auth';

@Component({
  selector: 'app-lead-task-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-management.html',
  styleUrls: ['./task-management.css']
})
export class TaskManagementComponent implements OnInit {
  // Data
  tasks: any[] = [];
  projects: any[] = [];
  sprints: any[] = [];
  teamMembers: any[] = [];
  filteredTasks: any[] = [];
  
  // Loading states
  isLoading = false;
  isCreatingTask = false;
  
  // Modals
  showCreateTaskModal = false;
  showEditTaskModal = false;
  
  // Forms
  newTask = {
    title: '',
    description: '',
    assignee: '',
    projectId: '',
    sprintId: '',
    priority: 'medium',
    dueDate: '',
    storyPoints: 1
  };
  
  selectedTask: any = null;
  
  // Filters
  selectedProject = '';
  selectedSprint = '';
  selectedStatus = '';
  selectedAssignee = '';
  searchQuery = '';
  
  // Task statuses
  taskStatuses = [
    { value: 'todo', label: 'To Do', color: 'bg-gray-100 text-gray-800' },
    { value: 'in-progress', label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
    { value: 'review', label: 'Review', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'done', label: 'Done', color: 'bg-green-100 text-green-800' }
  ];
  
  // Priorities
  priorities = [
    { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800' }
  ];

  constructor(private authService: Auth) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  async loadInitialData(): Promise<void> {
    this.isLoading = true;
    try {
      // Load projects, team, and sprints
      await Promise.all([
        this.loadProjects(),
        this.loadTeamMembers(),
        this.loadSprints()
      ]);
      
      // Load tasks after we have projects
      await this.loadTasks();
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async loadProjects(): Promise<void> {
    try {
      this.projects = await this.authService.leadGetProjects().toPromise() || [];
    } catch (error) {
      console.error('Error loading projects:', error);
      this.projects = [];
    }
  }

  async loadTeamMembers(): Promise<void> {
    try {
      const teamData = await this.authService.leadGetTeam().toPromise();
      this.teamMembers = teamData?.members || [];
    } catch (error) {
      console.error('Error loading team members:', error);
      this.teamMembers = [];
    }
  }

  async loadSprints(): Promise<void> {
    try {
      this.sprints = await this.authService.leadGetSprints().toPromise() || [];
    } catch (error) {
      console.error('Error loading sprints:', error);
      this.sprints = [];
    }
  }

  async loadTasks(): Promise<void> {
    try {
      const filters: any = {};
      if (this.selectedProject) filters.projectId = this.selectedProject;
      if (this.selectedSprint) filters.sprintId = this.selectedSprint;
      if (this.selectedStatus) filters.status = this.selectedStatus;
      if (this.selectedAssignee) filters.assignee = this.selectedAssignee;

      this.tasks = await this.authService.leadGetTasks(filters).toPromise() || [];
      this.applySearch();
    } catch (error) {
      console.error('Error loading tasks:', error);
      this.tasks = [];
    }
  }

  applySearch(): void {
    if (!this.searchQuery.trim()) {
      this.filteredTasks = [...this.tasks];
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.filteredTasks = this.tasks.filter(task => 
      task.title.toLowerCase().includes(query) ||
      task.description?.toLowerCase().includes(query)
    );
  }

  onFilterChange(): void {
    this.loadTasks();
  }

  openCreateTaskModal(): void {
    this.resetNewTask();
    this.showCreateTaskModal = true;
  }

  openEditTaskModal(task: any): void {
    this.selectedTask = { ...task };
    this.showEditTaskModal = true;
  }

  closeModals(): void {
    this.showCreateTaskModal = false;
    this.showEditTaskModal = false;
    this.selectedTask = null;
  }

  resetNewTask(): void {
    this.newTask = {
      title: '',
      description: '',
      assignee: '',
      projectId: this.selectedProject || '',
      sprintId: this.selectedSprint || '',
      priority: 'medium',
      dueDate: '',
      storyPoints: 1
    };
  }

  async createTask(): Promise<void> {
    if (!this.newTask.title.trim() || !this.newTask.projectId) {
      return;
    }

    this.isCreatingTask = true;
    try {
      const taskData = {
        ...this.newTask,
        assignee: this.newTask.assignee || null,
        sprintId: this.newTask.sprintId || null
      };

      await this.authService.leadCreateTask(taskData).toPromise();
      this.closeModals();
      await this.loadTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      this.isCreatingTask = false;
    }
  }

  async updateTask(): Promise<void> {
    if (!this.selectedTask) return;

    try {
      await this.authService.leadUpdateTask(this.selectedTask._id, this.selectedTask).toPromise();
      this.closeModals();
      await this.loadTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  }

  async deleteTask(taskId: string): Promise<void> {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      await this.authService.leadDeleteTask(taskId).toPromise();
      await this.loadTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }

  async updateTaskStatus(task: any, newStatus: string): Promise<void> {
    try {
      await this.authService.leadUpdateTask(task._id, { status: newStatus }).toPromise();
      await this.loadTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  }

  getStatusColor(status: string): string {
    return this.taskStatuses.find(s => s.value === status)?.color || 'bg-gray-100 text-gray-800';
  }

  getPriorityColor(priority: string): string {
    return this.priorities.find(p => p.value === priority)?.color || 'bg-gray-100 text-gray-800';
  }

  getProjectName(projectId: string): string {
    return this.projects.find(p => p._id === projectId)?.name || 'Unknown Project';
  }

  getSprintName(sprintId: string): string {
    return this.sprints.find(s => s._id === sprintId)?.name || 'No Sprint';
  }

  getMemberName(memberId: string): string {
    return this.teamMembers.find(m => m._id === memberId)?.name || 'Unassigned';
  }

  onProjectChangeInModal(): void {
    // Filter sprints based on selected project
    this.newTask.sprintId = '';
  }

  getAvailableSprintsForProject(projectId: string): any[] {
    return this.sprints.filter(sprint => sprint.project._id === projectId);
  }
}
