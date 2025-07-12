// tasks.ts
import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../../core/services/task/task';
import { ProjectService } from '../../../core/services/project/project';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { NgbModal, NgbToast } from '@ng-bootstrap/ng-bootstrap';
import { Task } from '../../../model/user.model';

@Component({
  selector: 'app-lead-timeline',
  imports: [
    CommonModule,
    FormsModule,
    NgbToast
  ],
  templateUrl: './tasks.html',
  styleUrls: ['./tasks.css']
})
export class Tasks implements OnInit {
  projects: any[] = [];
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  selectedProject: string = 'all';
  selectedView: string = 'week';
  selectedTeamMember: string = 'all';
  selectedStatus: string = 'all';
  searchQuery: string = '';
  editTaskModalOpen = false;
  viewTaskModalOpen = false;
  addTaskModalOpen = false;
  currentTask: Task | null = null;
  newTask: Task = this.createEmptyTask();
  teamMembers: any[] = [];
  showDeleteToast = false;
  deleteToastMessage = '';
  isSubmitting = false;

  statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'todo', label: 'To Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'review', label: 'Review' },
    { value: 'done', label: 'Done' }
  ];

  priorityOptions = [
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  constructor(
    private taskService: TaskService,
    private projectService: ProjectService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.projects = this.projectService.getProjects();
    this.teamMembers = [
      { id: 'sarah', name: 'Sarah Johnson' },
      { id: 'mike', name: 'Mike Smith' },
      { id: 'alex', name: 'Alex Chen' }
    ];
    this.loadTasks();
  }

  createEmptyTask(): Task {
    return {
      id: '',
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      dueDate: new Date(),
      assignee: '',
      projectId: '',
      project: '',
      tags: [],
      estimatedHours: 0,
      actualHours: 0,
      progress: 0
    };
  }

  loadTasks(): void {
    this.tasks = [
      {
        id: '1',
        title: 'Design homepage mockup',
        description: 'Create initial design concepts for the homepage',
        status: 'in-progress',
        priority: 'high',
        dueDate: new Date('2023-05-15'),
        assignee: 'Sarah Johnson',
        projectId: '1',
        project: 'Website Redesign',
        tags: ['design'],
        estimatedHours: 8,
        actualHours: 6,
        progress: 75
      },
      {
        id: '2',
        title: 'Implement user authentication',
        description: 'Set up login and registration functionality',
        status: 'todo',
        priority: 'high',
        dueDate: new Date('2023-05-18'),
        assignee: 'Mike Smith',
        projectId: '1',
        project: 'Website Redesign',
        tags: ['development'],
        estimatedHours: 12,
        actualHours: 0,
        progress: 0
      },
      {
        id: '3',
        title: 'Write API documentation',
        description: 'Document all endpoints for backend services',
        status: 'review',
        priority: 'medium',
        dueDate: new Date('2023-05-10'),
        assignee: 'Alex Chen',
        projectId: '1',
        project: 'Website Redesign',
        tags: ['documentation'],
        estimatedHours: 5,
        actualHours: 4,
        progress: 80
      },
      {
        id: '4',
        title: 'Database schema design',
        description: 'Design the database schema for the new feature',
        status: 'done',
        priority: 'medium',
        dueDate: new Date('2023-05-05'),
        assignee: 'Mike Smith',
        projectId: '2',
        project: 'Mobile App Development',
        tags: ['database'],
        estimatedHours: 6,
        actualHours: 7,
        progress: 100
      },
      {
        id: '5',
        title: 'Mobile app UI implementation',
        description: 'Implement the UI for the mobile application',
        status: 'in-progress',
        priority: 'high',
        dueDate: new Date('2023-05-20'),
        assignee: 'Sarah Johnson',
        projectId: '2',
        project: 'Mobile App Development',
        tags: ['mobile', 'ui'],
        estimatedHours: 15,
        actualHours: 8,
        progress: 50
      }
    ];
    this.filterTasks();
  }

  filterTasks(): void {
    this.filteredTasks = this.tasks.filter(task => {
      const projectMatch = this.selectedProject === 'all' || task.projectId === this.selectedProject;
      const memberMatch = this.selectedTeamMember === 'all' || task.assignee === this.selectedTeamMember;
      const statusMatch = this.selectedStatus === 'all' || task.status === this.selectedStatus;
      const searchMatch = this.searchQuery === '' || 
                         task.title.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
                         task.description?.toLowerCase().includes(this.searchQuery.toLowerCase());
      return projectMatch && memberMatch && statusMatch && searchMatch;
    });
  }

  onFilterChange(): void {
    this.filterTasks();
  }

  onSearch(): void {
    this.filterTasks();
  }

  openEditTaskModal(task: Task): void {
    this.currentTask = { ...task };
    this.editTaskModalOpen = true;
  }

  openViewTaskModal(task: Task): void {
    this.currentTask = task;
    this.viewTaskModalOpen = true;
  }

  openAddTaskModal(): void {
    this.newTask = this.createEmptyTask();
    this.addTaskModalOpen = true;
  }

  confirmAction(action: string): boolean {
    return confirm(`Are you sure you want to ${action} this task?`);
  }

  saveTask(form: NgForm): void {
    if (!form.valid) {
      return;
    }

    if (!this.confirmAction('save')) {
      return;
    }

    this.isSubmitting = true;
    
    if (this.currentTask?.id) {
      // Update existing task
      const index = this.tasks.findIndex(t => t.id === this.currentTask?.id);
      if (index !== -1) {
        this.tasks[index] = { ...this.currentTask };
      }
    } else {
      // Add new task
      this.currentTask!.id = Date.now().toString();
      this.tasks.push({ ...this.currentTask! });
    }
    
    this.isSubmitting = false;
    this.editTaskModalOpen = false;
    this.currentTask = null;
    this.filterTasks();
  }

  addNewTask(form: NgForm): void {
    if (!form.valid) {
      return;
    }

    this.isSubmitting = true;
    
    this.newTask.id = Date.now().toString();
    this.tasks.push({ ...this.newTask });
    
    this.isSubmitting = false;
    this.addTaskModalOpen = false;
    this.newTask = this.createEmptyTask();
    this.filterTasks();
  }

  deleteTask(): void {
    if (!this.confirmAction('delete')) {
      return;
    }

    if (!this.currentTask) return;
    
    this.tasks = this.tasks.filter(t => t.id !== this.currentTask?.id);
    
    this.showDeleteToast = true;
    this.deleteToastMessage = 'Task deleted successfully';
    setTimeout(() => this.showDeleteToast = false, 3000);
    
    this.editTaskModalOpen = false;
    this.viewTaskModalOpen = false;
    this.currentTask = null;
    this.filterTasks();
  }

  deleteTaskFromView(): void {
    if (!this.confirmAction('delete')) {
      return;
    }

    if (!this.currentTask) return;
    
    this.tasks = this.tasks.filter(t => t.id !== this.currentTask?.id);
    
    this.showDeleteToast = true;
    this.deleteToastMessage = 'Task deleted successfully';
    setTimeout(() => this.showDeleteToast = false, 3000);
    
    this.viewTaskModalOpen = false;
    this.currentTask = null;
    this.filterTasks();
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'todo': return 'bg-gray-100 text-gray-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'review': return 'bg-purple-100 text-purple-800';
      case 'done': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getProgressColor(progress: number): string {
    if (progress >= 90) return 'bg-green-500';
    if (progress >= 70) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  }

  onDueDateChange(newDate: string, task: Task) {
    task.dueDate = new Date(newDate);
  }

  getProjectName(projectId: string): string {
    const project = this.projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  }
}