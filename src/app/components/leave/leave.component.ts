import { Component, OnInit } from '@angular/core';
import { LeaveApplicationDto, LeaveService, LeaveStatistics } from 'src/app/services/leave.service';


@Component({
  selector: 'app-leave',
  templateUrl: './leave.component.html',
  styleUrls: ['./leave.component.scss']
})
export class LeaveComponent implements OnInit {
  currentMonth: Date;
  isLoading: boolean = false;
  showLeaveStats: boolean = true;
  
  // Leave data
  allLeaves: LeaveApplicationDto[] = [];
  filteredLeaves: LeaveApplicationDto[] = [];
  selectedLeave: LeaveApplicationDto | null = null;
  leaveStats: LeaveStatistics | null = null;
  
  // Filters
  searchTerm: string = '';
  selectedStatus: string = '';
  
  // Pagination
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;

  constructor(private leaveService: LeaveService) {
    this.currentMonth = new Date();
  }

  ngOnInit(): void {
    this.loadLeaveData();
  }

  loadLeaveData(): void {
    this.isLoading = true;
    
    // Load leave statistics
    this.leaveService.getLeaveStatistics().subscribe({
      next: (stats) => {
        this.leaveStats = stats;
      },
      error: (error) => {
        console.error('Error loading leave statistics:', error);
      }
    });

    // Load all leave applications
    this.leaveService.getAllLeaveApplications().subscribe({
      next: (leaves) => {
        this.allLeaves = leaves;
        this.filterLeaves();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading leave applications:', error);
        this.isLoading = false;
      }
    });
  }

  filterLeaves(): void {
    let filtered = this.allLeaves;

    // Filter by search term
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(leave => 
        leave.employeeName?.toLowerCase().includes(term) ||
        leave.leaveTypeName?.toLowerCase().includes(term) ||
        leave.employeeCode?.toLowerCase().includes(term)
      );
    }

    // Filter by status
    if (this.selectedStatus) {
      filtered = filtered.filter(leave => leave.status === this.selectedStatus);
    }

    this.filteredLeaves = filtered;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredLeaves.length / this.pageSize);
    this.currentPage = 1; // Reset to first page when filtering
  }

  get paginatedLeaves(): LeaveApplicationDto[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredLeaves.slice(startIndex, endIndex);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'PENDING': return 'badge badge-pending';
      case 'APPROVED': return 'badge badge-approved';
      case 'REJECTED': return 'badge badge-rejected';
      case 'CANCELLED': return 'badge badge-cancelled';
      default: return 'badge badge-secondary';
    }
  }

  viewLeaveDetails(leave: LeaveApplicationDto): void {
    this.selectedLeave = leave;
    // You'll need to import and use bootstrap modal or use a different approach
    const modal = new (window as any).bootstrap.Modal(document.getElementById('leaveDetailsModal'));
    modal.show();
  }

  approveLeave(leaveId: number): void {
    if (confirm('Are you sure you want to approve this leave application?')) {
      this.leaveService.approveLeave(leaveId, 1, 'Approved by manager').subscribe({
        next: (updatedLeave) => {
          this.loadLeaveData(); // Reload data
          alert('Leave application approved successfully!');
        },
        error: (error) => {
          console.error('Error approving leave:', error);
          alert('Error approving leave application');
        }
      });
    }
  }

  rejectLeave(leaveId: number): void {
    const reason = prompt('Please enter rejection reason:');
    if (reason) {
      this.leaveService.rejectLeave(leaveId, 1, reason).subscribe({
        next: (updatedLeave) => {
          this.loadLeaveData(); // Reload data
          alert('Leave application rejected successfully!');
        },
        error: (error) => {
          console.error('Error rejecting leave:', error);
          alert('Error rejecting leave application');
        }
      });
    }
  }

  loadPendingLeaves(): void {
    this.selectedStatus = 'PENDING';
    this.filterLeaves();
  }

  loadApprovedLeaves(): void {
    this.selectedStatus = 'APPROVED';
    this.filterLeaves();
  }

  loadUpcomingLeaves(): void {
    this.leaveService.getUpcomingLeaves(30).subscribe({
      next: (leaves) => {
        this.allLeaves = leaves;
        this.filterLeaves();
      },
      error: (error) => {
        console.error('Error loading upcoming leaves:', error);
      }
    });
  }

  exportToExcel(): void {
    // Implement Excel export functionality
    alert('Export functionality would be implemented here');
  }
}