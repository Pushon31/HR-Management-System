import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { EmpDashboardComponent } from './components/emp-dashboard/emp-dashboard.component';
import { ManDashboardComponent } from './components/man-dashboard/man-dashboard.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
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
  {path : "" , component : HomeComponent},
{path : "home" , component : HomeComponent},
{path : "login" , component : LoginComponent},
{path : "signup" , component : SignupComponent},
{path : "empDashboard" , component :EmpDashboardComponent},
{path : "manDashboard" , component :ManDashboardComponent},
// {path : "adminDashboard" , component :AdminDashboardComponent},
{
    path: 'admin',
    component: AdminDashboardComponent,
    children: [
      { path: 'employeee', component: EmployeeComponent },
      { path: 'attendance', component: AttendanceComponent },
      { path: 'leave', component: LeaveComponent },
      { path: 'payroll', component: PayrollComponent },
      { path: 'recruitment', component: RecruitmentComponent },
      { path: 'task-management', component: TaskManagementComponent },
      { path: 'analytics', component: AnalyticsComponent },
    ]
  },
  { path: 'calendar', component: CalendarComponent },
  { path: 'help-support', component: HelpSupportComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
