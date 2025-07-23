import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ValidationErrors {
  name: boolean;
  email: boolean;
  message: boolean;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule
  ],
  templateUrl: './contact.html',
  styleUrls: ['./contact.css']
})
export class Contact implements AfterViewInit {
  @ViewChild('messageDiv') messageDiv!: ElementRef;

  formData: ContactForm = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  errors: ValidationErrors = {
    name: false,
    email: false,
    message: false
  };

  charCount = 0;
  maxChars = 500;
  messagePlaceholder = 'Type your message here...';
  messageError = 'Please enter your message';
  isMessageFocused = false;

  ngAfterViewInit() {
    this.initializeMessagePlaceholder();
  }

  initializeMessagePlaceholder() {
    if (this.messageDiv && this.messageDiv.nativeElement.textContent.trim() === '') {
      this.messageDiv.nativeElement.textContent = this.messagePlaceholder;
      this.messageDiv.nativeElement.classList.add('text-gray-400');
    }
  }

  onMessageInput(event: Event) {
    const target = event.target as HTMLElement;
    const content = target.textContent || '';
    
    if (content === this.messagePlaceholder) {
      this.charCount = 0;
      return;
    }

    this.charCount = content.length;
    this.formData.message = content;
    
    // Remove placeholder styling when user types
    target.classList.remove('text-gray-400');
    
    // Update border color based on character count
    if (this.charCount > this.maxChars) {
      target.classList.add('border-red-500');
    } else {
      target.classList.remove('border-red-500');
    }
  }

  onMessageFocus() {
    this.isMessageFocused = true;
    const element = this.messageDiv.nativeElement;
    if (element.textContent === this.messagePlaceholder) {
      element.textContent = '';
      element.classList.remove('text-gray-400');
    }
  }

  onMessageBlur() {
    this.isMessageFocused = false;
    const element = this.messageDiv.nativeElement;
    if (element.textContent.trim() === '') {
      element.textContent = this.messagePlaceholder;
      element.classList.add('text-gray-400');
      this.charCount = 0;
    }
    this.validateField('message');
  }

  validateField(field: keyof ValidationErrors) {
    switch (field) {
      case 'name':
        this.errors.name = this.formData.name.trim() === '';
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        this.errors.email = !emailRegex.test(this.formData.email.trim());
        break;
      case 'message':
        const messageContent = this.messageDiv.nativeElement.textContent.trim();
        if (messageContent === '' || messageContent === this.messagePlaceholder) {
          this.errors.message = true;
          this.messageError = 'Please enter your message';
        } else if (this.charCount > this.maxChars) {
          this.errors.message = true;
          this.messageError = `Message exceeds ${this.maxChars} character limit`;
        } else {
          this.errors.message = false;
        }
        break;
    }
  }

  onSubmit() {
    // Validate all fields
    this.validateField('name');
    this.validateField('email');
    this.validateField('message');

    // Update message from contenteditable div
    const messageContent = this.messageDiv.nativeElement.textContent.trim();
    if (messageContent !== this.messagePlaceholder) {
      this.formData.message = messageContent;
    } else {
      this.formData.message = '';
    }

    const isValid = !this.errors.name && !this.errors.email && !this.errors.message;

    if (isValid) {
      // In a real application, you would submit the form here
      alert("Thank you for contacting us! We'll get back to you soon.");
      
      // Reset the form
      this.resetForm();
    } else {
      // Scroll to the first error
      const firstError = document.querySelector('.text-red-500:not(.hidden)');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  resetForm() {
    this.formData = {
      name: '',
      email: '',
      subject: '',
      message: ''
    };
    
    this.errors = {
      name: false,
      email: false,
      message: false
    };
    
    this.charCount = 0;
    this.messageDiv.nativeElement.textContent = this.messagePlaceholder;
    this.messageDiv.nativeElement.classList.add('text-gray-400');
    this.messageDiv.nativeElement.classList.remove('border-red-500');
  }
}