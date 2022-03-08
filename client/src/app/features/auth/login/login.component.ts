import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/services';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  loginForm!: FormGroup;
  hasErrors = false;
  errorMessage!: string;

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    this.userService.attemptAuth('login', this.loginForm.value).subscribe(
      (res) => {
        this.hasErrors = false;
        if (res.data.role === 1) this.router.navigate(['/dummy']);
        else this.router.navigate(['/dummy']);
      },
      (err) => {
        this.hasErrors = true;
        if (err.status === 401) {
          Swal.fire({
            title: 'Error!',
            text: 'Not Authorized',
            icon: 'error',
            confirmButtonText: 'Go Back',
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: err.message,
            icon: 'error',
            confirmButtonText: 'Go Back',
          });
        }
        // if (err.code === 403) {
        //   this.errorMessage =
        //     'Gebruiker is niet actief. Vraag aan Rick om je account te activeren.';
        //   Swal.fire({
        //     title: 'Foutmelding!',
        //     text: this.errorMessage,
        //     icon: 'error',
        //     confirmButtonText: 'Ga terug',
        //     confirmButtonColor: '#4b5c6b',
        //   });
        // } else
        this.errorMessage = 'Invalid credentials';
      }
    );
  }
}
