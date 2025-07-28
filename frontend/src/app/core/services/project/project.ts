// core/services/project/project.ts
import { Injectable } from '@angular/core';
import { Project } from '../../../model/user.model';
import { LocalStorageService } from '../local-storage/local-storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = '/api/projects';
  
  constructor(
    private localStorage: LocalStorageService,
    private http: HttpClient
  ) {
    // Demo Setup: Initialize with some sample data if none exists for fallback
    if (!this.localStorage.getProjects()) {
      this.addSampleDataForDemo();
    }
  }

  private getToken(): string | null {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  // Get projects assigned to the current user's team (from backend)
  getMyProjects(): Observable<Project[]> {
    return this.http.get<Project[]>('/api/users/my-projects', { headers: this.getAuthHeaders() }).pipe(
      catchError((error) => {
        console.warn('Failed to fetch user projects from backend, falling back to local storage:', error);
        // Fallback to local storage filtering
        const localProjects = this.getProjects();
        const userTeam = this.getUserTeamFromStorage();
        const filteredProjects = userTeam ? localProjects.filter(p => p.team === userTeam) : localProjects;
        return of(filteredProjects);
      })
    );
  }

  // Fallback method for local storage (kept for development/demo)
  getProjects(): Project[] {
    return this.localStorage.getProjects<Project[]>() || [];
  }

  getProjectById(id: string): Project | undefined {
    return this.getProjects().find(p => p.id === id);
  }

  // Gets projects assigned to a specific team (local storage fallback)
  getProjectsByTeam(teamId: string): Project[] {
    if (!teamId) return [];
    return this.getProjects().filter(p => p.team === teamId);
  }

  private getUserTeamFromStorage(): string | null {
    // Try to get user team from local storage or session storage
    const userStr = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return user.team || null;
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  addProject(project: Project): void {
    const projects = this.getProjects();
    projects.push(project);
    this.localStorage.saveProjects(projects);
  }  private addSampleDataForDemo(): void {
    const sampleProjects: Project[] = [
      { id: 'proj-1', name: 'Website Redesign', lead: 'Hema Dharshini', team: 'team-alpha', status: 'in-progress', progress: 65, deadline: new Date('2025-08-30'), description: 'Complete overhaul of the main company website.', teamMembers: ['1', '2', '3'], startDate: new Date(), endDate: new Date(), priority: 'high' },
      { id: 'proj-2', name: 'Mobile App Launch', lead: 'Hema Dharshini', team: 'team-alpha', status: 'not-started', progress: 15, deadline: new Date('2025-09-20'), description: 'Develop and launch the new iOS and Android apps.', teamMembers: ['1', '2', '3'], startDate: new Date(), endDate: new Date(), priority: 'high' },
      { id: 'proj-3', name: 'Internal CRM Tool', lead: 'Another Lead', team: 'team-beta', status: 'completed', progress: 80, deadline: new Date('2025-08-15'), description: 'A project for another team.', teamMembers: [], startDate: new Date(), endDate: new Date(), priority: 'medium' }
    ];
    this.localStorage.saveProjects(sampleProjects);
  }
}