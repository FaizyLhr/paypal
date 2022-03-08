import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { OtpComponent } from './otp/otp.component';
import { ResetComponent } from './reset/reset.component';
import { ForgetComponent } from './forget/forget.component';
import { CoreModule } from 'src/app/core/core.module';

@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    OtpComponent,
    ResetComponent,
    ForgetComponent,
  ],
  imports: [CommonModule, AuthRoutingModule, SharedModule, CoreModule],
})
export class AuthModule {}
