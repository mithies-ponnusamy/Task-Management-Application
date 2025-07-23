import { Component, OnInit, OnDestroy } from '@angular/core';
import { User, Notification } from '../../../model/user.model';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { UserService } from '../../../core/services/user/user';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';
import { LocalStorageService } from '../../../core/services/local-storage/local-storage';
import { SessionStorage } from '../../../core/services/session-storage/session-storage';
import { ModalService } from '../../../core/services/modal/modal';
import { CreateTask } from '../create-task/create-task';
import { ManageSprints } from '../manage-sprints/manage-sprints';
import { ManageTeam } from '../manage-team/manage-team';
import { ProjectDetails } from '../project-details/project-details';
import { ConfirmDialog } from "../../shared/confirm-dialog/confirm-dialog";
import { Toast } from "../../shared/toast/toast";

// Import all modal components

@Component({
  selector: 'app-lead-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    Sidebar,
    CreateTask,
    ManageSprints,
    ManageTeam,
    ProjectDetails,
    ConfirmDialog,
    Toast
],
  templateUrl: './lead-layout.html',
  styleUrls: ['./lead-layout.css']
})
export class LeadLayout implements OnInit, OnDestroy {
  currentUser: User | null = null;
  isSidebarCollapsed = false;
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
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.userService.getCurrentUser();
    
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.isUserMenuOpen = false;
        this.showNotifications = false;
      });

    this.loadNotifications();
  }

  loadNotifications(): void {
    this.notifications = [
       { id: '1', title: 'New Project Assigned', message: 'You have been assigned to the Website Redesign project.', date: new Date(), read: false, type: 'project', projectId: 'proj-1' },
       { id: '2', title: 'Team Member Added', message: 'Mithies P has been added to your team.', date: new Date(Date.now() - 3600000), read: true, type: 'team', memberId: '2' },
       { id: '3', title: 'Task Overdue', message: 'Task "Develop Homepage" is overdue.', date: new Date(Date.now() - 86400000), read: false, type: 'task', taskId: 'task-1' }
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
    
    if (notification.type === 'project' && notification.projectId) {
      this.router.navigate(['/lead/dashboard'], { queryParams: { projectId: notification.projectId } });
    } else if (notification.type === 'team') {
      this.modalService.openManageTeamModal();
    } else if (notification.type === 'task') {
       this.router.navigate(['/lead/dashboard']);
    }
    
    this.showNotifications = false;
  }

  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true);
    this.updateUnreadCount();
  }

  updateUnreadCount(): void {
    this.unreadNotifications = this.notifications.filter(n => !n.read).length;
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
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