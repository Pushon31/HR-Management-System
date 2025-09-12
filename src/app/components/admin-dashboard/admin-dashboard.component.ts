import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent {
  today: Date = new Date();
  cards = [
    { title: 'Users', icon: 'fas fa-users', color: '#4e73df' },
    { title: 'Attendance', icon: 'fas fa-calendar-check', color: '#1cc88a' },
    { title: 'Salary', icon: 'fas fa-money-bill-wave', color: '#36b9cc' },
    { title: 'Reports', icon: 'fas fa-chart-line', color: '#f6c23e' },
    { title: 'Settings', icon: 'fas fa-cogs', color: '#e74a3b' },
    { title: 'Notifications', icon: 'fas fa-bell', color: '#858796' }
  ];
  
}
