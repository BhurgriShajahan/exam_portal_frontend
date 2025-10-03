import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  // Getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;

      // Prepare data for API
      const loginData = this.prepareLoginData();

      // Log form data to console
      this.logFormData('LOGIN_FORM_DATA', loginData);

      // // Call API service (replace with your actual API call)
      // this.callLoginAPI(loginData).subscribe({
      //   next: (response) => {
      //     this.isLoading = false;
      //     this.handleLoginSuccess(response);
      //   },
      //   error: (error) => {
      //     this.isLoading = false;
      //     this.handleLoginError(error);
      //   }
      // });

    } else {
      // Mark all fields as touched to show validation errors
      this.markAllFieldsAsTouched();
    }
  }

  // Prepare data for API - Easy to modify for your API requirements
  private prepareLoginData(): any {
    return {
      email: this.loginForm.value.email.trim().toLowerCase(),
      password: this.loginForm.value.password,
      rememberMe: this.loginForm.value.rememberMe
    };
  }

  // API call method - Replace with your actual API service
  private callLoginAPI(loginData: any) {
    // Simulated API call - Replace this with your actual HTTP service
    console.log('🔐 API Call - Login:', loginData);

    // Example of how to integrate with HttpClient:
    // return this.http.post('/api/auth/login', loginData);

    // Simulate API delay
    // return new Observable(observer => {
    //   setTimeout(() => {
    //     observer.next({
    //       success: true,
    //       token: 'mock-jwt-token',
    //       user: { id: 1, email: loginData.email }
    //     });
    //     observer.complete();
    //   }, 1500);
    // });
  }

  private handleLoginSuccess(response: any): void {
    console.log('✅ Login successful:', response);

    // Store token and user data (implement your auth service)
    this.storeAuthData(response);

    // Show success message
    this.showSuccessMessage('Login successful!');

    // Redirect to dashboard
    this.router.navigate(['/dashboard']);
  }

  private handleLoginError(error: any): void {
    console.error('❌ Login failed:', error);

    // Show error message to user
    this.showErrorMessage(
      error?.error?.message || 'Login failed. Please try again.'
    );
  }

  // Social login methods
  signInWithGoogle(): void {
    console.log('🔐 Google Sign In initiated');
    this.isLoading = true;

    // Replace with your Google auth implementation
    setTimeout(() => {
      this.isLoading = false;
      this.showSuccessMessage('Google login successful!');
      this.router.navigate(['/dashboard']);
    }, 1200);
  }

  signInWithGithub(): void {
    console.log('🔐 GitHub Sign In initiated');
    this.isLoading = true;

    // Replace with your GitHub auth implementation
    setTimeout(() => {
      this.isLoading = false;
      this.showSuccessMessage('GitHub login successful!');
      this.router.navigate(['/dashboard']);
    }, 1200);
  }

  signInWithLinkedIn(): void {
    console.log('🔐 LinkedIn Sign In initiated');
    this.isLoading = true;

    // Replace with your LinkedIn auth implementation
    setTimeout(() => {
      this.isLoading = false;
      this.showSuccessMessage('LinkedIn login successful!');
      this.router.navigate(['/dashboard']);
    }, 1200);
  }

  // Utility methods
  private markAllFieldsAsTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      this.loginForm.get(key)?.markAsTouched();
    });
  }

  private logFormData(label: string, data: any): void {
    console.group(`📋 ${label}`);
    console.log('Form Values:', this.loginForm.value);
    console.log('API Data:', data);
    console.log('Form Valid:', this.loginForm.valid);
    console.log('Form Errors:', this.loginForm.errors);
    console.groupEnd();
  }

  private storeAuthData(response: any): void {
    // Implement your token storage logic here
    localStorage.setItem('auth_token', response.token);
    localStorage.setItem('user_data', JSON.stringify(response.user));
  }

  private showSuccessMessage(message: string): void {
    // Implement your success notification
    alert(message); // Replace with toast notification
  }

  private showErrorMessage(message: string): void {
    // Implement your error notification
    alert(message); // Replace with toast notification
  }

  // Helper methods for template
  isFieldValid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return field ? field.touched && field.valid : false;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return field ? field.touched && field.invalid : false;
  }
}