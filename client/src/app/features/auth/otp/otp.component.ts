import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/core/services';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css'],
})
export class OtpComponent implements OnInit {
  otp: any;
  email!: string;
  flag!: number;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.email = params['email'];
      this.flag = params['flag'];
    });
  }

  onOtpChange(otp: any) {
    this.otp = otp;
  }

  submit() {
    this.userService.OTPVerify(this.email, this.otp, this.flag).subscribe(
      (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Email Verified',
          showConfirmButton: false,
          timer: 1500,
        });

        if (this.flag == 1) {
          this.router.navigate([`/auth`]);
        } else if (this.flag == 2) {
          this.router.navigate([`/auth/reset/${this.email}`], {
            queryParams: { passwordRestToken: res.data.passwordRestToken },
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: 'Params Not Valid',
            icon: 'error',
            confirmButtonText: 'Go Back',
          });
        }
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
