import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/services';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-forget',
  templateUrl: './forget.component.html',
  styleUrls: ['./forget.component.css'],
})
export class ForgetComponent implements OnInit {
  email!: string;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {}

  submit() {
    this.userService.ResendOTP(this.email).subscribe(
      (res) => {
        Swal.fire({
          icon: 'success',
          title: 'OTP sent Successfully to registered email address',
          showConfirmButton: false,
          timer: 1500,
        });
        this.router.navigate([`/auth/otp/${this.email}/2`]);
        this.email = '';
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
