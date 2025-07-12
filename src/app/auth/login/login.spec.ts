// login.component.spec.ts
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Login } from './login';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { Auth } from '../../core/services/auth/auth';
import { UserRole } from '../../model/user.model';

describe('LoginComponent', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let authService: Auth;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, RouterTestingModule],
      declarations: [Login],
      providers: [Auth]
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    authService = TestBed.inject(Auth);
    router = TestBed.inject(Router);
    
    spyOn(router, 'navigateByUrl').and.stub();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize login form', () => {
    expect(component.loginForm).toBeTruthy();
    expect(component.loginForm.get('email')).toBeTruthy();
    expect(component.loginForm.get('password')).toBeTruthy();
    expect(component.loginForm.get('rememberMe')).toBeTruthy();
  });

  it('should mark form as invalid when empty', () => {
    expect(component.loginForm.valid).toBeFalse();
  });

  it('should validate email field', () => {
    const email = component.loginForm.get('email');
    email?.setValue('invalid');
    expect(email?.valid).toBeFalse();
    
    email?.setValue('valid@email.com');
    expect(email?.valid).toBeTrue();
  });

  it('should validate password field', () => {
    const password = component.loginForm.get('password');
    password?.setValue('short');
    expect(password?.valid).toBeFalse();
    
    password?.setValue('validpassword');
    expect(password?.valid).toBeTrue();
  });

  it('should not submit when form is invalid', () => {
    spyOn(authService, 'login').and.stub();
    component.onSubmit();
    expect(authService.login).not.toHaveBeenCalled();
  });

    const mockResponse = {
      adminUser: {
        id: '1',
        name: 'Admin User',
        email: 'admin@genworx.ai',
        role: UserRole.ADMIN,
        status: 'active'
      },

      leadUser: {
        id: '2',
        name: 'Lead User',
        email: 'mithiesoff@gmail.com',
        role: UserRole.LEAD,
        status: 'active'
      },
      
      user: {
        id: '3',
        name: 'User',
        email: 'mithiesofficial@gmail.com',
        role: UserRole.USER,
        status: 'active'
      },
      
      token: 'mock-token'
    };
    
    spyOn(authService, 'login').and.returnValue(of(mockResponse));
    
    component.loginForm.setValue({
      email: 'admin@genworx.ai',
      password: '@admin123',
      rememberMe: false
    });
    
    component.onSubmit();
    tick();
    
    expect(authService.login).toHaveBeenCalledWith({
      email: 'admin@genworx.ai',
      password: '@admin123'
    }, false);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/admin/dashboard');
    expect(component.isLoading).toBeFalse();
  });

  it('should handle login error', fakeAsync(() => {
    spyOn(authService, 'login').and.returnValue(throwError(() => new Error('Invalid credentials')));
    
    component.loginForm.setValue({
      email: 'wrong@email.com',
      password: 'wrongpass',
      rememberMe: false
    });
    
    component.onSubmit();
    tick();
    
    expect(component.loginError).toBeTrue();
    expect(component.isLoading).toBeFalse();
  }));

  it('should navigate to correct dashboard based on role', fakeAsync(() => {
    const testCases = [
      { role: 'ADMIN', expectedRoute: '/admin/dashboard' },
      { role: 'LEAD', expectedRoute: '/lead/dashboard' },
      { role: 'USER', expectedRoute: '/member/dashboard' }
    ];
    
    spyOn(authService, 'login').and.callFake((creds, rememberMe?: boolean) => {
      const demoUser = component.demoUsers.find(u => u.email === creds.email);
      if (demoUser && demoUser.user) {
        return of({
          user: demoUser.user,
          token: 'mock-token'
        });
      } else {
        // Return a default valid user or throw error as per your logic
        return of({
          user: {
            email: creds.email,
            role: 'USER'
          },
          token: 'mock-token'
        });
      }
    });
    
    testCases.forEach(testCase => {
      const credentials = component.demoUsers.find(u => u.user.role === testCase.role);
      if (credentials) {
        component.loginForm.setValue({
          email: credentials.email,
          password: credentials.password,
          rememberMe: false
        });
        
        component.onSubmit();
        tick();
        
        expect(router.navigateByUrl).toHaveBeenCalledWith(testCase.expectedRoute);
        
        // Reset for next test case
        router.navigateByUrl.calls.reset();
      }
    });
  }));
}