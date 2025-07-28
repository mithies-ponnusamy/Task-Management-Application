import { Component, OnInit, OnDestroy } from '@angular/core';
import { Task, Project, User } from '../../../model/user.model';
import { TaskService } from '../../../core/services/task/task';
import { UserService } from '../../../core/services/user/user';
import { Auth } from '../../../core/services/auth/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './tasks.html',
  styleUrls: ['./tasks.css']
})
export class Tasks implements OnInit, OnDestroy {
  assignedProjects: Project[] = [];
  allTasks: Task[] = [];
  filteredTasks: Task[] = [];
  viewMode: 'list' | 'board' = 'board';
  showTaskModal = false;
  selectedTask: Task | null = null;
  currentUser!: User;
  loading = false;
  private subscriptions: Subscription[] = [];

  // Task board data
  allTasks$!: Observable<Task[]>;
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  boardTasks: { [key: string]: Task[] } = {};

  filters = {
    status: '',
    priority: '',
    project: ''
  };

  constructor(
    private taskService: TaskService,
    private userService: UserService,
    private authService: Auth
  ) {
    this.allTasks$ = this.tasksSubject.asObservable();
  }

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadProjects();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private loadCurrentUser(): void {
    this.loading = true;
    const userSub = this.authService.getUserProfile().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.loadTasks();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
        this.loading = false;
      }
    });
    this.subscriptions.push(userSub);
  }

  loadTasks(): void {
    if (!this.currentUser) return;
    
    console.log('DEBUG: Loading tasks for user:', this.currentUser);
    
    // Use backend API to get tasks assigned to current user
    const taskSub = this.taskService.getMyTasks().subscribe({
      next: (tasks) => {
        console.log('DEBUG: Tasks from backend API:', tasks);
        this.allTasks = tasks;
        this.filteredTasks = [...this.allTasks];
        this.tasksSubject.next(this.allTasks);
        this.initializeBoardTasks();
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error loading user tasks from backend:', error);
        // Fallback: use the old method if backend fails
        this.loadTasksFromService();
      }
    });
    
    this.subscriptions.push(taskSub);
  }

  private loadTasksFromService(): void {
    this.taskService.getTasks().subscribe(tasks => {
      console.log('DEBUG: All tasks from service (fallback):', tasks);
      
      // Filter tasks assigned to current user - check multiple fields
      this.allTasks = tasks.filter(task => {
        const isAssignedByName = task.assignee === this.currentUser.name;
        const isAssignedById = task.assigneeId === this.currentUser.id;
        console.log(`DEBUG: Task "${task.title}" - assignee: "${task.assignee}", assigneeId: "${task.assigneeId}", user: "${this.currentUser.name}" (${this.currentUser.id}) - assigned: ${isAssignedByName || isAssignedById}`);
        return isAssignedByName || isAssignedById;
      });
      
      console.log('DEBUG: Filtered tasks for user:', this.allTasks);
      
      this.filteredTasks = [...this.allTasks];
      this.tasksSubject.next(this.allTasks);
      this.initializeBoardTasks();
      this.applyFilters();
    });
  }

  private initializeBoardTasks(): void {
    this.boardTasks = {
      'my-tasks': this.allTasks
    };
  }

  // Board view methods
  getTasksForBoard(boardId: string, status: string): Task[] {
    return this.allTasks.filter(task => task.status === status) || [];
  }

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      
      // Update task status based on the new column
      const task = event.container.data[event.currentIndex];
      let newStatus: 'todo' | 'in-progress' | 'review' | 'done';
      
      if (event.container.id.includes('todo')) newStatus = 'todo';
      else if (event.container.id.includes('inProgress')) newStatus = 'in-progress';
      else if (event.container.id.includes('review')) newStatus = 'review';
      else newStatus = 'done';
      
      task.status = newStatus;
      
      // Update the task on the backend
      this.taskService.updateTask(task).subscribe();
    }
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
    this.viewMode = this.viewMode === 'list' ? 'board' : 'list';
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

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
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
    
    if (newProgress === 100 && task.status !== 'done') {
      task.status = 'done';
    } else if (newProgress < 100 && task.status === 'done') {
      task.status = 'in-progress';
    }
  }

  viewTaskDetails(task: any): void {
    this.selectedTask = task;
    this.showTaskModal = true;
  }

  closeTaskModal(): void {
    this.showTaskModal = false;
    this.selectedTask = null;
  }

  editTask(task: any): void {
    // Implementation for editing task
    console.log('Edit task:', task);
  }

  deleteTask(task: any): void {
    // Implementation for deleting task
    console.log('Delete task:', task);
  }

  updateTaskStatus(task: Task, newStatus: string): void {
    task.status = newStatus as 'todo' | 'in-progress' | 'review' | 'done';
    this.taskService.updateTask(task).subscribe();
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'todo': 'bg-gray-100 text-gray-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'review': 'bg-yellow-100 text-yellow-800',
      'done': 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }

  getPriorityColor(priority: string): string {
    const colors: { [key: string]: string } = {
      'low': 'text-green-600',
      'medium': 'text-yellow-600',
      'high': 'text-red-600'
    };
    return colors[priority] || 'text-gray-600';
  }
}
