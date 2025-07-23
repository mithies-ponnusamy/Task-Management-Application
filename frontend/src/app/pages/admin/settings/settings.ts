import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ProfileForm {
  name: string;
  email: string;
  phone: string;
  profilePicture: string;
}

interface SecurityForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface NotificationSettings {
  projectUpdates: boolean;
  taskAssignments: boolean;
  systemAlerts: boolean;
  newMessages: boolean;
  mentions: boolean;
}

interface PasswordRequirements {
  length: boolean;
  uppercase: boolean;
  number: boolean;
  special: boolean;
}

interface ActiveSession {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  icon: string;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.html',
  styleUrls: ['./settings.css'],
})
export class Settings implements OnInit {
  activeTab = 'profile';
  
  // Password visibility toggles
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  // Password validation
  passwordRequirements: PasswordRequirements = {
    length: false,
    uppercase: false,
    number: false,
    special: false
  };
  passwordStrength = 0;
  passwordsMatch = false;

  // Two-factor authentication
  twoFactorEnabled = false;

  tabs = [
    { id: 'profile', label: 'Profile', icon: 'fa-user' },
    { id: 'security', label: 'Security', icon: 'fa-shield-alt' },
    { id: 'notifications', label: 'Notifications', icon: 'fa-bell' }
  ];

  profileForm: ProfileForm = {
    name: 'Admin User',
    email: 'admin@genworx.ai',
    phone: '+91 63383350764',
    profilePicture: 'public/assets/user-images/mithies.JPG'

  };

  securityForm: SecurityForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  notificationSettings: NotificationSettings = {
    projectUpdates: true,
    taskAssignments: true,
    systemAlerts: false,
    newMessages: true,
    mentions: true
  };

  activeSessions: ActiveSession[] = [
    {
      id: '1',
      device: 'Windows 11 - Opera',
      location: 'Erode, Tamil Nadu',
      lastActive: '2 hours ago',
      icon: 'fa-desktop'
    },
    {
      id: '2',
      device: 'IQOO Z7 5G',
      location: 'Coimbatore, Tamil Nadu',
      lastActive: '1 day ago',
      icon: 'fa-mobile-alt'
    }
  ];

  ngOnInit() {
    // Initialize component
  }

  setActiveTab(tabId: string) {
    this.activeTab = tabId;
  }

  togglePasswordVisibility(field: string) {
    switch (field) {
      case 'current':
        this.showCurrentPassword = !this.showCurrentPassword;
        break;
      case 'new':
        this.showNewPassword = !this.showNewPassword;
        break;
      case 'confirm':
        this.showConfirmPassword = !this.showConfirmPassword;
        break;
    }
  }

  onProfilePictureChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        this.profileForm.profilePicture = e.target?.result as string;
      };
      
      reader.readAsDataURL(file);
    }
  }

  removePhoto() {
    this.profileForm.profilePicture = 'https://via.placeholder.com/128x128/6366f1/white?text=Admin';
  }

  resetProfileForm() {
    this.profileForm = {
      name: 'Admin Name',
      email: 'admin@genworx.ai',
      phone: '+1 (555) 123-4567',
      profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg'
    };
  }

  validatePassword() {
    const password = this.securityForm.newPassword;
    
    // Update password requirements
    this.passwordRequirements.length = password.length >= 8;
    this.passwordRequirements.uppercase = /[A-Z]/.test(password);
    this.passwordRequirements.number = /\d/.test(password);
    this.passwordRequirements.special = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    // Calculate strength (0-4)
    this.passwordStrength = 0;
    if (this.passwordRequirements.length) this.passwordStrength++;
    if (this.passwordRequirements.uppercase) this.passwordStrength++;
    if (this.passwordRequirements.number) this.passwordStrength++;
    if (this.passwordRequirements.special) this.passwordStrength++;
    
    // Convert to percentage
    this.passwordStrength = (this.passwordStrength / 4) * 100;
    
    // Recheck password match
    this.checkPasswordMatch();
  }

  checkPasswordMatch() {
    if (this.securityForm.newPassword && this.securityForm.confirmPassword) {
      this.passwordsMatch = this.securityForm.newPassword === this.securityForm.confirmPassword;
    } else {
      this.passwordsMatch = false;
    }
  }

  getPasswordStrengthColor(): string {
    if (this.passwordStrength <= 25) return 'bg-red-500';
    if (this.passwordStrength <= 50) return 'bg-yellow-500';
    if (this.passwordStrength <= 75) return 'bg-blue-500';
    return 'bg-green-500';
  }

  getPasswordStrengthText(): string {
    if (this.passwordStrength <= 25) return 'Weak password';
    if (this.passwordStrength <= 50) return 'Fair password';
    if (this.passwordStrength <= 75) return 'Good password';
    return 'Strong password';
  }

  getPasswordStrengthTextColor(): string {
    if (this.passwordStrength <= 25) return 'text-red-600';
    if (this.passwordStrength <= 50) return 'text-yellow-600';
    if (this.passwordStrength <= 75) return 'text-blue-600';
    return 'text-green-600';
  }

  isSecurityFormValid(): boolean {
    return !!(
      this.securityForm.currentPassword &&
      this.securityForm.newPassword &&
      this.securityForm.confirmPassword &&
      this.passwordsMatch &&
      this.passwordStrength >= 50 // Require at least fair password
    );
  }

  toggleTwoFactor() {
    this.twoFactorEnabled = !this.twoFactorEnabled;
    alert(this.twoFactorEnabled 
      ? 'Two-factor authentication enabled successfully!' 
      : 'Two-factor authentication disabled.');
  }

  logoutSession(sessionId: string) {
    if (confirm('Are you sure you want to logout this session?')) {
      this.activeSessions = this.activeSessions.filter(session => session.id !== sessionId);
      alert('Session logged out successfully!');
    }
  }

  onProfileSubmit() {
    if (!this.profileForm.name.trim()) {
      alert('Full Name is required.');
      return;
    }

    console.log('Profile form submitted:', this.profileForm);
    alert('Profile updated successfully!');
  }

  onSecuritySubmit() {
    if (!this.isSecurityFormValid()) {
      alert('Please fill in all required fields with valid data.');
      return;
    }

    console.log('Security form submitted');
    
    // Reset form
    this.securityForm = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
    
    this.passwordStrength = 0;
    this.passwordsMatch = false;
    
    alert('Security settings updated successfully!');
  }

  onNotificationsSubmit() {
    console.log('Notification settings submitted:', this.notificationSettings);
    alert('Notification preferences saved!');
  }
}