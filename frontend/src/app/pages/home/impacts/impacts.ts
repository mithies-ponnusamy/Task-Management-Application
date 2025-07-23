import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Stat {
  value: string;
  title: string;
  description: string;
  icon: string;
}

interface ProgressMetric {
  label: string;
  percentage: number;
  color: string;
}

@Component({
  selector: 'app-impacts',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './impacts.html',
  styleUrls: ['./impacts.css']
})
export class Impacts {
  stats: Stat[] = [
    {
      value: '10000',
      title: 'Active Users',
      description: 'Trusted by teams across 50+ countries',
      icon: 'fa-users'
    },
    {
      value: '95',
      title: 'Success Rate',
      description: 'Of teams report improved productivity',
      icon: 'fa-chart-line'
    },
    {
      value: '500',
      title: 'Projects Daily',
      description: 'Managed through our platform',
      icon: 'fa-project-diagram'
    },
    {
      value: '24',
      title: 'Support Hours',
      description: 'Dedicated customer success team',
      icon: 'fa-headset'
    }
  ];

  performanceMetrics: ProgressMetric[] = [
    { label: 'Task Completion', percentage: 87, color: 'bg-primary' },
    { label: 'On-Time Delivery', percentage: 92, color: 'bg-success' },
    { label: 'Team Collaboration', percentage: 78, color: 'bg-warning' }
  ];

  satisfactionMetrics: ProgressMetric[] = [
    { label: 'Ease of Use', percentage: 94, color: 'bg-primary' },
    { label: 'Features', percentage: 89, color: 'bg-primary' },
    { label: 'Support', percentage: 97, color: 'bg-primary' }
  ];
}