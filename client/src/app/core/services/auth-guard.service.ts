import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { UserService } from '.';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // console.log('Auth gaurd', this.userService.authenticated , this.userService.getCurrentUser())
    if (!this.userService.authenticated) {
      this.router.navigate(['/auth']);
      return false;
    }
    return true;
  }
}
