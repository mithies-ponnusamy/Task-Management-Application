import { Component, OnInit, OnDestroy } from '@angular/core';
import { Task, Project } from '../../../model/user.model';
import { Chart, registerables } from 'chart.js';
import { TaskService } from '../../../core/services/task/task';
import { Auth } from '../../../core/services/auth/auth';
import { UserService } from '../../../core/services/user/user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ModalService } from '../../../core/services/modal/modal';
import { DialogService } from '../../../core/services/dialog/dialog';
import { ToastService } from '../../../core/services/toast/toast';

@Component({
  selector: 'app-lead-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit, OnDestroy {
  // Stats and Data
  stats = { tasksCompleted: 0, inProgress: 0, pendingReview: 0, overdue: 0 };
  teamMembers: any[] = [];
  projects: Project[] = [];
  allTeamTasks: Task[] = [];
  
  // Charting
  performanceChart: any;
  
  // Modals and State
  memberDetailsModalOpen = false;
  selectedMember: any = null;
  editTaskModalOpen = false;
  currentTask: Task | null = null;
  
  // Board Properties
  selectedProject: string = '';
  boardColumns: { id: string; title: string; tasks: Task[] }[] = [
    { id: 'to-do', title: 'To Do', tasks: [] },
    { id: 'in-progress', title: 'In Progress', tasks: [] },
    { id: 'review', title: 'Review', tasks: [] },
    { id: 'done', title: 'Done', tasks: [] }
  ];
  filteredColumns: { id: string; title: string; tasks: Task[] }[] = [
    { id: 'to-do', title: 'To Do', tasks: [] },
    { id: 'in-progress', title: 'In Progress', tasks: [] },
    { id: 'review', title: 'Review', tasks: [] },
    { id: 'done', title: 'Done', tasks: [] }
  ];
  
  // Filters
  searchQuery: string = '';
  selectedBoardMember: string = '';

  // Recent Activities
  recentActivities: Array<{
    type: string;
    description: string;
    timestamp: Date;
  }> = [];

  private taskSubscription!: Subscription;

  constructor(
    private taskService: TaskService,
    private authService: Auth,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: ModalService,
    private dialogService: DialogService,
    private toastService: ToastService
  ) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.loadProjects();
    this.loadRecentActivities();

    // Subscribe to task updates
    this.taskSubscription = this.taskService.tasksUpdated$.subscribe(() => {
        this.loadAllData();
    });
  }

  ngOnDestroy(): void {
    if (this.taskSubscription) {
      this.taskSubscription.unsubscribe();
    }
    if (this.performanceChart) {
      this.performanceChart.destroy();
    }
  }

  loadProjects(): void {
    this.authService.leadGetProjects().subscribe({
      next: (projects) => {
        this.projects = projects.map((project: any) => ({
          id: project._id || project.id,
          name: project.name,
          description: project.description,
          startDate: project.startDate,
          deadline: project.deadline,
          team: project.team,
          manager: project.manager,
          lead: project.lead || project.manager, // Add lead field
          status: project.status,
          priority: project.priority,
          progress: project.progress || 0,
          budget: project.budget,
          client: project.client,
          technologies: project.technologies,
          tasks: project.tasks || [],
          createdAt: project.createdAt,
          updatedAt: project.updatedAt
        }));
        
        // Load team members after projects are loaded
        this.loadTeamMembers();
        
        // Update project selection after projects are loaded
        this.updateProjectSelection();
        
        // Load all data
        this.loadAllData();
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        this.toastService.show('Failed to load projects', 'error');
      }
    });
  }

  loadTeamMembers(): void {
    this.authService.leadGetTeam().subscribe({
      next: (teamData) => {
        this.teamMembers = teamData?.members || [];
      },
      error: (error) => {
        console.error('Error loading team members:', error);
      }
    });
  }

  updateProjectSelection(): void {
    this.route.queryParams.subscribe(params => {
      const projectId = params['projectId'];
      if (projectId && this.projects.some(p => p.id === projectId)) {
        this.selectedProject = projectId;
      } else if (this.projects.length > 0) {
        this.selectedProject = this.projects[0].id;
        // Update URL to reflect default selection
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { projectId: this.selectedProject },
          queryParamsHandling: 'merge',
          replaceUrl: true
        });
      }
    });
  }
  
  loadAllData(): void {
    const projectIds = this.projects.map(p => p.id);
    this.taskService.getTasks().subscribe(tasks => {
        this.allTeamTasks = tasks.filter(t => projectIds.includes(t.projectId));
        this.loadStats();
        this.loadBoardTasks();
        this.initPerformanceChart();
    });
  }

  loadStats(): void {
    this.stats = {
      tasksCompleted: this.allTeamTasks.filter(t => t.status === 'completed').length,
      inProgress: this.allTeamTasks.filter(t => t.status === 'in-progress').length,
      pendingReview: this.allTeamTasks.filter(t => t.status === 'review').length,
      overdue: this.allTeamTasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed').length
    };
  }
  
  loadBoardTasks(): void {
    this.boardColumns.forEach(col => col.tasks = []);
    this.filteredColumns.forEach(col => col.tasks = []);
    
    if (!this.selectedProject) {
        this.filterTasks();
        return;
    };

    const projectTasks = this.allTeamTasks.filter(task => task.projectId === this.selectedProject);

    projectTasks.forEach(task => {
      const column = this.boardColumns.find(col => col.id === task.status);
      if (column) column.tasks.push(task);
      else this.boardColumns[0].tasks.push(task); // Default to 'To Do'
    });
    this.filterTasks();
  }

  filterTasks(): void {
    const searchTerm = this.searchQuery.toLowerCase();
    
    for (let i = 0; i < this.boardColumns.length; i++) {
      const column = this.boardColumns[i];
      this.filteredColumns[i].tasks = column.tasks.filter(task => {
        const matchesMember = !this.selectedBoardMember || task.assignee === this.selectedBoardMember;
        const matchesSearch = !searchTerm || 
          task.title.toLowerCase().includes(searchTerm) ||
          (task.description && task.description.toLowerCase().includes(searchTerm));
        return matchesMember && matchesSearch;
      });
    }
  }

  onProjectChange(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { projectId: this.selectedProject },
      queryParamsHandling: 'merge',
    });
    // Data will be reloaded by the queryParams subscription
  }
  
  initPerformanceChart(): void {
    // Chart initialization logic remains the same
    const canvas = document.getElementById('performanceChart') as HTMLCanvasElement;
    if (!canvas) return;
    if (this.performanceChart) this.performanceChart.destroy();
    
    this.performanceChart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          { label: 'Tasks Completed', data: [65, 59, 80, 81, 56, 72], borderColor: '#3B82F6', tension: 0.3, fill: true, backgroundColor: 'rgba(59, 130, 246, 0.1)' },
          { label: 'Overdue Tasks', data: [5, 8, 2, 4, 6, 3], borderColor: '#EF4444', tension: 0.3, fill: true, backgroundColor: 'rgba(239, 68, 68, 0.1)' }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }
  
  onTaskDrop(event: CdkDragDrop<Task[]>): void {
    // Drag and drop logic remains the same
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      const task: Task = event.item.data;
      task.status = event.container.id as 'to-do' | 'in-progress' | 'review' | 'completed';
      this.taskService.updateTask(task);
    }
  }

  // --- Modal and Form Handling ---
  openAddTaskModal(): void {
    this.modalService.openCreateTaskModal(this.selectedProject);
  }

  openEditTaskModal(task: Task): void {
    this.currentTask = { ...task };
    this.editTaskModalOpen = true;
  }
  
  viewMemberDetails(member: any): void {
    this.selectedMember = member;
    this.memberDetailsModalOpen = true;
  }
  
  closeModals(): void {
    this.editTaskModalOpen = false;
    this.memberDetailsModalOpen = false;
    this.currentTask = null;
    this.selectedMember = null;
  }
  
  // --- Utility Functions ---
  getTotalTasks = (): number => this.filteredColumns.reduce((sum, col) => sum + col.tasks.length, 0);
  getCompletedTasks = (): number => this.filteredColumns.find(c => c.id === 'done')?.tasks.length || 0;
  getTotalStoryPoints = (columnId: string): number => this.filteredColumns.find(c => c.id === columnId)?.tasks.reduce((sum, task) => sum + (task.storyPoints || 0), 0) || 0;
  getPriorityColor = (priority: string) => ({ high: 'bg-red-100 text-red-800', medium: 'bg-yellow-100 text-yellow-800', low: 'bg-green-100 text-green-800' }[priority] || 'bg-gray-100');
  
  // --- Enhanced Member Details Functions ---
  getTasksForMember(name: string): Task[] {
      return this.allTeamTasks.filter(task => task.assignee === name);
  }

  getMemberStat(memberName: string, status: string): number {
      return this.getTasksForMember(memberName).filter(task => task.status === status).length;
  }
  
  getMemberOverdueTasks(memberName: string): number {
    return this.getTasksForMember(memberName).filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed').length;
  }

  getProfileImgForAssignee(assignee: string): string {
    const member = this.teamMembers?.find((m: any) => m.name === assignee);
    return member?.profileImg || 'assets/default-avatar.png';
  }

  saveTaskChanges(): void {
    if (!this.currentTask) return;
    this.dialogService.open({
      title: 'Confirm Changes',
      message: 'Are you sure you want to save the changes to this task?',
      onConfirm: () => {
        if (this.currentTask) {
          this.taskService.updateTask(this.currentTask);
          this.toastService.show('Task updated successfully!');
          this.closeModals();
        }
      }
    });
  }

  deleteTask(): void {
    if (!this.currentTask) return;
    this.dialogService.open({
      title: 'Confirm Deletion',
      message: `Are you sure you want to delete the task "${this.currentTask.title}"? This action cannot be undone.`,
      confirmButtonText: 'Delete Task',
      confirmButtonClass: 'bg-red-600 hover:bg-red-700',
      onConfirm: () => {
        if (this.currentTask) {
          this.taskService.deleteTask(this.currentTask.id);
          this.closeModals();
          this.loadTasks();
        }
      }
    });
  }

  getActivityIcon(type: string): string {
    switch (type) {
      case 'task_created': return 'bg-green-100 text-green-600';
      case 'task_completed': return 'bg-blue-100 text-blue-600';
      case 'task_updated': return 'bg-yellow-100 text-yellow-600';
      case 'member_added': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  }

  getActivityIconClass(type: string): string {
    switch (type) {
      case 'task_created': return 'fas fa-plus text-xs';
      case 'task_completed': return 'fas fa-check text-xs';
      case 'task_updated': return 'fas fa-edit text-xs';
      case 'member_added': return 'fas fa-user-plus text-xs';
      default: return 'fas fa-info text-xs';
    }
  }

  private loadRecentActivities(): void {
    // This would typically come from an API
    this.recentActivities = [
      {
        type: 'task_completed',
        description: 'Task "Update user interface" was completed by John Doe',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      {
        type: 'task_created',
        description: 'New task "Review pull request #123" was created',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
      },
      {
        type: 'member_added',
        description: 'Jane Smith was added to the team',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
      }
    ];
  }

  private loadTasks(): void {
    // Implementation for loading tasks (can be empty for now since we removed task board)
  }
}