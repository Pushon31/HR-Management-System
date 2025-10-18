import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  active: boolean;
  roles: string[];
  employeeId?: number;
  employeeCode?: string;
  designation?: string;
  departmentName?: string;
}

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm: string = '';

  // Available roles
  availableRoles = [
    'ROLE_ADMIN',
    'ROLE_MANAGER', 
    'ROLE_HR',
    'ROLE_ACCOUNTANT',
    'ROLE_EMPLOYEE'
  ];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.http.get<User[]>('http://localhost:8080/api/admin/users')
      .subscribe({
        next: (data) => {
          this.users = data;
          this.filteredUsers = data;
        },
        error: (err) => {
          console.error('Failed to load users', err);
          alert('Error loading users');
        }
      });
  }

  searchUsers(): void {
    if (!this.searchTerm) {
      this.filteredUsers = this.users;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.username.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.fullName.toLowerCase().includes(term) ||
      (user.roles && user.roles.some(role => role.toLowerCase().includes(term)))
    );
  }

  // ✅ FIXED: Proper event handling with type safety
  onRoleCheckboxChange(user: User, role: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    if (!target) {
      console.error('Checkbox target element is null');
      return;
    }
    
    const isChecked = target.checked;
    this.updateUserRoles(user, role, isChecked);
  }

  // ✅ FIXED: Separate method for API call
  updateUserRoles(user: User, role: string, isChecked: boolean): void {
    let updatedRoles: string[];
    
    if (isChecked) {
      // Add role
      updatedRoles = [...(user.roles || []), role];
    } else {
      // Remove role
      updatedRoles = (user.roles || []).filter(r => r !== role);
    }

    this.http.put(`http://localhost:8080/api/admin/users/${user.id}/roles`, {
      roleNames: updatedRoles
    }).subscribe({
      next: () => {
        user.roles = updatedRoles;
        alert('User roles updated successfully!');
      },
      error: (err) => {
        console.error('Failed to update roles', err);
        alert('Error updating roles');
        
        // Revert the checkbox state on error
        const checkbox = document.getElementById(`role_${user.id}_${role}`) as HTMLInputElement;
        if (checkbox) {
          checkbox.checked = !isChecked;
        }
      }
    });
  }

  hasRole(user: User, role: string): boolean {
    return user.roles ? user.roles.includes(role) : false;
  }

  getRoleDisplayName(role: string): string {
    const roleMap: { [key: string]: string } = {
      'ROLE_ADMIN': 'Administrator',
      'ROLE_MANAGER': 'Manager',
      'ROLE_HR': 'HR Manager', 
      'ROLE_ACCOUNTANT': 'Accountant',
      'ROLE_EMPLOYEE': 'Employee'
    };
    return roleMap[role] || role;
  }

  toggleUserStatus(user: User): void {
    const action = user.active ? 'deactivate' : 'activate';
    if (!confirm(`Are you sure you want to ${action} ${user.username}?`)) {
      return;
    }

    // You'll need to implement activate/deactivate endpoints
    const url = `http://localhost:8080/api/admin/users/${user.id}/${user.active ? 'deactivate' : 'activate'}`;
    this.http.put(url, {}).subscribe({
      next: () => {
        user.active = !user.active;
        alert(`User ${action}d successfully!`);
      },
      error: (err) => {
        console.error(`Failed to ${action} user`, err);
        alert(`Error ${action}ing user`);
      }
    });
  }
}