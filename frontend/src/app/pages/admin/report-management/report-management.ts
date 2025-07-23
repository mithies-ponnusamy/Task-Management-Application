import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { DialogService } from '../../../core/services/dialog/dialog';
import { ToastService } from '../../../core/services/toast/toast';

interface Report {
  id: number;
  title: string;
  type: string;
  date: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending';
  format: 'table' | 'chart' | 'both';
  filters: {
    dateRange: string;
    projects: string[];
    teams: string[];
    statuses: string[];
    priority: string[];
  };
  metrics: {
    totalTasks?: number;
    completedTasks?: number;
    overdueTasks?: number;
    avgCompletionTime?: string;
    taskDistribution?: { [key: string]: number };
  };
  data: any[];
  insights: string[];
}

interface ReportForm {
  reportType: string;
  dateRange: string;
  projects: string[];
  teams: string[];
  statuses: string[];
  priority: string[];
  columns: {
    task: boolean;
    project: boolean;
    assignee: boolean;
    status: boolean;
    priority: boolean;
    dueDate: boolean;
    timeSpent: boolean;
  };
  format: 'table' | 'chart' | 'both';
  includeInsights: boolean;
}

@Component({
  selector: 'app-report-management',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule
  ],
  templateUrl: './report-management.html',
  styleUrls: ['./report-management.css']
})
export class ReportManagement implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('taskStatusChart') taskStatusChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('teamPerformanceChart') teamPerformanceChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('priorityDistributionChart') priorityDistributionChartRef!: ElementRef<HTMLCanvasElement>;

  private isBrowser: boolean;
  private taskStatusChart: Chart | null = null;
  private teamPerformanceChart: Chart | null = null;
  private priorityDistributionChart: Chart | null = null;
  public currentDate: Date = new Date();

  // Toast dialog properties
  showToast = false;
  toastTitle = '';
  toastMessage = '';
  toastReportId: number | null = null;
  toastActionType: 'export' | 'duplicate' | null = null;

  activeTab = 'saved';
  showReportGenerator = false;
  showAdvancedOptions = false;
  showExportDropdown = false;
  showReportMenu: number | null = null;
  selectedReport: Report | null = null;
  searchTerm = '';
  historySearchTerm = '';
  filteredReports: Report[] = [];
  filteredHistory: any[] = [];

  // Pagination
  currentPage = 1;
  itemsPerPage = 6;
  totalPages = 1;
  paginationInfo = { start: 1, end: 6, total: 0 };

  // Table pagination
  tableCurrentPage = 1;
  tableItemsPerPage = 5;
  tableTotalPages = 1;

  tabs = [
    { id: 'saved', label: 'Saved Reports', icon: 'fa-file-alt' },
    { id: 'history', label: 'Report History', icon: 'fa-history' }
  ];

  reportForm: ReportForm = {
    reportType: 'task_status',
    dateRange: '30',
    projects: [],
    teams: [],
    statuses: [],
    priority: [],
    columns: {
      task: true,
      project: true,
      assignee: true,
      status: true,
      priority: true,
      dueDate: true,
      timeSpent: false
    },
    format: 'both',
    includeInsights: true
  };

  // Sample data for demo purposes
  allProjects = ['Website Redesign', 'Mobile App', 'Marketing Campaign', 'API Development'];
  allTeams = ['Development', 'Design', 'Marketing', 'QA'];
  allStatuses = ['Not Started', 'In Progress', 'In Review', 'Completed', 'Blocked'];
  allPriorities = ['Critical', 'High', 'Medium', 'Low'];

  reports: Report[] = [
    {
      id: 1,
      title: "Q2 Task Completion Report",
      type: "Task Status Report",
      date: "15 Jun 2025",
      description: "This task status report covers last 30 days (16 May 2025 - 15 Jun 2025). Focused on projects: Website Redesign, Mobile App. Includes data for teams: Development, Design.",
      status: "completed",
      format: "both",
      filters: {
        dateRange: "Last 30 Days (16 May 2025 - 15 Jun 2025)",
        projects: ["Website Redesign", "Mobile App"],
        teams: ["Development", "Design"],
        statuses: ["Completed", "In Progress"],
        priority: ["High", "Medium"]
      },
      metrics: {
        totalTasks: 142,
        completedTasks: 98,
        overdueTasks: 12,
        avgCompletionTime: "3.2 days",
        taskDistribution: {
          "Completed": 98,
          "In Progress": 32,
          "Not Started": 8,
          "Blocked": 4
        }
      },
      data: [
        {
          task: "Implement user authentication",
          project: "Mobile App",
          assignee: "John Doe",
          status: "Completed",
          priority: "High",
          dueDate: "15 May 2025",
          timeSpent: "8h 30m"
        },
        {
          task: "Design dashboard UI",
          project: "Website Redesign",
          assignee: "Jane Smith",
          status: "In Progress",
          priority: "Medium",
          dueDate: "25 Jun 2025",
          timeSpent: "5h 15m"
        },
        {
          task: "API integration testing",
          project: "Mobile App",
          assignee: "Mike Johnson",
          status: "In Review",
          priority: "High",
          dueDate: "20 Jun 2025",
          timeSpent: "12h 45m"
        }
      ],
      insights: [
        "Development team completed 92% of high priority tasks on time",
        "Design team has 3 overdue tasks needing attention",
        "Average completion time improved by 18% compared to Q1"
      ]
    },
    {
      id: 2,
      title: "Team Performance - May 2025",
      type: "Team Performance Report",
      date: "1 Jun 2025",
      description: "This team performance report covers last 30 days (2 May 2025 - 1 Jun 2025). Includes data for all teams.",
      status: "in-progress",
      format: "both",
      filters: {
        dateRange: "Last 30 Days (2 May 2025 - 1 Jun 2025)",
        projects: ["All Projects"],
        teams: ["Development", "Design", "Marketing"],
        statuses: ["All Statuses"],
        priority: ["All Priorities"]
      },
      metrics: {
        totalTasks: 187,
        completedTasks: 132,
        overdueTasks: 18,
        avgCompletionTime: "2.8 days",
        taskDistribution: {
          "Development": 84,
          "Design": 56,
          "Marketing": 47
        }
      },
      data: [
        {
          team: "Development",
          tasksCompleted: 84,
          completionRate: "92%",
          avgTimeSpent: "4.2h/task",
          overdueTasks: 5
        },
        {
          team: "Design",
          tasksCompleted: 56,
          completionRate: "88%",
          avgTimeSpent: "3.8h/task",
          overdueTasks: 7
        },
        {
          team: "Marketing",
          tasksCompleted: 47,
          completionRate: "85%",
          avgTimeSpent: "5.1h/task",
          overdueTasks: 6
        }
      ],
      insights: [
        "Development team leads in completion rate (92%)",
        "Marketing tasks take longer on average (5.1h vs 4.2h for Development)",
        "7% of all tasks were overdue this month"
      ]
    }
  ];

  reportHistory = [
    { name: "Weekly Status Report", type: "Task Status", generatedBy: "Admin User", date: "12 Jun 2025", exportedAs: "PDF" },
    { name: "Team Performance Review", type: "Team Performance", generatedBy: "Admin User", date: "5 Jul 2025", exportedAs: "Excel" },
    { name: "Project Health Dashboard", type: "Project Summary", generatedBy: "Project Manager", date: "7 Jun 2025", exportedAs: "PDF" }
  ];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private dialogService: DialogService,
    private toastService: ToastService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      Chart.register(...registerables);
    }
  }

  ngOnInit() {
    this.filteredReports = [...this.reports];
    this.filteredHistory = [...this.reportHistory];
    this.updatePagination();
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      setTimeout(() => {
        this.initializeCharts();
      }, 100);
    }
  }

  ngOnDestroy() {
    if (this.taskStatusChart) {
      this.taskStatusChart.destroy();
    }
    if (this.teamPerformanceChart) {
      this.teamPerformanceChart.destroy();
    }
    if (this.priorityDistributionChart) {
      this.priorityDistributionChart.destroy();
    }
  }

  // Toast dialog methods
  showDuplicateConfirmation(reportId: number) {
    const report = this.reports.find(r => r.id === reportId);
    if (report) {
      this.toastTitle = 'Duplicate Report';
      this.toastMessage = `Are you sure you want to duplicate "${report.title}"?`;
      this.toastReportId = reportId;
      this.toastActionType = 'duplicate';
      this.showToast = true;
    }
    this.showReportMenu = null;
  }

  showExportConfirmation(reportId: number) {
    const report = this.reports.find(r => r.id === reportId);
    if (report) {
      this.toastTitle = 'Export Report';
      this.toastMessage = `Are you sure you want to export "${report.title}"?`;
      this.toastReportId = reportId;
      this.toastActionType = 'export';
      this.showToast = true;
    }
    this.showReportMenu = null;
  }

  toastAction(confirmed: boolean) {
    if (confirmed && this.toastReportId && this.toastActionType) {
      if (this.toastActionType === 'duplicate') {
        this.duplicateReport(this.toastReportId);
      } else if (this.toastActionType === 'export') {
        this.exportReport(this.toastReportId);
      }
    }
    this.showToast = false;
    this.toastTitle = '';
    this.toastMessage = '';
    this.toastReportId = null;
    this.toastActionType = null;
  }

  setActiveTab(tabId: string) {
    this.activeTab = tabId;
    this.selectedReport = null;
    this.showReportMenu = null;
  }

  toggleReportGenerator() {
    this.showReportGenerator = !this.showReportGenerator;
    this.showReportMenu = null;
    if (!this.showReportGenerator) {
      this.resetReportForm();
    }
  }

  toggleAdvancedOptions() {
    this.showAdvancedOptions = !this.showAdvancedOptions;
  }

  toggleExportDropdown() {
    this.showExportDropdown = !this.showExportDropdown;
    this.showReportMenu = null;
  }

  toggleReportMenu(reportId: number) {
    this.showReportMenu = this.showReportMenu === reportId ? null : reportId;
    this.showExportDropdown = false;
  }

  generateReport() {
    if (!this.reportForm.reportType) {
      if (this.isBrowser) {
        alert('Please select a report type');
      }
      return;
    }

    const newReport: Report = {
      id: this.reports.length + 1,
      title: this.generateReportTitle(),
      type: this.getReportTypeLabel(this.reportForm.reportType),
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      description: this.generateReportDescription(),
      status: "completed",
      format: this.reportForm.format,
      filters: {
        dateRange: this.getDateRangeLabel(this.reportForm.dateRange),
        projects: this.reportForm.projects.length > 0 ? this.reportForm.projects : ['All Projects'],
        teams: this.reportForm.teams.length > 0 ? this.reportForm.teams : ['All Teams'],
        statuses: this.reportForm.statuses.length > 0 ? this.reportForm.statuses : ['All Statuses'],
        priority: this.reportForm.priority.length > 0 ? this.reportForm.priority : ['All Priorities']
      },
      metrics: this.generateSampleMetrics(),
      data: this.generateSampleData(),
      insights: this.reportForm.includeInsights ? this.generateSampleInsights() : []
    };

    this.reports.unshift(newReport);
    this.filteredReports = [...this.reports];
    this.updatePagination();
    this.showReportGenerator = false;
    this.viewReport(newReport.id);
    this.toastService.show('Report generated successfully.');
  }

  cancelReportGeneration() {
    this.showReportGenerator = false;
    this.resetReportForm();
  }

  filterReports() {
    if (!this.searchTerm.trim()) {
      this.filteredReports = [...this.reports];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredReports = this.reports.filter(report => 
        report.title.toLowerCase().includes(term) || 
        report.description.toLowerCase().includes(term) ||
        report.type.toLowerCase().includes(term)
      );
    }
    this.currentPage = 1;
    this.updatePagination();
  }

  filterHistory() {
    if (!this.historySearchTerm.trim()) {
      this.filteredHistory = [...this.reportHistory];
    } else {
      const term = this.historySearchTerm.toLowerCase();
      this.filteredHistory = this.reportHistory.filter(history => 
        history.name.toLowerCase().includes(term) || 
        history.type.toLowerCase().includes(term) ||
        history.generatedBy.toLowerCase().includes(term)
      );
    }
  }

  viewReport(reportId: number) {
    this.selectedReport = this.reports.find(r => r.id === reportId) || null;
    this.showReportMenu = null;
    this.tableCurrentPage = 1;
    this.tableTotalPages = Math.ceil((this.selectedReport?.data.length || 0) / this.tableItemsPerPage);
    if (this.selectedReport && this.isBrowser) {
      setTimeout(() => {
        this.initializeCharts();
      }, 100);
    }
  }

  closeReportView() {
    this.selectedReport = null;
  }

  exportReport(reportId: number, format: string = 'pdf') {
    const report = this.reports.find(r => r.id === reportId);
    if (report && this.isBrowser) {
      console.log(`Exporting ${report.title} as ${format.toUpperCase()}`);
      alert(`Exporting ${report.title} as ${format.toUpperCase()}...`);
      // In a real app, this would trigger actual export functionality
    }
    this.showReportMenu = null;
  }

  exportAs(format: string) {
    if (this.selectedReport) {
      this.exportReport(this.selectedReport.id, format);
    }
    this.showExportDropdown = false;
  }

  duplicateReport(reportId: number) {
    const report = this.reports.find(r => r.id === reportId);
    if (report) {
      const newReport = JSON.parse(JSON.stringify(report));
      newReport.id = this.reports.length + 1;
      newReport.title = `Copy of ${report.title}`;
      newReport.date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
      
      this.reports.unshift(newReport);
      this.filteredReports = [...this.reports];
      this.updatePagination();
      this.showReportMenu = null;
      
      if (this.isBrowser) {
        alert('Report duplicated successfully!');
      }
    }
  }

  deleteReport(reportId: number) {
    const report = this.reports.find(r => r.id === reportId);
    if (!report) return;
    
    this.dialogService.open({
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete the report "${report.title}"?`,
        confirmButtonText: 'Delete',
        confirmButtonClass: 'bg-red-600 hover:bg-red-700',
        onConfirm: () => {
            this.reports = this.reports.filter(r => r.id !== reportId);
            this.filteredReports = this.filteredReports.filter(r => r.id !== reportId);
            if (this.selectedReport?.id === reportId) this.selectedReport = null;
            this.updatePagination();
            this.showReportMenu = null;
            this.toastService.show('Report deleted successfully.');
        }
    });
  }

  printReport() {
    if (this.isBrowser) {
      window.print();
    }
  }

  // Table pagination methods
  previousTablePage() {
    if (this.tableCurrentPage > 1) {
      this.tableCurrentPage--;
    }
  }

  nextTablePage() {
    if (this.selectedReport && this.tableCurrentPage < Math.ceil(this.selectedReport.data.length / this.tableItemsPerPage)) {
      this.tableCurrentPage++;
    }
  }

  // Pagination methods
  updatePagination() {
    this.totalPages = Math.ceil(this.filteredReports.length / this.itemsPerPage);
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.filteredReports.length);
    this.paginationInfo = {
      start,
      end,
      total: this.filteredReports.length
    };
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePagination();
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  // Helper methods
  getStatusClass(status: string): string {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'completed': return 'fa-check-circle';
      case 'in-progress': return 'fa-sync-alt';
      case 'pending': return 'fa-clock';
      default: return 'fa-clock';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in-progress': return 'In Progress';
      case 'pending': return 'Pending';
      default: return 'Unknown';
    }
  }

  getFilterTags(report: Report): string[] {
    const tags = [
      `Date Range: ${report.filters.dateRange}`,
      `Projects: ${report.filters.projects.join(', ')}`,
      `Teams: ${report.filters.teams.join(', ')}`,
      `Statuses: ${report.filters.statuses.join(', ')}`,
      `Priorities: ${report.filters.priority.join(', ')}`
    ];
    return tags.filter(tag => !tag.includes(': All '));
  }

  getMetricCards(report: Report): any[] {
    if (report.type.includes('Task Status') || report.type.includes('Project Summary')) {
      return [
        {
          label: 'Total Tasks',
          value: report.metrics.totalTasks?.toString() || '0',
          icon: 'fa-tasks',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-800',
          valueColor: 'text-blue-900'
        },
        {
          label: 'Completed',
          value: `${report.metrics.completedTasks} (${Math.round(((report.metrics.completedTasks || 0) / (report.metrics.totalTasks || 1)) * 100)}%)`,
          icon: 'fa-check-circle',
          bgColor: 'bg-green-50',
          textColor: 'text-green-800',
          valueColor: 'text-green-900'
        },
        {
          label: 'Overdue',
          value: report.metrics.overdueTasks?.toString() || '0',
          icon: 'fa-exclamation-triangle',
          bgColor: 'bg-red-50',
          textColor: 'text-red-800',
          valueColor: 'text-red-900'
        },
        {
          label: 'Avg. Time',
          value: report.metrics.avgCompletionTime || 'N/A',
          icon: 'fa-clock',
          bgColor: 'bg-purple-50',
          textColor: 'text-purple-800',
          valueColor: 'text-purple-900'
        }
      ];
    } else if (report.type.includes('Team Performance')) {
      return [
        {
          label: 'Teams',
          value: report.filters.teams.join(', ') || 'All Teams',
          icon: 'fa-users',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-800',
          valueColor: 'text-blue-900'
        },
        {
          label: 'Tasks Completed',
          value: report.metrics.completedTasks?.toString() || '0',
          icon: 'fa-check',
          bgColor: 'bg-green-50',
          textColor: 'text-green-800',
          valueColor: 'text-green-900'
        },
        {
          label: 'Completion Rate',
          value: `${Math.round(((report.metrics.completedTasks || 0) / (report.metrics.totalTasks || 1)) * 100)}%`,
          icon: 'fa-percent',
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-800',
          valueColor: 'text-yellow-900'
        },
        {
          label: 'Avg. Time',
          value: report.metrics.avgCompletionTime || 'N/A',
          icon: 'fa-clock',
          bgColor: 'bg-purple-50',
          textColor: 'text-purple-800',
          valueColor: 'text-purple-900'
        }
      ];
    }
    return [];
  }

  getTableHeaders(report: Report): string[] {
    if (report.data && report.data.length > 0) {
      return Object.keys(report.data[0]).filter(key => key !== 'id').map(key => 
        key.split(/(?=[A-Z])/).join(' ')
      );
    }
    return [];
  }

  getTableRow(row: any): string[] {
    return Object.keys(row).filter(key => key !== 'id').map(key => {
      const value = row[key];
      
      if (key === 'status') {
        let statusClass = '';
        if (value === 'Completed') statusClass = 'bg-green-100 text-green-800';
        else if (value === 'In Progress') statusClass = 'bg-blue-100 text-blue-800';
        else if (value === 'Not Started') statusClass = 'bg-gray-100 text-gray-800';
        else if (value === 'In Review') statusClass = 'bg-yellow-100 text-yellow-800';
        else if (value === 'Blocked') statusClass = 'bg-red-100 text-red-800';
        else statusClass = 'bg-gray-100 text-gray-800';
        
        return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass}">${value}</span>`;
      } else if (key === 'priority') {
        let priorityClass = '';
        if (value === 'Critical') priorityClass = 'bg-red-100 text-red-800';
        else if (value === 'High') priorityClass = 'bg-orange-100 text-orange-800';
        else if (value === 'Medium') priorityClass = 'bg-yellow-100 text-yellow-800';
        else if (value === 'Low') priorityClass = 'bg-green-100 text-green-800';
        else priorityClass = 'bg-gray-100 text-gray-800';
        
        return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityClass}">${value}</span>`;
      } else {
        return value?.toString() || '';
      }
    });
  }

  private getReportTypeLabel(type: string): string {
    switch (type) {
      case 'task_status': return 'Task Status Report';
      case 'team_performance': return 'Team Performance Report';
      case 'project_summary': return 'Project Summary Report';
      case 'time_tracking': return 'Time Tracking Report';
      default: return 'Custom Report';
    }
  }

  private getDateRangeLabel(range: string): string {
    const today = new Date();
    const prevDate = new Date();
    
    switch (range) {
      case '7':
        prevDate.setDate(today.getDate() - 7);
        return `Last 7 Days (${prevDate.toLocaleDateString()} - ${today.toLocaleDateString()})`;
      case '30':
        prevDate.setDate(today.getDate() - 30);
        return `Last 30 Days (${prevDate.toLocaleDateString()} - ${today.toLocaleDateString()})`;
      case '90':
        prevDate.setDate(today.getDate() - 90);
        return `Last Quarter (${prevDate.toLocaleDateString()} - ${today.toLocaleDateString()})`;
      case '365':
        prevDate.setDate(today.getDate() - 365);
        return `Last Year (${prevDate.toLocaleDateString()} - ${today.toLocaleDateString()})`;
      case 'custom':
        return 'Custom Date Range';
      default:
        return 'All Time';
    }
  }

  private resetReportForm() {
    this.reportForm = {
      reportType: 'task_status',
      dateRange: '30',
      projects: [],
      teams: [],
      statuses: [],
      priority: [],
      columns: {
        task: true,
        project: true,
        assignee: true,
        status: true,
        priority: true,
        dueDate: true,
        timeSpent: false
      },
      format: 'both',
      includeInsights: true
    };
    this.showAdvancedOptions = false;
  }

  private initializeCharts() {
    if (this.selectedReport) {
      this.createTaskStatusChart();
      this.createTeamPerformanceChart();
      this.createPriorityDistributionChart();
    }
  }

  private createTaskStatusChart() {
    if (!this.taskStatusChartRef?.nativeElement || !this.selectedReport) return;

    const ctx = this.taskStatusChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    if (this.taskStatusChart) {
      this.taskStatusChart.destroy();
    }

    const statusData = this.selectedReport.metrics.taskDistribution || {
      'Completed': 0,
      'In Progress': 0,
      'Not Started': 0,
      'Blocked': 0
    };

    const config: ChartConfiguration<'doughnut'> = {
      type: 'doughnut',
      data: {
        labels: Object.keys(statusData),
        datasets: [{
          data: Object.values(statusData),
          backgroundColor: [
            '#10b981',
            '#3b82f6',
            '#9ca3af',
            '#ef4444'
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
          },
          title: {
            display: true,
            text: 'Task Status Distribution',
            font: {
              size: 14
            }
          }
        },
        cutout: '70%'
      }
    };

    this.taskStatusChart = new Chart(ctx, config);
  }

  private createTeamPerformanceChart() {
    if (!this.teamPerformanceChartRef?.nativeElement || !this.selectedReport) return;

    const ctx = this.teamPerformanceChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    if (this.teamPerformanceChart) {
      this.teamPerformanceChart.destroy();
    }

    let teamData = [];
    if (this.selectedReport.type.includes('Team Performance')) {
      teamData = this.selectedReport.data.map(team => ({
        team: team.team,
        completionRate: parseFloat(team.completionRate)
      }));
    } else {
      // For other report types, we'll create sample data
      teamData = [
        { team: 'Development', completionRate: 92 },
        { team: 'Design', completionRate: 88 },
        { team: 'Marketing', completionRate: 85 }
      ];
    }

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: teamData.map(item => item.team),
        datasets: [{
          label: 'Completion Rate %',
          data: teamData.map(item => item.completionRate),
          backgroundColor: [
            'rgba(99, 102, 241, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(59, 130, 246, 0.8)'
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Team Performance',
            font: {
              size: 14
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: function(value) {
                return value + '%';
              }
            }
          }
        }
      }
    };

    this.teamPerformanceChart = new Chart(ctx, config);
  }

  private createPriorityDistributionChart() {
    if (!this.priorityDistributionChartRef?.nativeElement || !this.selectedReport) return;

    const ctx = this.priorityDistributionChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    if (this.priorityDistributionChart) {
      this.priorityDistributionChart.destroy();
    }

    // Sample priority data - in a real app this would come from the report data
    const priorityData = {
      'Critical': 8,
      'High': 24,
      'Medium': 45,
      'Low': 15
    };

    const config: ChartConfiguration<'pie'> = {
      type: 'pie',
      data: {
        labels: Object.keys(priorityData),
        datasets: [{
          data: Object.values(priorityData),
          backgroundColor: [
            '#ef4444',
            '#f97316',
            '#eab308',
            '#22c55e'
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
          },
          title: {
            display: true,
            text: 'Priority Distribution',
            font: {
              size: 14
            }
          }
        }
      }
    };

    this.priorityDistributionChart = new Chart(ctx, config);
  }

  // Helper methods for report generation
  private generateReportTitle(): string {
    const type = this.getReportTypeLabel(this.reportForm.reportType);
    const dateRange = this.getDateRangeLabel(this.reportForm.dateRange).split(' ')[0];
    return `${dateRange} ${type}`;
  }

  private generateReportDescription(): string {
    const type = this.getReportTypeLabel(this.reportForm.reportType);
    const dateRange = this.getDateRangeLabel(this.reportForm.dateRange);
    let description = `This ${type.toLowerCase()} covers ${dateRange.toLowerCase()}.`;
    
    if (this.reportForm.projects.length > 0) {
      description += ` Focused on ${this.reportForm.projects.length > 1 ? 'projects' : 'project'}: ${this.reportForm.projects.join(', ')}.`;
    }
    
    if (this.reportForm.teams.length > 0) {
      description += ` Includes data for ${this.reportForm.teams.length > 1 ? 'teams' : 'team'}: ${this.reportForm.teams.join(', ')}.`;
    }
    
    return description;
  }

  private generateSampleMetrics(): any {
    const metrics: any = {
      totalTasks: Math.floor(Math.random() * 200) + 50,
      completedTasks: 0,
      overdueTasks: 0,
      avgCompletionTime: ''
    };
    
    metrics.completedTasks = Math.floor(metrics.totalTasks * (0.7 + Math.random() * 0.25));
    metrics.overdueTasks = Math.floor(metrics.totalTasks * (0.05 + Math.random() * 0.1));
    metrics.avgCompletionTime = (1.5 + Math.random() * 3).toFixed(1) + ' days';
    
    if (this.reportForm.reportType === 'task_status') {
      metrics.taskDistribution = {
        'Completed': metrics.completedTasks,
        'In Progress': Math.floor((metrics.totalTasks - metrics.completedTasks) * 0.7),
        'Not Started': Math.floor((metrics.totalTasks - metrics.completedTasks) * 0.2),
        'Blocked': Math.floor((metrics.totalTasks - metrics.completedTasks) * 0.1)
      };
    }
    
    return metrics;
  }

  private generateSampleData(): any[] {
    const data = [];
    const sampleTasks = [
      'Implement user authentication',
      'Design dashboard UI',
      'API integration testing',
      'Write documentation',
      'Fix critical bugs',
      'Optimize database queries',
      'Create marketing materials',
      'User acceptance testing',
      'Deploy to production',
      'Performance testing'
    ];
    
    const sampleAssignees = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams', 'David Brown'];
    
    if (this.reportForm.reportType === 'task_status') {
      for (let i = 0; i < 10; i++) {
        data.push({
          task: sampleTasks[Math.floor(Math.random() * sampleTasks.length)],
          project: this.allProjects[Math.floor(Math.random() * this.allProjects.length)],
          assignee: sampleAssignees[Math.floor(Math.random() * sampleAssignees.length)],
          status: this.allStatuses[Math.floor(Math.random() * this.allStatuses.length)],
          priority: this.allPriorities[Math.floor(Math.random() * this.allPriorities.length)],
          dueDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
            .toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
          timeSpent: `${Math.floor(Math.random() * 10) + 1}h ${Math.floor(Math.random() * 60)}m`
        });
      }
    } else if (this.reportForm.reportType === 'team_performance') {
      const teams = this.reportForm.teams.length > 0 ? this.reportForm.teams : this.allTeams;
      teams.forEach(team => {
        const tasks = Math.floor(Math.random() * 50) + 20;
        const completed = Math.floor(tasks * (0.8 + Math.random() * 0.15));
        data.push({
          team,
          tasksCompleted: completed,
          completionRate: `${Math.round((completed / tasks) * 100)}%`,
          avgTimeSpent: `${(3 + Math.random() * 2).toFixed(1)}h/task`,
          overdueTasks: Math.floor(tasks * (0.05 + Math.random() * 0.1))
        });
      });
    }
    
    return data;
  }

  private generateSampleInsights(): string[] {
    const insights = [];
    
    if (this.reportForm.reportType === 'task_status') {
      insights.push(
        `${Math.floor(70 + Math.random() * 20)}% of high priority tasks were completed on time`,
        `${Math.floor(1 + Math.random() * 5)} tasks are blocked and need attention`,
        `Average completion time is ${(2 + Math.random() * 3).toFixed(1)} days`
      );
    } else if (this.reportForm.reportType === 'team_performance') {
      insights.push(
        `${this.reportForm.teams.length > 0 ? this.reportForm.teams[0] : 'Development'} team has the highest completion rate`,
        `${Math.floor(5 + Math.random() * 10)}% of all tasks were overdue this period`,
        `Tasks take an average of ${(3 + Math.random() * 2).toFixed(1)} hours to complete`
      );
    }
    
    return insights;
  }

  min(a: number, b: number): number {
    return Math.min(a, b);
  }

  toggleAllProjects(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.reportForm.projects = isChecked ? [...this.allProjects] : [];
  }

  toggleAllTeams(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.reportForm.teams = isChecked ? [...this.allTeams] : [];
  }
}