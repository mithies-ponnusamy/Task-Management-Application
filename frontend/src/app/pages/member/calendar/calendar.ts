import { Component, OnInit } from '@angular/core';
import { Task, User } from '../../../model/user.model';
import { TaskService } from '../../../core/services/task/task';
import { UserService } from '../../../core/services/user/user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calendar.html',
  styleUrls: ['./calendar.css']
})
export class Calendar implements OnInit {
  currentUser!: User;
  currentMonth: Date = new Date();
  selectedDay: Date = new Date();
  view: 'month' | 'week' | 'day' = 'month';
  weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  hours = Array.from({length: 24}, (_, i) => i);
  calendarDays: any[] = [];
  currentWeekDays: Date[] = [];
  upcomingTasks: Task[] = [];
  showTaskModal = false;
  selectedTask: Task | null = null;

  constructor(
    private taskService: TaskService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.userService.getUsers().find(user => user.id === '2')!;
    this.generateCalendarDays();
    this.generateWeekDays();
    this.loadTasks();
  }

  generateCalendarDays(): void {
    this.calendarDays = [];
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Days from previous month to show
    const prevMonthDays = firstDay.getDay();
    // Days from next month to show
    const nextMonthDays = 6 - lastDay.getDay();
    
    // Total days to show (usually 42)
    const totalDays = prevMonthDays + lastDay.getDate() + nextMonthDays;
    
    // Generate days
    for (let i = 0; i < totalDays; i++) {
      const date = new Date(year, month, 1 - prevMonthDays + i);
      const isCurrentMonth = date.getMonth() === month;
      const isToday = this.isToday(date);
      
      this.calendarDays.push({
        date,
        isCurrentMonth,
        isToday
      });
    }
  }

  generateWeekDays(): void {
    const today = new Date();
    const currentDay = today.getDay();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - currentDay);
    
    this.currentWeekDays = Array.from({length: 7}, (_, i) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      return date;
    });
  }

  loadTasks(): void {
    this.taskService.getTasksByAssignee(this.currentUser.name).subscribe(tasks => {
      // Add mock tasks for demonstration
      const mockTasks = this.generateMockTasks();
      this.upcomingTasks = [...tasks, ...mockTasks]
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    });
  }

  generateMockTasks(): Task[] {
    const today = new Date();
    const tasks: Task[] = [];
    
    // Overdue task
    tasks.push({
      id: '101',
      title: 'Complete project proposal',
      description: 'Finalize and submit the project proposal document',
      dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2),
      status: 'todo',
      priority: 'high',
      assignee: this.currentUser.name,
      project: 'Website Redesign',
      projectId: '1',
      tags: ['documentation'],
      startTime: '09:00',
      endTime: '11:00'
    });
    
    // Today's task
    tasks.push({
      id: '102',
      title: 'Team meeting',
      description: 'Weekly team sync meeting',
      dueDate: new Date(today),
      status: 'in-progress',
      priority: 'medium',
      assignee: this.currentUser.name,
      project: 'Website Redesign',
      projectId: '1',
      tags: ['meeting'],
      startTime: '14:00',
      endTime: '15:00'
    });
    
    // Upcoming task
    tasks.push({
      id: '103',
      title: 'Implement user authentication',
      description: 'Create login and registration pages',
      dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3),
      status: 'todo',
      priority: 'high',
      assignee: this.currentUser.name,
      project: 'Website Redesign',
      projectId: '1',
      tags: ['frontend', 'security'],
      startTime: '10:00',
      endTime: '12:00'
    });
    
    return tasks;
  }

  getTasksForDay(date: Date): Task[] {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);
    
    return this.upcomingTasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return taskDate >= dayStart && taskDate <= dayEnd;
    });
  }

  getTasksForTimeSlot(day: Date, hour: number): Task[] {
    const slotStart = new Date(day);
    slotStart.setHours(hour, 0, 0, 0);
    
    const slotEnd = new Date(day);
    slotEnd.setHours(hour + 1, 0, 0, 0);
    
    return this.upcomingTasks.filter(task => {
      if (!task.startTime) return false;
      
      const [taskHour, taskMinute] = task.startTime.split(':').map(Number);
      const taskStart = new Date(day);
      taskStart.setHours(taskHour, taskMinute, 0, 0);
      
      return taskStart >= slotStart && taskStart < slotEnd;
    });
  }

  getTaskPosition(task: Task, hour?: number): string {
    if (!task.startTime) return '0px';
    
    const [taskHour, taskMinute] = task.startTime.split(':').map(Number);
    
    if (this.view === 'day') {
      // Position in day view
      const minutesFromTop = taskHour * 60 + taskMinute;
      return `${minutesFromTop}px`;
    } else if (this.view === 'week' && hour !== undefined) {
      // Position in week view
      const minutesFromTop = (taskHour - hour) * 60 + taskMinute;
      return `${minutesFromTop}px`;
    }
    
    return '0px';
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  }

  isOverdue(dueDate: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(dueDate) < today;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  }

  formatTime(time: string | undefined): string {
    if (!time) return '';
    
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
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

  previousMonth(): void {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() - 1,
      1
    );
    this.generateCalendarDays();
  }

  nextMonth(): void {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() + 1,
      1
    );
    this.generateCalendarDays();
  }

  goToToday(): void {
    this.currentMonth = new Date();
    this.selectedDay = new Date();
    this.generateCalendarDays();
    this.generateWeekDays();
  }

  changeView(view: 'month' | 'week' | 'day'): void {
    this.view = view;
    if (view === 'week') {
      this.generateWeekDays();
    }
  }

  openTaskDetails(task: Task): void {
    this.selectedTask = task;
    this.showTaskModal = true;
  }

  closeTaskDetails(): void {
    this.showTaskModal = false;
    this.selectedTask = null;
  }

  updateTaskStatus(status: string): void {
    if (this.selectedTask) {
      this.selectedTask.status = status as any;
      if (status === 'done') {
        this.selectedTask.completionDate = new Date();
      }
      this.closeTaskDetails();
    }
  }

  openEditTaskModal(): void {
    // In a real app, this would open a form to edit the task
    alert('Edit task functionality would open here');
    this.closeTaskDetails();
  }
}