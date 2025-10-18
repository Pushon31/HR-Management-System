import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { AttendanceService } from '../../services/attendance.service';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent {//implements OnInit, AfterViewInit, OnDestroy {
//   today: Date = new Date();
  
//   // Chart instances
//   private attendanceChart: any;
//   private employeeTypeChart: any;
  
//   // Data properties
//   attendanceData: any = {
//     present: 0,
//     late: 0,
//     absent: 0,
//     total: 0
//   };
  
//   employeeTypeData: any = {
//     onsite: 0,
//     remote: 0,
//     hybrid: 0
//   };
  
//   employeeAttendance: any[] = [];
//   currentPage: number = 1;
//   itemsPerPage: number = 10;
//   totalPages: number = 1;
//   searchTerm: string = '';
//   selectedYear: number = new Date().getFullYear();

//   constructor(
//     private attendanceService: AttendanceService,
//     private employeeService: EmployeeService
//   ) {
//     Chart.register(...registerables);
//   }

//   ngOnInit(): void {
//     this.loadDashboardData();
//     this.loadEmployeeAttendance();
//   }

//   ngAfterViewInit(): void {
//     // Charts will be initialized after data loads
//   }

//   ngOnDestroy(): void {
//     // Clean up charts
//     if (this.attendanceChart) {
//       this.attendanceChart.destroy();
//     }
//     if (this.employeeTypeChart) {
//       this.employeeTypeChart.destroy();
//     }
//   }

//   // Load dashboard summary data
//   loadDashboardData(): void {
//     // Load attendance statistics
//     this.attendanceService.getTodayAttendanceStats().subscribe({
//       next: (data) => {
//         this.attendanceData = data;
//         this.initAttendanceChart();
//       },
//       error: (error) => {
//         console.error('Error loading attendance stats:', error);
//         this.initAttendanceChart(); // Initialize with default data
//       }
//     });

//     // Load employee type distribution
//     this.employeeService.getEmployeeWorkTypeStats().subscribe({
//       next: (data) => {
//         this.employeeTypeData = data;
//         this.initEmployeeTypeChart();
//       },
//       error: (error) => {
//         console.error('Error loading employee type stats:', error);
//         this.initEmployeeTypeChart(); // Initialize with default data
//       }
//     });
//   }

//   // Load employee attendance table data
//   loadEmployeeAttendance(): void {
//     this.attendanceService.getEmployeeAttendance(
//       this.currentPage, 
//       this.itemsPerPage, 
//       this.searchTerm,
//       this.selectedYear
//     ).subscribe({
//       next: (response) => {
//         this.employeeAttendance = response.data;
//         this.totalPages = response.totalPages;
//       },
//       error: (error) => {
//         console.error('Error loading employee attendance:', error);
//       }
//     });
//   }

//   // Initialize Attendance Rate Chart
//   private initAttendanceChart(): void {
//     const ctx = document.getElementById('attendanceGraph') as HTMLCanvasElement;
    
//     if (!ctx) return;

//     if (this.attendanceChart) {
//       this.attendanceChart.destroy();
//     }

//     this.attendanceChart = new Chart(ctx, {
//       type: 'line',
//       data: {
//         labels: this.generateMonthLabels(),
//         datasets: [
//           {
//             label: 'Present',
//             data: this.generateSampleData(80, 95),
//             borderColor: '#28a745',
//             backgroundColor: 'rgba(40, 167, 69, 0.1)',
//             tension: 0.4,
//             fill: true
//           },
//           {
//             label: 'Late',
//             data: this.generateSampleData(5, 15),
//             borderColor: '#ffc107',
//             backgroundColor: 'rgba(255, 193, 7, 0.1)',
//             tension: 0.4,
//             fill: true
//           },
//           {
//             label: 'Absent',
//             data: this.generateSampleData(1, 8),
//             borderColor: '#dc3545',
//             backgroundColor: 'rgba(220, 53, 69, 0.1)',
//             tension: 0.4,
//             fill: true
//           }
//         ]
//       },
//       options: {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//           legend: {
//             display: false
//           },
//           tooltip: {
//             mode: 'index',
//             intersect: false
//           }
//         },
//         scales: {
//           x: {
//             grid: {
//               display: false
//             }
//           },
//           y: {
//             min: 0,
//             max: 100,
//             ticks: {
//               callback: function(value) {
//                 return value + '%';
//               }
//             }
//           }
//         },
//         interaction: {
//           mode: 'nearest',
//           axis: 'x',
//           intersect: false
//         }
//       }
//     });
//   }

//   // Initialize Employee Type Pie Chart
//   private initEmployeeTypeChart(): void {
//     const ctx = document.getElementById('employeeTypePieChart') as HTMLCanvasElement;
    
//     if (!ctx) return;

//     if (this.employeeTypeChart) {
//       this.employeeTypeChart.destroy();
//     }

//     this.employeeTypeChart = new Chart(ctx, {
//       type: 'doughnut',
//       data: {
//         labels: ['Onsite', 'Remote', 'Hybrid'],
//         datasets: [{
//           data: [
//             this.employeeTypeData.onsite || 45,
//             this.employeeTypeData.remote || 30,
//             this.employeeTypeData.hybrid || 25
//           ],
//           backgroundColor: [
//             '#28a745',
//             '#007bff',
//             '#fd7e14'
//           ],
//           borderWidth: 2,
//           borderColor: '#ffffff'
//         }]
//       },
//       options: {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//           legend: {
//             display: false
//           },
//           tooltip: {
//             callbacks: {
//               label: function(context) {
//                 const label = context.label || '';
//                 const value = context.parsed;
//                 const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
//                 const percentage = Math.round((value / total) * 100);
//                 return `${label}: ${value} (${percentage}%)`;
//               }
//             }
//           }
//         },
//         cutout: '70%'
//       }
//     });
//   }

//   // Helper methods
//   private generateMonthLabels(): string[] {
//     return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//   }

//   private generateSampleData(min: number, max: number): number[] {
//     return Array(12).fill(0).map(() => 
//       Math.floor(Math.random() * (max - min + 1)) + min
//     );
//   }

//   // UI Interaction methods
//   onSearchChange(): void {
//     this.currentPage = 1;
//     this.loadEmployeeAttendance();
//   }

//   onYearChange(): void {
//     this.currentPage = 1;
//     this.loadEmployeeAttendance();
//   }

//   previousPage(): void {
//     if (this.currentPage > 1) {
//       this.currentPage--;
//       this.loadEmployeeAttendance();
//     }
//   }

//   nextPage(): void {
//     if (this.currentPage < this.totalPages) {
//       this.currentPage++;
//       this.loadEmployeeAttendance();
//     }
//   }

//   downloadReport(): void {
//     // Implement download functionality
//     console.log('Downloading attendance report...');
//   }

//   getAttendanceIcon(status: string): string {
//     switch (status) {
//       case 'present': return 'fas fa-check-circle text-success';
//       case 'late': return 'fas fa-clock text-warning';
//       case 'absent': return 'fas fa-times-circle text-danger';
//       case 'half_day': return 'fas fa-adjust text-info';
//       default: return 'fas fa-circle text-secondary';
//     }
//   }

//   getAttendanceTooltip(status: string): string {
//     switch (status) {
//       case 'present': return 'Present';
//       case 'late': return 'Late';
//       case 'absent': return 'Absent';
//       case 'half_day': return 'Half Day';
//       default: return 'Not Marked';
//     }
//   }
}