// backlogs.ts
import { Component, OnInit } from '@angular/core';
import { Task } from '../../../model/user.model';
import { TaskService } from '../../../core/services/task/task';
import { ProjectService } from '../../../core/services/project/project';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { NgbModal, NgbToast } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-lead-backlogs',
  imports: [
    CommonModule,
    FormsModule,
    NgbToast
  ],
  templateUrl: './backlogs.html',
  styleUrls: ['./backlogs.css']
})
export class Backlogs implements OnInit {
  currentSprintTasks: Task[] = [];
  productBacklogTasks: Task[] = [];
  filteredProductBacklogTasks: Task[] = [];
  selectedProject: string = 'all';
  projects: any[] = [];
  addTaskModalOpen = false;
  editTaskModalOpen = false;
  viewTaskModalOpen = false;
  manageSprintModalOpen = false;
  editSprintModalOpen = false;
  currentTask: Task | null = null;
  newTask: Task = this.createEmptyTask();
  teamMembers: any[] = [];
  sprints: any[] = [
    { id: 'sprint1', name: 'Sprint 1', startDate: '2023-05-01', endDate: '2023-05-14', status: 'completed', goal: 'Implement core functionality' },
    { id: 'sprint2', name: 'Sprint 2', startDate: '2023-05-15', endDate: '2023-05-28', status: 'active', goal: 'Enhance user experience' },
    { id: 'sprint3', name: 'Sprint 3', startDate: '2023-05-29', endDate: '2023-06-11', status: 'planned', goal: 'Finalize and test features' }
  ];
  selectedSprint = 'sprint2';
  newSprint = this.createEmptySprint();
  editingSprint: any = null;
  showToast = false;
  toastMessage = '';
  toastType = 'success';
  isSubmitting = false;

  constructor(
    private taskService: TaskService,
    private projectService: ProjectService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.projects = this.projectService.getProjects();
    this.teamMembers = [
      { id: '1', name: 'Sarah Johnson', role: 'Designer', email: 'sarah@example.com' },
      { id: '2', name: 'Mike Smith', role: 'Developer', email: 'mike@example.com' },
      { id: '3', name: 'Alex Chen', role: 'Developer', email: 'alex@example.com' }
    ];
    this.loadTasks();
    this.filterTasks();
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
      projectId: this.selectedProject !== 'all' ? this.selectedProject : '',
      project: '',
      tags: [],
      estimatedHours: 0,
      storyPoints: 3,
      sprintId: ''
    };
  }

  createEmptySprint(): any {
    return {
      name: '',
      startDate: '',
      endDate: '',
      goal: '',
      status: 'planned'
    };
  }

  loadTasks(): void {
    this.currentSprintTasks = [
      {
        id: '1',
        title: 'Design homepage mockup',
        description: 'Create initial design concepts for the homepage',
        status: 'in-progress',
        priority: 'high',
        dueDate: new Date('2023-05-18'),
        assignee: 'Sarah Johnson',
        projectId: '1',
        project: 'Website Redesign',
        tags: ['design'],
        estimatedHours: 8,
        storyPoints: 5,
        sprintId: 'sprint2'
      },
      {
        id: '2',
        title: 'Implement user authentication',
        description: 'Set up login and registration functionality',
        status: 'todo',
        priority: 'high',
        dueDate: new Date('2023-05-20'),
        assignee: 'Mike Smith',
        projectId: '1',
        project: 'Website Redesign',
        tags: ['development'],
        estimatedHours: 12,
        storyPoints: 8,
        sprintId: 'sprint2'
      },
      {
        id: '3',
        title: 'Write API documentation',
        description: 'Document all endpoints for backend services',
        status: 'review',
        priority: 'medium',
        dueDate: new Date('2023-05-15'),
        assignee: 'Alex Chen',
        projectId: '1',
        project: 'Website Redesign',
        tags: ['documentation'],
        estimatedHours: 5,
        storyPoints: 3,
        sprintId: 'sprint2'
      }
    ];

    this.productBacklogTasks = [
      {
        id: '10',
        title: 'Implement payment gateway',
        description: 'Integrate Stripe payment system',
        status: 'todo',
        priority: 'high',
        dueDate: new Date('2023-06-01'),
        assignee: '',
        projectId: '1',
        project: 'E-commerce Platform',
        tags: ['development'],
        estimatedHours: 16,
        storyPoints: 13,
        sprintId: ''
      },
      {
        id: '11',
        title: 'Create admin dashboard',
        description: 'Build interface for admin users',
        status: 'todo',
        priority: 'medium',
        dueDate: new Date('2023-06-05'),
        assignee: '',
        projectId: '1',
        project: 'E-commerce Platform',
        tags: ['development'],
        estimatedHours: 10,
        storyPoints: 8,
        sprintId: ''
      },
      {
        id: '12',
        title: 'Optimize image loading',
        description: 'Implement lazy loading for images',
        status: 'todo',
        priority: 'low',
        dueDate: new Date('2023-06-10'),
        assignee: '',
        projectId: '1',
        project: 'E-commerce Platform',
        tags: ['performance'],
        estimatedHours: 6,
        storyPoints: 5,
        sprintId: ''
      }
    ];
    this.filterTasks();
  }

  filterTasks(): void {
    // Filter product backlog by selected project
    this.filteredProductBacklogTasks = this.productBacklogTasks.filter(task => {
      return this.selectedProject === 'all' || task.projectId === this.selectedProject;
    });
  }

  onProjectChange(): void {
    this.filterTasks();
  }

  onSprintChange(): void {
    // In a real app, you would fetch tasks for the selected sprint
    this.showToastMessage('Sprint changed successfully', 'success');
  }

  openAddTaskModal(): void {
    this.newTask = this.createEmptyTask();
    this.addTaskModalOpen = true;
  }

  openEditTaskModal(task: Task): void {
    this.currentTask = { ...task };
    this.editTaskModalOpen = true;
  }

  openViewTaskModal(task: Task): void {
    this.currentTask = task;
    this.viewTaskModalOpen = true;
  }

  openManageSprintModal(): void {
    this.manageSprintModalOpen = true;
  }

  openEditSprintModal(sprint: any): void {
    this.editingSprint = { ...sprint };
    this.editSprintModalOpen = true;
  }

  showToastMessage(message: string, type: string = 'success'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => this.showToast = false, 3000);
  }

  saveTask(form: NgForm): void {
    if (!form.valid) {
      this.showToastMessage('Please fill all required fields', 'error');
      return;
    }

    this.isSubmitting = true;

    if (this.editTaskModalOpen && this.currentTask) {
      // Update existing task
      const index = this.currentSprintTasks.findIndex(t => t.id === this.currentTask?.id);
      if (index !== -1) {
        this.currentSprintTasks[index] = { ...this.currentTask };
        this.showToastMessage('Task updated successfully');
      }
    } else if (this.addTaskModalOpen) {
      // Add new task
      this.newTask.id = 'task' + (this.productBacklogTasks.length + 1);
      this.productBacklogTasks.push({ ...this.newTask });
      this.showToastMessage('Task added to product backlog');
    }
    
    this.isSubmitting = false;
    this.closeModals();
    this.filterTasks();
  }

  deleteTask(): void {
    if (confirm('Are you sure you want to delete this task?')) {
      if (this.currentTask) {
        this.currentSprintTasks = this.currentSprintTasks.filter(t => t.id !== this.currentTask?.id);
        this.productBacklogTasks = this.productBacklogTasks.filter(t => t.id !== this.currentTask?.id);
        this.showToastMessage('Task deleted successfully');
        this.closeModals();
      }
    }
  }

  promoteToSprint(task: Task): void {
    if (confirm(`Promote this task to current sprint?`)) {
      task.status = 'todo';
      task.sprintId = this.selectedSprint;
      this.currentSprintTasks.push({ ...task });
      this.productBacklogTasks = this.productBacklogTasks.filter(t => t.id !== task.id);
      
      // In a real app, you would send notification to team members
      if (task.assignee) {
        const member = this.teamMembers.find(m => m.name === task.assignee);
        if (member) {
          this.showToastMessage(`Task promoted and notification sent to ${member.name}`);
        }
      } else {
        this.showToastMessage('Task promoted to current sprint');
      }
    }
  }

  removeFromSprint(task: Task): void {
    if (confirm('Remove this task from sprint and move to product backlog?')) {
      task.status = 'todo';
      task.sprintId = '';
      this.productBacklogTasks.push({ ...task });
      this.currentSprintTasks = this.currentSprintTasks.filter(t => t.id !== task.id);
      this.showToastMessage('Task moved to product backlog');
    }
  }

  createSprint(form: NgForm): void {
    if (!form.valid) {
      this.showToastMessage('Please fill all required fields', 'error');
      return;
    }

    this.isSubmitting = true;
    const newSprint = {
      id: 'sprint' + (this.sprints.length + 1),
      name: this.newSprint.name,
      startDate: this.newSprint.startDate,
      endDate: this.newSprint.endDate,
      status: 'planned',
      goal: this.newSprint.goal
    };
    this.sprints.push(newSprint);
    this.newSprint = this.createEmptySprint();
    this.showToastMessage('Sprint created successfully');
    this.isSubmitting = false;
    this.manageSprintModalOpen = false;
  }

  updateSprint(form: NgForm): void {
    if (!form.valid) {
      this.showToastMessage('Please fill all required fields', 'error');
      return;
    }

    this.isSubmitting = true;
    const index = this.sprints.findIndex(s => s.id === this.editingSprint.id);
    if (index !== -1) {
      this.sprints[index] = { ...this.editingSprint };
      this.showToastMessage('Sprint updated successfully');
    }
    this.isSubmitting = false;
    this.editSprintModalOpen = false;
  }

  deleteSprint(sprint: any): void {
    if (confirm(`Are you sure you want to delete ${sprint.name}?`)) {
      if (sprint.status === 'active') {
        this.showToastMessage('Cannot delete active sprint', 'error');
        return;
      }

      // Move tasks back to product backlog
      const tasksToMove = this.currentSprintTasks.filter(t => t.sprintId === sprint.id);
      tasksToMove.forEach(task => {
        task.sprintId = '';
        this.productBacklogTasks.push(task);
      });

      this.currentSprintTasks = this.currentSprintTasks.filter(t => t.sprintId !== sprint.id);
      this.sprints = this.sprints.filter(s => s.id !== sprint.id);
      
      if (this.selectedSprint === sprint.id) {
        this.selectedSprint = this.sprints.length > 0 ? this.sprints[0].id : '';
      }
      
      this.showToastMessage('Sprint deleted successfully');
    }
  }

  closeModals(): void {
    this.addTaskModalOpen = false;
    this.editTaskModalOpen = false;
    this.viewTaskModalOpen = false;
    this.manageSprintModalOpen = false;
    this.editSprintModalOpen = false;
    this.currentTask = null;
    this.editingSprint = null;
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

  getSprintStatusColor(status: string): string {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'planned': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getSprintStoryPoints(): number {
    return this.currentSprintTasks.reduce((sum, task) => sum + (task.storyPoints || 0), 0);
  }

  getProjectName(projectId: string): string {
    const project = this.projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  }

  getSprintName(sprintId: string): string {
    const sprint = this.sprints.find(s => s.id === sprintId);
    return sprint ? sprint.name : 'Unknown Sprint';
  }

  onTagsInputChange(event: any, task: Task) {
    const value = event.target.value;
    task.tags = value.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0);
  }
}