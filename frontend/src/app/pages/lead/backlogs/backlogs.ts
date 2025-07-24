import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Project, Sprint, Task, User } from '../../../model/user.model';
import { TaskService } from '../../../core/services/task/task';
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
  currentTask: Task | null = null;

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
    private taskService: TaskService,
    private projectService: ProjectService,
    private userService: UserService,
    private localStorage: LocalStorageService,
    private modalService: ModalService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
    this.taskSubscription = this.taskService.tasksUpdated$.subscribe(() => {
      this.taskService.getTasks().subscribe(tasks => {
        this.allTasks = tasks;
        this.applyFilters();
      });
    });
  }

  ngOnDestroy(): void {
    if (this.taskSubscription) {
      this.taskSubscription.unsubscribe();
    }
  }

  loadInitialData(): void {
    const currentUser = this.userService.getCurrentUser();
    if (currentUser?.team) {
      this.projects = this.projectService.getProjectsByTeam(currentUser.team);
      this.teamMembers = this.userService.getTeamMembers(currentUser.team);
      const projectIds = this.projects.map(p => p.id);
      
      this.sprints = this.localStorage.getSprints<Sprint[]>()?.filter(s => projectIds.includes(s.projectId)) || [];
      this.taskService.getTasks().subscribe(tasks => {
        this.allTasks = tasks.filter(t => projectIds.includes(t.projectId));
        this.onProjectFilterChange(); // Initial filter application
      });
    }
  }
  
  onProjectFilterChange(): void {
      if (this.filters.projectId === 'all') {
          const projectIds = this.projects.map(p => p.id);
          this.filteredSprints = this.sprints.filter(s => projectIds.includes(s.projectId));
      } else {
          this.filteredSprints = this.sprints.filter(s => s.projectId === this.filters.projectId);
      }
      this.filters.sprintId = 'all'; // Reset sprint filter
      this.applyFilters();
  }

  applyFilters(): void {
    let tasksToFilter = [...this.allTasks];
    const { projectId, sprintId, assigneeId, status, query } = this.filters;
    const lowerCaseQuery = query.toLowerCase();

    this.filteredTasks = tasksToFilter.filter(task => {
      const matchesProject = projectId === 'all' || task.projectId === projectId;
      const matchesAssignee = assigneeId === 'all' || task.assignee === assigneeId;
      const matchesStatus = status === 'all' || task.status === status;
      const matchesQuery = !query || task.title.toLowerCase().includes(lowerCaseQuery);
      
      let matchesSprint = true;
      if (sprintId === 'all') {
        matchesSprint = true; // Show all tasks regardless of sprint
      } else if (sprintId === 'none') {
        matchesSprint = !task.sprintId; // Show only tasks in the product backlog
      } else {
        matchesSprint = task.sprintId === sprintId; // Show tasks for a specific sprint
      }
      
      return matchesProject && matchesAssignee && matchesStatus && matchesQuery && matchesSprint;
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
    this.taskService.deleteTask(taskId);
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
        this.taskService.updateTask(this.currentTask);
        this.closeModals();
    }
  }

  // --- Modal Control ---
  
  openCreateTaskModal(): void {
    this.modalService.openCreateTaskModal(this.filters.projectId !== 'all' ? this.filters.projectId : undefined);
  }

  closeModals(): void {
      this.isViewModalOpen = false;
      this.isEditModalOpen = false;
      this.currentTask = null;
  }


  // Utility methods
  getProjectName = (id: string) => this.projects.find(p => p.id === id)?.name || 'N/A';
  getSprintName = (id: string | undefined) => id ? (this.sprints.find(s => s.id === id)?.name || 'N/A') : 'Backlog';
  getAssigneeName = (id: string | undefined) => id ? (this.teamMembers.find(m => m.id === id)?.name || 'Unassigned') : 'Unassigned';
  getPriorityClass = (p: string) => ({ high: 'text-red-600', medium: 'text-yellow-600', low: 'text-green-600' }[p] || 'text-gray-500');
  getStatusClass = (s: string) => ({ todo: 'bg-gray-200 text-gray-800', 'in-progress': 'bg-blue-200 text-blue-800', review: 'bg-purple-200 text-purple-800', done: 'bg-green-200 text-green-800' }[s] || '');
}