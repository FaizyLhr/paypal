import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/services';

import Swal from 'sweetalert2';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  hasErrors = false;
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.email],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    this.userService.attemptAuth('signUp', this.signupForm.value).subscribe(
      (res) => {
        Swal.fire({
          icon: 'success',
          title:
            'SignUp successful!. We have sent an OTP sent to your email please verify your email address',
          showConfirmButton: false,
          timer: 3000,
        });
        this.signupForm.reset();
        this.router.navigate([`/auth/otp/${res.data.email}/1`]);
      },
      (err) => {
        Swal.fire({
          title: 'Error!',
          text: err.message,
          icon: 'error',
          confirmButtonText: 'Go Back',
          confirmButtonColor: '#4b5c6b',
        });
      }
    );
  }
}
