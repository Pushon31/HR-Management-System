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

  // ✅ সম্পূর্ণ ফর্ম মডেল ব্যাকেন্ড DTO-এর সাথে মিল রেখে
  employeeForm: Employee = {
    firstName: '',
    lastName: '',
    employeeId: '',
    email: '',
    status: 'ACTIVE',
    workType: 'ONSITE',
    employeeType: 'FULL_TIME',
    gender: 'MALE',
    maritalStatus: 'SINGLE',
    departmentId: null,
    managerId: null,
    nidNumber: '',
    bankAccountNumber: '',
    phoneNumber: '',
    designation: '',
    basicSalary: 0,
    joinDate: new Date().toISOString().split('T')[0], // আজকের তারিখ
    profilePic: ''
  };

  editingEmployee: Employee | null = null;

  // ✅ ব্যাকেন্ড Enum-এর অপশনগুলি
  workTypeOptions = ['ONSITE', 'REMOTE', 'HYBRID'];
  employeeTypeOptions = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN', 'PROBATION'];
  statusOptions = ['ACTIVE', 'INACTIVE', 'TERMINATED', 'SUSPENDED', 'ON_LEAVE'];
  genderOptions = ['MALE', 'FEMALE', 'OTHER'];
  maritalStatusOptions = ['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED'];

  Math = Math;

  constructor(private empService: EmployeeService) { }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.empService.getEmployees().subscribe(
      (data: Employee[]) => {
        this.employees = data;
        this.setPage(this.page);
        console.log('Employees loaded:', data);
      },
      err => {
        console.error('Employees load failed', err);
        alert('Employees load error: ' + err.message);
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
      console.warn('Delete employee called without id');
      return;
    }
    if (!confirm('Are you sure to delete?')) {
      return;
    }
    this.empService.deleteEmployee(id).subscribe(
      () => {
        this.loadEmployees();
        alert('Employee deleted successfully!');
      },
      err => {
        console.error('Delete failed', err);
        alert('Delete error: ' + err.message);
      }
    );
  }

  openAddModal(): void {
    this.editingEmployee = null;
    this.employeeForm = {
      firstName: '',
      lastName: '',
      employeeId: '',
      email: '',
      status: 'ACTIVE',
      workType: 'ONSITE',
      employeeType: 'FULL_TIME',
      gender: 'MALE',
      maritalStatus: 'SINGLE',
      departmentId: null,
      managerId: null,
      nidNumber: '',
      bankAccountNumber: '',
      phoneNumber: '',
      designation: '',
      basicSalary: 0,
      joinDate: new Date().toISOString().split('T')[0],
      profilePic: ''
    };
    this.showModal();
  }

  openEditModal(emp: Employee): void {
    this.editingEmployee = emp;
    this.employeeForm = { ...emp };
    
    // তারিখ ফরম্যাট ঠিক করা
    if (this.employeeForm.joinDate) {
      this.employeeForm.joinDate = this.formatDateForInput(this.employeeForm.joinDate);
    }
    if (this.employeeForm.birthDate) {
      this.employeeForm.birthDate = this.formatDateForInput(this.employeeForm.birthDate);
    }

    this.showModal();
  }

  saveEmployee(): void {
    // ডেটা স্যানিটাইজেশন
    this.sanitizeFormData();

    if (this.editingEmployee && this.employeeForm.id) {
      // আপডেট করা
      this.empService.updateEmployee(this.employeeForm).subscribe(
        (updatedEmployee: Employee) => {
          this.loadEmployees();
          this.hideModal();
          alert('Employee updated successfully!');
        },
        err => {
          console.error('Update failed', err);
          alert('Update error: ' + err.message);
        }
      );
    } else {
      // নতুন এমপ্লয়ী তৈরি করা
      this.empService.addEmployee(this.employeeForm).subscribe(
        (newEmployee: Employee) => {
          this.loadEmployees();
          this.hideModal();
          alert('Employee added successfully!');
        },
        err => {
          console.error('Create failed', err);
          alert('Create error: ' + err.message);
        }
      );
    }
  }

  onDepartmentChange(value: any): void {
    if (value === '' || value === null || value === undefined || value === 0) {
      this.employeeForm.departmentId = null;
    } else {
      this.employeeForm.departmentId = +value;
    }
  }

  onManagerChange(value: any): void {
    if (value === '' || value === null || value === undefined || value === 0) {
      this.employeeForm.managerId = null;
    } else {
      this.employeeForm.managerId = +value;
    }
  }

  private sanitizeFormData(): void {
    // অপশনাল ফিল্ডগুলি খালি স্ট্রিং হলে null সেট করা
    const optionalFields = ['nidNumber', 'bankAccountNumber', 'phoneNumber', 'designation', 'profilePic', 'emergencyContact', 'address', 'shift'];
    optionalFields.forEach(field => {
      if (this.employeeForm[field as keyof Employee] === '') {
        (this.employeeForm as any)[field] = null;
      }
    });

    // নম্বর ফিল্ডগুলি হ্যান্ডল করা
    if (this.employeeForm.departmentId === undefined || this.employeeForm.departmentId === null || this.employeeForm.departmentId <= 0) {
      this.employeeForm.departmentId = null;
    }
    if (this.employeeForm.managerId === undefined || this.employeeForm.managerId === null || this.employeeForm.managerId <= 0) {
      this.employeeForm.managerId = null;
    }
    if (!this.employeeForm.basicSalary || this.employeeForm.basicSalary < 0) {
      this.employeeForm.basicSalary = 0;
    }
  }

  private formatDateForInput(dateString: string): string {
    if (!dateString) return '';
    return dateString.split('T')[0];
  }

  private showModal(): void {
    const modalEl = document.getElementById('employeeModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  private hideModal(): void {
    const modal = bootstrap.Modal.getInstance(document.getElementById('employeeModal')!);
    if (modal) {
      modal.hide();
    }
  }
}