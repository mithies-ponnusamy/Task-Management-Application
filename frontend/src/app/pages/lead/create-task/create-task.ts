import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faArrowLeft, faSave, faTimes, faProjectDiagram, 
  faCalendarAlt, faFlag, faUser, faClock, faPlus, faTrash, faTasks
} from '@fortawesome/free-solid-svg-icons';
import { Auth } from '../../../core/services/auth/auth';
import { ToastService } from '../../../core/services/toast/toast';
import { Task, Project, Sprint, User } from '../../../model/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './create-task.html',
  styleUrls: ['./create-task.css']
})
export class CreateTask implements OnInit, OnDestroy {
  // Font Awesome icons
  faArrowLeft = faArrowLeft;
  faSave = faSave;
  faTimes = faTimes;
  faProjectDiagram = faProjectDiagram;
  faCalendarAlt = faCalendarAlt;
  faFlag = faFlag;
  faUser = faUser;
  faClock = faClock;
  faPlus = faPlus;
  faTrash = faTrash;
  faTasks = faTasks;

  // Data properties
  projects: Project[] = [];
  allSprints: Sprint[] = [];
  filteredSprints: Sprint[] = [];
  teamMembers: User[] = [];

  // Form data
  newTask: Partial<Task> = this.initializeTask();

  // Form states
  isSubmitting = false;
  taskFormErrors: any = {};

  // Options
  priorities = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ];

  taskStatuses = [
    { value: 'todo', label: 'To Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'review', label: 'In Review' },
    { value: 'done', label: 'Done' }
  ];

  private subscriptions: Subscription[] = [];

  constructor(
    private authService: Auth,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('=== CreateTask Component Initialized ===');
    this.loadInitialData();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private loadInitialData(): void {
    // Load projects first, then load other data
    const projectsSub = this.authService.leadGetProjects().subscribe({
      next: (projects: any[]) => {
        console.log('Create-task: Raw projects received:', projects);
        // Process projects to ensure consistent ID format
        this.projects = projects.map(project => ({
          ...project,
          id: project._id || project.id
        }));
        console.log('Create-task: Processed projects:', this.projects.map(p => ({ 
          id: p.id, 
          _id: (p as any)._id, 
          name: p.name 
        })));
        this.loadTeamMembers();
        this.loadSprints();
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        this.toastService.show('Failed to load projects', 'error');
      }
    });

    this.subscriptions.push(projectsSub);
  }

  private loadTeamMembers(): void {
    const teamSub = this.authService.leadGetTeam().subscribe({
      next: (teamData: any) => {
        console.log('DEBUG: Team data for create task:', teamData);
        this.teamMembers = teamData.members || [];
        console.log('DEBUG: Team members for task creation:', this.teamMembers);
      },
      error: (error: any) => {
        console.error('Error loading team members:', error);
      }
    });

    this.subscriptions.push(teamSub);
  }

  private loadSprints(): void {
    console.log('Loading sprints for projects:', this.projects.length);
    
    if (this.projects.length > 0) {
      const sprintsSub = this.authService.leadGetSprints().subscribe({
        next: (sprints) => {
          console.log('Raw sprints received:', sprints);
          
          // Process sprints to ensure projectId is available for frontend use
          this.allSprints = sprints.map(sprint => {
            const processedSprint = {
              ...sprint,
              id: (sprint as any)._id || sprint.id,
              projectId: typeof sprint.project === 'string' ? sprint.project : (sprint.project as any)?._id || (sprint.project as any)?.id
            };
            console.log('Processed sprint:', processedSprint.name, 'for project:', processedSprint.projectId);
            return processedSprint;
          }).filter(sprint => {
            // Filter out sprints without valid project references
            const hasValidProject = sprint.projectId && sprint.projectId !== 'undefined';
            if (!hasValidProject) {
              console.warn('Create-task: Filtering out sprint without valid project:', sprint.name);
            }
            return hasValidProject;
          });
          
          this.filteredSprints = []; // Initially no project selected, so no sprints shown
          console.log('Total valid sprints loaded:', this.allSprints.length);
        },
        error: (error) => {
          console.error('Error loading sprints:', error);
          this.toastService.show('Failed to load sprints', 'error');
        }
      });

      this.subscriptions.push(sprintsSub);
    } else {
      console.log('No projects available, skipping sprint loading');
    }
  }

  private initializeTask(): Partial<Task> {
    const initialTask = {
      title: '',
      description: '',
      projectId: '',
      sprintId: '',
      assignee: '',
      priority: 'medium' as const,
      status: 'todo' as const,
      dueDate: undefined,
      storyPoints: 1,
      attachments: []
    };
    console.log('Initialized task:', initialTask);
    return initialTask;
  }

  onProjectChange(event: any): void {
    // Get the actual selected value from the event
    const selectedProjectId = event.target.value;
    console.log('=== Project Change Event ===');
    console.log('Event target value:', selectedProjectId);
    console.log('Event target type:', typeof selectedProjectId);
    console.log('Previous projectId:', this.newTask.projectId);
    console.log('Available projects for comparison:');
    this.projects.forEach(p => {
      console.log(`  Project: ${p.name}, ID: "${p.id}" (type: ${typeof p.id})`);
    });
    
    // Update the model with the selected value
    this.newTask.projectId = selectedProjectId;
    console.log('Updated newTask.projectId to:', this.newTask.projectId);
    
    // When project changes, filter sprints for that project
    if (this.newTask.projectId && this.newTask.projectId !== '') {
      console.log('Filtering sprints for project:', this.newTask.projectId);
      this.filteredSprints = this.allSprints.filter(s => {
        const sprintProjectId = String(s.projectId);
        const selectedProjectIdStr = String(this.newTask.projectId);
        const matches = sprintProjectId === selectedProjectIdStr;
        console.log(`Sprint "${s.name}" projectId: "${sprintProjectId}" matches "${selectedProjectIdStr}": ${matches}`);
        return matches;
      });
      console.log('Filtered sprints for project:', this.filteredSprints.length);
      console.log('Filtered sprint names:', this.filteredSprints.map(s => s.name));
    } else {
      this.filteredSprints = []; // No project selected, no sprints available
      console.log('No project selected, clearing sprint options');
    }
    
    this.newTask.sprintId = ''; // Reset sprint selection when project changes
    
    // Clear any previous project-related errors
    if (this.taskFormErrors.projectId) {
      delete this.taskFormErrors.projectId;
    }
    if (this.taskFormErrors.sprintId) {
      delete this.taskFormErrors.sprintId;
    }
  }

  private validateTask(task: Partial<Task>): boolean {
    this.taskFormErrors = {};

    if (!task.title?.trim()) {
      this.taskFormErrors.title = 'Title is required';
    }

    if (!task.projectId) {
      this.taskFormErrors.projectId = 'Project is required';
    } else {
      // Validate that the project is assigned to the current user's team
      const assignedProject = this.projects.find(p => p.id === task.projectId);
      if (!assignedProject) {
        this.taskFormErrors.projectId = 'You can only create tasks for assigned projects';
      }
    }

    // Validate sprint belongs to the selected project
    if (task.sprintId && task.projectId) {
      const sprint = this.allSprints.find(s => s.id === task.sprintId);
      if (!sprint || sprint.projectId !== task.projectId) {
        this.taskFormErrors.sprintId = 'Sprint must belong to the selected project';
      }
    }

    if (!task.assignee) {
      this.taskFormErrors.assignee = 'Assignee is required';
    }

    if (!task.dueDate) {
      this.taskFormErrors.dueDate = 'Due date is required';
    }

    return Object.keys(this.taskFormErrors).length === 0;
  }

  createTask(): void {
    if (!this.validateTask(this.newTask)) {
      this.toastService.show('Please fix the errors in the form', 'error');
      return;
    }

    this.isSubmitting = true;

    // Filter out empty attachments before saving
    this.newTask.attachments = this.newTask.attachments?.filter(att => att && att.name && att.url);

    // Prepare task data in the format expected by the backend
    const taskData = {
      title: this.newTask.title,
      description: this.newTask.description || '',
      assignee: this.newTask.assignee, // This should be the user ID
      projectId: this.newTask.projectId,
      sprintId: this.newTask.sprintId || null,
      priority: this.newTask.priority || 'medium',
      dueDate: this.newTask.dueDate ? new Date(this.newTask.dueDate) : null,
      storyPoints: this.newTask.storyPoints || 1
    };

    const createSub = this.authService.leadCreateTask(taskData).subscribe({
      next: (response) => {
        this.toastService.show('Task created successfully!', 'success');
        this.router.navigate(['/lead/tasks']);
      },
      error: (error) => {
        console.error('Error creating task:', error);
        this.toastService.show('Failed to create task', 'error');
        this.isSubmitting = false;
      }
    });

    this.subscriptions.push(createSub);
  }

  addAttachmentLink(): void {
    if (!this.newTask.attachments) {
      this.newTask.attachments = [];
    }
    this.newTask.attachments.push({ name: '', url: '' });
  }

  removeAttachment(index: number): void {
    this.newTask.attachments?.splice(index, 1);
  }

  handleFileInput(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      if (!this.newTask.attachments) {
        this.newTask.attachments = [];
      }
      // Storing file name as a placeholder for a real URL
      this.newTask.attachments.push({ name: file.name, url: `file://${file.name}` });
    }
  }

  cancel(): void {
    this.router.navigate(['/lead/tasks']);
  }

  getProjectName(projectId: string): string {
    const project = this.projects.find(p => p.id === projectId);
    return project?.name || 'Unknown Project';
  }

  getSprintName(sprintId: string): string {
    const sprint = this.allSprints.find(s => s.id === sprintId);
    return sprint?.name || 'Unknown Sprint';
  }

  getMemberName(memberId: string): string {
    const member = this.teamMembers.find(m => m._id === memberId || m.id === memberId);
    return member?.name || 'Unknown Member';
  }

  trackByProjectId(index: number, project: any): string {
    return project.id;
  }
}