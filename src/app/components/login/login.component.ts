import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
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

  onSubmit(): void {
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;
      console.log('Login Data:', this.loginForm.value);

      setTimeout(() => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      }, 1500);
    } else {
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }

  signInWithGoogle(): void {
    this.isLoading = true;
    console.log('Google sign in');
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['/dashboard']);
    }, 1200);
  }

  signInWithGithub(): void {
    this.isLoading = true;
    console.log('GitHub sign in');
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['/dashboard']);
    }, 1200);
  }

  signInWithLinkedIn(): void {
    this.isLoading = true;
    console.log('LinkedIn sign in');
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['/dashboard']);
    }, 1200);
  }
}