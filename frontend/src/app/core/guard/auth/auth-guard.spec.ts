// auth-guard.spec.ts
import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth-guard';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Auth } from '../../services/auth/auth';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: Auth;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [AuthGuard, Auth]
    });
    
    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(Auth);
    router = TestBed.inject(Router);
    
    spyOn(router, 'navigate').and.callThrough();
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access when authenticated', () => {
    spyOn(authService, 'isAuthenticated').and.returnValue(true);
    expect(guard.canActivate()).toBeTrue();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to login when not authenticated', () => {
    spyOn(authService, 'isAuthenticated').and.returnValue(false);
    expect(guard.canActivate()).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});