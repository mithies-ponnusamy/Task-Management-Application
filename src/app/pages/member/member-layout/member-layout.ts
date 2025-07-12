import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../../model/user.model';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { UserService } from '../../../core/services/user/user';
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
  logoUrl: string = 'public/logo/logo-black.png'; 

  constructor(
    private userService: UserService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Check if user is authenticated
    const userData = SessionStorage.getItem('currentUser');
    if (!userData) {
      this.router.navigate(['/login']);
      return;
    }

    // Initialize user data
    this.currentUser = this.userService.getUsers().find(user => user.id === '2') ?? null;
    
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        // No need to track active page here as sidebar handles it
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
    SessionStorage.clear();
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}