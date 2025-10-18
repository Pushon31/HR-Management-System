import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface SignupRequest {
  username: string;
  email: string;
  fullName: string;
  password: string;
  roles: string[];
  employeeId?: string;
  department?: string;
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.signupForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      employeeId: [''],
      department: ['']
    });
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      // ✅ SECURITY FIX: Force default role to 'employee' only
      const signupData: SignupRequest = {
        username: this.signupForm.value.username,
        fullName: this.signupForm.value.fullName,
        email: this.signupForm.value.email,
        password: this.signupForm.value.password,
        roles: ['employee'], // ✅ HARDCODED - Users can't choose roles
        employeeId: this.signupForm.value.employeeId || undefined,
        department: this.signupForm.value.department || undefined
      };

      console.log('Sending signup data:', signupData);

      this.http.post(`${this.apiUrl}/signup`, signupData, { responseType: 'text' })
        .subscribe({
          next: (response) => this.handleSignupSuccess(response),
          error: (error) => this.handleSignupError(error)
        });
    } else {
      this.markFormFieldsAsTouched();
    }
  }

  private handleSignupSuccess(response: any): void {
    this.isLoading = false;
    this.successMessage = 'Employee account created successfully! Your account is pending approval. Redirecting to login...';
    
    // Clear form
    this.signupForm.reset();
    
    // Redirect to login after 3 seconds
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 3000);
  }

  private handleSignupError(error: any): void {
    this.isLoading = false;
    
    if (error.status === 400) {
      if (error.error?.includes('Username')) {
        this.errorMessage = 'Username is already taken. Please choose another.';
      } else if (error.error?.includes('Email')) {
        this.errorMessage = 'Email is already registered. Please use another email.';
      } else {
        this.errorMessage = error.error || 'Registration failed. Please check your data.';
      }
    } else if (error.status === 0) {
      this.errorMessage = 'Cannot connect to server. Please make sure the backend is running on port 8080.';
    } else if (error.status === 403) {
      this.errorMessage = 'Registration is restricted to employee role only. Please contact administrator for other roles.';
    } else {
      this.errorMessage = 'Registration failed. Please try again.';
    }
    
    console.error('Signup error:', error);
  }

  private markFormFieldsAsTouched(): void {
    Object.keys(this.signupForm.controls).forEach(key => {
      this.signupForm.get(key)?.markAsTouched();
    });
  }

  // Helper method for template
  isFieldInvalid(fieldName: string): boolean {
    const field = this.signupForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }
}