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

  // Attachment modal
  showAttachmentModal = false;
  selectedTaskForAttachment: Task | null = null;
  linkUrl = '';
  linkTitle = '';
  linkDescription = '';

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
    
    // Use auth service to get member tasks
    const taskSub = this.authService.getMemberTasks().subscribe({
      next: (tasks) => {
        console.log('DEBUG: Tasks from backend API:', tasks);
        this.allTasks = tasks;
        this.filteredTasks = [...this.allTasks];
        this.tasksSubject.next(this.allTasks);
        this.initializeBoardTasks();
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error loading member tasks from backend:', error);
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
      const task = event.previousContainer.data[event.previousIndex];
      let newStatus: 'to-do' | 'in-progress' | 'review' | 'completed';
      let canMove = true;

      // Determine new status based on drop location
      if (event.container.id.includes('todo')) newStatus = 'to-do';
      else if (event.container.id.includes('inProgress')) newStatus = 'in-progress';
      else if (event.container.id.includes('review')) newStatus = 'review';
      else newStatus = 'completed';

      // Implement workflow rules
      if (task.status === 'to-do' && newStatus === 'in-progress') {
        // Mark task as read when moving from to-do to in-progress
        this.markTaskAsRead(task);
      } else if (task.status === 'in-progress' && newStatus === 'review') {
        // Check if task has completion files/links before moving to review
        if (!this.hasCompletionAttachments(task)) {
          alert('Please attach completion files or links before marking as ready for review.');
          canMove = false;
        } else {
          this.moveTaskToReview(task);
        }
      } else if (newStatus === 'completed') {
        // Only team leads can move tasks to completed
        if (this.currentUser.role !== 'team-lead') {
          alert('Only team leads can mark tasks as completed.');
          canMove = false;
        }
      }

      if (canMove) {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
        
        task.status = newStatus;
        this.updateTaskStatus(task, newStatus);
      }
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
    return new Date(dueDate) < today && this.selectedTask?.status !== 'completed';
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
    task.status = newStatus as 'to-do' | 'in-progress' | 'review' | 'completed';
    this.taskService.updateTask(task).subscribe();
  }

  // Task workflow methods
  markTaskAsRead(task: Task): void {
    this.authService.markTaskAsRead(task._id || task.id).subscribe({
      next: (response) => {
        console.log('Task marked as read:', response);
        task.status = 'in-progress';
        this.loadTasks(); // Reload tasks to get updated status
      },
      error: (error) => {
        console.error('Error marking task as read:', error);
      }
    });
  }

  hasCompletionAttachments(task: Task): boolean {
    // Check if task has completion files or links
    return !!(task.completionFiles && task.completionFiles.length > 0) || 
           !!(task.completionLinks && task.completionLinks.length > 0);
  }

  moveTaskToReview(task: Task): void {
    this.authService.moveTaskToReview(task._id || task.id).subscribe({
      next: (response) => {
        console.log('Task moved to review:', response);
        task.status = 'review';
        this.loadTasks(); // Reload tasks to get updated status
      },
      error: (error) => {
        console.error('Error moving task to review:', error);
      }
    });
  }

  // File attachment methods
  openAttachmentModal(task: Task): void {
    this.selectedTaskForAttachment = task;
    this.showAttachmentModal = true;
  }

  closeAttachmentModal(): void {
    this.showAttachmentModal = false;
    this.selectedTaskForAttachment = null;
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0 && this.selectedTaskForAttachment) {
      this.uploadCompletionFiles(this.selectedTaskForAttachment, Array.from(files));
    }
  }

  uploadCompletionFiles(task: Task, files: File[]): void {
    // Validate file sizes (10MB limit per file)
    const maxFileSize = 10 * 1024 * 1024; // 10MB in bytes
    const oversizedFiles = files.filter(file => file.size > maxFileSize);
    
    if (oversizedFiles.length > 0) {
      const fileNames = oversizedFiles.map(file => `${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`).join(', ');
      alert(`The following files are too large (max 10MB): ${fileNames}`);
      return;
    }

    // Validate number of files (max 5)
    if (files.length > 5) {
      alert('Maximum 5 files can be uploaded at once.');
      return;
    }

    this.authService.uploadTaskCompletionFiles(task._id || task.id, files).subscribe({
      next: (response) => {
        console.log('Files uploaded successfully:', response);
        // Update task with new files
        if (!task.completionFiles) task.completionFiles = [];
        task.completionFiles.push(...response.files);
        this.closeAttachmentModal();
        this.loadTasks(); // Reload to get updated task data
      },
      error: (error) => {
        console.error('Error uploading files:', error);
        if (error.message && error.message.includes('too large')) {
          alert('One or more files are too large. Maximum file size is 10MB.');
        } else {
          alert('Error uploading files: ' + (error.message || 'Unknown error'));
        }
      }
    });
  }

  addCompletionLink(task: Task, linkData: { url: string; title?: string; description?: string }): void {
    // Validate required fields
    if (!linkData.url || !linkData.url.trim()) {
      alert('URL is required');
      return;
    }

    // Provide default title if not provided
    const finalLinkData = {
      url: linkData.url.trim(),
      title: linkData.title && linkData.title.trim() ? linkData.title.trim() : 'Completion Link',
      description: linkData.description || ''
    };

    this.authService.addTaskCompletionLink(task._id || task.id, finalLinkData).subscribe({
      next: (response) => {
        console.log('Link added successfully:', response);
        // Update task with new link
        if (!task.completionLinks) task.completionLinks = [];
        task.completionLinks.push(response.link);
        // Clear form
        this.linkUrl = '';
        this.linkTitle = '';
        this.linkDescription = '';
        // Reload tasks to get updated data
        this.loadTasks();
      },
      error: (error) => {
        console.error('Error adding link:', error);
        alert('Error adding link: ' + (error.message || 'Unknown error'));
      }
    });
  }

  // Helper methods for task workflow
  canMarkAsRead(task: Task): boolean {
    return task.status === 'to-do';
  }

  canUploadCompletion(task: Task): boolean {
    return task.status === 'in-progress';
  }

  canMoveToReview(task: Task): boolean {
    return task.status === 'in-progress';
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'to-do': 'bg-gray-100 text-gray-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'review': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-green-100 text-green-800'
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
