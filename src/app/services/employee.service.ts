import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Employee{
  id: number;
  name: string;
  department: string; 
  hiredDate: string; 
  email: string; 
  phone: string; 
  status: string; 
  profilePic: string;
  
}

@Injectable({
  providedIn: 'root'
})


export class EmployeeService {

  private apiUrl = 'http://127.0.0.1:3000/employees';

  constructor(private http : HttpClient) { }

  getEmployees():Observable<Employee[]>{
    return this.http.get<Employee[]>(this.apiUrl);

  }

  addEmployee(emp:Employee):Observable<Employee>{
    return this.http.post<Employee>(this.apiUrl,emp);
  }

  updateEmployee(emp:Employee):Observable<Employee>{
    return this.http.put<Employee>(this.apiUrl + '/' + emp.id,emp);
  }

  deleteEmployee(id:number):Observable<any>{
    return this.http.delete(this.apiUrl + '/' + id)
  }
}
