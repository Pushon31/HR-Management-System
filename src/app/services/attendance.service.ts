import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AttendanceDto {
  id: number;
  employeeId: string;
  employeeName: string;
  attendanceDate: string;
  checkInTime: string;
  checkOutTime: string;
  status: string;
  totalHours: number;
  remarks: string;
  departmentName: string;
}

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private apiUrl = '/api/attendance';

  constructor(private http: HttpClient) { }

  // Get today's attendance by date
  getAttendanceByDate(date: string): Observable<AttendanceDto[]> {
    return this.http.get<AttendanceDto[]>(`${this.apiUrl}/date/${date}`);
  }

  // Get today's present count
  getTodayPresentCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/reports/today-present`);
  }

  // Get today's late count
  getTodayLateCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/reports/today-late`);
  }

  // Get today's attendance by status
  getTodayAttendanceByStatus(status: string): Observable<AttendanceDto[]> {
    return this.http.get<AttendanceDto[]>(`${this.apiUrl}/today/status/${status}`);
  }

  // Manual check-in
  manualCheckIn(employeeId: string, checkInTime: string): Observable<AttendanceDto> {
    let params = new HttpParams().set('checkInTime', checkInTime);
    return this.http.post<AttendanceDto>(`${this.apiUrl}/manual/check-in/${employeeId}`, {}, { params });
  }

  // Manual check-out
  manualCheckOut(employeeId: string, checkOutTime: string): Observable<AttendanceDto> {
    let params = new HttpParams().set('checkOutTime', checkOutTime);
    return this.http.post<AttendanceDto>(`${this.apiUrl}/manual/check-out/${employeeId}`, {}, { params });
  }

  // Get employee attendance history
  getEmployeeAttendanceHistory(employeeId: string, startDate: string, endDate: string): Observable<AttendanceDto[]> {
    let params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    
    return this.http.get<AttendanceDto[]>(`${this.apiUrl}/history/${employeeId}`, { params });
  }

  // Get monthly attendance
  getMonthlyAttendance(employeeId: string, year: number, month: number): Observable<AttendanceDto[]> {
    let params = new HttpParams()
      .set('year', year.toString())
      .set('month', month.toString());
    
    return this.http.get<AttendanceDto[]>(`${this.apiUrl}/monthly/${employeeId}`, { params });
  }

  // Update attendance
  updateAttendance(id: number, attendanceDto: AttendanceDto): Observable<AttendanceDto> {
    return this.http.put<AttendanceDto>(`${this.apiUrl}/${id}`, attendanceDto);
  }

  // Delete attendance
  deleteAttendance(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Download report
  downloadAttendanceReport(date: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/reports/export?date=${date}`, {
      responseType: 'blob'
    });
  }
}