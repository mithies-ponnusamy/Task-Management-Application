import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface OtpForm {
  digit1: string;
  digit2: string;
  digit3: string;
  digit4: string;
  digit5: string;
  digit6: string;
}

@Component({
  selector: 'app-otp-verification',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './otp-verification.html',
  styleUrls: ['./otp-verification.css'],
})
export class OtpVerification implements OnInit, OnDestroy {
  image: string = 'public/logo/logo-black.png';
  illustration: string = 'public/logo/full-logo.png';

  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;

  private isBrowser: boolean;
  private countdownInterval: any;

  formData: OtpForm = {
    digit1: '',
    digit2: '',
    digit3: '',
    digit4: '',
    digit5: '',
    digit6: ''
  };

  userEmail = 'user@example.com';
  timeLeft = 300; // 5 minutes in seconds
  isLoading = false;

  features = [
    'Instant Delivery',
    'Expires in 5 Minutes'
  ];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    // Get email from sessionStorage
    if (this.isBrowser) {
      const savedEmail = sessionStorage.getItem('signupEmail') || sessionStorage.getItem('resetEmail');
      if (savedEmail) {
        this.userEmail = savedEmail;
      }
    }

    // Start countdown timer
    this.startCountdown();

    // Focus on first input after view init
    setTimeout(() => {
      if (this.otpInputs && this.otpInputs.first) {
        this.otpInputs.first.nativeElement.focus();
      }
    }, 100);
  }

  ngOnDestroy() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  onDigitInput(event: any, index: number) {
    const value = event.target.value;
    
    // Only allow numbers
    if (!/^\d*$/.test(value)) {
      event.target.value = '';
      return;
    }

    // Auto-advance to next input
    if (value.length === 1 && index < 5) {
      const nextInput = this.otpInputs.toArray()[index + 1];
      if (nextInput) {
        nextInput.nativeElement.focus();
      }
    }

    // Auto-submit when all digits are filled
    if (this.isFormValid()) {
      setTimeout(() => {
        this.onSubmit();
      }, 100);
    }
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    // Handle backspace to move to previous input
    const target = event.currentTarget as HTMLInputElement;
    if (event.key === 'Backspace' && !target?.value && index > 0) {
      const prevInput = this.otpInputs.toArray()[index - 1];
      if (prevInput) {
        prevInput.nativeElement.focus();
      }
    }
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text') || '';
    
    // Only process if it's 6 digits
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      this.formData.digit1 = digits[0];
      this.formData.digit2 = digits[1];
      this.formData.digit3 = digits[2];
      this.formData.digit4 = digits[3];
      this.formData.digit5 = digits[4];
      this.formData.digit6 = digits[5];

      // Update input values
      this.otpInputs.toArray().forEach((input, index) => {
        input.nativeElement.value = digits[index];
      });

      // Focus on last input
      const lastInput = this.otpInputs.toArray()[5];
      if (lastInput) {
        lastInput.nativeElement.focus();
      }

      // Auto-submit
      setTimeout(() => {
        this.onSubmit();
      }, 100);
    }
  }

  isFormValid(): boolean {
    const otp = this.getOtpValue();
    return otp.length === 6 && /^\d{6}$/.test(otp);
  }

  getOtpValue(): string {
    return this.formData.digit1 + this.formData.digit2 + this.formData.digit3 + 
           this.formData.digit4 + this.formData.digit5 + this.formData.digit6;
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? '0' + minutes : minutes}:${remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}`;
  }

  startCountdown() {
    this.timeLeft = 300; // 5 minutes
    
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

  resendOtp() {
    if (this.timeLeft > 0) {
      return;
    }

    console.log('Resending OTP to:', this.userEmail);
    
    // Restart countdown
    this.startCountdown();
    
    // Show feedback
    if (this.isBrowser) {
      alert('OTP sent again! Please check your email.');
    }
  }

  onSubmit() {
    if (!this.isFormValid() || this.isLoading) {
      return;
    }

    const otp = this.getOtpValue();
    this.isLoading = true;

    console.log('Verifying OTP:', otp);

    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
      
      if (this.isBrowser) {
        // Clear session storage
        sessionStorage.removeItem('signupEmail');
        sessionStorage.removeItem('resetEmail');
        
        // Show success message
        alert('Account verified successfully!');
        
        // Navigate to login
        this.router.navigate(['/login']);
      }
    }, 1500);
  }

  checkSpamFolder() {
    if (this.isBrowser) {
      alert('Please check your spam or junk folder if you don\'t see our email in your inbox.');
    }
  }

  changeEmailAddress() {
    if (this.isBrowser) {
      const confirmed = confirm('Do you want to change your email address?');
      if (confirmed) {
        this.router.navigate(['/signup']);
      }
    }
  }

  goBack() {
    console.log('Going back...');
    if (this.isBrowser && window.history.length > 1) {
      window.history.back();
    } else {
      this.router.navigate(['/signup']);
    }
  }
}