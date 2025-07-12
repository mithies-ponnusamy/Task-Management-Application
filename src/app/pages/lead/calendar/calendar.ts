import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../../core/services/project/project';
import { TaskService } from '../../../core/services/task/task';
import { addDays, addMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, 
  isSameMonth, isSameDay, format, addWeeks, subMonths, subWeeks, getDay } from 'date-fns';

@Component({
  selector: 'app-lead-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calendar.html',
  styleUrls: ['./calendar.css']
})
export class Calendar implements OnInit {
  currentMonth: Date = new Date();
  selectedDay: Date = new Date();
  viewMode: 'month' | 'week' | 'day' = 'month';
  weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  hours = Array.from({length: 24}, (_, i) => i);
  calendarDays: any[] = [];
  weekDays: any[] = [];
  events: any[] = [];
  eventModalOpen = false;
  selectedEvent: any = null;

  constructor(
    private projectService: ProjectService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.generateCalendar();
    this.loadEvents();
  }

  generateCalendar(): void {
    if (this.viewMode === 'month') {
      this.generateMonthView();
    } else if (this.viewMode === 'week') {
      this.generateWeekView();
    }
  }

  generateMonthView(): void {
    const startDate = startOfMonth(this.currentMonth);
    const endDate = endOfMonth(this.currentMonth);
    const startWeek = startOfWeek(startDate);
    const endWeek = endOfWeek(endDate);

    this.calendarDays = [];
    let currentDate = startWeek;

    while (currentDate <= endWeek) {
      this.calendarDays.push({
        date: new Date(currentDate),
        isCurrentMonth: isSameMonth(currentDate, this.currentMonth),
        isToday: isSameDay(currentDate, new Date())
      });
      currentDate = addDays(currentDate, 1);
    }
  }

  generateWeekView(): void {
    const startDate = startOfWeek(this.currentMonth);
    this.weekDays = [];
    
    for (let i = 0; i < 7; i++) {
      this.weekDays.push({
        date: addDays(startDate, i)
      });
    }
  }

  loadEvents(): void {
    // Load project deadlines
    const projects = this.projectService.getProjects();
    this.events = projects.map(project => ({
      id: `project-${project.id}`,
      title: `${project.name} Deadline`,
      description: `Deadline for ${project.name} project`,
      start: new Date(project.deadline),
      end: new Date(project.deadline),
      projectId: project.id,
      type: 'deadline',
      color: 'bg-red-100 text-red-800 border-red-200'
    }));

    // Load tasks with due dates
    const tasks = this.taskService.getTasks();
    (Array.isArray(tasks) ? tasks : []).forEach((task: any) => {
      if (task && task.dueDate) {
        this.events.push({
          id: `task-${task.id}`,
          title: task.title,
          description: task.description,
          start: new Date(task.dueDate),
          end: new Date(task.dueDate),
          projectId: task.projectId,
          status: task.status,
          type: 'task',
          color: this.getTaskColor(task)
        });
      }
    });
  }

  getTaskColor(task: any): string {
    switch (task.status) {
      case 'done': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'review': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  getEventsForDay(date: Date): any[] {
    return this.events.filter(event => 
      isSameDay(new Date(event.start), date)
    );
  }

  getEventsForDayAndHour(date: Date, hour: number): any[] {
    return this.events.filter(event => {
      const eventDate = new Date(event.start);
      return isSameDay(eventDate, date) && eventDate.getHours() === hour;
    });
  }

  getEventPosition(event: any, hour: number): number {
    const eventDate = new Date(event.start);
    return (eventDate.getMinutes() / 60) * 64; // 64px per hour
  }

  getEventHeight(event: any): number {
    if (!event.end) return 16;
    const duration = (new Date(event.end).getTime() - new Date(event.start).getTime()) / (1000 * 60 * 60);
    return duration * 64; // 64px per hour
  }

  getEventColor(event: any): string {
    return event.color || 'bg-gray-100 text-gray-800 border-gray-200';
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'done': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'review': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getProjectName(projectId: string): string {
    const project = this.projectService.getProjects().find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  }

  previousMonth(): void {
    this.currentMonth = subMonths(this.currentMonth, 1);
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentMonth = addMonths(this.currentMonth, 1);
    this.generateCalendar();
  }

  previousWeek(): void {
    this.currentMonth = subWeeks(this.currentMonth, 1);
    this.generateCalendar();
  }

  nextWeek(): void {
    this.currentMonth = addWeeks(this.currentMonth, 1);
    this.generateCalendar();
  }

  goToToday(): void {
    this.currentMonth = new Date();
    this.selectedDay = new Date();
    this.generateCalendar();
  }

  changeViewMode(): void {
    this.generateCalendar();
  }

  viewEvent(event: any): void {
    this.selectedEvent = event;
    this.eventModalOpen = true;
  }

  editEvent(): void {
    // In a real app, you would navigate to edit the task/project
    console.log('Edit event:', this.selectedEvent);
    this.eventModalOpen = false;
  }

  deleteEvent(): void {
    // In a real app, you would delete the task/project
    console.log('Delete event:', this.selectedEvent);
    this.events = this.events.filter(e => e.id !== this.selectedEvent.id);
    this.eventModalOpen = false;
  }

  openAddEventModal(date: Date): void {
    // In a real app, you would open a modal to add a new task/event
    console.log('Add event on:', date);
  }
}