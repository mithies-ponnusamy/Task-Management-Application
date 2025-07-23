// core/services/project/project.ts
import { Injectable } from '@angular/core';
import { Project } from '../../../model/user.model';
import { LocalStorageService } from '../local-storage/local-storage';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  constructor(private localStorage: LocalStorageService) {
     // Demo Setup: Initialize with some sample data if none exists.
    if (!this.localStorage.getProjects()) {
      this.addSampleDataForDemo();
    }
  }

  getProjects(): Project[] {
    return this.localStorage.getProjects<Project[]>() || [];
  }

  getProjectById(id: string): Project | undefined {
    return this.getProjects().find(p => p.id === id);
  }

  // Gets projects assigned to a specific team
  getProjectsByTeam(teamId: string): Project[] {
    if (!teamId) return [];
    return this.getProjects().filter(p => p.team === teamId);
  }

  addProject(project: Project): void {
    const projects = this.getProjects();
    projects.push(project);
    this.localStorage.saveProjects(projects);
  }

  private addSampleDataForDemo(): void {
    const sampleProjects: Project[] = [
      { id: 'proj-1', name: 'Website Redesign', lead: 'Hema Dharshini', team: 'team-alpha', status: 'in-progress', progress: 65, deadline: new Date('2025-08-30'), description: 'Complete overhaul of the main company website.', teamMembers: ['1', '2', '3'], startDate: new Date(), endDate: new Date(), priority: 'high' },
      { id: 'proj-2', name: 'Mobile App Launch', lead: 'Hema Dharshini', team: 'team-alpha', status: 'not-started', progress: 15, deadline: new Date('2025-09-20'), description: 'Develop and launch the new iOS and Android apps.', teamMembers: ['1', '2', '3'], startDate: new Date(), endDate: new Date(), priority: 'high' },
      { id: 'proj-3', name: 'Internal CRM Tool', lead: 'Another Lead', team: 'team-beta', status: 'completed', progress: 80, deadline: new Date('2025-08-15'), description: 'A project for another team.', teamMembers: [], startDate: new Date(), endDate: new Date(), priority: 'medium' }
    ];
    this.localStorage.saveProjects(sampleProjects);
  }
}