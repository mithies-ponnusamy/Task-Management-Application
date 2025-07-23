// content-management.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DialogService } from '../../../core/services/dialog/dialog';
import { ToastService } from '../../../core/services/toast/toast';

interface ContentData {
  home: {
    title: string;
    subtitle: string;
    banner: string;
  };
  about: {
    title: string;
    description: string;
    image: string;
  };
  features: {
    title: string;
    subtitle: string;
    items: FeatureItem[];
  };
  testimonials: {
    title: string;
    subtitle: string;
    items: TestimonialItem[];
  };
  contact: {
    title: string;
    description: string;
    email: string;
    phone: string;
    address: string;
  };
}

interface FeatureItem {
  title: string;
  description: string;
}

interface TestimonialItem {
  quote: string;
  name: string;
  title: string;
  image: string;
}

@Component({
  selector: 'app-content-management',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule
  ],
  templateUrl: './content-management.html',
  styleUrls: ['./content-management.css']
})
export class ContentManagement implements OnInit {
  activeTab = 'home';
  previewMode = 'desktop';
  homepage: string = 'public/assets/homeimage.png';
  aboutimage: string = 'public/assets/ss.png';

  tabs = [
    { id: 'home', label: 'Home', icon: 'fas fa-home' },
    { id: 'about', label: 'About', icon: 'fas fa-info-circle' },
    { id: 'features', label: 'Features', icon: 'fas fa-star' },
    { id: 'testimonials', label: 'Testimonials', icon: 'fas fa-comment' },
    { id: 'contact', label: 'Contact', icon: 'fas fa-envelope' }
  ];

  contentData: ContentData = {
    home: {
      title: 'Effortless Task Management, Anytime',
      subtitle: 'Designed to help you manage projects today with a set of powerful tools for software enhancement and team collaboration.',
      banner: 'https://via.placeholder.com/800x400/6366f1/white?text=Hero+Banner'
    },
    about: {
      title: 'About Us',
      description: 'Our Task Management System simplifies task creation, assignment, and tracking for admins, team leads, and all members. With real-time updates, program monitoring, and an intuitive interface, it boosts team productivity and ensures projects stay on track.',
      image: 'https://via.placeholder.com/600x400/6366f1/white?text=About+Image'
    },
    features: {
      title: 'Key Features to Boost Your Productivity',
      subtitle: 'Create new solutions to improve your team\'s ability to manage projects effectively',
      items: [
        {
          title: 'Innovative Solutions',
          description: 'Build solutions with multiple opportunities to ensure your team is always ready for any challenge.'
        },
        {
          title: 'Real-time Collaboration',
          description: 'Work together seamlessly with real-time updates and notifications for all team members.'
        }
      ]
    },
    testimonials: {
      title: 'What Our Users Say',
      subtitle: 'Hear from teams who have transformed their workflow',
      items: [
        {
          quote: 'A game changer for our team! The role-based dashboards and deadline notifications keep everyone on track.',
          name: 'Sarah M.',
          title: 'Project Manager',
          image: 'https://randomuser.me/api/portraits/women/44.jpg'
        }
      ]
    },
    contact: {
      title: 'Contact Us',
      description: 'Have questions or want to learn more about our task management solution? Get in touch with our team.',
      email: 'support@genflow.com',
      phone: '+1 (555) 123-4567',
      address: '123 Business Ave, Suite 400\nSan Francisco, CA 94107'
    }
  };

  constructor(
    private dialogService: DialogService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
  }

  setActiveTab(tabId: string) {
    this.activeTab = tabId;
  }

  setPreviewMode(mode: string) {
    this.previewMode = mode;
  }

  onImageUpload(event: Event, section: string, field: string) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (section === 'home' && field === 'banner') {
          this.contentData.home.banner = result;
        } else if (section === 'about' && field === 'image') {
          this.contentData.about.image = result;
        }
      };
      
      reader.readAsDataURL(file);
    }
  }

  onTestimonialImageUpload(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const result = e.target?.result as string;
        this.contentData.testimonials.items[index].image = result;
      };
      
      reader.readAsDataURL(file);
    }
  }

  addFeature() {
    this.contentData.features.items.push({
      title: 'New Feature',
      description: 'Feature description'
    });
  }

  removeFeature(index: number) {
    this.contentData.features.items.splice(index, 1);
  }

  addTestimonial() {
    this.contentData.testimonials.items.push({
      quote: 'New testimonial quote',
      name: 'Name',
      title: 'Title',
      image: 'https://via.placeholder.com/80x80/6366f1/white?text=Photo'
    });
  }

  removeTestimonial(index: number) {
    this.contentData.testimonials.items.splice(index, 1);
  }

  saveContent() {
    console.log('Content data to save:', this.contentData);
    // Replace alert with toast
    this.toastService.show('Content changes saved successfully!');
  }

  nl2br(text: string): string {
    return text ? text.replace(/\n/g, '<br>') : '';
  }
}