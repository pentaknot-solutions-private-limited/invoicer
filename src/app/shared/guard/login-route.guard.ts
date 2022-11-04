import { Injectable } from '@angular/core';
import { Router, CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { GlobalConfig } from 'src/app/configs/global-config';
import { EncryptedStorage } from '../utils/encrypted-storage';

@Injectable()
export class LoginRouteGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (
      new EncryptedStorage().getItem('_vsa-u', false) ||
      new EncryptedStorage().getItem('_vsa-u', true)
    ) {
      // logged in so go to dashboard
      const data = new EncryptedStorage().findItemFromAllStorage("_vsa-u")
      const userProfile = JSON.parse(data)
      if (userProfile.isAdmin) {
        this.router.navigate([new GlobalConfig().dashboardRoute]);
      } else {
        this.router.navigate([new GlobalConfig().dashboardUserRoute]);
      }
      return false;
    } else {
      // if not logged in
      return true;
    }
  }
}
