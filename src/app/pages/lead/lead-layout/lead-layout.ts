import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../../model/user.model';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { UserService } from '../../../core/services/user/user';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';
import { LocalStorageService } from '../../../core/services/local-storage/local-storage';
import { SessionStorage } from '../../../core/services/session-storage/session-storage';
import { ProjectService } from '../../../core/services/project/project';
import { Notification } from '../../../model/user.model';

@Component({
  selector: 'app-lead-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    Sidebar
  ],
  templateUrl: './lead-layout.html',
  styleUrls: ['./lead-layout.css']
})
export class LeadLayout implements OnInit, OnDestroy {
  currentUser: User | null = null;
  isSidebarCollapsed = false;
  isMobileSidebarOpen = false;
  isUserMenuOpen = false;
  showNotifications = false;
  private routerSubscription!: Subscription;
  logo: string = 'public/logo/logo-black.png';
  
  notifications: Notification[] = [];
  unreadNotifications = 0;

  constructor(
    private userService: UserService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.userService.getUsers().find(u => u.role === 'team-lead') ?? null;
    
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        // Close menus when route changes
        this.isUserMenuOpen = false;
        this.showNotifications = false;
      });

    this.loadNotifications();
  }

  loadNotifications(): void {
    // In a real app, you would fetch these from a service
    this.notifications = [
      {
        id: '1',
        title: 'New Project Assigned',
        message: 'You have been assigned to the Website Redesign project',
        date: new Date(),
        read: false,
        type: 'project',
        projectId: '1'
      },
      {
        id: '2',
        title: 'Team Member Added',
        message: 'Mithies P has been added to your team',
        date: new Date(Date.now() - 3600000),
        read: false,
        type: 'team',
        memberId: '2'
      }
    ];
    this.updateUnreadCount();
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    this.isUserMenuOpen = false;
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
    this.showNotifications = false;
  }

  handleNotificationClick(notification: Notification): void {
    notification.read = true;
    this.updateUnreadCount();
    
    if (notification.type === 'project') {
      this.router.navigate(['/lead/dashboard'], { 
        queryParams: { projectId: notification.projectId } 
      });
    } else if (notification.type === 'team') {
      this.router.navigate(['/lead/dashboard'], { 
        queryParams: { memberId: notification.memberId } 
      });
    }
    
    this.showNotifications = false;
  }

  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true);
    this.updateUnreadCount();
    this.showNotifications = false;
  }

  updateUnreadCount(): void {
    this.unreadNotifications = this.notifications.filter(n => !n.read).length;
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  toggleMobileSidebar(): void {
    this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
  }

  closeUserMenu(): void {
    this.isUserMenuOpen = false;
  }

  logout(): void {
    this.localStorageService.clear();
    SessionStorage.clear();
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}