import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RoleService } from 'src/app/services/role.service';


@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.component.html'
})
export class AccessDeniedComponent implements OnInit {
  currentUserRole: string = '';
  requiredRole: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private roleService: RoleService
  ) {}

  ngOnInit(): void {
    const roles = this.roleService.getUserRoles();
    this.currentUserRole = roles.length > 0 ? roles[0] : 'Unknown';
    
    // Get required role from query parameters
    this.route.queryParams.subscribe(params => {
      this.requiredRole = params['requiredRole'] || 'Higher Privileges';
    });
  }

  goToDashboard(): void {
    const defaultRoute = this.roleService.getDefaultRoute();
    this.router.navigate([defaultRoute]);
  }
}