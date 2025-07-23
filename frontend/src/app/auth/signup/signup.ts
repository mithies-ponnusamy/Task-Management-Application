// signup.ts
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule for standalone component
import { Auth } from '../../core/services/auth/auth';
import { AuthResponse, User, UserRole } from '../../model/user.model';
import { catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ToastService } from '../../core/services/toast/toast';

interface SignupForm {
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
  username: string;
  name: string;
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    RouterModule,
    HttpClientModule
  ],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css'],
})
export class Signup implements OnInit {

  image: string = 'public/logo/logo-black.png';
  illustration: string = 'public/logo/full-logo.png';

  private isBrowser: boolean;
  
  formData: SignupForm = {
    email: '',
    password: '',
    confirmPassword: '',
    terms: false,
    username: '',
    name: ''
  };

  emailValid = false;
  passwordValid = false;
  confirmPasswordValid = false;
  usernameValid = false;
  nameValid = false;
  termsValid = false;

  emailError = false;
  passwordError = false;
  confirmPasswordError = false;
  usernameError = false;
  nameError = false;
  termsError = false;
  
  showPassword = false;
  showConfirmPassword = false;
  showPasswordRequirements = false;
  
  lengthValid = false;
  numberValid = false;
  specialValid = false;
  passwordStrength = 0;

  isLoading = false;
  
  // New property to control button disabled state
  isButtonEnabled = false; 

  features = [
    'Real-Time Collaboration',
    'Smart Notifications',
    'Advanced Analytics'
  ];

  private readonly emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private authService: Auth,
    private toastService: ToastService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    // Initial validation check to set button state on load
    this.updateButtonState();
  }

  // Helper to update button state
  private updateButtonState(): void {
    this.isButtonEnabled = this.nameValid && this.usernameValid && this.emailValid && this.passwordValid && this.confirmPasswordValid && this.termsValid;
  }

  // All validateX methods now also call updateButtonState()
  validateUsername() {
    this.usernameValid = this.formData.username.trim().length > 0;
    this.usernameError = !this.usernameValid && this.formData.username.length > 0; // Show error only if invalid AND not empty
    if (this.formData.username.length === 0) this.usernameError = true; // Show error if empty
    this.updateButtonState();
  }

  validateName() {
    this.nameValid = this.formData.name.trim().length > 0;
    this.nameError = !this.nameValid && this.formData.name.length > 0;
    if (this.formData.name.length === 0) this.nameError = true;
    this.updateButtonState();
  }

  validateEmail() {
    this.emailValid = this.emailRegex.test(this.formData.email);
    this.emailError = !this.emailValid && this.formData.email.length > 0;
    if (this.formData.email.length === 0) {
      this.emailValid = false;
      this.emailError = true;
    }
    this.updateButtonState();
  }

  validatePassword() {
    const password = this.formData.password;
    
    this.lengthValid = password.length >= 8;
    this.numberValid = /\d/.test(password);
    this.specialValid = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    this.passwordStrength = 0;
    if (this.lengthValid) this.passwordStrength++;
    if (this.numberValid) this.passwordStrength++;
    if (this.specialValid) this.passwordStrength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) this.passwordStrength++;
    
    this.passwordValid = this.lengthValid && this.numberValid && this.specialValid;
    this.passwordError = !this.passwordValid && password.length > 0;
    if (password.length === 0) {
      this.passwordValid = false;
      this.passwordError = true;
    }
    
    // Always re-validate confirm password if password changes
    this.validateConfirmPassword(); 
    this.updateButtonState();
  }

  validateConfirmPassword() {
    this.confirmPasswordValid = this.formData.password === this.formData.confirmPassword && this.passwordValid;
    this.confirmPasswordError = !this.confirmPasswordValid && this.formData.confirmPassword.length > 0;
    if (this.formData.confirmPassword.length === 0) {
        this.confirmPasswordValid = false;
        this.confirmPasswordError = true;
    }
    this.updateButtonState();
  }

  validateTerms() {
    this.termsValid = this.formData.terms;
    this.termsError = !this.termsValid;
    this.updateButtonState();
  }

  onPasswordBlur() {
    if (this.formData.password.length === 0) {
      this.showPasswordRequirements = false;
    }
    this.updateButtonState();
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  getStrengthColor(index: number): string {
    if (index >= this.passwordStrength) {
      return '#e5e7eb';
    }
    if (this.passwordStrength === 1) return '#ef4444';
    if (this.passwordStrength === 2) return '#f59e0b';
    if (this.passwordStrength === 3) return '#3b82f6';
    if (this.passwordStrength === 4) return '#10b981';
    return '#e5e7eb';
  }

  // isFormValid() now only checks the boolean flags
  isFormValid(): boolean {
    return this.nameValid && this.usernameValid && this.emailValid && this.passwordValid && this.confirmPasswordValid && this.termsValid;
  }

  onSubmit() {
    // Before submission, run all validations one last time
    // This is important because input events might not fire for untouched fields
    this.validateName();
    this.validateUsername();
    this.validateEmail();
    this.validatePassword();
    this.validateConfirmPassword();
    this.validateTerms();

    if (!this.isFormValid()) {
      this.toastService.show('Please fill all required fields correctly.', 'error');
      this.isLoading = false; // Ensure loading is off if form is invalid
      return;
    }

    this.isLoading = true;

    const userToRegister: Partial<User> = {
      email: this.formData.email,
      password: this.formData.password,
      username: this.formData.username,
      name: this.formData.name,
      role: UserRole.USER, 
    };

    // Correct the API endpoint from '/api/auth/register' to '/api/users/register'
    this.authService.registerUser(userToRegister as User) // registerUser in AuthService calls /api/users/register
      .pipe(
        finalize(() => this.isLoading = false),
        catchError((error) => {
          console.error('Signup error:', error);
          const errorMessage = error.error?.message || 'Registration failed. Please try again.';
          this.toastService.show(errorMessage, 'error');
          return throwError(() => new Error(errorMessage));
        })
      )
      .subscribe(
        (response: AuthResponse) => {
          console.log('Signup successful:', response);
          this.toastService.show('Registration successful! Please log in.', 'success');
          this.router.navigate(['/login']); 
        }
        // No need for error handler here, as catchError already handles errors
      );
  }

  goBack() {
    if (this.isBrowser && window.history.length > 1) {
      window.history.back();
    } else {
      this.router.navigate(['/']);
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}