import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dash-nav',
  templateUrl: './dash-nav.component.html',
  styleUrls: ['./dash-nav.component.scss']
})
export class DashNavComponent {
  @Input() role: string = 'employee'; // employee, manager, admin

  constructor(private router: Router) {}

  logout() {
    // এখানে logout logic দিবে পরে
    console.log('Logging out...');
    this.router.navigate(['/login']);
  }

}
