import { Component } from '@angular/core';
import { Auth } from '../../../core/services/auth/auth';
import { 
  faTachometerAlt, 
  faUsers, 
  faProjectDiagram, 
  faFileAlt, 
  faChartBar, 
  faChartLine, 
  faCog,
  faQuestionCircle,
  faEnvelope,
  faPhone
} from '@fortawesome/free-solid-svg-icons';
import { UserRole } from '../../../model/user.model';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-help-center',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './help-center.html',
  styleUrls: ['./help-center.css']
})
export class HelpCenter {
  // Icons
  faTachometerAlt = faTachometerAlt;
  faUsers = faUsers;
  faProjectDiagram = faProjectDiagram;
  faFileAlt = faFileAlt;
  faChartBar = faChartBar;
  faChartLine = faChartLine;
  faCog = faCog;
  faQuestionCircle = faQuestionCircle;
  faEnvelope = faEnvelope;
  faPhone = faPhone;

  activeTab: string = 'dashboard';
  sections = [
    { id: 'dashboard', icon: faTachometerAlt, title: 'Dashboard', adminOnly: false },
    { id: 'userManagement', icon: faUsers, title: 'User Management', adminOnly: true },
    { id: 'projectManagement', icon: faProjectDiagram, title: 'Project Management', adminOnly: false },
    { id: 'contentManagement', icon: faFileAlt, title: 'Content Management', adminOnly: false },
    { id: 'reports', icon: faChartBar, title: 'Reports', adminOnly: false },
    { id: 'performance', icon: faChartLine, title: 'Performance', adminOnly: false },
    { id: 'settings', icon: faCog, title: 'Settings', adminOnly: false },
    { id: 'faq', icon: faQuestionCircle, title: 'FAQ', adminOnly: false }
  ];

  constructor(private authService: Auth) {}

  isAdmin() {
    return this.authService.hasRole(UserRole.ADMIN);
  }

  setActiveTab(tabId: string) {
    this.activeTab = tabId;
  }

  shouldShowTab(section: any): boolean {
    return !section.adminOnly || this.isAdmin();
  }
}