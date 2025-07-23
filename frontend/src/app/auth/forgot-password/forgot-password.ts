import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

interface ForgotPasswordForm {
  email: string;
  otp: string;
}

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css'],
})
export class ForgotPassword implements OnInit, OnDestroy {
  image: string = 'public/logo/logo-black.png';
  illustration: string = 'public/logo/full-logo.png';

  private isBrowser: boolean;
  private countdownInterval: any;

  formData: ForgotPasswordForm = {
    email: '',
    otp: ''
  };

  emailValid = false;
  emailError = false;
  isOtpSent = false;
  timeLeft = 0;
  isLoading = false;
  loadingText = '';

  features = [
    'Secure Verification',
    'Instant OTP Delivery'
  ];

  private readonly emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {}

  ngOnDestroy() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  get submitButtonText(): string {
    return this.isOtpSent ? 'VERIFY OTP' : 'SEND OTP';
  }

  validateEmail() {
    if (this.formData.email === '') {
      this.emailValid = false;
      this.emailError = false;
      return;
    }

    this.emailValid = this.emailRegex.test(this.formData.email);
    this.emailError = !this.emailValid;
  }

  canSubmit(): boolean {
    if (!this.isOtpSent) {
      return this.emailValid && !!this.formData.email;
    } else {
      return this.formData.otp.length === 6 && /^\d+$/.test(this.formData.otp);
    }
  }

  onOtpInput() {
    if (this.formData.otp.length === 6 && /^\d+$/.test(this.formData.otp)) {
      this.onSubmit();
    }
  }

  onSubmit() {
    if (!this.canSubmit() || this.isLoading) return;

    this.isLoading = true;
    this.loadingText = this.isOtpSent ? 'Verifying OTP...' : 'Sending OTP...';

    if (!this.isOtpSent) {
      this.sendOtp();
    } else {
      this.verifyOtp();
    }
  }

  sendOtp() {
    setTimeout(() => {
      if (this.isBrowser) {
        console.log('OTP sent to:', this.formData.email);
        sessionStorage.setItem('resetEmail', this.formData.email);

        this.isOtpSent = true;
        this.isLoading = false;
        this.loadingText = '';
        this.cdr.detectChanges(); // ✅ Ensure UI updates before alert

        setTimeout(() => {
          alert('OTP sent successfully! Please check your email.');
          this.startCountdown();
        }, 100); // Short delay before alert
      }
    }, 1500);
  }

  verifyOtp() {
    setTimeout(() => {
      if (this.isBrowser) {
        console.log('OTP verified:', this.formData.otp);

        this.router.navigate(['/set-new-password'], {
          state: { email: this.formData.email }
        });
      }

      this.isLoading = false;
      this.loadingText = '';
    }, 1500);
  }

  resendOtp() {
    if (this.timeLeft > 0 || this.isLoading) return;

    this.isLoading = true;
    this.loadingText = 'Resending OTP...';

    setTimeout(() => {
      if (this.isBrowser) {
        console.log('Resending OTP to:', this.formData.email);
      }

      this.isLoading = false;
      this.loadingText = '';
      this.startCountdown();

      if (this.isBrowser) {
        alert('OTP sent again! Please check your email.');
      }
    }, 1500);
  }

  startCountdown() {
    this.timeLeft = 60;

    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }

    this.countdownInterval = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        clearInterval(this.countdownInterval);
      }
    }, 1000);
  }

  goBack() {
    if (this.isOtpSent) {
      this.isOtpSent = false;
      this.timeLeft = 0;
      if (this.countdownInterval) {
        clearInterval(this.countdownInterval);
      }
    } else {
      if (this.isBrowser && window.history.length > 1) {
        window.history.back();
      } else {
        this.router.navigate(['/login']);
      }
    }
  }
}
