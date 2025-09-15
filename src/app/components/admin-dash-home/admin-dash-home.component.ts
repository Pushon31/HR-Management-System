import { AfterViewInit, Component } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-admin-dash-home',
  templateUrl: './admin-dash-home.component.html',
  styleUrls: ['./admin-dash-home.component.scss']
})
export class AdminDashHomeComponent  implements AfterViewInit {
  today: Date = new Date();
  cards = [
    { title: 'Users', icon: 'fas fa-users', color: '#4e73df' },
    { title: 'Attendance', icon: 'fas fa-calendar-check', color: '#1cc88a' },
    { title: 'Salary', icon: 'fas fa-money-bill-wave', color: '#36b9cc' },
    { title: 'Reports', icon: 'fas fa-chart-line', color: '#f6c23e' },
    { title: 'Settings', icon: 'fas fa-cogs', color: '#e74a3b' },
    { title: 'Notifications', icon: 'fas fa-bell', color: '#858796' }
  ];





    // For html part div : 2 ...dummy data show 

   ngAfterViewInit() {
    const ctx = document.getElementById('employeeChart') as HTMLCanvasElement;

    new Chart(ctx, {
      type: 'bar', // চাইলে pie/line এ পরিবর্তন করা যাবে
      data: {
        labels: ['HR', 'IT', 'Finance', 'Marketing', 'Sales'],
        datasets: [{
          label: 'Number of Employees',
          data: [120, 300, 150, 200, 180], // 👉 demo data
          backgroundColor: [
            '#4caf50',  // green
            '#2196f3',  // blue
            '#ff9800',  // orange
            '#f44336',  // red
            '#9c27b0'   // purple
          ],
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 50
            }
          }
        }
      }
    });
  }

  applicants = [
  { name: 'Fahim Haider', post: 'Developer', status: 'Pending', profilePic: 'https://i.pravatar.cc/150?img=1' },
  { name: 'Haris Rauf', post: 'Designer', status: 'Approved', profilePic: 'https://i.pravatar.cc/150?img=2' },
  { name: 'Shakib Khan', post: 'Manager', status: 'Rejected', profilePic: 'https://i.pravatar.cc/150?img=3' },
  { name: 'Gausul Haque', post: 'HR', status: 'Pending', profilePic: 'https://i.pravatar.cc/150?img=4' },
  { name: 'Robiul Hossain', post: 'Marketing', status: 'Approved', profilePic: 'https://i.pravatar.cc/150?img=5' }
];
}
