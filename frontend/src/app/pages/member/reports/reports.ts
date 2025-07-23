import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Project, Task } from '../../../model/user.model';
import { TaskService } from '../../../core/services/task/task';
import { UserService } from '../../../core/services/user/user';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.html',
  styleUrls: ['./reports.css']
})
export class Reports implements OnInit {
  assignedProjects: Project[] = [];
  reportData = {
    projectId: '',
    type: 'progress',
    startDate: '',
    endDate: '',
    includeTasks: true,
    includeComments: false,
    includeAttachments: false
  };
  generatedReport: any = null;
  currentUser: any;

  constructor(
    private taskService: TaskService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.userService.getUsers().find(user => user.id === '2');
    this.loadProjects();
    this.setDefaultDates();
  }

  loadProjects(): void {
    // In a real app, this would come from a service
    this.assignedProjects = [
      {
        id: '1',
        name: 'Website Redesign',
        lead: '2',
        description: 'Complete redesign of company website',
        status: 'in-progress',
        progress: 65,
        startDate: new Date('2023-01-15'),
        endDate: new Date('2023-06-30'),
        teamMembers: ['2'],
        team: '',
        deadline: new Date('2023-06-30'),
        priority: 'high'
      },
      {
        id: '2',
        name: 'Mobile App Development',
        lead: '3',
        description: 'Development of new mobile application',
        status: 'in-progress',
        progress: 30,
        startDate: new Date('2023-03-01'),
        endDate: new Date('2023-09-15'),
        teamMembers: ['2'],
        team: '',
        deadline: new Date('2023-09-15'),
        priority: 'medium'
      }
    ];
    
    if (this.assignedProjects.length > 0) {
      this.reportData.projectId = this.assignedProjects[0].id;
    }
  }

  setDefaultDates(): void {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    
    this.reportData.startDate = firstDay.toISOString().split('T')[0];
    this.reportData.endDate = today.toISOString().split('T')[0];
  }

  generateReport(): void {
    const project = this.assignedProjects.find(p => p.id === this.reportData.projectId);
    if (!project) return;
    
    this.taskService.getTasksByProject(this.reportData.projectId).subscribe((tasks: Task[]) => {
      const completedTasks = tasks.filter(t => t.status === 'done').length;
      
      this.generatedReport = {
        projectName: project.name,
        startDate: new Date(this.reportData.startDate),
        endDate: new Date(this.reportData.endDate),
        totalTasks: tasks.length,
        completedTasks: completedTasks,
        progress: project.progress,
        tasks: this.reportData.includeTasks ? tasks.map(t => ({
          ...t,
          progress: t.status === 'done' ? 100 : (t.status === 'in-progress' ? 50 : 0)
        })) : [],
        comments: this.reportData.includeComments ? [
          {
            author: this.currentUser.name,
            text: 'Initial design approved by client',
            date: new Date('2023-02-15')
          },
          {
            author: 'Project Manager',
            text: 'Please prioritize the user authentication tasks',
            date: new Date('2023-03-01')
          }
        ] : []
      };
    });
  }

  downloadReport(format: 'pdf' | 'excel'): void {
    // In a real app, this would generate and download the report
    alert(`Downloading report in ${format.toUpperCase()} format`);
  }

  getStatusClass(status?: string): string {
    switch(status) {
      case 'done':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'review':
        return 'bg-yellow-100 text-yellow-800';
      case 'todo':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusText(status?: string): string {
    switch(status) {
      case 'done':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      case 'review':
        return 'Pending Review';
      case 'todo':
        return 'To Do';
      default:
        return status || 'Unknown';
    }
  }

  isOverdue(dueDate: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(dueDate) < today;
  }
}