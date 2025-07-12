//app.route.ts
import { Routes } from '@angular/router';
import { Home } from './pages/home/home/home';
import { Login } from './auth/login/login';
import { Signup } from './auth/signup/signup';
import { ForgotPassword } from './auth/forgot-password/forgot-password';
import { AdminLayout } from './pages/admin/admin-layout/admin-layout';
import { UserManagement } from './pages/admin/user-management/user-management';
import { AuthGuard } from './core/guard/auth/auth-guard';
import { RoleGuard } from './core/guard/role/role-guard';
import { UserRole } from './model/user.model';
import { SetNewPassword } from './auth/set-new-password/set-new-password';
import { OtpVerification } from './auth/otp-verification/otp-verification';
import { AdminDashboard } from './pages/admin/admin-dashboard/admin-dashboard';
import { ProjectManagement } from './pages/admin/project-management/project-management';
import { ContentManagement } from './pages/admin/content-management/content-management';
import { ReportManagement } from './pages/admin/report-management/report-management';
import { PerformanceManagement } from './pages/admin/performance-management/performance-management';
import { Settings } from './pages/admin/settings/settings';
import { HelpCenter } from './pages/admin/help-center/help-center';
import { LeadLayout } from './pages/lead/lead-layout/lead-layout';
import { Dashboard } from './pages/lead/dashboard/dashboard';
import { Backlogs } from './pages/lead/backlogs/backlogs';
import { MemberLayout } from './pages/member/member-layout/member-layout';
import { Dashboard as MemberDashboard } from './pages/member/dashboard/dashboard';
import { Tasks as MemberTasks } from './pages/member/tasks/tasks';
import { Profile } from './pages/member/profile/profile';
import { Settings as MemberSettings } from './pages/member/settings/settings';
import { LeadProfile } from './pages/lead/lead-profile/lead-profile';
import { LeadSettings } from './pages/lead/lead-settings/lead-settings';
import { Tasks } from './pages/lead/tasks/tasks';
import { Calendar } from './pages/member/calendar/calendar';
import { Reports } from './pages/member/reports/reports';


export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'signup',
    component: Signup
  },
  {
    path: 'forgot-password',
    component: ForgotPassword
  },
  {
    path: 'otp-verification',
    component: OtpVerification
  },
  {
    path: 'set-new-password',
    component: SetNewPassword
  },
  {
    path: 'unauthorized',
    component: Login,
  },
  // Admin Routes
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRoles: [UserRole.ADMIN] },
    children: [
      {
        path: 'dashboard',
        component: AdminDashboard,
        data: { title: 'Dashboard' }
      },
      {
        path: 'users',
        component: UserManagement,
        data: { title: 'User Management' }
      },
      {
        path: 'projects',
        component: ProjectManagement,
        data: { title: 'Project Management' }
      },
      {
        path: 'content',
        component: ContentManagement,
        data: { title: 'Content Management' }
      },
      {
        path: 'reports',
        component: ReportManagement,
        data: { title: 'Report Management' }
      },
      {
        path: 'performance',
        component: PerformanceManagement,
        data: { title: 'Performance Management' }
      },
      {
        path: 'settings',
        component: Settings,
        data: { title: 'Settings' }
      },
      {
        path: 'help-center',
        component: HelpCenter,
        data: { title: 'Help Center' }
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'lead',
    component: LeadLayout,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: UserRole.LEAD },
    children: [
      {
        path: 'dashboard',
        component: Dashboard,
        data: { title: 'Dashboard' }
      },
      {
        path: 'tasks',
        component: Tasks,
        data: { title: 'Tasks' }
      },
      {
        path: 'backlogs',
        component: Backlogs,
        data: { title: 'Backlogs' }
      },
      {
        path: 'calendar',
        component: Calendar,
        data: { title: 'Calendar' }
      },
      {
        path: 'profile',
        component: LeadProfile,
        data: { title: 'Profile' }
      },
      {
        path: 'settings',
        component: LeadSettings,
        data: { title: 'Settings' }
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'member',
    component: MemberLayout,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRoles: [UserRole.USER] },
    children: [
      {
        path: 'dashboard',
        component: MemberDashboard,
        data: { title: 'Dashboard' }
      },
      {
        path: 'tasks',
        component: MemberTasks,
        data: { title: 'Tasks' }
      },
      {
        path: 'calendar',
        component: Calendar,
        data: { title: 'Calendar' }
      },
      {
        path: 'reports',
        component: Reports,
        data: { title: 'Reports' }
      },
      {
        path: 'profile',
        component: Profile,
        data: { title: 'Profile' }
      },
      {
        path: 'settings',
        component: MemberSettings,
        data: { title: 'Settings' }
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];