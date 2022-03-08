import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/core/services';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css'],
})
export class ResetComponent implements OnInit {
  email!: string;
  passwordRestToken!: string;
  password!: string;
  confirmPassword!: string;
  resetForm: any;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.email = params['email'];
    });
    this.route.queryParams.subscribe((params) => {
      this.passwordRestToken = params['passwordRestToken'];
    });

    this.resetForm = this.fb.group({
      confirmPassword: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  submit() {
    if (
      this.resetForm.get('password').value ===
      this.resetForm.get('confirmPassword').value
    ) {
      this.userService
        .ResetPassword(
          this.email,
          this.resetForm.get('password').value,
          this.passwordRestToken
        )
        .subscribe(
          (res) => {
            Swal.fire({
              icon: 'success',
              title: 'Password Reset',
              showConfirmButton: false,
              timer: 1500,
            });
            this.router.navigate([`/auth`]);
          },
          (err) => {
            Swal.fire({
              title: 'Error!',
              text: err.message,
              icon: 'error',
              confirmButtonText: 'Go Back',
            });
          }
        );
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'Password and Confirm Password Not Matched',
        icon: 'error',
        confirmButtonText: 'Go Back',
        confirmButtonColor: '#4b5c6b',
      });
      return;
    }
  }
}
