import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header implements OnInit {
  image: string = 'public/logo/logo-black.png';
  isMobileMenuOpen = false;
  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    // Set up smooth scrolling for navigation links only in browser
    if (this.isBrowser) {
      this.setupSmoothScrolling();
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  navigateToLogin() {
    this.router.navigate(['/login']).then(nav => {
      console.log('Navigation success:', nav);
    }, err => {
      console.error('Navigation error:', err);
    });
  }

  private setupSmoothScrolling() {
    if (!this.isBrowser) return;
    
    // This would be implemented for smooth scrolling to sections
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const targetId = target.getAttribute('href');
        if (targetId && targetId !== '#') {
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    });
  }
}