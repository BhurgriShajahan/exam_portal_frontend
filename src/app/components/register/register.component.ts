import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomResponseEntity } from 'src/app/exception_handler/CustomResponseEntity.model';
import { UserDto } from 'src/app/dtos/request/UserDto.model';
import { UserService } from 'src/app/services/user-service.service';
import { ToastService } from 'src/app/toast_service/toast-service.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isLoading: boolean = false;
  showDebug: boolean = true; // Set to false in production

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private toastService: ToastService // Inject ToastService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.registerForm = this.fb.group({
      firstName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern('^[a-zA-Z ]*$')
      ]],
      lastName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern('^[a-zA-Z ]*$')
      ]],
      userName: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.pattern('^[a-zA-Z0-9_]*$')
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      phone: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{11}$')
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]],
      isActive: [true]
    });
  }

  // Getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  onSubmit(): void {
    if (this.registerForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.markAllFieldsAsTouched();

      const userDto: UserDto = this.prepareUserDto();
      this.logFormData('REGISTRATION_FORM_SUBMISSION', userDto);

      this.callRegistrationAPI(userDto);
    } else {
      this.markAllFieldsAsTouched();
      // Show warning toast for invalid form
      this.toastService.warning('Please fill all required fields correctly.');
    }
  }

  private prepareUserDto(): UserDto {
    const formValue = this.registerForm.value;
    return {
      firstName: formValue.firstName?.trim(),
      lastName: formValue.lastName?.trim(),
      userName: formValue.userName?.trim(),
      email: formValue.email?.trim().toLowerCase(),
      phone: formValue.phone,
      password: formValue.password,
      isActive: formValue.isActive
    };
  }

  private callRegistrationAPI(userDto: UserDto): void {
    console.log('🚀 Making API call to Spring Boot:', userDto);

    this.userService.registerUser(userDto).subscribe({
      next: (response: CustomResponseEntity) => {
        this.isLoading = false;
        this.handleApiResponse(response);
      },
      error: (error) => {
        this.isLoading = false;
        this.handleHttpError(error);
      }
    });
  }

  private handleApiResponse(response: CustomResponseEntity): void {
    console.log('📨 Spring Boot Response:', response);

    if (response.success) {
      this.handleSuccessResponse(response);
    } else {
      this.handleErrorResponse(response);
    }
  }

  private handleSuccessResponse(response: CustomResponseEntity): void {
    const successMessage = response.message || 'Registration successful!';

    // ✅ SUCCESS TOAST
    this.toastService.success(successMessage);

    console.log('✅ Success Details:', {
      errorCode: response.errorCode,
      success: response.success,
      message: response.message,
      data: response.data
    });

    // Navigate after a short delay to let user see the success message
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 1500);
  }

  private handleErrorResponse(response: CustomResponseEntity): void {
    const errorMessage = response.message || 'Registration failed';

    // ✅ ERROR TOAST
    this.toastService.error(errorMessage);

    this.handleErrorCode(response.errorCode, response.message);

    console.warn('❌ Backend Error Response:', {
      errorCode: response.errorCode,
      message: response.message,
      data: response.data
    });
  }

  private handleErrorCode(errorCode: number, message: string): void {
    switch (errorCode) {
      case 1000:
        this.handleDuplicateUserError(message);
        break;
      case 1:
        this.handleGenericError(message);
        break;
      default:
        this.handleUnknownError(errorCode, message);
        break;
    }
  }

  private handleDuplicateUserError(message: string): void {
    this.highlightPotentialDuplicateFields(message);
    console.log('👥 Duplicate user detected:', message);
  }

  private handleGenericError(message: string): void {
    console.log('⚠️ Generic error from backend:', message);
  }

  private handleUnknownError(errorCode: number, message: string): void {
    console.log('❓ Unknown error code:', errorCode, 'Message:', message);
  }

  private highlightPotentialDuplicateFields(message: string): void {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('email') || lowerMessage.includes('user')) {
      const emailControl = this.registerForm.get('email');
      const userNameControl = this.registerForm.get('userName');

      if (emailControl) {
        emailControl.setErrors({ ...emailControl.errors, duplicate: true });
      }
      if (userNameControl) {
        userNameControl.setErrors({ ...userNameControl.errors, duplicate: true });
      }
    }
  }

  private handleHttpError(error: any): void {
    console.error('🌐 HTTP Error:', error);

    let userFriendlyMessage = 'Registration failed. Please try again.';

    if (error.status === 0) {
      userFriendlyMessage = 'Cannot connect to server. Please check if Spring Boot is running on localhost:1111';
    } else if (error.status === 404) {
      userFriendlyMessage = 'API endpoint not found (404). Please check the URL.';
    } else if (error.status === 400) {
      userFriendlyMessage = 'Bad request. Please check your input data.';
    } else if (error.status === 500) {
      userFriendlyMessage = 'Server error. Please try again later.';
    } else if (error.error?.message) {
      userFriendlyMessage = error.error.message;
    }

    // ✅ ERROR TOAST for HTTP errors
    this.toastService.error(userFriendlyMessage);
  }

  // Utility methods
  private markAllFieldsAsTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      this.registerForm.get(key)?.markAsTouched();
    });
  }

  private logFormData(label: string, data: any): void {
    console.group(`📋 ${label}`);
    console.log('Form Values:', this.registerForm.value);
    console.log('Form Valid:', this.registerForm.valid);
    console.log('Form Errors:', this.getFormErrors());
    console.log('UserDto for Spring Boot:', data);
    console.groupEnd();
  }

  private getFormErrors(): any {
    const errors: any = {};
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      if (control?.errors) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }

  // ✅ REMOVED ALERT METHODS - Now using ToastService

  // Helper methods for template
  isFieldValid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return field ? field.touched && field.valid : false;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return field ? field.touched && field.invalid : false;
  }

  hasFieldError(fieldName: string, errorType?: string): boolean {
    const field = this.registerForm.get(fieldName);
    if (!field) return false;

    if (errorType) {
      return field.touched && !!field.errors?.[errorType];
    } else {
      return field.touched && field.invalid;
    }
  }

  getFieldErrorMessage(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (!field?.touched || !field.errors) return '';

    const errors = field.errors;

    if (errors['required']) return 'This field is required';
    if (errors['minlength']) return `Minimum ${errors['minlength'].requiredLength} characters required`;
    if (errors['pattern']) return 'Invalid format';
    if (errors['email']) return 'Please enter a valid email address';
    if (errors['duplicate']) return 'This value is already registered';
    if (errors['invalid']) return 'This value is invalid';

    return 'Please check this field';
  }

  getFormData(): any {
    return {
      formValue: this.registerForm.value,
      formValid: this.registerForm.valid,
      formErrors: this.getFormErrors(),
      userDto: this.prepareUserDto(),
      apiEndpoint: 'POST http://localhost:1111/v1/user-auth/register',
    };
  }
}