import { Component, OnInit } from '@angular/core';
import { Task, Project, User } from '../../../model/user.model';
import { TaskService } from '../../../core/services/task/task';
import { UserService } from '../../../core/services/user/user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tasks.html',
  styleUrls: ['./tasks.css']
})
export class Tasks implements OnInit {
  assignedProjects: Project[] = [];
  allTasks: Task[] = [];
  filteredTasks: Task[] = [];
  viewMode: 'list' | 'table' = 'list';
  showTaskModal = false;
  selectedTask: Task | null = null;
  currentUser!: User;

  filters = {
    status: '',
    priority: '',
    project: ''
  };

  constructor(
    private taskService: TaskService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.userService.getUsers().find(user => user.id === '2')!;
    this.loadProjects();
    this.loadTasks();
  }

  loadProjects(): void {
    // In a real app, this would come from a service
    this.assignedProjects = [
      {
        id: '1',
        name: 'Website Redesign',
        lead: '2',
        description: 'Complete redesign of company website',
        status: 'in-progress',
        progress: 65,
        startDate: new Date('2023-01-15'),
        endDate: new Date('2023-06-30'),
        teamMembers: ['2'],
        team: '',
        deadline: new Date('2023-06-30'),
        priority: 'high'
      },
      {
        id: '2',
        name: 'Mobile App Development',
        lead: '3',
        description: 'Development of new mobile application',
        status: 'in-progress',
        progress: 30,
        startDate: new Date('2023-03-01'),
        endDate: new Date('2023-09-15'),
        teamMembers: ['2'],
        team: '',
        deadline: new Date('2023-09-15'),
        priority: 'medium'
      }
    ];
  }

  loadTasks(): void {
    this.taskService.getTasksByAssignee(this.currentUser.name).subscribe(tasks => {
      // Add mock tasks for demonstration
      const mockTasks = this.generateMockTasks();
      this.allTasks = [...tasks, ...mockTasks];
      this.applyFilters();
    });
  }

  generateMockTasks(): Task[] {
    const today = new Date();
    const tasks: Task[] = [];
    
    // Tasks for Website Redesign
    tasks.push({
      id: '101',
      title: 'Design homepage layout',
      description: 'Create wireframes for the new homepage design',
      dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
      status: 'in-progress',
      priority: 'high',
      assignee: this.currentUser.name,
      project: 'Website Redesign',
      projectId: '1',
      tags: ['design', 'ui'],
      progress: 75
    });
    
    tasks.push({
      id: '102',
      title: 'Implement user authentication',
      description: 'Create login and registration pages',
      dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3),
      status: 'todo',
      priority: 'high',
      assignee: this.currentUser.name,
      project: 'Website Redesign',
      projectId: '1',
      tags: ['frontend', 'security'],
      progress: 0
    });
    
    // Tasks for Mobile App Development
    tasks.push({
      id: '103',
      title: 'Design app icon',
      description: 'Create multiple design options for the app icon',
      dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1),
      status: 'todo',
      priority: 'medium',
      assignee: this.currentUser.name,
      project: 'Mobile App Development',
      projectId: '2',
      tags: ['design'],
      progress: 0
    });
    
    tasks.push({
      id: '104',
      title: 'Set up Firebase backend',
      description: 'Configure Firebase for the mobile app',
      dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7),
      status: 'in-progress',
      priority: 'high',
      assignee: this.currentUser.name,
      project: 'Mobile App Development',
      projectId: '2',
      tags: ['backend'],
      progress: 30
    });
    
    return tasks;
  }

  applyFilters(): void {
    this.filteredTasks = this.allTasks.filter(task => {
      // Filter by status
      if (this.filters.status && task.status !== this.filters.status) {
        return false;
      }
      
      // Filter by priority
      if (this.filters.priority && task.priority !== this.filters.priority) {
        return false;
      }
      
      // Filter by project
      if (this.filters.project && task.projectId !== this.filters.project) {
        return false;
      }
      
      return true;
    });
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'list' ? 'table' : 'list';
  }

  getProjectName(projectId: string): string {
    const project = this.assignedProjects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  }

  isOverdue(dueDate: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(dueDate) < today && this.selectedTask?.status !== 'done';
  }

  getTaskProgress(task: any): number {
    if (!task) return 0;
    if (task.status === 'done') return 100;
    return task.progress || 0;
  }

  updateTaskProgress(task: any, change: number): void {
    if (!task) return;
    
    let newProgress = (task.progress || 0) + change;
    newProgress = Math.max(0, Math.min(100, newProgress));
    
    task.progress = newProgress;
    
    // Update status based on progress
    if (newProgress >= 100) {
      task.status = 'done';
    } else if (newProgress > 0 && task.status === 'todo') {
      task.status = 'in-progress';
    }
    
    // Update project progress if needed
    this.updateProjectProgress(task.projectId);
  }

  updateProjectProgress(projectId: string): void {
    const project = this.assignedProjects.find(p => p.id === projectId);
    if (!project) return;
    
    const projectTasks = this.allTasks.filter(t => t.projectId === projectId);
    if (projectTasks.length === 0) return;
    
    const totalProgress = projectTasks.reduce((sum, task) => sum + this.getTaskProgress(task), 0);
    project.progress = Math.round(totalProgress / projectTasks.length);
  }

  updateTaskStatus(status: string): void {
    if (this.selectedTask) {
      this.selectedTask.status = status as any;
      if (status === 'done') {
        this.selectedTask.progress = 100;
        this.selectedTask.completionDate = new Date();
      } else if (status === 'in-progress' && this.selectedTask.progress === 0) {
        this.selectedTask.progress = 10;
      }
      
      this.updateProjectProgress(this.selectedTask.projectId);
      this.closeTaskDetails();
    }
  }

  getStatusClass(status?: string): string {
    switch(status) {
      case 'done':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'review':
        return 'bg-yellow-100 text-yellow-800';
      case 'todo':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusText(status?: string): string {
    switch(status) {
      case 'done':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      case 'review':
        return 'Pending Review';
      case 'todo':
        return 'To Do';
      default:
        return status || 'Unknown';
    }
  }

  getPriorityClass(priority: string): string {
    switch(priority) {
      case 'high':
        return 'bg-purple-100 text-purple-800';
      case 'medium':
        return 'bg-blue-100 text-blue-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getPriorityText(priority: string): string {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  }

  openTaskDetails(task: Task): void {
    this.selectedTask = { ...task };
    this.showTaskModal = true;
  }

  closeTaskDetails(): void {
    this.showTaskModal = false;
    this.selectedTask = null;
  }

  openCreateTaskModal(): void {
    // In a real app, this would open a form to create a new task
    alert('Create task functionality would open here');
  }

  openEditTaskModal(): void {
    // In a real app, this would open a form to edit the task
    alert('Edit task functionality would open here');
    this.closeTaskDetails();
  }
}