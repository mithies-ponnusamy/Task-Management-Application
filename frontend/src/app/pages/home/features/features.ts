import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Feature {
  icon: string;
  title: string;
  description: string;
  bgColor: string;
  textColor: string;
}

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './features.html',
  styleUrls: ['./features.css'],
})
export class Features {
  features: Feature[] = [
    {
      icon: 'fa-lightbulb',
      title: 'Innovative Solutions',
      description: 'Build solutions with multiple opportunities to ensure your team is always ready for any challenge.',
      bgColor: 'bg-primary/10',
      textColor: 'text-primary'
    },
    {
      icon: 'fa-users',
      title: 'Customer-Centric',
      description: 'Develop new solutions focused on improving your customers\' ability to manage their workflows.',
      bgColor: 'bg-success/10',
      textColor: 'text-success'
    },
    {
      icon: 'fa-thumbs-up',
      title: 'Satisfaction Focused',
      description: 'Promote improvements that directly address your customers\' needs and enhance satisfaction.',
      bgColor: 'bg-warning/10',
      textColor: 'text-warning'
    },
    {
      icon: 'fa-headset',
      title: 'Service Excellence',
      description: 'Continuously improve customer service through responsive support and regular updates.',
      bgColor: 'bg-secondary/10',
      textColor: 'text-secondary'
    },
    {
      icon: 'fa-bell',
      title: 'Smart Notifications',
      description: 'Get timely alerts for deadlines, updates, and important project milestones.',
      bgColor: 'bg-danger/10',
      textColor: 'text-danger'
    },
    {
      icon: 'fa-chart-line',
      title: 'Advanced Analytics',
      description: 'Track team performance and project progress with comprehensive dashboards.',
      bgColor: 'bg-primary/10',
      textColor: 'text-primary'
    }
  ];
}