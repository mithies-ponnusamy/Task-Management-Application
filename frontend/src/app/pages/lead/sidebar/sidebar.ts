import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User, Project } from '../../../model/user.model';
import { ProjectService } from '../../../core/services/project/project';
import { UserService } from '../../../core/services/user/user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalService } from '../../../core/services/modal/modal';

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
export class Sidebar implements OnInit {
  @Input() currentUser: User | null = null;
  @Input() collapsed: boolean = false;

  projects: Project[] = [];
  showAllProjects = false;
  activeProjectId: string | null = null;

  constructor(
    private router: Router,
    private projectService: ProjectService,
    private userService: UserService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    if (this.currentUser && this.currentUser.team) {
      this.projects = this.projectService.getProjectsByTeam(this.currentUser.team);
    }
  }

  navigateTo(route: string): void {
    this.router.navigate([`/lead/${route}`]);
    this.activeProjectId = null;
  }
  
  navigateToProject(projectId: string): void {
      this.router.navigate(['/lead/dashboard'], { queryParams: { projectId: projectId } });
      this.activeProjectId = projectId;
  }

  isActive(route: string): boolean {
    // Check if the current URL path starts with the given route
    return this.router.url.split('?')[0] === `/lead/${route}`;
  }

  toggleAllProjects(): void {
    this.showAllProjects = !this.showAllProjects;
  }

  // --- Modal Triggers ---
  openCreateTaskModal(): void {
    this.modalService.openCreateTaskModal();
  }
  
  openManageTeamModal(): void {
    this.modalService.openManageTeamModal();
  }
  
  openProjectDetailsModal(project: Project, event: MouseEvent): void {
    event.stopPropagation(); // Prevents the navigation link from firing
    this.modalService.openProjectDetailsModal(project);
  }
  
  getProjectStatusColor(status: string): string {
    const colorMap: { [key: string]: string } = {
        'in-progress': 'bg-blue-500',
        'completed': 'bg-green-500',
        'on-hold': 'bg-yellow-500',
        'planning': 'bg-gray-400'
    };
    return colorMap[status] || 'bg-gray-300';
  }
}