import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../model/employeemodel';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private baseUrl = 'http://localhost:8080/api/employees';

  constructor(private http: HttpClient) { }

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.baseUrl);
  }

  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.baseUrl}/${id}`);
  }

  // ✅ FIXED: Use employeeId (business ID) instead of database ID
  getEmployeeByEmployeeId(employeeId: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.baseUrl}/employee-id/${employeeId}`);
  }

  addEmployee(emp: Employee): Observable<Employee> {
    // ✅ Ensure required fields are set
    const employeeToCreate = {
      ...emp,
      status: emp.status || 'ACTIVE',
      workType: emp.workType || 'ONSITE'
    };
    return this.http.post<Employee>(this.baseUrl, employeeToCreate);
  }

  updateEmployee(emp: Employee): Observable<Employee> {
    if (!emp.id) {
      throw new Error('Employee id required for update');
    }
    return this.http.put<Employee>(`${this.baseUrl}/${emp.id}`, emp);
  }

  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // ✅ Additional backend-aligned methods
  getEmployeesByDepartment(departmentId: number): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.baseUrl}/department/${departmentId}`);
  }

  getEmployeesByType(employeeType: string): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.baseUrl}/type/${employeeType}`);
  }

  getEmployeesByStatus(status: string): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.baseUrl}/status/${status}`);
  }

  // ✅ Manager-related methods
  getManagerTeam(managerId: number): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.baseUrl}/manager/${managerId}/team`);
  }

  assignManager(employeeId: number, managerId: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${employeeId}/manager/${managerId}`, {});
  }

  getEmployeesWithoutManager(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.baseUrl}/no-manager`);
  }
  getEmployeeWorkTypeStats(): Observable<any> {
  return this.http.get<any>('/api/employees/worktype-stats');
}
}