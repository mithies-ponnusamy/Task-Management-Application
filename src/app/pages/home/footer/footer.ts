import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SafeUrlPipe } from './safe-url.pipe';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './footer.html',
  styleUrls: ['./footer.css'],
})
export class Footer {
  image: string = 'public/logo/logo.png';
  showMap: boolean = false;
  mapUrl: SafeResourceUrl;

  overviewLinks = [
    { text: 'About Us', href: '#about' },
    { text: 'Features', href: '#features' },
    { text: 'Impacts', href: '#impacts' },
    { text: 'Testimonials', href: '#testimonials' }
  ];

  contactInfo = [
    { 
      icon: 'fa-envelope', 
      text: 'genworx-ai@gmail.com',
      href: 'mailto:genworx-ai@gmail.com',
      action: 'mail'
    },
    { 
      icon: 'fa-phone-alt', 
      text: '+91 63833 50764',
      href: 'tel:+916383350764',
      action: 'call'
    },
    { 
      icon: 'fa-map-marker-alt', 
      text: '1st Floor, 431, Workafella High Street, Anna Salai, Teynampet, Chennai, Tamil Nadu 600018',
      href: '#',
      action: 'map'
    }
  ];

  constructor(private sanitizer: DomSanitizer) {
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1997923.3529264152!2d77.29402652499998!3d12.030157984494812!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5267b7e87b8e77%3A0x588f9e91541227be!2sWorkafella%20Teynampet%20-%20Coworking%20Space%20in%20Chennai!5e0!3m2!1sen!2sin!4v1752042600548!5m2!1sen!2sin'
    );
  }

  handleAction(event: Event, action: string) {
    if (action === 'map') {
      event.preventDefault();
      this.showMap = true;
    }
    // For mail and phone, the href will handle it automatically
  }

  closeMap() {
    this.showMap = false;
  }
}