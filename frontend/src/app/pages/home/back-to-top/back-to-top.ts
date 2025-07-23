import { Component, OnInit, OnDestroy, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-back-to-top',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './back-to-top.html',
  styleUrls: ['./back-to-top.css']
})

export class BackToTop implements OnInit, OnDestroy {
  isVisible = true; // Initially set to true to show the button on page load
  // Check if the code is running in the browser
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.isBrowser) {
      this.isVisible = window.pageYOffset > 300;
    }
  }

  ngOnInit() {
    // Initial check only in browser
    if (this.isBrowser) {
      this.isVisible = window.pageYOffset > 300;
    }
  }

  ngOnDestroy() {
    // Cleanup if needed
  }

  scrollToTop() {
    if (this.isBrowser) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}