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

  addEmployee(emp: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.baseUrl, emp);
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
}
