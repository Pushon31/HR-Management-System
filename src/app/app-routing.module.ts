import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { EmpDashboardComponent } from './components/emp-dashboard/emp-dashboard.component';
import { ManDashboardComponent } from './components/man-dashboard/man-dashboard.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminDashHomeComponent } from './components/admin-dash-home/admin-dash-home.component';
import { EmployeeComponent } from './components/employee/employee.component';
import { AttendanceComponent } from './components/attendance/attendance.component';
import { LeaveComponent } from './components/leave/leave.component';
import { PayrollComponent } from './components/payroll/payroll.component';
import { RecruitmentComponent } from './components/recruitment/recruitment.component';
import { TaskManagementComponent } from './components/task-management/task-management.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { HelpSupportComponent } from './components/help-support/help-support.component';

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "home", component: HomeComponent },
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },

  // Employee Routes
  { 
    path: "empDashboard", 
    component: EmpDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_EMPLOYEE', 'ROLE_MANAGER', 'ROLE_ADMIN', 'ROLE_HR', 'ROLE_ACCOUNTANT'] }
  },

  // Manager Routes
  { 
    path: "manDashboard", 
    component: ManDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_MANAGER', 'ROLE_ADMIN'] }
  },

  // Admin Routes
  { 
    path: "admin",
    component: AdminDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ADMIN'] },
    children: [
      { path: '', component: AdminDashHomeComponent },
      { path: 'employeee', component: EmployeeComponent },
      { path: 'attendance', component: AttendanceComponent },
      { path: 'leave', component: LeaveComponent },
      { path: 'payroll', component: PayrollComponent },
      { path: 'recruitment', component: RecruitmentComponent },
      { path: 'task-management', component: TaskManagementComponent },
      { path: 'analytics', component: AnalyticsComponent },
    ]
  },

  // Specific dashboard routes with role protection
  { 
    path: "admin/dashboard", 
    component: AdminDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ADMIN'] }
  },
  { 
    path: "manager/dashboard", 
    component: ManDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_MANAGER', 'ROLE_ADMIN'] }
  },
  { 
    path: "hr/dashboard", 
    component: EmpDashboardComponent, // Create HR dashboard later
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_HR', 'ROLE_ADMIN'] }
  },
  { 
    path: "accountant/dashboard", 
    component: EmpDashboardComponent, // Create Accountant dashboard later
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ACCOUNTANT', 'ROLE_ADMIN'] }
  },
  { 
    path: "employee/dashboard", 
    component: EmpDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_EMPLOYEE', 'ROLE_MANAGER', 'ROLE_ADMIN', 'ROLE_HR', 'ROLE_ACCOUNTANT'] }
  },

  // Other routes
  { 
    path: 'calendar', 
    component: CalendarComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_EMPLOYEE', 'ROLE_MANAGER', 'ROLE_ADMIN', 'ROLE_HR', 'ROLE_ACCOUNTANT'] }
  },
  { 
    path: 'help-support', 
    component: HelpSupportComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_EMPLOYEE', 'ROLE_MANAGER', 'ROLE_ADMIN', 'ROLE_HR', 'ROLE_ACCOUNTANT'] }
  },

  // Fallback route
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }