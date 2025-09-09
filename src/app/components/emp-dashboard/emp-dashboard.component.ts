// emp-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-emp-dashboard',
  templateUrl: './emp-dashboard.component.html',
  styleUrls: ['./emp-dashboard.component.scss']
})
export class EmpDashboardComponent implements OnInit {

   cards = [
    { title: 'Profile', icon: 'fas fa-user', color: '#4e73df' },
    { title: 'Attendance', icon: 'fas fa-calendar-check', color: '#1cc88a' },
    { title: 'Tasks', icon: 'fas fa-tasks', color: '#36b9cc' },
    { title: 'Salary', icon: 'fas fa-money-bill-wave', color: '#f6c23e' },
    { title: 'Notifications', icon: 'fas fa-bell', color: '#858796' }
  ];

  role: string = 'employee'; 

  constructor(private router: Router) { }

  ngOnInit(): void {
  
  }

  logout() {
    
    this.router.navigate(['/login']);
  }
}

