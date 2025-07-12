// auth.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { Auth } from './auth';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { UserRole } from '../../../model/user.model';

describe('Auth Service', () => {
  let service: Auth;
  const mockPlatformId = 'browser';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        Auth,
        { provide: PLATFORM_ID, useValue: mockPlatformId }
      ]
    });
    service = TestBed.inject(Auth);
    
    // Clear storage before each test
    localStorage.clear();
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login successfully with valid credentials', (done) => {
    const credentials = { email: 'admin@genworx.ai', password: '@admin123' };
    
    service.login(credentials).subscribe({
      next: (response) => {
        expect(response.user.email).toBe('admin@genworx.ai');
        expect(response.token).toBeTruthy();
        expect(service.isAuthenticated()).toBeTrue();
        done();
      },
      error: () => fail('Should not throw error')
    });
  });

  it('should reject invalid credentials', (done) => {
    const credentials = { email: 'wrong@email.com', password: 'wrongpass' };
    
    service.login(credentials).subscribe({
      next: () => fail('Should not succeed'),
      error: (error) => {
        expect(error.message).toBe('Invalid email or password');
        expect(service.isAuthenticated()).toBeFalse();
        done();
      }
    });
  });

  it('should store user data in localStorage when rememberMe is true', (done) => {
    const credentials = { email: 'admin@genworx.ai', password: '@admin123' };
    
    service.login(credentials, true).subscribe({
      next: () => {
        expect(localStorage.getItem('currentUser')).toBeTruthy();
        expect(localStorage.getItem('authToken')).toBeTruthy();
        done();
      }
    });
  });

  it('should store user data in sessionStorage when rememberMe is false', (done) => {
    const credentials = { email: 'admin@genworx.ai', password: '@admin123' };
    
    service.login(credentials, false).subscribe({
      next: () => {
        expect(sessionStorage.getItem('currentUser')).toBeTruthy();
        expect(sessionStorage.getItem('authToken')).toBeTruthy();
        done();
      }
    });
  });

  it('should logout and clear storage', () => {
    const credentials = { email: 'admin@genworx.ai', password: '@admin123' };
    
    service.login(credentials, true).subscribe(() => {
      service.logout();
      expect(service.isAuthenticated()).toBeFalse();
      expect(localStorage.getItem('currentUser')).toBeNull();
      expect(localStorage.getItem('authToken')).toBeNull();
    });
  });

  it('should check user roles correctly', () => {
    const credentials = { email: 'admin@genworx.ai', password: '@admin123' };
    
    service.login(credentials).subscribe(() => {
      expect(service.hasRole(UserRole.ADMIN)).toBeTrue();
      expect(service.hasRole(UserRole.USER)).toBeFalse();
      expect(service.hasAnyRole([UserRole.ADMIN, UserRole.LEAD])).toBeTrue();
    });
  });
});