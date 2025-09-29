import { Component, OnInit } from '@angular/core';
import { Employee } from '../../model/employeemodel';
import { EmployeeService } from 'src/app/services/employee.service';

declare var bootstrap: any;

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {
  employees: Employee[] = [];
  pagedEmployees: Employee[] = [];
  page: number = 1;
  pageSize: number = 20;

  employeeForm: Employee = this.initializeEmptyEmployee();
  editingEmployee: Employee | null = null;

  constructor(private empService: EmployeeService) { }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.empService.getEmployees().subscribe(
      data => {
        this.employees = data;
        this.setPage(this.page);
      },
      err => {
        console.error('Failed to load employees', err);
      }
    );
  }

  setPage(page: number): void {
    this.page = page;
    const start = (page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedEmployees = this.employees.slice(start, end);
  }

  nextPage(): void {
    if ((this.page * this.pageSize) < this.employees.length) {
      this.setPage(this.page + 1);
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.setPage(this.page - 1);
    }
  }

  deleteEmployee(id: number | undefined): void {
    if (!id) {
      console.warn('deleteEmployee called without id');
      return;
    }
    if (!confirm('Are you sure?')) {
      return;
    }
    this.empService.deleteEmployee(id).subscribe(
      () => {
        this.loadEmployees();
      },
      err => {
        console.error('Delete failed', err);
      }
    );
  }

  openAddModal(): void {
    this.editingEmployee = null;
    this.employeeForm = this.initializeEmptyEmployee();

    const modalEl = document.getElementById('employeeModal');
    const modal = new bootstrap.Modal(modalEl!);
    modal.show();
  }

  openEditModal(emp: Employee): void {
    this.editingEmployee = emp;
    this.employeeForm = { ...emp };

    const modalEl = document.getElementById('employeeModal');
    const modal = new bootstrap.Modal(modalEl!);
    modal.show();
  }

  saveEmployee(): void {
    // sanitize departmentId: set to null if invalid / empty
    if (this.employeeForm.departmentId === undefined ||
        this.employeeForm.departmentId === null ||
        this.employeeForm.departmentId <= 0) {
      this.employeeForm.departmentId = null;
    }

    // similarly, if you handle managerId, do same sanitization

    if (this.editingEmployee && this.employeeForm.id) {
      this.empService.updateEmployee(this.employeeForm).subscribe(
        () => {
          this.loadEmployees();
          bootstrap.Modal.getInstance(document.getElementById('employeeModal')!)?.hide();
        },
        err => {
          console.error('Update failed', err);
        }
      );
    } else {
      this.empService.addEmployee(this.employeeForm).subscribe(
        () => {
          this.loadEmployees();
          bootstrap.Modal.getInstance(document.getElementById('employeeModal')!)?.hide();
        },
        err => {
          console.error('Create failed', err);
        }
      );
    }
  }

  onDepartmentChange(value: any): void {
    // treat blank, zero, undefined, null as null
    if (value === '' || value === null || value === undefined || value === 0) {
      this.employeeForm.departmentId = null;
    } else {
      this.employeeForm.departmentId = +value;
    }
  }

  private initializeEmptyEmployee(): Employee {
    return {
      firstName: '',
      lastName: '',
      employeeId: '',
      email: '',
      status: 'ACTIVE',
      departmentId: null,
      managerId: null
      // other optional fields left undefined
    };
  }
}
