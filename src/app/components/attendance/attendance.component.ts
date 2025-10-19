import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { AttendanceService } from '../../services/attendance.service';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit, AfterViewInit, OnDestroy {
  today: Date = new Date();
  
  // Chart instances
  private attendanceChart: any;
  private employeeTypeChart: any;
  
  // Form Group
  filtersForm: FormGroup;

  // Data properties
  attendanceData: any = {
    present: 0,
    late: 0,
    absent: 0,
    halfDay: 0,
    total: 0
  };
  
  employeeTypeData: any = {
    ONSITE: 0,
    REMOTE: 0,
    HYBRID: 0
  };
  
  employeeAttendance: any[] = [];
  allAttendanceData: any[] = []; // Store all data for filtering
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  // Loading states
  isLoading: boolean = false;
  isChartLoading: boolean = false;

  constructor(
    private attendanceService: AttendanceService,
    private employeeService: EmployeeService,
    private fb: FormBuilder
  ) {
    Chart.register(...registerables);
    
    // Initialize form
    this.filtersForm = this.fb.group({
      searchTerm: [''],
      selectedDate: [new Date().toISOString().split('T')[0]]
    });
  }

  ngOnInit(): void {
    this.loadDashboardData();
    this.loadTodayAttendance();

    // Subscribe to form changes
    this.filtersForm.get('selectedDate')?.valueChanges.subscribe((date) => {
      if (date) {
        this.currentPage = 1;
        this.loadTodayAttendance();
      }
    });

    this.filtersForm.get('searchTerm')?.valueChanges.subscribe(() => {
      this.currentPage = 1;
      this.applyFilterAndPagination();
    });
  }

  ngAfterViewInit(): void {
    // Charts will be initialized after data loads
  }

  ngOnDestroy(): void {
    // Clean up charts
    if (this.attendanceChart) {
      this.attendanceChart.destroy();
    }
    if (this.employeeTypeChart) {
      this.employeeTypeChart.destroy();
    }
  }

  // Load dashboard summary data
  loadDashboardData(): void {
    this.isChartLoading = true;

    // Load today's attendance statistics
    this.attendanceService.getTodayPresentCount().subscribe({
      next: (presentCount) => {
        this.attendanceData.present = presentCount;
        this.updateAttendanceData();
      },
      error: (error) => {
        console.error('Error loading present count:', error);
        this.updateAttendanceData();
      }
    });

    this.attendanceService.getTodayLateCount().subscribe({
      next: (lateCount) => {
        this.attendanceData.late = lateCount;
        this.updateAttendanceData();
      },
      error: (error) => {
        console.error('Error loading late count:', error);
        this.updateAttendanceData();
      }
    });

    // Load employee type distribution
    this.employeeService.getEmployeeWorkTypeStats().subscribe({
      next: (data) => {
        this.employeeTypeData = data;
        this.initEmployeeTypeChart();
        this.isChartLoading = false;
      },
      error: (error) => {
        console.error('Error loading employee type stats:', error);
        this.initEmployeeTypeChart();
        this.isChartLoading = false;
      }
    });
  }

  // Update attendance data and initialize chart
  private updateAttendanceData(): void {
    // Calculate total (you might want to get total employees from another service)
    this.attendanceData.total = this.attendanceData.present + this.attendanceData.late + this.attendanceData.absent + this.attendanceData.halfDay;
    
    if (this.attendanceData.total > 0) {
      this.initAttendanceChart();
    }
  }

  // Load today's attendance for table
  loadTodayAttendance(): void {
    this.isLoading = true;
    const selectedDate = this.filtersForm.get('selectedDate')?.value;
    
    this.attendanceService.getAttendanceByDate(selectedDate).subscribe({
      next: (response) => {
        this.allAttendanceData = response;
        this.applyFilterAndPagination();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading today\'s attendance:', error);
        this.isLoading = false;
      }
    });
  }

  // Apply search filter and pagination
  private applyFilterAndPagination(): void {
    const searchTerm = this.filtersForm.get('searchTerm')?.value?.toLowerCase() || '';
    
    let filteredData = this.allAttendanceData;

    // Apply search filter
    if (searchTerm) {
      filteredData = filteredData.filter(attendance => 
        attendance.employeeName?.toLowerCase().includes(searchTerm) ||
        attendance.employeeId?.toLowerCase().includes(searchTerm) ||
        attendance.departmentName?.toLowerCase().includes(searchTerm)
      );
    }

    // Calculate pagination
    this.totalPages = Math.ceil(filteredData.length / this.itemsPerPage);
    
    // Apply pagination
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.employeeAttendance = filteredData.slice(startIndex, endIndex);
  }

  // Initialize Attendance Trend Chart
  private initAttendanceChart(): void {
    const ctx = document.getElementById('attendanceGraph') as HTMLCanvasElement;
    
    if (!ctx) return;

    if (this.attendanceChart) {
      this.attendanceChart.destroy();
    }

    this.attendanceChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Present', 'Late', 'Absent', 'Half Day'],
        datasets: [{
          data: [
            this.attendanceData.present,
            this.attendanceData.late,
            this.attendanceData.absent,
            this.attendanceData.halfDay
          ],
          backgroundColor: [
            '#28a745', // Present - Green
            '#ffc107', // Late - Yellow
            '#dc3545', // Absent - Red
            '#17a2b8'  // Half Day - Blue
          ],
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.parsed;
                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        },
        cutout: '60%'
      }
    });
  }

  // Initialize Employee Type Pie Chart
  private initEmployeeTypeChart(): void {
    const ctx = document.getElementById('employeeTypePieChart') as HTMLCanvasElement;
    
    if (!ctx) return;

    if (this.employeeTypeChart) {
      this.employeeTypeChart.destroy();
    }

    this.employeeTypeChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Onsite', 'Remote', 'Hybrid'],
        datasets: [{
          data: [
            this.employeeTypeData.ONSITE || 0,
            this.employeeTypeData.REMOTE || 0,
            this.employeeTypeData.HYBRID || 0
          ],
          backgroundColor: [
            '#28a745', // Onsite - Green
            '#007bff', // Remote - Blue
            '#fd7e14'  // Hybrid - Orange
          ],
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.parsed;
                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }

  // UI Interaction methods
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.applyFilterAndPagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.applyFilterAndPagination();
    }
  }

  // Manual check-in/check-out methods
  manualCheckIn(employeeId: string): void {
    const currentTime = new Date();
    const checkInTime = currentTime.toTimeString().split(' ')[0];
    
    this.attendanceService.manualCheckIn(employeeId, checkInTime)
      .subscribe({
        next: (response) => {
          console.log('Manual check-in successful:', response);
          this.loadTodayAttendance();
          this.loadDashboardData();
        },
        error: (error) => {
          console.error('Manual check-in failed:', error);
          alert('Manual check-in failed: ' + (error.error?.message || error.message));
        }
      });
  }

  manualCheckOut(employeeId: string): void {
    const currentTime = new Date();
    const checkOutTime = currentTime.toTimeString().split(' ')[0];
    
    this.attendanceService.manualCheckOut(employeeId, checkOutTime)
      .subscribe({
        next: (response) => {
          console.log('Manual check-out successful:', response);
          this.loadTodayAttendance();
          this.loadDashboardData();
        },
        error: (error) => {
          console.error('Manual check-out failed:', error);
          alert('Manual check-out failed: ' + (error.error?.message || error.message));
        }
      });
  }

  downloadReport(): void {
    const selectedDate = this.filtersForm.get('selectedDate')?.value;
    this.attendanceService.downloadAttendanceReport(selectedDate)
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `attendance-report-${selectedDate}.pdf`;
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: (error) => {
          console.error('Download failed:', error);
          alert('Download failed: ' + (error.error?.message || error.message));
        }
      });
  }

  getAttendanceIcon(status: string): string {
    switch (status?.toUpperCase()) {
      case 'PRESENT': return 'fas fa-check-circle text-success';
      case 'LATE': return 'fas fa-clock text-warning';
      case 'ABSENT': return 'fas fa-times-circle text-danger';
      case 'HALF_DAY': return 'fas fa-adjust text-info';
      default: return 'fas fa-circle text-secondary';
    }
  }

  getAttendanceBadgeClass(status: string): string {
    switch (status?.toUpperCase()) {
      case 'PRESENT': return 'badge bg-success bg-opacity-10 text-success border border-success border-opacity-25';
      case 'LATE': return 'badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25';
      case 'ABSENT': return 'badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25';
      case 'HALF_DAY': return 'badge bg-info bg-opacity-10 text-info border border-info border-opacity-25';
      default: return 'badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25';
    }
  }

  getAttendanceTooltip(status: string): string {
    switch (status?.toUpperCase()) {
      case 'PRESENT': return 'Present';
      case 'LATE': return 'Late';
      case 'ABSENT': return 'Absent';
      case 'HALF_DAY': return 'Half Day';
      default: return 'Not Marked';
    }
  }

  // Format status for display (replaces titlecase pipe)
  formatStatus(status: string): string {
    if (!status) return 'Not Marked';
    
    // Convert snake_case to Title Case
    return status.toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // Calculate total hours worked
  calculateTotalHours(checkInTime: string, checkOutTime: string): string {
    if (!checkInTime || !checkOutTime) return 'N/A';
    
    try {
      const checkIn = new Date(`1970-01-01T${checkInTime}`);
      const checkOut = new Date(`1970-01-01T${checkOutTime}`);
      const diffMs = checkOut.getTime() - checkIn.getTime();
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      
      return `${hours}h ${minutes}m`;
    } catch (error) {
      return 'N/A';
    }
  }
}