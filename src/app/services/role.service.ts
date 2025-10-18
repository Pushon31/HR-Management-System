// role.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor() { }

  getUserRoles(): string[] {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.roles || [];
    }
    return [];
  }

  hasRole(role: string): boolean {
    const roles = this.getUserRoles();
    return roles.includes(role);
  }

  hasAnyRole(requiredRoles: string[]): boolean {
    const userRoles = this.getUserRoles();
    return requiredRoles.some(role => userRoles.includes(role));
  }

  getDefaultRoute(): string {
    const roles = this.getUserRoles();
    
    if (roles.includes('ROLE_ADMIN')) return '/admin/dashboard';
    if (roles.includes('ROLE_MANAGER')) return '/manager/dashboard';
    if (roles.includes('ROLE_HR')) return '/hr/dashboard';
    if (roles.includes('ROLE_ACCOUNTANT')) return '/accountant/dashboard';
    
    return '/employee/dashboard';
  }
}