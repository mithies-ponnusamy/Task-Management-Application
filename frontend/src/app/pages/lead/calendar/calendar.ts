// calendar.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../../core/services/project/project';
import { TaskService } from '../../../core/services/task/task';
import { UserService } from '../../../core/services/user/user';
import { addDays, addMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, subMonths, addWeeks, subWeeks } from 'date-fns';

interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    type: 'deadline' | 'task';
    color: string;
    data: any; // Original project or task object
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule
  ],
  templateUrl: './calendar.html',
  styleUrls: ['./calendar.css']
})
export class Calendar implements OnInit {
  currentMonth: Date = new Date();
  selectedDay: Date = new Date();
  viewMode: 'month' | 'week' | 'day' = 'month';
  weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  calendarDays: { date: Date; isCurrentMonth: boolean; isToday: boolean }[] = [];
  events: CalendarEvent[] = [];
  
  eventModalOpen = false;
  selectedEvent: CalendarEvent | null = null;

  constructor(
    private projectService: ProjectService,
    private taskService: TaskService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadEvents();
    this.generateCalendar();
  }

  generateCalendar(): void {
    const monthStart = startOfMonth(this.currentMonth);
    const monthEnd = endOfMonth(this.currentMonth);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);

    this.calendarDays = [];
    let day = calendarStart;
    while (day <= calendarEnd) {
      this.calendarDays.push({
        date: day,
        isCurrentMonth: isSameMonth(day, this.currentMonth),
        isToday: isSameDay(day, new Date())
      });
      day = addDays(day, 1);
    }
  }

  loadEvents(): void {
    const currentUser = this.userService.getCurrentUser();
    if (!currentUser?.team) return;

    const teamProjects = this.projectService.getProjectsByTeam(currentUser.team);
    const projectIds = teamProjects.map(p => p.id);
    
    // Project deadlines as events
    const projectEvents: CalendarEvent[] = teamProjects.map(project => ({
      id: `project-${project.id}`,
      title: `${project.name} Deadline`,
      start: new Date(project.deadline),
      end: new Date(project.deadline),
      type: 'deadline',
      color: 'bg-red-200 text-red-900 border-red-300',
      data: project
    }));

    // Tasks as events
    this.taskService.getTasks().subscribe(tasks => {
      const taskEvents: CalendarEvent[] = tasks
        .filter(task => projectIds.includes(task.projectId))
        .map(task => ({
          id: `task-${task.id}`,
          title: task.title,
          start: new Date(task.dueDate),
          end: new Date(task.dueDate),
          type: 'task',
          color: this.getTaskColor(task.status),
          data: task
        }));
        
      this.events = [...projectEvents, ...taskEvents];
    });
  }
  
  getEventsForDay(date: Date): CalendarEvent[] {
    return this.events.filter(event => isSameDay(event.start, date));
  }
  
  getTaskColor(status: string): string {
    switch (status) {
      case 'done': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'review': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  // Navigation
  previousMonth = () => { this.currentMonth = subMonths(this.currentMonth, 1); this.generateCalendar(); };
  nextMonth = () => { this.currentMonth = addMonths(this.currentMonth, 1); this.generateCalendar(); };
  goToToday = () => { this.currentMonth = new Date(); this.generateCalendar(); };
  
  // Modals
  viewEvent(event: CalendarEvent): void {
    this.selectedEvent = event;
    this.eventModalOpen = true;
  }
  
  getProjectName(projectId: string): string {
    return this.projectService.getProjectById(projectId)?.name || 'Unknown Project';
  }
}