import { Component, Input, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { User, Project } from '../../../model/user.model';
import { Auth } from '../../../core/services/auth/auth';
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
  styleUrls: ['./sidebar.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Sidebar implements OnInit {
  @Input() currentUser: User | null = null;
  @Input() collapsed: boolean = false;

  projects: Project[] = [];
  teamMembers: any[] = [];
  teamData: any = null;
  showAllProjects = false;
  activeProjectId: string | null = null;
  userProfileImage: string = 'assets/default-avatar.png';

  constructor(
    private router: Router,
    private authService: Auth,
    private modalService: ModalService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadProjects();
    this.loadTeamData();
  }

  loadCurrentUser(): void {
    // Get current user profile with updated information
    this.authService.leadGetProfile().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.userProfileImage = user?.profileImg || 'assets/default-avatar.png';
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error loading current user:', err);
        // Fallback to stored user data
        this.currentUser = this.authService.getCurrentUser();
        this.userProfileImage = this.currentUser?.profileImg || 'assets/default-avatar.png';
        this.cdr.markForCheck();
      }
    });
  }

  loadTeamData(): void {
    this.authService.leadGetTeam().subscribe({
      next: (teamData) => {
        this.teamData = teamData;
        this.teamMembers = teamData?.members || [];
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading team data:', error);
        this.teamMembers = [];
        this.cdr.markForCheck();
      }
    });
  }

  loadProjects(): void {
    this.authService.leadGetProjects().subscribe({
      next: (projects) => {
        this.projects = projects.map(project => ({
          id: project._id || project.id,
          name: project.name,
          lead: project.lead?.name || project.lead,
          team: project.team?.name || project.team,
          status: project.status,
          progress: project.progress || 0,
          deadline: new Date(project.deadline),
          description: project.description,
          teamMembers: project.teamMembers || [], // Fixed field name
          startDate: new Date(project.startDate),
          endDate: new Date(project.endDate),
          priority: project.priority
        }));
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error loading projects:', err);
        this.projects = []; // Set empty array on error
        this.cdr.markForCheck();
      }
    });
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