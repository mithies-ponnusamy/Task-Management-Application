import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Auth } from '../../../core/services/auth/auth';
import { Sidebar } from '../sidebar/sidebar';
import { CommonModule } from '@angular/common';
import { ConfirmDialog } from '../../shared/confirm-dialog/confirm-dialog';
import { Toast } from '../../shared/toast/toast';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    Sidebar,
    RouterOutlet,
    ConfirmDialog,
    Toast
  ],
  templateUrl: './admin-layout.html',
  styleUrls: ['./admin-layout.css']
})
export class AdminLayout implements OnInit {
  pageTitle: string = 'Dashboard';
  showMobileSidebar: boolean = false;

  constructor(private router: Router, private authService: Auth) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updatePageTitle();
        // Scroll to top on route change
        window.scrollTo(0, 0);
      });
  }

  ngOnInit(): void {
    this.updatePageTitle();
  }

  private updatePageTitle() {
    const childRoute = this.router.routerState.snapshot.root.firstChild;
    if (childRoute?.firstChild?.data) {
      this.pageTitle = childRoute.firstChild.data['title'] || 'Dashboard';
    }
  }

  toggleMobileSidebar() {
    this.showMobileSidebar = !this.showMobileSidebar;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}