import { Injectable } from '@angular/core';
import { Project, Task } from '../../../model/user.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: Task[] = [
    {
      id: '1',
      title: 'Implement user authentication',
      description: 'Create login and registration pages',
      dueDate: new Date('2023-05-15'),
      status: 'in-progress',
      priority: 'high',
      assignee: 'John Doe',
      project: 'Website Redesign',
      projectId: '1',
      tags: ['frontend', 'security'],
      progress: 50
    },
    {
      id: '2',
      title: 'Design product page',
      description: 'Create mockups for the product listing page',
      dueDate: new Date('2023-05-10'),
      status: 'done',
      priority: 'medium',
      assignee: 'John Doe',
      project: 'Website Redesign',
      projectId: '1',
      tags: ['design', 'ui'],
      progress: 100
    }
  ];

  private projects: Project[] = [
    {
      id: '1',
      name: 'Website Redesign',
      lead: 'Thirunavukarasu KM',
      description: 'Complete redesign of company website',
      status: 'in-progress',
      progress: 65,
      startDate: new Date('2023-01-15'),
      endDate: new Date('2023-06-30'),
      teamMembers: ['2'],
      team: '',
      deadline: new Date('2023-06-30'),
      priority: 'high'
    }
  ];

  getTasks(): Observable<Task[]> {
    return of(this.tasks); // Wrap in Observable
  }

  getTasksByAssignee(assignee: string): Observable<Task[]> {
    return of(this.tasks.filter(task => task.assignee === assignee));
  }

  getTasksByProject(projectId: string): Observable<Task[]> {
    return of(this.tasks.filter(task => task.projectId === projectId));
  }

  getTaskById(id: string): Observable<Task | undefined> {
    return of(this.tasks.find(task => task.id === id));
  }

  updateTask(task: Task): void {
    const index = this.tasks.findIndex(t => t.id === task.id);
    if (index !== -1) {
      this.tasks[index] = task;
    }
  }

  getProjects(): Project[] {
    return this.projects;
  }

  getProjectById(id: string): Project | undefined {
    return this.projects.find(project => project.id === id);
  }
}