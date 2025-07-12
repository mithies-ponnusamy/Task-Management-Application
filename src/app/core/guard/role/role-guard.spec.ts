// role-guard.spec.ts
import { TestBed } from '@angular/core/testing';
import { RoleGuard } from './role-guard';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Auth } from '../../services/auth/auth';

describe('RoleGuard', () => {
  let guard: RoleGuard;
  let authService: Auth;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [RoleGuard, Auth]
    });
    
    guard = TestBed.inject(RoleGuard);
    authService = TestBed.inject(Auth);
    router = TestBed.inject(Router);
    
    spyOn(router, 'navigate').and.callThrough();
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access when authenticated and has required role', () => {
    const route = new ActivatedRouteSnapshot();
    route.data = { expectedRoles: ['ADMIN'] };
    
    spyOn(authService, 'isAuthenticated').and.returnValue(true);
    spyOn(authService, 'hasAnyRole').and.returnValue(true);
    
    expect(guard.canActivate(route)).toBeTrue();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to login when not authenticated', () => {
    const route = new ActivatedRouteSnapshot();
    route.data = { expectedRoles: ['ADMIN'] };
    
    spyOn(authService, 'isAuthenticated').and.returnValue(false);
    
    expect(guard.canActivate(route)).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should redirect to unauthorized when authenticated but no required role', () => {
    const route = new ActivatedRouteSnapshot();
    route.data = { expectedRoles: ['ADMIN'] };
    
    spyOn(authService, 'isAuthenticated').and.returnValue(true);
    spyOn(authService, 'hasAnyRole').and.returnValue(false);
    
    expect(guard.canActivate(route)).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/unauthorized']);
  });
});