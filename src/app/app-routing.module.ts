import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { EmpDashboardComponent } from './components/emp-dashboard/emp-dashboard.component';
import { ManDashboardComponent } from './components/man-dashboard/man-dashboard.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';

const routes: Routes = [
  {path : "" , component : HomeComponent},
{path : "home" , component : HomeComponent},
{path : "login" , component : LoginComponent},
{path : "signup" , component : SignupComponent},
{path : "empDashboard" , component :EmpDashboardComponent},
{path : "manDashboard" , component :ManDashboardComponent},
{path : "adminDashboard" , component :AdminDashboardComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
