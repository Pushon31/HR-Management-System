// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const userStr = localStorage.getItem('user');
    
    // Check if user is logged in
    if (!userStr) {
      this.router.navigate(['/login']);
      return false;
    }

    const user = JSON.parse(userStr);
    const userRoles = user.roles || [];
    const requiredRoles = route.data['roles'] || [];

    // If no specific roles required, allow access
    if (requiredRoles.length === 0) {
      return true;
    }

    // Check if user has required role
    const hasRole = requiredRoles.some((role: string) => 
      userRoles.includes(role)
    );

    if (!hasRole) {
      alert('⚠️ Access Denied! You do not have permission to access this page.');
      this.redirectToUserDashboard(userRoles);
      return false;
    }

    return true;
  }

  private redirectToUserDashboard(userRoles: string[]): void {
    if (userRoles.includes('ROLE_ADMIN')) {
      this.router.navigate(['/admin/dashboard']);
    } else if (userRoles.includes('ROLE_MANAGER')) {
      this.router.navigate(['/manager/dashboard']);
    } else if (userRoles.includes('ROLE_HR')) {
      this.router.navigate(['/hr/dashboard']);
    } else if (userRoles.includes('ROLE_ACCOUNTANT')) {
      this.router.navigate(['/accountant/dashboard']);
    } else {
      this.router.navigate(['/employee/dashboard']);
    }
  }
}