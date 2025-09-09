import { Component } from '@angular/core';

@Component({
  selector: 'app-man-dashboard',
  templateUrl: './man-dashboard.component.html',
  styleUrls: ['./man-dashboard.component.scss']
})
export class ManDashboardComponent {

   cards = [
    { title: 'Team', icon: 'fas fa-users', color: '#4e73df' },
    { title: 'Attendance', icon: 'fas fa-calendar-check', color: '#1cc88a' },
    { title: 'Tasks', icon: 'fas fa-tasks', color: '#36b9cc' },
    { title: 'Reports', icon: 'fas fa-chart-line', color: '#f6c23e' },
    { title: 'Notifications', icon: 'fas fa-bell', color: '#858796' }
  ];

}
