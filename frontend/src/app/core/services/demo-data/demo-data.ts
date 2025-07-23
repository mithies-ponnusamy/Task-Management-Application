// demo-data.service.ts
import { Injectable } from '@angular/core';
import * as bcrypt from 'bcryptjs';
import { LocalStorageService } from '../local-storage/local-storage';
import { Project, Team, User, UserRole } from '../../../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class DemoDataService {
  constructor(private localStorage: LocalStorageService) {}

  initializeDemoData(): void {
    this.initializeDemoUsers();
    this.initializeDemoTeams();
    this.initializeDemoProjects();
  }

  private initializeDemoUsers(): void {
    const demoUsers: User[] = [
      {
        id: '1',
        email: 'admin@genworx.ai',
        role: UserRole.ADMIN,
        name: 'Admin User',
        username: 'admin',
        status: "active",
        password: '@admin123' // Add password
      },
      {
        id: '2',
        email: 'mithiesoff@gmail.com',
        role: UserRole.LEAD,
        name: 'Lead User',
        username: 'leaduser',
        status: "active",
        password: '@Mithies2315' // Add password
      },
      {
        id: '3',
        email: 'mithiesofficial@gmail.com',
        role: UserRole.USER,
        name: 'Teammate User',
        username: 'teammateuser',
        status: "active",
        password: '@Mithies2317' // Add password
      }
    ];

    if (!this.localStorage.get('users')) {
      this.localStorage.set('users', demoUsers);
    }
  }

  private initializeDemoTeams(): void {
    const demoTeams: Team[] = [
      {
        id: '1',
        name: 'Development',
        department: 'Engineering',
        lead: 'Team Lead',
        members: 8,
        projects: 5,
        completionRate: 75,
        description: 'Handles all development tasks',
        parentTeam: null,
        subTeams: []
      },
      {
        id: '2',
        name: 'Design',
        department: 'Creative',
        lead: 'Design Lead',
        members: 4,
        projects: 3,
        completionRate: 85,
        description: 'Responsible for product design',
        parentTeam: null,
        subTeams: []
      }
    ];

    if (!this.localStorage.get('teams')) {
      this.localStorage.set('teams', demoTeams);
    }
  }

  private initializeDemoProjects(): void {
    const demoProjects: Project[] = [
      {
        id: '1',
        name: 'Website Redesign',
        lead: 'Thirunavukarasu KM',
        team: 'Development',
        status: 'in-progress',
        progress: 65,
        startDate: '2024-06-01',
        deadline: '2024-07-01',
        priority: 'high'
      },
      {
        id: '2',
        name: 'Mobile App',
        lead: 'Hema Dharshini',
        team: 'Development',
        status: 'in-progress',
        progress: 30,
        startDate: '2024-06-10',
        deadline: '2024-08-15',
        priority: 'medium'
      }
    ];

    if (!this.localStorage.get('projects')) {
      this.localStorage.set('projects', demoProjects);
    }
  }
}