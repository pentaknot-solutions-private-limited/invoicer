import { Component } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'authlayout',
  templateUrl: './authlayout.component.html',
  styleUrls: ['./authlayout.component.scss']
})
export class AuthLayoutComponent {
  loading = false;
  constructor(public router: Router) {
    router.events.subscribe((event) => {
      switch (true) {
        case event instanceof NavigationStart:
          // Turn on Page Loading
          this.loading = true;
          break;
        case event instanceof NavigationError:
        case event instanceof NavigationCancel:
        case event instanceof NavigationEnd:
          // Turn off Page Loading
          this.loading = false;
          break;
        default:
          break;
      }
    })
  }
}