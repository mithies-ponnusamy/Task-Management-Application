import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../../core/services/auth/auth';
import { UserRole } from '../../../model/user.model';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUsers, faTachometerAlt, faProjectDiagram, faFileAlt, faChartBar, faChartLine, faCog, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule
  ],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class Sidebar {
  faQuestionCircle = faQuestionCircle;
  adminName: string = 'Admin';
  adminEmail: string = 'admin@genworx.ai';
  profileImage: string = 'public/assets/user-images/mithies.JPG';
  logo: string = 'public/logo/logo-black.png';

  // Font Awesome icons
  faUsers = faUsers;
  faTachometerAlt = faTachometerAlt;
  faProjectDiagram = faProjectDiagram;
  faFileAlt = faFileAlt;
  faChartBar = faChartBar;
  faChartLine = faChartLine;
  faCog = faCog;

  constructor(private authService: Auth, private router: Router) {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.adminName = currentUser.name ?? '';
      this.adminEmail = currentUser.email;
    }
  }

  confirmNavigation(): void {
      const confirmed = window.confirm('Are you sure you want to go to the home page?');

      if (confirmed) {
        this.router.navigate(['/home']); // or [''] if your home route is root
      }
    }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  isAdmin(): boolean {
    return this.authService.hasRole(UserRole.ADMIN);
  }
}