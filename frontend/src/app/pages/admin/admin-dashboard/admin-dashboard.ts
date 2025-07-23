import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';

interface StatCard {
  title: string;
  value: number;
  icon: string;
  iconBg: string;
  textColor: string;
  details: {
    label1: string;
    value1: number;
    label2: string;
    value2: number;
  };
}

interface Activity {
  icon: string;
  iconBg: string;
  title: string;
  description: string;
  time: string;
}

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboard implements OnInit, AfterViewInit {
  statCards: StatCard[] = [
    {
      title: 'Teams',
      value: 24,
      icon: 'fa-users',
      iconBg: 'bg-blue-50',
      textColor: 'text-blue-600',
      details: {
        label1: 'Team leads',
        value1: 5,
        label2: 'Members',
        value2: 56
      }
    },
    {
      title: 'Projects',
      value: 18,
      icon: 'fa-project-diagram',
      iconBg: 'bg-green-50',
      textColor: 'text-green-600',
      details: {
        label1: 'Active',
        value1: 12,
        label2: 'Completed',
        value2: 6
      }
    },
    {
      title: 'Tasks Assigned',
      value: 142,
      icon: 'fa-tasks',
      iconBg: 'bg-purple-50',
      textColor: 'text-purple-600',
      details: {
        label1: 'Completed',
        value1: 98,
        label2: 'Pending',
        value2: 44
      }
    },
    {
      title: 'Recent Activities',
      value: 12,
      icon: 'fa-history',
      iconBg: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      details: {
        label1: 'Last 7 days',
        value1: 12,
        label2: '',
        value2: 0
      }
    }
  ];

  recentActivities: Activity[] = [
    {
      icon: 'fa-user-plus',
      iconBg: 'bg-blue-50 text-blue-600',
      title: 'New user registered',
      description: 'Mithies P',
      time: '2 hours ago'
    },
    {
      icon: 'fa-tasks',
      iconBg: 'bg-green-50 text-green-600',
      title: 'Task completed',
      description: 'Update dashboard design',
      time: '5 hours ago'
    },
    {
      icon: 'fa-project-diagram',
      iconBg: 'bg-purple-50 text-purple-600',
      title: 'New project created',
      description: 'Website Redesign',
      time: '1 day ago'
    },
    {
      icon: 'fa-exclamation-circle',
      iconBg: 'bg-yellow-50 text-yellow-600',
      title: 'High priority task',
      description: 'Fix critical bug assigned',
      time: '2 days ago'
    }
  ];

  constructor() {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.initCharts();
  }

  private initCharts(): void {
    // Status Overview Chart (Line Chart)
    const statusCtx = document.getElementById('statusChart') as HTMLCanvasElement;
    if (statusCtx) {
      new Chart(statusCtx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
          datasets: [
            {
              label: 'Tasks Created',
              data: [12, 19, 15, 25, 22, 30, 28],
              borderColor: '#6366f1',
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              tension: 0.3,
              fill: true,
              borderWidth: 2
            },
            {
              label: 'Tasks Completed',
              data: [8, 12, 10, 18, 15, 22, 20],
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
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
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }

    // Task Status Chart (Doughnut)
    const taskStatusCtx = document.getElementById('taskStatusChart') as HTMLCanvasElement;
    if (taskStatusCtx) {
      new Chart(taskStatusCtx, {
        type: 'doughnut',
        data: {
          labels: ['To Do', 'In Progress', 'Done'],
          datasets: [{
            data: [15, 8, 12],
            backgroundColor: [
              '#f59e0b',
              '#3b82f6',
              '#10b981'
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
      });
    }

    // Priority Chart (Bar Chart)
    const priorityCtx = document.getElementById('priorityChart') as HTMLCanvasElement;
    if (priorityCtx) {
      new Chart(priorityCtx, {
        type: 'bar',
        data: {
          labels: ['Critical', 'High', 'Medium', 'Low'],
          datasets: [{
            label: 'Tasks by Priority',
            data: [5, 10, 15, 8],
            backgroundColor: [
              '#ef4444',
              '#f59e0b',
              '#3b82f6',
              '#6b7280'
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
              beginAtZero: true
            }
          }
        }
      });
    }
  }
}