import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { Project, Task, User } from '../../../model/user.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SessionStorage } from '../../../core/services/session-storage/session-storage';
import { ProjectService } from '../../../core/services/project/project';
import { Subscription } from 'rxjs';

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
export class Sidebar implements OnInit, OnDestroy, OnChanges {
  @Input() currentUser: User | null = null;
  @Input() userTasks: Task[] = [];
  @Input() collapsed: boolean = false;
  @Output() toggleSidebar = new EventEmitter<void>();
  
  assignedProjects: Project[] = [];
  showAllProjects: boolean = false;
  showProjectDetails: boolean = false;
  selectedProject: Project | null = null;
  currentRoute: string = '';
  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private projectService: ProjectService
  ) {
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url.split('/')[2] || 'dashboard';
    });
  }

  ngOnInit(): void {
    if (this.currentUser) {
      this.loadTeamProjects();
    }
  }

  ngOnChanges(): void {
    if (this.currentUser) {
      this.loadTeamProjects();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private loadTeamProjects(): void {
    this.assignedProjects = [];
    
    if (!this.currentUser) {
      console.log('DEBUG: No current user available');
      return;
    }

    console.log('DEBUG: Current user:', this.currentUser);
    console.log('DEBUG: User team:', this.currentUser.team);

    // Use backend API to get projects assigned to user's team
    const subscription = this.projectService.getMyProjects().subscribe({
      next: (projects: Project[]) => {
        console.log('DEBUG: Projects from backend:', projects);
        this.assignedProjects = projects;
      },
      error: (error) => {
        console.error('Error loading team projects:', error);
        // Fallback: use local method if backend fails
        this.loadTeamProjectsFromLocal();
      }
    });
    
    this.subscriptions.push(subscription);
  }

  private loadTeamProjectsFromLocal(): void {
    const allProjects = this.projectService.getProjects();
    console.log('DEBUG: All projects (fallback):', allProjects);

    // Method 1: Get projects assigned to user's team
    if (this.currentUser && this.currentUser.team) {
      const teamProjects = allProjects.filter(project => {
        console.log(`DEBUG: Checking project ${project.name} - project.team: '${project.team}' vs user.team: '${this.currentUser!.team}'`);
        return project.team === this.currentUser!.team;
      });
      console.log('DEBUG: Team projects found:', teamProjects);
      this.assignedProjects = [...this.assignedProjects, ...teamProjects];
    }

    // Method 2: Get projects where user is explicitly listed as team member
    const memberProjects = allProjects.filter(project => {
      const isTeamMember = project.teamMembers?.includes(this.currentUser?.id || '');
      const notAlreadyAdded = !this.assignedProjects.find(p => p.id === project.id);
      console.log(`DEBUG: Project ${project.name} - teamMembers: ${project.teamMembers}, includes user ${this.currentUser?.id}: ${isTeamMember}, not already added: ${notAlreadyAdded}`);
      return isTeamMember && notAlreadyAdded;
    });
    console.log('DEBUG: Member projects found:', memberProjects);
    this.assignedProjects = [...this.assignedProjects, ...memberProjects];

    // Method 3: If user still has no projects and has a team, try the ProjectService method
    if (this.assignedProjects.length === 0 && this.currentUser?.team) {
      const serviceTeamProjects = this.projectService.getProjectsByTeam(this.currentUser.team);
      console.log('DEBUG: Service team projects:', serviceTeamProjects);
      this.assignedProjects = [...this.assignedProjects, ...serviceTeamProjects];
    }

    console.log('DEBUG: Final assigned projects:', this.assignedProjects);
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