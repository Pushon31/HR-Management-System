import { Component, OnInit } from '@angular/core';
import { Employee, EmployeeService } from 'src/app/services/employee.service';

declare var bootstrap: any;
@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {
  employees: Employee[] = []
  pagedEmployees: Employee[] = []
  page: number = 1
  pageSize: number = 20

  constructor(private empService: EmployeeService) { }


  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees() {
    this.empService.getEmployees().subscribe(
      data => {
        this.employees = data;
        this.setPage(this.page);
      }
    )

  }

  setPage(page: number) {
    this.page = page;
    const start = (page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedEmployees = this.employees.slice(start, end)
  }

  nextPage() {
    if ((this.page * this.pageSize) < this.employees.length) {
      this.setPage(this.page + 1);
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.setPage(this.page - 1);
    }
  }

  deleteEmployee(id: number) { if (confirm('Are you sure?')) { this.empService.deleteEmployee(id).subscribe(() => this.loadEmployees()); } }



  // Ngform / modal part 

  employeeForm: Employee = {
  id: 0,
  name: '',
  department: '',
  hiredDate: '',
  email: '',
  phone: '',
  status: 'Active',
  profilePic: ''
};

editingEmployee: Employee | null = null;

// Add Employee button click
openAddModal() {
  this.editingEmployee = null;
  this.employeeForm = {
    id: 0, name: '', department: '', hiredDate: '', email: '',
    phone: '', status: 'Active', profilePic: ''
  };
   
  const modalEl = document.getElementById('employeeModal');
  const modal = new bootstrap.Modal(modalEl!);
  modal.show();
}

// Edit Employee button click
openEditModal(emp: Employee) {
  this.editingEmployee = emp;
  this.employeeForm = { ...emp };
  const modalEl = document.getElementById('employeeModal');
  const modal = new bootstrap.Modal(modalEl!);
  modal.show();
}

// Save (Add / Update)
saveEmployee() {
  if (this.editingEmployee) {
    this.empService.updateEmployee(this.employeeForm).subscribe(() => {
      this.loadEmployees();
      bootstrap.Modal.getInstance(document.getElementById('employeeModal')!)?.hide();
    });
  } else {
    this.empService.addEmployee(this.employeeForm).subscribe(() => {
      this.loadEmployees();
      bootstrap.Modal.getInstance(document.getElementById('employeeModal')!)?.hide();
    });
  }
}

}
