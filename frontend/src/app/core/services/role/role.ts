import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Role implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const expectedRole = route.data['expectedRole'];
    const userRole = localStorage.getItem('userRole');
    
    if (userRole === expectedRole) {
      return true;
    } else {
      this.router.navigate(['/unauthorized']);
      return false;
    }
  }
}