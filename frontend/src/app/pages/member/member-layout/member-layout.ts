import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../../model/user.model';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { UserService } from '../../../core/services/user/user';
import { Auth } from '../../../core/services/auth/auth';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';
import { SessionStorage } from '../../../core/services/session-storage/session-storage'

@Component({
  selector: 'app-member-layout',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    Sidebar
  ],
  templateUrl: './member-layout.html',
  styleUrls: ['./member-layout.css']
})
export class MemberLayout implements OnInit, OnDestroy {
  currentUser: User | null = null;
  isMobileSidebarOpen: boolean = false;
  isUserMenuOpen: boolean = false;
  private routerSubscription!: Subscription;
  private profileSubscription: Subscription | null = null;
  logoUrl: string = 'public/logo/logo-black.png'; 
  loading: boolean = true;

  constructor(
    private userService: UserService,
    private authService: Auth,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Check if user is authenticated
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    // Get current user from auth service
    this.currentUser = this.authService.getCurrentUser();
    
    // Fetch fresh user data from backend
    this.loadUserProfile();
    
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        // No need to track active page here as sidebar handles it
      });
  }

  private loadUserProfile(): void {
    this.loading = true;
    this.profileSubscription = this.authService.getUserProfile().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
        this.loading = false;
        // If profile fetch fails, redirect to login
        this.router.navigate(['/login']);
      }
    });
  }

  toggleMobileSidebar(): void {
    this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  closeUserMenu(): void {
    this.isUserMenuOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    if (this.profileSubscription) {
      this.profileSubscription.unsubscribe();
    }
  }
}