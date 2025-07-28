// dashboard.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Task, User } from '../../../model/user.model';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TaskService } from '../../../core/services/task/task';
import { Auth } from '../../../core/services/auth/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit, OnDestroy {
  completedTasks$!: Observable<number>;
  inProgressTasks$!: Observable<number>;
  pendingReviewTasks$!: Observable<number>;
  overdueTasks$!: Observable<number>;
  allTasks$!: Observable<Task[]>;
  recentActivities$!: Observable<any[]>;
  currentUser: User | null = null;

  loading: boolean = true;
  
  private profileSubscription: Subscription | null = null;

  constructor(
    private taskService: TaskService,
    private authService: Auth
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  ngOnDestroy(): void {
    if (this.profileSubscription) {
      this.profileSubscription.unsubscribe();
    }
  }

  private loadUserData(): void {
    this.loading = true;
    
    // Get current user from auth service
    this.currentUser = this.authService.getCurrentUser();
    
    // Load fresh user data from backend
    this.profileSubscription = this.authService.getUserProfile().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.initializeData();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
        // Fallback to stored user data
        this.currentUser = this.authService.getCurrentUser();
        if (this.currentUser) {
          this.initializeData();
        }
        this.loading = false;
      }
    });
  }

  private initializeData(): void {
    if (!this.currentUser) return;
    
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
    
    this.recentActivities$ = this.taskService.getTasksByAssignee(this.currentUser.name).pipe(
      map(tasks => {
        const activities: any[] = [];
        
        // Get recent task assignments (tasks created in last 7 days)
        const recentTasks = tasks.filter(task => {
          const taskDate = new Date(task.createdAt || new Date());
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          return taskDate >= sevenDaysAgo;
        });

        // Add task assignment activities
        recentTasks.forEach(task => {
          activities.push({
            type: 'task_assigned',
            message: `You were assigned to "${task.title}" in project ${task.project || 'Unknown'}`,
            time: this.getRelativeTime(task.createdAt || new Date()),
            taskId: task.id
          });
        });

        // Add task completion activities
        const completedTasks = tasks.filter(task => 
          task.status === 'done' && task.completionDate
        ).slice(0, 3);

        completedTasks.forEach(task => {
          activities.push({
            type: 'task_completed',
            message: `You completed "${task.title}"`,
            time: this.getRelativeTime(task.completionDate!),
            taskId: task.id
          });
        });

        // Add deadline reminders for upcoming tasks
        const upcomingTasks = tasks.filter(task => {
          if (!task.dueDate || task.status === 'done') return false;
          const dueDate = new Date(task.dueDate);
          const today = new Date();
          const threeDaysFromNow = new Date();
          threeDaysFromNow.setDate(today.getDate() + 3);
          return dueDate >= today && dueDate <= threeDaysFromNow;
        }).slice(0, 2);

        upcomingTasks.forEach(task => {
          activities.push({
            type: 'deadline_reminder',
            message: `"${task.title}" is due ${this.getRelativeTime(task.dueDate!)}`,
            time: 'Reminder',
            taskId: task.id
          });
        });

        // Sort by most recent and limit to 5
        return activities.slice(0, 5);
      })
    );
  }

  private generateMockTasksCount(count: number): Task[] {
    const mockTasks: Task[] = [];
    const statuses: ('todo' | 'in-progress' | 'review' | 'done')[] = ['todo', 'in-progress', 'review', 'done'];
    const priorities: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
    
    for (let i = 0; i < count; i++) {
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      const randomPriority = priorities[Math.floor(Math.random() * priorities.length)];
      
      mockTasks.push({
        id: `mock-${i}`,
        title: `Task ${i + 1}`,
        description: `Description for task ${i + 1}`,
        dueDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
        status: randomStatus,
        priority: randomPriority,
        estimatedHours: Math.floor(Math.random() * 8) + 1,
        assignee: this.currentUser?.name || 'Unknown',
        tags: ['mock', 'task'],
        projectId: 'mock-project',
        project: 'Mock Project',
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        completionDate: randomStatus === 'done' ? new Date() : undefined
      });
    }
    
    return mockTasks;
  }

  private addMockProjectData(tasks: Task[]): Task[] {
    return tasks.map(task => ({
      ...task,
      project: task.project || 'Website Redesign',
      projectId: task.projectId || 'proj-1'
    }));
  }

  private getRelativeTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return new Date(date).toLocaleDateString();
  }

  // Helper function for template
  Math = Math;
}
