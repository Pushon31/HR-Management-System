import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmpDashboardComponent } from './components/emp-dashboard/emp-dashboard.component';
import { DashNavComponent } from './components/dash-nav/dash-nav.component';
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
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    FooterComponent,
    LoginComponent,
    SignupComponent,
    EmpDashboardComponent,
    DashNavComponent,
    ManDashboardComponent,
    AdminDashboardComponent,
    EmployeeComponent,
    AttendanceComponent,
    LeaveComponent,
    PayrollComponent,
    RecruitmentComponent,
    TaskManagementComponent,
    AnalyticsComponent,
    CalendarComponent,
    HelpSupportComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
