import { Injectable } from '@angular/core';
import { Project } from '../../../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projects: Project[] = [
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

  getProjects(): Project[] {
    return this.projects;
  }

  addProject(project: any) {
    this.projects.push(project);
  }
}