import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LeaveApplicationDto {
  id: number;
  employeeId: number;
  employeeName: string;
  employeeCode: string;
  leaveTypeId: number;
  leaveTypeName: string;
  leaveTypeCode: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  status: string;
  reason: string;
  remarks: string;
  approvedById: number;
  approvedByName: string;
  appliedDate: string;
  processedDate: string;
  contactNumber: string;
  addressDuringLeave: string;
  departmentName: string;
}

export interface LeaveStatistics {
  [key: string]: number | undefined;
  TOTAL?: number;
  PENDING?: number;
  APPROVED?: number;
  REJECTED?: number;
  CANCELLED?: number;
  PENDING_COUNT?: number;
}

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  private baseUrl = '/api/leaves';

  constructor(private http: HttpClient) { }

  // Get all leave applications
  getAllLeaveApplications(): Observable<LeaveApplicationDto[]> {
    return this.http.get<LeaveApplicationDto[]>(`${this.baseUrl}/applications`);
  }

  // Get leave statistics
  getLeaveStatistics(): Observable<LeaveStatistics> {
    return this.http.get<LeaveStatistics>(`${this.baseUrl}/statistics`);
  }

  // Get leave applications by status
  getLeaveApplicationsByStatus(status: string): Observable<LeaveApplicationDto[]> {
    return this.http.get<LeaveApplicationDto[]>(`${this.baseUrl}/applications/status/${status}`);
  }

  // Get pending leaves for manager
  getPendingLeavesForManager(managerId: number): Observable<LeaveApplicationDto[]> {
    return this.http.get<LeaveApplicationDto[]>(`${this.baseUrl}/applications/manager/${managerId}/pending`);
  }

  // Get upcoming leaves
  getUpcomingLeaves(days: number = 30): Observable<LeaveApplicationDto[]> {
    return this.http.get<LeaveApplicationDto[]>(`${this.baseUrl}/upcoming?days=${days}`);
  }

  // Approve leave
  approveLeave(leaveId: number, approvedBy: number, remarks?: string): Observable<LeaveApplicationDto> {
    let params = new HttpParams().set('approvedBy', approvedBy.toString());
    if (remarks) {
      params = params.set('remarks', remarks);
    }
    return this.http.put<LeaveApplicationDto>(`${this.baseUrl}/applications/${leaveId}/approve`, {}, { params });
  }

  // Reject leave
  rejectLeave(leaveId: number, approvedBy: number, remarks?: string): Observable<LeaveApplicationDto> {
    let params = new HttpParams().set('approvedBy', approvedBy.toString());
    if (remarks) {
      params = params.set('remarks', remarks);
    }
    return this.http.put<LeaveApplicationDto>(`${this.baseUrl}/applications/${leaveId}/reject`, {}, { params });
  }

  // Cancel leave
  cancelLeave(leaveId: number, employeeId: number): Observable<LeaveApplicationDto> {
    const params = new HttpParams().set('employeeId', employeeId.toString());
    return this.http.put<LeaveApplicationDto>(`${this.baseUrl}/applications/${leaveId}/cancel`, {}, { params });
  }

  // Get employee leave balances
  getEmployeeLeaveBalances(employeeId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/balance/employee/${employeeId}`);
  }

  // Check leave availability
  checkLeaveAvailability(employeeId: number, leaveTypeId: number, startDate: string, endDate: string): Observable<boolean> {
    const params = new HttpParams()
      .set('employeeId', employeeId.toString())
      .set('leaveTypeId', leaveTypeId.toString())
      .set('startDate', startDate)
      .set('endDate', endDate);
    
    return this.http.get<boolean>(`${this.baseUrl}/check-availability`, { params });
  }
}