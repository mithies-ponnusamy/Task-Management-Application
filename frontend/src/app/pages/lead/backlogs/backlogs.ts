import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Project, Sprint, Task, User } from '../../../model/user.model';
import { Auth } from '../../../core/services/auth/auth';
import { ProjectService } from '../../../core/services/project/project';
import { UserService } from '../../../core/services/user/user';
import { LocalStorageService } from '../../../core/services/local-storage/local-storage';
import { ModalService } from '../../../core/services/modal/modal';
import { DialogService } from '../../../core/services/dialog/dialog';

@Component({
  selector: 'app-backlogs',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    TitleCasePipe
  ],
  templateUrl: './backlogs.html',
  styleUrls: ['./backlogs.css']
})
export class Backlogs implements OnInit, OnDestroy {
  // Master Data
  allTasks: Task[] = [];
  projects: Project[] = [];
  sprints: Sprint[] = [];
  teamMembers: User[] = [];

  // Filtered Data
  filteredTasks: Task[] = [];
  filteredSprints: Sprint[] = [];

  // Modals & State
  isViewModalOpen = false;
  isEditModalOpen = false;
  isViewTasksModalOpen = false;
  currentTask: Task | null = null;
  currentSprint: Sprint | null = null;
  currentSprintTasks: Task[] = [];

  // Filters
  filters = {
    projectId: 'all',
    sprintId: 'all', // 'all', 'none' (for product backlog), or a sprint ID
    assigneeId: 'all',
    status: 'all',
    query: ''
  };
  
  private taskSubscription!: Subscription;

  constructor(
    private authService: Auth,
    private projectService: ProjectService,
    private userService: UserService,
    private localStorage: LocalStorageService,
    private modalService: ModalService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
    this.taskSubscription = this.authService.leadGetTasks().subscribe((tasks: any[]) => {
        console.log('=== BACKLOGS TASK MAPPING DEBUG ===');
        console.log('Raw tasks from API:', tasks.slice(0, 2));
        
        // Map backend task fields to frontend expectations
        this.allTasks = tasks.map(task => {
          // Extract sprint ID first
          const extractedSprintId = task.sprint ? (
            typeof task.sprint === 'object' 
              ? (task.sprint._id || task.sprint.id) 
              : task.sprint
          ) : null;
          
          const mappedTask = {
            ...task,
            // Explicitly set the mapped values AFTER the spread to override any existing properties
            sprintId: extractedSprintId,
            assigneeId: task.assignee ? (typeof task.assignee === 'object' ? task.assignee._id || task.assignee.id : task.assignee) : null,
            projectId: task.project ? (typeof task.project === 'object' ? task.project._id || task.project.id : task.project) : null
          };
          
          if (task.sprint) {
            console.log(`Task "${task.title}" sprint mapping:`, {
              originalSprint: task.sprint,
              sprintType: typeof task.sprint,
              extractedSprintId: extractedSprintId,
              finalSprintId: mappedTask.sprintId,
              sprintIdType: typeof mappedTask.sprintId,
              sprintKeys: typeof task.sprint === 'object' ? Object.keys(task.sprint) : 'n/a'
            });
          }
          
          return mappedTask;
        });
        
        console.log('Mapped tasks with sprint IDs:', this.allTasks.map(t => ({ 
          title: t.title, 
          sprintId: t.sprintId, 
          sprintIdType: typeof t.sprintId,
          originalSprint: tasks.find(orig => orig._id === t.id || orig.id === t.id)?.sprint 
        })));
        this.applyFilters();
    });
  }

  ngOnDestroy(): void {
    if (this.taskSubscription) {
      this.taskSubscription.unsubscribe();
    }
  }

  loadInitialData(): void {
    console.log('=== Backlogs: Loading initial data ===');
    
    // Load projects using the same method as create-task
    this.authService.leadGetProjects().subscribe({
      next: (projects: any[]) => {
        console.log('Backlogs: Raw projects received:', projects);
        // Process projects to ensure consistent ID format
        this.projects = projects.map(project => ({
          ...project,
          id: project._id || project.id
        }));
        console.log('Backlogs: Processed projects with details:', this.projects.map(p => ({ 
          id: p.id, 
          _id: (p as any)._id, 
          name: p.name,
          originalId: (p as any).originalId
        })));
        this.loadSprintsAndTeam();
      },
      error: (error) => {
        console.error('Backlogs: Error loading projects:', error);
        this.projects = [];
        this.loadSprintsAndTeam();
      }
    });
  }

  loadSprintsAndTeam(): void {
    // Load team members
    this.authService.leadGetTeam().subscribe({
      next: (teamData: any) => {
        console.log('Backlogs: Team loaded:', teamData.members?.length || 0, 'members');
        this.teamMembers = teamData.members || [];
      },
      error: (error: any) => {
        console.error('Backlogs: Error loading team members:', error);
        this.teamMembers = [];
      }
    });
    
    // Fetch sprints from backend for projects assigned to the team lead
    this.authService.leadGetSprints().subscribe({
      next: (sprints: Sprint[]) => {
        console.log('Backlogs: Raw sprints received:', sprints.length);
        console.log('Backlogs: Sprint data sample:', sprints.map(s => ({ 
          name: s.name, 
          project: s.project, 
          _id: (s as any)._id,
          id: s.id 
        })));
        
        // Process sprints to ensure projectId is available for frontend use
        this.sprints = sprints.map(sprint => {
          const processed = {
            ...sprint,
            id: (sprint as any)._id || sprint.id,
            projectId: typeof sprint.project === 'string' 
              ? sprint.project 
              : (sprint.project as any)?._id || (sprint.project as any)?.id
          };
          
          console.log(`Sprint "${processed.name}" ID mapping:`, {
            originalId: sprint.id,
            originalSprintObj: { _id: (sprint as any)._id, id: sprint.id },
            processedId: processed.id,
            idType: typeof processed.id
          });
          
          // Debug: Log sprint and team data
          if (sprint.project && typeof sprint.project === 'object') {
            console.log(`Sprint "${processed.name}":`, {
              project: (sprint.project as any).name,
              team: (sprint.project as any).team?.name,
              teamLead: (sprint.project as any).team?.lead?.name
            });
          }
          
          return processed;
        }).filter(sprint => {
          // Filter out sprints without valid project references
          const hasValidProject = sprint.projectId && sprint.projectId !== 'undefined';
          if (!hasValidProject) {
            console.warn('Backlogs: Filtering out sprint without valid project:', sprint.name);
          }
          return hasValidProject;
        });
        
        console.log('Backlogs: Total valid sprints processed:', this.sprints.length);
        this.onProjectFilterChange(); // Initial filter application
      },
      error: (error) => {
        console.error('Backlogs: Error loading sprints:', error);
        this.sprints = [];
        this.onProjectFilterChange();
      }
    });

    // Also load tasks for reference
    this.authService.leadGetTasks().subscribe({
      next: (tasks: Task[]) => {
        console.log('Backlogs: Tasks loaded:', tasks.length);
        this.allTasks = tasks;
        this.applyFilters();
      },
      error: (error) => {
        console.error('Backlogs: Error loading tasks:', error);
        this.allTasks = [];
        this.applyFilters();
      }
    });
  }
  
  onProjectFilterChange(): void {
      console.log('Backlogs: Project filter changed to:', this.filters.projectId);
      console.log('Backlogs: Available projects:', this.projects.map(p => ({ id: p.id, name: p.name })));
      console.log('Backlogs: Available sprints:', this.sprints.map(s => ({ 
        name: s.name, 
        id: s.id, 
        idType: typeof s.id,
        projectId: s.projectId 
      })));
      
      if (this.filters.projectId === 'all') {
          const projectIds = this.projects.map(p => p.id);
          this.filteredSprints = this.sprints.filter(s => s.projectId && projectIds.includes(s.projectId));
          console.log('Backlogs: Showing sprints for all projects, filtered count:', this.filteredSprints.length);
      } else {
          this.filteredSprints = this.sprints.filter(s => s.projectId === this.filters.projectId);
          console.log('Backlogs: Showing sprints for project', this.filters.projectId, ', filtered count:', this.filteredSprints.length);
      }
      this.filters.sprintId = 'all'; // Reset sprint filter
      this.applyFilters();
  }

  applyFilters(): void {
    let sprintsToFilter = [...this.sprints];
    const { projectId, query } = this.filters;
    const lowerCaseQuery = query.toLowerCase();

    this.filteredSprints = sprintsToFilter.filter(sprint => {
      const matchesProject = projectId === 'all' || sprint.projectId === projectId;
      const matchesQuery = !query || 
        sprint.name.toLowerCase().includes(lowerCaseQuery) ||
        (sprint.description && sprint.description.toLowerCase().includes(lowerCaseQuery));
      
      return matchesProject && matchesQuery;
    });
  }

  // --- Task Actions ---

  viewTask(task: Task): void {
    this.currentTask = { ...task };
    this.isViewModalOpen = true;
  }
  
  editTask(task: Task): void {
    this.currentTask = { ...task };
    this.isEditModalOpen = true;
    this.isViewModalOpen = false; // Close view modal if open
  }
  
  confirmDelete(taskId: string): void {
      this.dialogService.open({
          title: 'Confirm Deletion',
          message: 'Are you sure you want to delete this task? This action cannot be undone.',
          confirmButtonText: 'Delete Task',
          confirmButtonClass: 'bg-red-600 hover:bg-red-700',
          onConfirm: () => this.deleteTask(taskId)
      });
  }
  
  deleteTask(taskId: string): void {
    this.authService.leadDeleteTask(taskId).subscribe({
      next: () => {
        console.log('Task deleted successfully');
        this.loadInitialData(); // Reload data after deletion
      },
      error: (error) => {
        console.error('Error deleting task:', error);
      }
    });
    this.closeModals();
  }
  
  confirmSaveChanges(form: NgForm): void {
      if (!form.valid) return;
      this.dialogService.open({
          title: 'Confirm Changes',
          message: 'Are you sure you want to save the changes to this task?',
          onConfirm: () => this.saveChanges()
      });
  }

  saveChanges(): void {
    if (this.currentTask) {
        this.authService.leadUpdateTask(this.currentTask.id, this.currentTask).subscribe({
          next: () => {
            console.log('Task updated successfully');
            this.loadInitialData(); // Reload data after update
          },
          error: (error) => {
            console.error('Error updating task:', error);
          }
        });
        this.closeModals();
    }
  }

  private loadTasks(): void {
    const projectIds = this.projects.map(p => p.id);
    this.authService.leadGetTasks().subscribe((tasks: Task[]) => {
      this.allTasks = tasks.filter((t: Task) => projectIds.includes(t.projectId));
      this.onProjectFilterChange(); // Apply current filters
    });
  }

  // --- Modal Control ---
  
  openCreateTaskModal(): void {
    this.modalService.openCreateTaskModal(this.filters.projectId !== 'all' ? this.filters.projectId : undefined);
  }

  closeModals(): void {
      this.isViewModalOpen = false;
      this.isEditModalOpen = false;
      this.currentTask = null;
      this.currentSprint = null;
  }

  // Sprint-focused methods for new table structure
  viewSprintDetails(sprint: Sprint): void {
    this.currentSprint = { ...sprint };
    this.isViewModalOpen = true;
  }

  viewSprintTasks(sprint: Sprint): void {
    console.log('=== VIEW SPRINT TASKS DEBUG ===');
    console.log('Viewing sprint tasks for:', sprint.name);
    console.log('Sprint ID being searched:', sprint.id, typeof sprint.id);
    console.log('All available tasks count:', this.allTasks.length);
    console.log('All available tasks detailed:', this.allTasks.map(t => ({ 
      title: t.title, 
      sprintId: t.sprintId, 
      sprintIdType: typeof t.sprintId,
      hasSprintId: !!t.sprintId,
      keys: Object.keys(t).filter(k => k.includes('sprint'))
    })));
    
    this.currentSprint = { ...sprint };
    
    // Filter tasks for this specific sprint - use multiple comparison approaches
    this.currentSprintTasks = this.allTasks.filter(task => {
      if (!task.sprintId) {
        console.log(`Task "${task.title}": No sprintId, skipping`);
        return false;
      }
      
      const taskSprintId = task.sprintId;
      const sprintId = sprint.id;
      
      // Convert both to strings for comparison (handles ObjectId vs String)
      const taskSprintStr = String(taskSprintId).trim();
      const sprintIdStr = String(sprintId).trim();
      
      const matches = taskSprintStr === sprintIdStr;
      
      console.log(`Task "${task.title}": sprintId="${taskSprintStr}" === sprint.id="${sprintIdStr}" ? ${matches}`);
      return matches;
    });
    
    console.log('Found tasks for sprint:', this.currentSprintTasks.length);
    if (this.currentSprintTasks.length === 0) {
      console.log('🔍 No tasks found. Debug info:');
      console.log('Sprint ID to match:', String(sprint.id));
      console.log('Available task sprint IDs:', this.allTasks.map(t => String(t.sprintId || 'null')));
    }
    
    this.isViewTasksModalOpen = true;
  }

  closeTasksModal(): void {
    this.isViewTasksModalOpen = false;
    this.currentSprint = null;
    this.currentSprintTasks = [];
  }

  getProjectById(projectId: string | undefined): Project | undefined {
    if (!projectId) return undefined;
    return this.projects.find(p => p.id === projectId);
  }

  getProjectStatusClass(project: Project | undefined): string {
    if (!project) return 'bg-gray-100 text-gray-800';
    switch (project.status) {
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getSprintDuration(sprint: Sprint): number {
    const start = new Date(sprint.startDate);
    const end = new Date(sprint.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getSprintStatusClass(status: string): string {
    switch (status) {
      case 'upcoming': return 'bg-gray-100 text-gray-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getSprintTaskProgress(sprintId: string): number {
    const sprintTasks = this.allTasks.filter(task => task.sprintId === sprintId);
    if (sprintTasks.length === 0) return 0;
    const completedTasks = sprintTasks.filter(task => task.status === 'completed');
    return Math.round((completedTasks.length / sprintTasks.length) * 100);
  }

  getSprintTaskCount(sprintId: string): number {
    return this.allTasks.filter(task => task.sprintId === sprintId).length;
  }

  getTeamName(sprint: Sprint): string {
    // Try to get team name from populated project data
    if (sprint && sprint.project && typeof sprint.project === 'object') {
      const project = sprint.project as any;
      if (project.team && typeof project.team === 'object') {
        return project.team.name || 'Team';
      }
    }
    
    return 'No Team';
  }

  getTeamLeadName(sprint: Sprint): string {
    // Try to get team lead name from populated project data
    if (sprint && sprint.project && typeof sprint.project === 'object') {
      const project = sprint.project as any;
      if (project.team && typeof project.team === 'object' && project.team.lead) {
        return project.team.lead.name || 'Team Lead';
      }
    }
    
    return 'Team Lead';
  }

  // Utility methods
  getProjectName = (id: string | undefined) => {
    if (!id) return 'N/A';
    
    const project = this.projects.find(p => p.id === id || (p as any)._id === id);
    const name = project?.name || 'N/A';
    
    // Debug logging for troubleshooting
    if (name === 'N/A') {
      console.warn('Backlogs: Could not find project for ID:', id);
      console.warn('Available projects:', this.projects.map(p => ({ id: p.id, _id: (p as any)._id, name: p.name })));
    }
    
    return name;
  };
  getSprintName = (id: string | undefined) => id ? (this.sprints.find(s => s.id === id)?.name || 'N/A') : 'Backlog';
  getAssigneeName = (id: string | undefined) => id ? (this.teamMembers.find(m => m.id === id)?.name || 'Unassigned') : 'Unassigned';
  getPriorityClass = (p: string) => ({ high: 'text-red-600', medium: 'text-yellow-600', low: 'text-green-600' }[p] || 'text-gray-500');
  getStatusClass = (s: string) => ({ todo: 'bg-gray-200 text-gray-800', 'in-progress': 'bg-blue-200 text-blue-800', review: 'bg-purple-200 text-purple-800', done: 'bg-green-200 text-green-800' }[s] || '');
}