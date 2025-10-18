// login.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface LoginResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  fullName: string;
  roles: string[];
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']  // ✅ Changed to SCSS
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading: boolean = false;
  errorMessage: string = '';
  
  // ✅ Backend API URL - adjust according to your Spring Boot port
  private apiUrl = 'http://localhost:8080';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.checkExistingAuth();
  }

  private initializeForm(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required]
    });
  }

 private checkExistingAuth(): boolean {
  const token = localStorage.getItem('token');
  return !!token; // Just return boolean, don't redirect
}

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const loginData = {
        username: this.loginForm.value.username,
        password: this.loginForm.value.password
      };

      // ✅ Direct HTTP call without separate service
      this.http.post<LoginResponse>(`${this.apiUrl}/api/auth/signin`, loginData)
        .subscribe({
          next: (response) => this.handleLoginSuccess(response),
          error: (error) => this.handleLoginError(error)
        });
    } else {
      this.markFormFieldsAsTouched();
    }
  }

  private handleLoginSuccess(response: LoginResponse): void {
    // Store authentication data
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify({
      id: response.id,
      username: response.username,
      email: response.email,
      fullName: response.fullName,
      roles: response.roles
    }));

    this.isLoading = false;
    this.redirectBasedOnRole();
  }

 private handleLoginError(error: any): void {
  this.isLoading = false;
  
  if (error.status === 401) {
    this.errorMessage = 'Invalid username or password';
  } else if (error.status === 0) {
    this.errorMessage = 'Cannot connect to server. Please check:';
    this.errorMessage += '\n1. Spring Boot server is running on port 8080';
    this.errorMessage += '\n2. CORS is properly configured';
    this.errorMessage += '\n3. Backend endpoints are accessible';
  } else {
    this.errorMessage = error.error?.message || 'Login failed. Please try again.';
  }
  
  console.error('Login error details:', error);
}

  private markFormFieldsAsTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      this.loginForm.get(key)?.markAsTouched();
    });
  }

  private redirectBasedOnRole(): void {
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    this.router.navigate(['/login']);
    return;
  }

  const user = JSON.parse(userStr);
  const roles = user.roles;

  // Use role service to get proper route
  if (roles.includes('ROLE_ADMIN')) {
    this.router.navigate(['/admin/dashboard']);
  } else if (roles.includes('ROLE_MANAGER')) {
    this.router.navigate(['/manager/dashboard']);
  } else if (roles.includes('ROLE_HR')) {
    this.router.navigate(['/hr/dashboard']);
  } else if (roles.includes('ROLE_ACCOUNTANT')) {
    this.router.navigate(['/accountant/dashboard']);
  } else {
    this.router.navigate(['/employee/dashboard']);
  }
}

  // ✅ Template helper methods
  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field?.errors?.['required'] && field.touched) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    return '';
  }
}