import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RoleService } from '../services/role.service';


@Injectable({
  providedIn: 'root'
})
export class NavigationGuard {

  constructor(
    private router: Router,
    private roleService: RoleService
  ) {}

  // Method to check access before navigating
  canNavigate(route: string): boolean {
    const userRoles = this.roleService.getUserRoles();
    
    // Define route access rules
    const routeAccess: { [key: string]: string[] } = {
      '/admin/dashboard': ['ROLE_ADMIN'],
      '/manager/dashboard': ['ROLE_MANAGER', 'ROLE_ADMIN'],
      '/hr/dashboard': ['ROLE_HR', 'ROLE_ADMIN'],
      '/accountant/dashboard': ['ROLE_ACCOUNTANT', 'ROLE_ADMIN'],
      '/employee/dashboard': ['ROLE_EMPLOYEE', 'ROLE_MANAGER', 'ROLE_ADMIN', 'ROLE_HR', 'ROLE_ACCOUNTANT']
    };

    const allowedRoles = routeAccess[route] || [];
    const hasAccess = allowedRoles.some(role => userRoles.includes(role));

    if (!hasAccess) {
      alert('⚠️ Access Denied! You do not have permission to access this area.');
      this.router.navigate([this.roleService.getDefaultRoute()]);
      return false;
    }

    return true;
  }
}