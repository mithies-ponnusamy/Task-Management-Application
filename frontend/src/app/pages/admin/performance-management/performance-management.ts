// performance-management.component.ts
import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-performance-management',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './performance-management.html',
  styleUrls: ['./performance-management.css']
})
export class PerformanceManagement implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('performanceChart') performanceChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('teamChart') teamChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('performanceDistributionChart') performanceDistributionChartRef!: ElementRef<HTMLCanvasElement>;

  private performanceChart: Chart | null = null;
  private teamChart: Chart | null = null;
  private performanceDistributionChart: Chart | null = null;

  filterDropdownOpen = false;

  // Filter options
  selectedTimePeriod = '30';
  selectedTeam = '';
  selectedMetric = 'completion';

  statCards = [
    {
      title: 'Completion Rate',
      value: '87%',
      change: '5% from last period',
      changeType: 'positive',
      icon: 'fa-check-circle',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Projects Completed',
      value: '24',
      change: '12% from last period',
      changeType: 'positive',
      icon: 'fa-project-diagram',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Tasks Completed',
      value: '156',
      change: '18% from last period',
      changeType: 'positive',
      icon: 'fa-tasks',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'On-Time Delivery',
      value: '92%',
      change: '7% improvement',
      changeType: 'positive',
      icon: 'fa-clock',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    }
  ];

  topPerformers = [
    {
      initials: 'KM',
      name: 'Thirunavukarasu',
      team: 'Development Team',
      performance: '94%',
      rank: '1st',
      rankColor: 'text-indigo-600',
      avatarBg: 'bg-indigo-100',
      avatarText: 'text-indigo-800'
    },
    {
      initials: 'S',
      name: 'Sandeep',
      team: 'Design Team',
      performance: '91%',
      rank: '2nd',
      rankColor: 'text-green-600',
      avatarBg: 'bg-green-100',
      avatarText: 'text-green-800'
    },
    {
      initials: 'K',
      name: 'Gokul',
      team: 'Marketing Team',
      performance: '89%',
      rank: '3rd',
      rankColor: 'text-blue-600',
      avatarBg: 'bg-blue-100',
      avatarText: 'text-blue-800'
    },
    {
      initials: 'S',
      name: 'Abishek',
      team: 'Development Team',
      performance: '87%',
      rank: '4th',
      rankColor: 'text-purple-600',
      avatarBg: 'bg-purple-100',
      avatarText: 'text-purple-800'
    }
  ];

  constructor(private router: Router) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    // Component initialization
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initializeCharts();
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.performanceChart) {
      this.performanceChart.destroy();
    }
    if (this.teamChart) {
      this.teamChart.destroy();
    }
    if (this.performanceDistributionChart) {
      this.performanceDistributionChart.destroy();
    }
  }

  toggleFilterDropdown(): void {
    this.filterDropdownOpen = !this.filterDropdownOpen;
  }

  applyFilters(): void {
    console.log('Applying filters:', {
      timePeriod: this.selectedTimePeriod,
      team: this.selectedTeam,
      metric: this.selectedMetric
    });
    
    this.updateChartsWithFilters();
    this.filterDropdownOpen = false;
  }

  resetFilters(): void {
    this.selectedTimePeriod = '30';
    this.selectedTeam = '';
    this.selectedMetric = 'completion';
    this.updateChartsWithFilters();
    this.filterDropdownOpen = false;
  }

  exportData(): void {
    const data = {
      metrics: this.statCards,
      performers: this.topPerformers,
      filters: {
        timePeriod: this.selectedTimePeriod,
        team: this.selectedTeam,
        metric: this.selectedMetric
      },
      exportDate: new Date().toISOString()
    };
    
    console.log('Exporting performance data:', data);
    alert('Performance data exported successfully!');
  }

  onPerformanceTimeRangeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const weeks = parseInt(target.value);
    this.updatePerformanceChart(weeks);
  }

  onTeamMetricChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const metric = target.value;
    this.updateTeamChart(metric);
  }

  logout(): void {
    if (confirm('Are you sure you want to logout?')) {
      // Clear any stored authentication data
      localStorage.removeItem('authToken');
      sessionStorage.clear();
      
      // Navigate to home page
      this.router.navigate(['/']);
    }
  }

  private initializeCharts(): void {
    this.createPerformanceChart();
    this.createTeamChart();
    this.createPerformanceDistributionChart();
  }

  private createPerformanceChart(): void {
    if (!this.performanceChartRef?.nativeElement) return;

    const ctx = this.performanceChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
          {
            label: 'Development',
            data: [75, 78, 82, 85],
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            tension: 0.3,
            fill: true,
            borderWidth: 2
          },
          {
            label: 'Design',
            data: [85, 88, 90, 91],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.3,
            fill: true,
            borderWidth: 2
          },
          {
            label: 'Marketing',
            data: [70, 74, 77, 78],
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            tension: 0.3,
            fill: true,
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            mode: 'index',
            intersect: false
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

    this.performanceChart = new Chart(ctx, config);
  }

  private createTeamChart(): void {
    if (!this.teamChartRef?.nativeElement) return;

    const ctx = this.teamChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: ['Development', 'Design', 'Marketing'],
        datasets: [{
          label: 'Completion Rate',
          data: [85, 92, 78],
          backgroundColor: [
            'rgba(99, 102, 241, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)'
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

    this.teamChart = new Chart(ctx, config);
  }

  private createPerformanceDistributionChart(): void {
    if (!this.performanceDistributionChartRef?.nativeElement) return;

    const ctx = this.performanceDistributionChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration<'doughnut'> = {
      type: 'doughnut',
      data: {
        labels: ['Top Performers', 'Above Average', 'Average', 'Needs Improvement'],
        datasets: [{
          data: [15, 35, 40, 10],
          backgroundColor: [
            '#10b981',
            '#3b82f6',
            '#f59e0b',
            '#ef4444'
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'bottom',
          }
        }
      }
    };

    this.performanceDistributionChart = new Chart(ctx, config);
  }

  private updatePerformanceChart(weeks: number): void {
    if (!this.performanceChart) return;

    let labels: string[];
    let developmentData: number[];
    let designData: number[];
    let marketingData: number[];

    if (weeks === 4) {
      labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      developmentData = [75, 78, 82, 85];
      designData = [85, 88, 90, 91];
      marketingData = [70, 74, 77, 78];
    } else if (weeks === 8) {
      labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'];
      developmentData = [70, 72, 75, 78, 80, 82, 84, 85];
      designData = [80, 82, 85, 88, 89, 90, 90, 91];
      marketingData = [65, 68, 70, 74, 75, 77, 77, 78];
    } else {
      labels = ['Month 1', 'Month 2', 'Month 3'];
      developmentData = [78, 82, 85];
      designData = [88, 90, 91];
      marketingData = [72, 75, 78];
    }

    this.performanceChart.data.labels = labels;
    this.performanceChart.data.datasets[0].data = developmentData;
    this.performanceChart.data.datasets[1].data = designData;
    this.performanceChart.data.datasets[2].data = marketingData;
    this.performanceChart.update();
  }

  private updateTeamChart(metric: string): void {
    if (!this.teamChart) return;

    let data: number[];
    let label: string;

    switch (metric) {
      case 'completion':
        data = [85, 92, 78];
        label = 'Completion Rate';
        break;
      case 'volume':
        data = [45, 38, 52];
        label = 'Task Volume';
        break;
      case 'delivery':
        data = [88, 95, 82];
        label = 'On-Time Delivery';
        break;
      default:
        data = [85, 92, 78];
        label = 'Completion Rate';
    }

    this.teamChart.data.datasets[0].data = data;
    this.teamChart.data.datasets[0].label = label;
    this.teamChart.update();
  }

  private updateChartsWithFilters(): void {
    console.log('Updating charts with filters:', {
      timePeriod: this.selectedTimePeriod,
      team: this.selectedTeam,
      metric: this.selectedMetric
    });

    if (this.performanceChart) {
      this.updatePerformanceChart(4);
    }
    if (this.teamChart) {
      this.updateTeamChart(this.selectedMetric);
    }
  }
}