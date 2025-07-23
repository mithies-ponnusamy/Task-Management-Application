// dashboard.ts
import { Component, OnInit } from '@angular/core';
import { Task, User } from '../../../model/user.model';
import { Observable, of, BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../core/services/task/task';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { UserService } from '../../../core/services/user/user';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  completedTasks$!: Observable<number>;
  inProgressTasks$!: Observable<number>;
  pendingReviewTasks$!: Observable<number>;
  overdueTasks$!: Observable<number>;
  allTasks$!: Observable<Task[]>;
  paginatedTasks$!: Observable<Task[]>;
  recentActivities$!: Observable<any[]>;
  currentUser!: User;

  currentPage = 1;
  pageSize = 5;
  showAll = false;

  showTaskModal = false;
  selectedTask: Task | null = null;
  boardTasks: { [boardId: string]: Task[] } = {};
  
  private pageSubject = new BehaviorSubject<number>(1);

  constructor(
    private taskService: TaskService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // Initialize data immediately
    this.initializeData();
    this.currentUser = this.userService.getUsers().find(user => user.id === '2')!; // Fixed
    this.initializeBoardTasks();
    
    this.allTasks$ = this.taskService.getTasksByAssignee(this.currentUser.name).pipe(
      map(tasks => {
        const additionalTasks = this.generateMockTasksCount(15);
        return this.addMockProjectData([...tasks, ...additionalTasks]);
      })
    );
  }

  initializeData(): void {
    this.currentUser = this.userService.getUsers().find(user => user.id === '2')!;
    this.initializeBoardTasks();
    
    this.allTasks$ = this.taskService.getTasksByAssignee(this.currentUser.name).pipe(
      map(tasks => {
        const additionalTasks = this.generateMockTasksCount(15);
        return this.addMockProjectData([...tasks, ...additionalTasks]);
      })
    );

    this.completedTasks$ = this.allTasks$.pipe(
      map(tasks => tasks.filter(t => t.status === 'done').length)
    );
      
    this.inProgressTasks$ = this.allTasks$.pipe(
      map(tasks => tasks.filter(t => t.status === 'in-progress').length)
    );
      
    this.pendingReviewTasks$ = this.allTasks$.pipe(
      map(tasks => tasks.filter(t => t.status === 'review').length)
    );
      
    this.overdueTasks$ = this.allTasks$.pipe(
      map(tasks => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return tasks.filter(t => new Date(t.dueDate) < today && t.status !== 'done').length;
      })
    );
    
    this.paginatedTasks$ = combineLatest([
      this.allTasks$,
      this.pageSubject
    ]).pipe(
      map(([tasks, page]) => {
        const startIndex = (page - 1) * this.pageSize;
        return tasks.slice(startIndex, startIndex + this.pageSize);
      })
    );
    
    this.recentActivities$ = of([
      {
        type: 'completed',
        message: 'You completed task "Design homepage mockup"',
        time: '2 hours ago'
      },
      {
        type: 'comment',
        message: 'John Doe commented on your task "Implement user authentication"',
        time: '5 hours ago'
      },
      {
        type: 'assigned',
        message: 'You were assigned to "Write API documentation"',
        time: 'Yesterday'
      }
    ]);
  }

  private initializeBoardTasks(): void {
    this.boardTasks['website'] = [
      ...this.generateMockTasks('todo', 'website'),
      ...this.generateMockTasks('in-progress', 'website'),
      ...this.generateMockTasks('review', 'website'),
      ...this.generateMockTasks('done', 'website')
    ];
  }

  private generateMockTasks(status: string, boardId: string): Task[] {
    const today = new Date();
    const boardSpecificTasks = this.getBoardSpecificTasks('website', status as 'todo' | 'in-progress' | 'review' | 'done');
    
    return boardSpecificTasks.map(task => ({
      id: `${boardId}-${status}-${Math.random().toString(36).substring(2, 9)}`,
      title: task.title,
      description: task.description,
      dueDate: new Date(today.setDate(today.getDate() + task.daysDue)),
      status: status as any,
      priority: task.priority || 'medium',
      estimatedHours: task.estimatedHours || 4,
      assignee: this.currentUser.name,
      tags: task.tags || [],
      projectId: boardId,
      project: 'Website Redesign',
      completionDate: status === 'done' ? new Date(today.setDate(today.getDate() - 1)) : undefined
    }));
  }

  private getBoardSpecificTasks(
    boardId: 'website',
    status: 'todo' | 'in-progress' | 'review' | 'done'
  ): any[] {
    return {
      'website': {
        'todo': [
          { title: 'Design homepage layout', description: 'Create wireframes for the new homepage design', daysDue: 5, tags: ['design', 'ui'], priority: 'medium' },
          { title: 'Create style guide', description: 'Define color scheme and typography', daysDue: 7, tags: ['design'], priority: 'medium' }
        ],
        'in-progress': [
          { title: 'Implement header component', description: 'Build responsive header with navigation', daysDue: 3, tags: ['frontend'], priority: 'high' }
        ],
        'review': [
          { title: 'Mobile responsiveness fixes', description: 'Review fixes for mobile layout issues', daysDue: 2, tags: ['mobile', 'bug'], priority: 'medium' }
        ],
        'done': [
          { title: 'API documentation', description: 'Document all endpoints for backend services', daysDue: -1, tags: ['documentation'], priority: 'low' }
        ]
      }
    }[boardId][status];
  }

  getTasksForBoard(boardId: string, status: string): Task[] {
    return this.boardTasks[boardId]?.filter(task => task.status === status) || [];
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
    }
  }

  toggleViewAll() {
    this.showAll = !this.showAll;
    if (!this.showAll) {
      this.currentPage = 1;
      this.pageSubject.next(this.currentPage);
    }
  }

  nextPage() {
    this.currentPage++;
    this.pageSubject.next(this.currentPage);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.pageSubject.next(this.currentPage);
    }
  }

  private generateMockTasksCount(count: number): Task[] {
    const statuses: Array<'todo' | 'in-progress' | 'review' | 'done'> = ['todo', 'in-progress', 'review', 'done'];
    const tasks: Task[] = [];
    const today = new Date();
    
    for (let i = 0; i < count; i++) {
      const daysOffset = Math.floor(Math.random() * 30) - 15; // -15 to +15 days
      const dueDate = new Date(today);
      dueDate.setDate(today.getDate() + daysOffset);
      
      tasks.push({
        id: `mock-${i}`,
        title: `Task ${i + 1}`,
        description: `Description for task ${i + 1}`,
        dueDate: dueDate,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        assignee: this.currentUser.name,
        priority: 'medium',
        projectId: `project-${Math.floor(Math.random() * 5) + 1}`,
        tags: [],
        project: 'Mock Project'
      });
    }
    
    return tasks;
  }

  private addMockProjectData(tasks: Task[]): Task[] {
    const projects = ['Website Redesign', 'Mobile App', 'API Development', 'Marketing Site', 'Admin Dashboard'];
    return tasks.map(task => ({
      ...task,
      project: projects[Math.floor(Math.random() * projects.length)]
    }));
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

  isOverdue(dueDate?: Date): boolean {
    if (!dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(dueDate) < today;
  }

  formatDate(date?: Date): string {
    if (!date) return 'No date';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  openTaskDetails(task: Task): void {
    this.selectedTask = task;
    this.showTaskModal = true;
  }

  closeTaskDetails(): void {
    this.showTaskModal = false;
    this.selectedTask = null;
  }

  // Helper function for template
  Math = Math;
}