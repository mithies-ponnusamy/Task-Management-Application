import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

interface PasswordForm {
  newPassword: string;
  confirmPassword: string;
}

interface PasswordRequirements {
  length: boolean;
  number: boolean;
  special: boolean;
  case: boolean;
}

@Component({
  selector: 'app-set-new-password',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    RouterModule
  ],
  templateUrl: './set-new-password.html',
  styleUrls: ['./set-new-password.css'],
})
export class SetNewPassword implements OnInit {
  image: string = 'public/logo/logo-black.png';
  illustration: string = 'public/logo/full-logo.png';
  private isBrowser: boolean;

  formData: PasswordForm = {
    newPassword: '',
    confirmPassword: ''
  };

  showNewPassword = false;
  showConfirmPassword = false;
  isLoading = false;

  passwordRequirements: PasswordRequirements = {
    length: false,
    number: false,
    special: false,
    case: false
  };

  passwordError = false;
  confirmPasswordError = false;
  confirmPasswordValid = false;
  passwordStrength = 0;

  features = [
    'Minimum 8 characters',
    'Numbers & special characters',
    'Uppercase & lowercase letters'
  ];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    // Check if user came from password reset flow
    if (this.isBrowser) {
      const resetEmail = sessionStorage.getItem('resetEmail');
      if (!resetEmail) {
        // If no reset email in session, redirect to forgot password
        this.router.navigate(['/forgot-password']);
      }
    }
  }

  get isPasswordValid(): boolean {
    return this.passwordRequirements.length && 
           this.passwordRequirements.number && 
           this.passwordRequirements.special;
  }

  validatePassword() {
    const password = this.formData.newPassword;
    
    // Update password requirements
    this.passwordRequirements.length = password.length >= 8;
    this.passwordRequirements.number = /\d/.test(password);
    this.passwordRequirements.special = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    this.passwordRequirements.case = /[a-z]/.test(password) && /[A-Z]/.test(password);
    
    // Calculate strength
    this.passwordStrength = 0;
    if (this.passwordRequirements.length) this.passwordStrength++;
    if (this.passwordRequirements.number) this.passwordStrength++;
    if (this.passwordRequirements.special) this.passwordStrength++;
    if (this.passwordRequirements.case) this.passwordStrength++;
    
    // Set error state
    this.passwordError = password.length > 0 && !this.isPasswordValid;
    
    // Revalidate confirm password if it has content
    if (this.formData.confirmPassword) {
      this.validateConfirmPassword();
    }
  }

  validateConfirmPassword() {
    if (this.formData.confirmPassword === '') {
      this.confirmPasswordValid = false;
      this.confirmPasswordError = false;
      return;
    }

    this.confirmPasswordValid = this.formData.newPassword === this.formData.confirmPassword;
    this.confirmPasswordError = !this.confirmPasswordValid;
  }

  getStrengthColor(index: number): string {
    if (index >= this.passwordStrength) {
      return '#e5e7eb'; // gray
    }
    
    if (this.passwordStrength === 1) return '#ef4444'; // red
    if (this.passwordStrength === 2) return '#f59e0b'; // yellow
    if (this.passwordStrength === 3) return '#3b82f6'; // blue
    if (this.passwordStrength === 4) return '#10b981'; // green
    
    return '#e5e7eb';
  }

  toggleNewPassword() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  isFormValid(): boolean {
    return this.isPasswordValid && this.confirmPasswordValid && 
           !!this.formData.newPassword && !!this.formData.confirmPassword;
  }

  onSubmit() {
    if (!this.isFormValid()) {
      return;
    }

    this.isLoading = true;

    console.log('Updating password...');

    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
      
      if (this.isBrowser) {
        // Clear session storage
        sessionStorage.removeItem('resetEmail');
        
        // Show success message
        alert('Password successfully updated!');
        
        // Navigate to login page
        this.router.navigate(['/login']);
      }
    }, 1500);
  }

  goBack() {
    console.log('Going back...');
    if (this.isBrowser && window.history.length > 1) {
      window.history.back();
    } else {
      this.router.navigate(['/forgot-password']);
    }
  }

  navigateToLogin() {
    console.log('Navigating to login...');
    this.router.navigate(['/login']);
  }
}