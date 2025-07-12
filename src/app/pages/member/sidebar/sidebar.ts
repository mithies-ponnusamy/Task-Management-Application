import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Project, Task, User } from '../../../model/user.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SessionStorage } from '../../../core/services/session-storage/session-storage';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule
  ],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class Sidebar {
  @Input() currentUser: User | null = null;
  @Input() assignedProjects: Project[] = [];
  @Input() userTasks: Task[] = [];
  @Input() collapsed: boolean = false;
  @Output() toggleSidebar = new EventEmitter<void>();
  
  showAllProjects: boolean = false;
  showProjectDetails: boolean = false;
  selectedProject: Project | null = null;
  currentRoute: string = '';

  constructor(
    private router: Router
  ) {
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url.split('/')[2] || 'dashboard';
    });
  }

  navigateTo(route: string) {
    this.router.navigate([`/member/${route}`]);
    this.toggleSidebar.emit();
    this.resetViews();
  }

  isActive(route: string): boolean {
    return this.currentRoute === route;
  }

  toggleAllProjects() {
    this.showAllProjects = !this.showAllProjects;
  }

  viewProjectDetails(project: Project) {
    this.selectedProject = project;
    this.showProjectDetails = true;
  }

  resetViews() {
    this.showProjectDetails = false;
    this.selectedProject = null;
  }

  getUserTasks(projectId: string): Task[] {
    return this.userTasks.filter(task => 
      task.projectId === projectId && 
      task.assignee === this.currentUser?.id
    );
  }

  logout() {
    SessionStorage.clear();
    this.router.navigate(['/login']);
  }
}