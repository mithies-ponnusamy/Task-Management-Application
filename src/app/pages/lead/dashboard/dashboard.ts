import { Component, OnInit } from '@angular/core';
import { Task } from '../../../model/user.model';
import { Chart, registerables } from 'chart.js';
import { TaskService } from '../../../core/services/task/task';
import { ProjectService } from '../../../core/services/project/project';
import { UserService } from '../../../core/services/user/user';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-lead-dashboard',
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  stats = {
    tasksCompleted: 0,
    inProgress: 0,
    pendingReview: 0,
    overdue: 0
  };

  teamMembers: any[] = [];
  projects: any[] = [];
  assignedProjects: any[] = [];
  performanceChart: any;
  messageModalOpen = false;
  reportModalOpen = false;
  reportType = 'project';
  selectedReportProject = '';
  selectedReportMember = '';
  message = {
    to: '',
    subject: '',
    body: ''
  };
  selectedMember: any = null;
  memberDetailsModalOpen = false;
  reportData: any[] = [];
  showReportData = false;

  // Board related properties
  selectedProject: string = '';
  boardColumns: { id: string; title: string; tasks: Task[] }[] = [
    { id: 'todo', title: 'To Do', tasks: [] },
    { id: 'in-progress', title: 'In Progress', tasks: [] },
    { id: 'review', title: 'Review', tasks: [] },
    { id: 'done', title: 'Done', tasks: [] }
  ];
  filteredColumns: { id: string; title: string; tasks: Task[] }[] = [];
  teamBoards: Array<{ 
    name: string; 
    description: string; 
    tasks: number; 
    members: number;
    status: 'active' | 'planned' | 'completed';
    progress: number;
    memberAvatars: string[];
  }> = [];
  addTaskModalOpen = false;
  editTaskModalOpen = false;
  currentTask: Task | null = null;
  newTask: Task = {
    id: '',
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: new Date(),
    assignee: '',
    projectId: '',
    project:'',
    tags: [],
    estimatedHours: 0,
    storyPoints: 3
  };
  searchQuery: string = '';
  selectedBoardMember: string = '';

  constructor(
    private taskService: TaskService,
    private projectService: ProjectService,
    private userService: UserService,
    private modalService: NgbModal,
    private route: ActivatedRoute
  ) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.loadStats();
    this.loadTeamMembers();
    this.loadProjects();
    this.initPerformanceChart();
    this.loadBoardTasks();
    this.initializeTeamBoards();
    this.filteredColumns = [...this.boardColumns];
    
    // Load assigned projects for the current lead
    this.loadAssignedProjects();
    
    // Check for projectId in query params
    this.route.queryParams.subscribe(params => {
      if (params['projectId']) {
        this.selectedProject = params['projectId'];
        this.loadBoardTasks();
      }
    });
  }

  loadAssignedProjects(): void {
    // In a real app, you would fetch these from a service based on the current user
    this.assignedProjects = this.projectService.getProjects().filter(project => 
      project.lead === this.userService.getCurrentUser()?.id
    );
    
    if (this.assignedProjects.length > 0 && !this.selectedProject) {
      this.selectedProject = this.assignedProjects[0].id;
    }
  }

  loadStats(): void {
    // Calculate stats based on assigned projects
    const tasks = this.getTasksForAssignedProjects();
    this.stats = {
      tasksCompleted: tasks.filter(t => t.status === 'done').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      pendingReview: tasks.filter(t => t.status === 'review').length,
      overdue: tasks.filter(t => 
        new Date(t.dueDate) < new Date() && 
        t.status !== 'done'
      ).length
    };
  }

  loadTeamMembers(): void {
    // Get team members assigned to the lead's projects
    this.teamMembers = this.userService.getTeamMembers().filter(member => 
      this.assignedProjects.some(project => 
        project.teamMembers?.includes(member.id)
    ));
  }

  loadProjects(): void {
    this.projects = this.assignedProjects;
  }

  getTasksForAssignedProjects(): Task[] {
    // If getTasks() returns an Observable, you need to subscribe or use async pipe in the template.
    // Here is a synchronous workaround assuming you want to keep the method signature:
    let tasks: Task[] = [];
    const tasksObservable = this.taskService.getTasks();
    if ('subscribe' in tasksObservable) {
      // This is a quick synchronous hack for demonstration; in real code, handle async properly!
      tasksObservable.subscribe((allTasks: Task[]) => {
        tasks = allTasks.filter(task =>
          this.assignedProjects.some(project => project.id === task.projectId)
        );
      });
    }
    return tasks;
  }

  initPerformanceChart(): void {
    const ctx = document.getElementById('performanceChart') as HTMLCanvasElement;
    this.performanceChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Task Completion',
            data: [65, 59, 80, 81, 56, 72],
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.3,
            fill: true
          },
          {
            label: 'On Time Delivery',
            data: [28, 48, 40, 19, 86, 27],
            borderColor: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.3,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100
          }
        }
      }
    });
  }

  initializeTeamBoards(): void {
    this.teamBoards = [
      {
        name: 'Web Platform',
        description: 'Development of the main web application platform',
        tasks: 24,
        members: 5,
        status: 'active',
        progress: 65,
        memberAvatars: [
          'https://randomuser.me/api/portraits/women/44.jpg',
          'https://randomuser.me/api/portraits/men/32.jpg',
          'https://randomuser.me/api/portraits/women/68.jpg',
          'https://randomuser.me/api/portraits/men/22.jpg',
          'https://randomuser.me/api/portraits/women/63.jpg'
        ]
      },
      {
        name: 'Mobile App',
        description: 'iOS and Android application development',
        tasks: 18,
        members: 3,
        status: 'active',
        progress: 42,
        memberAvatars: [
          'https://randomuser.me/api/portraits/men/75.jpg',
          'https://randomuser.me/api/portraits/women/25.jpg',
          'https://randomuser.me/api/portraits/men/41.jpg'
        ]
      },
      {
        name: 'Marketing Site',
        description: 'New marketing website with CMS integration',
        tasks: 12,
        members: 4,
        status: 'completed',
        progress: 100,
        memberAvatars: [
          'https://randomuser.me/api/portraits/women/30.jpg',
          'https://randomuser.me/api/portraits/men/69.jpg',
          'https://randomuser.me/api/portraits/women/50.jpg',
          'https://randomuser.me/api/portraits/men/65.jpg'
        ]
      },
      {
        name: 'API Services',
        description: 'Backend API services and microservices',
        tasks: 15,
        members: 3,
        status: 'active',
        progress: 78,
        memberAvatars: [
          'https://randomuser.me/api/portraits/men/33.jpg',
          'https://randomuser.me/api/portraits/women/55.jpg',
          'https://randomuser.me/api/portraits/men/28.jpg'
        ]
      },
      {
        name: 'Data Analytics',
        description: 'Data pipeline and analytics dashboard',
        tasks: 8,
        members: 2,
        status: 'planned',
        progress: 15,
        memberAvatars: [
          'https://randomuser.me/api/portraits/women/72.jpg',
          'https://randomuser.me/api/portraits/men/45.jpg'
        ]
      },
      {
        name: 'Admin Portal',
        description: 'Internal admin and management portal',
        tasks: 6,
        members: 2,
        status: 'active',
        progress: 30,
        memberAvatars: [
          'https://randomuser.me/api/portraits/men/60.jpg',
          'https://randomuser.me/api/portraits/women/85.jpg'
        ]
      }
    ];
  }

  loadBoardTasks(): void {
    // Clear existing tasks
    this.boardColumns.forEach(col => col.tasks = []);

    // Load tasks based on selected project
    const tasks = this.getTasksForProject(this.selectedProject);
    
    // Distribute tasks to columns
    tasks.forEach(task => {
      const column = this.boardColumns.find(col => col.id === task.status);
      if (column) {
        column.tasks.push(task);
      }
    });

    this.filterTasks();
  }

  getTasksForProject(projectId: string): Task[] {
    const allTasks: Task[] = [
      {
        id: '1',
        title: 'Design homepage mockup',
        description: 'Create initial design concepts for the homepage',
        status: 'in-progress',
        priority: 'high',
        dueDate: new Date('2023-05-15'),
        assignee: 'Sarah Johnson',
        projectId: '1',
        project: 'Website Redesign',
        tags: ['design', 'ui'],
        estimatedHours: 8,
        storyPoints: 5
      },
      {
        id: '2',
        title: 'Implement user authentication',
        description: 'Set up login and registration flows with JWT',
        status: 'todo',
        priority: 'high',
        dueDate: new Date('2023-05-18'),
        assignee: 'Mike Smith',
        projectId: '1',
        project: 'Website Redesign',
        tags: ['development', 'backend'],
        estimatedHours: 12,
        storyPoints: 8
      },
      {
        id: '3',
        title: 'Write API documentation',
        description: 'Document all endpoints with Swagger',
        status: 'review',
        priority: 'medium',
        dueDate: new Date('2023-05-10'),
        assignee: 'Alex Chen',
        projectId: '1',
        project: 'API Documentation',
        tags: ['documentation', 'api'],
        estimatedHours: 5,
        storyPoints: 3
      },
      {
        id: '4',
        title: 'Database schema design',
        description: 'Design the database schema for user management',
        status: 'done',
        priority: 'medium',
        dueDate: new Date('2023-05-05'),
        assignee: 'Mike Smith',
        projectId: '1',
        project: 'Website Redesign',
        tags: ['database', 'backend'],
        estimatedHours: 6,
        storyPoints: 5
      },
      {
        id: '5',
        title: 'Mobile app UI implementation',
        description: 'Implement the UI components for iOS and Android',
        status: 'in-progress',
        priority: 'high',
        dueDate: new Date('2023-05-20'),
        assignee: 'Sarah Johnson',
        projectId: '1',
        project: 'Mobile App Development',
        tags: ['mobile', 'ui', 'development'],
        estimatedHours: 15,
        storyPoints: 8
      },
      {
        id: '6',
        title: 'Performance optimization',
        description: 'Optimize critical path rendering',
        status: 'todo',
        priority: 'medium',
        dueDate: new Date('2023-05-22'),
        assignee: 'Alex Chen',
        projectId: '1',
        project: 'Website Redesign',
        tags: ['performance', 'frontend'],
        estimatedHours: 10,
        storyPoints: 5
      },
      {
        id: '7',
        title: 'User profile page',
        description: 'Design and implement user profile page',
        status: 'todo',
        priority: 'low',
        dueDate: new Date('2023-05-25'),
        assignee: '',
        projectId: '1',
        project: 'Website Redesign',
        tags: ['ui', 'frontend'],
        estimatedHours: 8,
        storyPoints: 3
      }
    ];

    return allTasks.filter(task => task.projectId === projectId);
  }

  filterTasks(): void {
    const searchTerm = this.searchQuery.toLowerCase();
    const memberFilter = this.selectedBoardMember;

    this.filteredColumns = this.boardColumns.map(column => {
      const filteredTasks = column.tasks.filter(task => {
        // Search by title, description, or tags
        const matchesSearch = searchTerm === '' || 
          task.title.toLowerCase().includes(searchTerm) || 
          task.description?.toLowerCase().includes(searchTerm) ||
          (task.tags && task.tags.some(tag => tag.toLowerCase().includes(searchTerm)));
        
        // Filter by assignee
        const matchesMember = memberFilter === '' || 
          (task.assignee && task.assignee === memberFilter);
        
        return matchesSearch && matchesMember;
      });
      
      return {
        ...column,
        tasks: filteredTasks
      };
    });
  }

  onProjectChange(): void {
    this.loadBoardTasks();
  }

  openAddTaskModal(): void {
    this.newTask = {
      id: '',
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      dueDate: new Date(),
      assignee: '',
      projectId: this.selectedProject,
      project: '',
      tags: [],
      estimatedHours: 0,
      storyPoints: 3
    };
    this.addTaskModalOpen = true;
  }

  openEditTaskModal(task: Task): void {
    this.currentTask = { ...task };
    this.editTaskModalOpen = true;
  }

  saveTask(): void {
    if (this.editTaskModalOpen && this.currentTask) {
      // Update existing task
      const column = this.boardColumns.find(col => col.id === this.currentTask?.status);
      if (column) {
        const index = column.tasks.findIndex(t => t.id === this.currentTask?.id);
        if (index !== -1) {
          column.tasks[index] = { ...this.currentTask };
        }
      }
    } else if (this.addTaskModalOpen) {
      // Add new task
      this.newTask.id = 'task' + (this.boardColumns.reduce((acc, col) => acc + col.tasks.length, 0) + 1);
      const targetColumn = this.boardColumns.find(col => col.id === this.newTask.status);
      if (targetColumn) {
        targetColumn.tasks.push({ ...this.newTask });
      }
    }
    
    this.closeModals();
    this.filterTasks();
  }

  deleteTask(): void {
    if (this.currentTask) {
      for (const column of this.boardColumns) {
        column.tasks = column.tasks.filter(t => t.id !== this.currentTask?.id);
      }
      this.closeModals();
      this.filterTasks();
    }
  }

  deleteColumn(columnId: string): void {
    if (columnId !== 'todo' && columnId !== 'in-progress' && columnId !== 'review' && columnId !== 'done') {
      // Move tasks from deleted column to "To Do"
      const columnToDelete = this.boardColumns.find(col => col.id === columnId);
      const todoColumn = this.boardColumns.find(col => col.id === 'todo');
      
      if (columnToDelete && todoColumn) {
        todoColumn.tasks = [...todoColumn.tasks, ...columnToDelete.tasks];
      }
      
      this.boardColumns = this.boardColumns.filter(col => col.id !== columnId);
      this.filteredColumns = this.filteredColumns.filter(col => col.id !== columnId);
    }
  }

  closeModals(): void {
    this.addTaskModalOpen = false;
    this.editTaskModalOpen = false;
    this.currentTask = null;
  }

  onTaskDrop(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      // Update task status based on new column
      const task = event.container.data[event.currentIndex];
      task.status = event.container.id as 'todo' | 'in-progress' | 'review' | 'done';
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'todo': return 'bg-gray-100 text-gray-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'review': return 'bg-purple-100 text-purple-800';
      case 'done': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getTotalStoryPoints(columnId: string): number {
    const column = this.boardColumns.find(col => col.id === columnId);
    return column ? column.tasks.reduce((sum, task) => sum + (task.storyPoints || 0), 0) : 0;
  }

  getSelectedProjectName(): string {
    const project = this.projects?.find((p: any) => p.id === this.selectedProject);
    return project?.name || 'Select Project';
  }

  getTotalTasks(): number {
    return this.boardColumns
      ? this.boardColumns.reduce((acc: number, col: any) => acc + (col.tasks ? col.tasks.length : 0), 0)
      : 0;
  }

  getCompletedTasks(): number {
    const doneColumn = this.boardColumns.find(col => col.id === 'done');
    return doneColumn ? doneColumn.tasks.length : 0;
  }

  onEditTagsInputChange(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    const tags = input && input.value
      ? input.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      : [];
    
    if (this.currentTask) {
      this.currentTask.tags = tags;
    } else if (this.addTaskModalOpen) {
      this.newTask.tags = tags;
    }
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  openMessageModal(member: any): void {
    this.message = {
      to: member.email,
      subject: '',
      body: ''
    };
    this.messageModalOpen = true;
  }

  sendMessage(): void {
    console.log('Message sent:', this.message);
    this.messageModalOpen = false;
    this.message = { to: '', subject: '', body: '' };
  }

  openReportModal(): void {
    this.reportModalOpen = true;
    this.showReportData = false;
  }

  viewMemberDetails(member: any): void {
    this.selectedMember = member;
    this.memberDetailsModalOpen = true;
  }

  generateReport(): void {
    // Generate report data based on filters
    this.reportData = [];
    
    if (this.reportType === 'project') {
      if (this.selectedReportProject) {
        const project = this.projects.find(p => p.id === this.selectedReportProject);
        this.reportData = [
          { field: 'Project Name', value: project.name },
          { field: 'Status', value: project.status },
          { field: 'Progress', value: `${project.progress}%` },
          { field: 'Team Members', value: this.teamMembers.filter(m => m.currentProjects.includes(project.name)).map(m => m.name).join(', ') },
          { field: 'Tasks Completed', value: this.boardColumns.find(col => col.id === 'done')?.tasks.filter(t => t.projectId === project.id).length || 0 },
          { field: 'Tasks In Progress', value: this.boardColumns.find(col => col.id === 'in-progress')?.tasks.filter(t => t.projectId === project.id).length || 0 }
        ];
      } else {
        // All projects report
        this.reportData = this.projects.map(project => ({
          'Project Name': project.name,
          'Status': project.status,
          'Progress': `${project.progress}%`,
          'Tasks Completed': this.boardColumns.find(col => col.id === 'done')?.tasks.filter(t => t.projectId === project.id).length || 0,
          'Tasks Pending': this.boardColumns.filter(col => col.id !== 'done').reduce((acc, col) => acc + col.tasks.filter(t => t.projectId === project.id).length, 0)
        }));
      }
    } else {
      if (this.selectedReportMember) {
        const member = this.teamMembers.find(m => m.id === this.selectedReportMember);
        this.reportData = [
          { field: 'Name', value: member.name },
          { field: 'Role', value: member.role },
          { field: 'Productivity', value: `${member.productivity}%` },
          { field: 'Tasks Completed', value: member.completed },
          { field: 'Tasks In Progress', value: member.inProgress },
          { field: 'Current Projects', value: member.currentProjects.join(', ') },
          { field: 'Skills', value: member.skills.join(', ') }
        ];
      } else {
        // All members report
        this.reportData = this.teamMembers.map(member => ({
          'Name': member.name,
          'Role': member.role,
          'Productivity': `${member.productivity}%`,
          'Tasks Completed': member.completed,
          'Tasks In Progress': member.inProgress,
          'Email': member.email
        }));
      }
    }
    
    this.showReportData = true;
  }

  downloadReport(format: string): void {
    if (!this.reportData.length) return;

    let dataToExport: any[];
    
    if (Array.isArray(this.reportData) && this.reportData[0].field) {
      // For detailed single report
      dataToExport = this.reportData.map(item => ({
        Field: item.field,
        Value: item.value
      }));
    } else {
      // For tabular data
      dataToExport = this.reportData;
    }

    if (format === 'csv') {
      this.exportToCSV(dataToExport);
    } else if (format === 'excel') {
      this.exportToExcel(dataToExport);
    } else if (format === 'pdf') {
      // In a real app, you would use a PDF library like pdfmake or jspdf
      console.log('PDF export would be implemented here');
      alert('PDF export would be implemented with a proper PDF library');
    }
  }

  private exportToCSV(data: any[]): void {
    const replacer = (key: string, value: any) => value === null ? '' : value;
    const header = Object.keys(data[0]);
    const csvRows = data.map(row => 
      header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(',')
    );
    const csv = [header.join(','), ...csvRows].join('\r\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    saveAs(blob, 'report.csv');
  }

  private exportToExcel(data: any[]): void {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
    XLSX.writeFile(workbook, 'report.xlsx');
  }

  closeReportModal(): void {
    this.reportModalOpen = false;
    this.showReportData = false;
  }

  getObjectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }
}