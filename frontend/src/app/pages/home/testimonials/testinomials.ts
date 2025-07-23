import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Testimonial {
  rating: number;
  quote: string;
  author: string;
  position: string;
  avatar: string;
  borderColor: string;
}

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './testinomials.html',
  styleUrls: ['./testinomials.css'],
})
export class Testimonials {
  testimonials: Testimonial[] = [
    {
      rating: 5,
      quote: 'A game changer for our team! The role-based dashboards and deadline notifications keep everyone on track - no more missed deadlines or communication gaps.',
      author: 'Thirunavukarasu K M ',
      position: 'Project Manager',
      avatar: 'public/assets/emp1.jpg',
      borderColor: 'bg-primary'
    },
    {
      rating: 4.5,
      quote: 'We\'ve tried many task management tools, but TaskFlow\'s intuitive interface and powerful features made it an instant favorite across our organization.',
      author: 'Sandeep S ',
      position: 'CTO, Tech Startup',
      avatar: 'public/assets/emp2.jpg',
      borderColor: 'bg-secondary'
    }
  ];

  getFullStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  hasHalfStar(rating: number): boolean {
    return rating % 1 !== 0;
  }
}