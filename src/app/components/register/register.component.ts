import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
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

  // Getter for easy access in template
  get f() {
    return this.registerForm.controls;
  }

  onSubmit(): void {
    if (this.registerForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      // Simulate API call
      console.log('✅ Registration Data:', this.registerForm.value);

      setTimeout(() => {
        this.isSubmitting = false;
        // Show success message and redirect
        alert('Account created successfully!');
        this.router.navigate(['/login']);
      }, 2000);

    } else {
      // Mark all controls as touched to show errors
      Object.values(this.registerForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }

  // Helper method to check field validity
  isFieldValid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return field ? field.touched && field.valid : false;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return field ? field.touched && field.invalid : false;
  }
}