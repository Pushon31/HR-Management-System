import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dash-nav',
  templateUrl: './dash-nav.component.html',
  styleUrls: ['./dash-nav.component.scss']
})
export class DashNavComponent {
  @Input() role: string = 'Employee';  // <-- Input property
  username = 'John Doe';               // dummy data

  isSidebarOpen = false;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    const content = document.querySelector('.main-content');
    if (this.isSidebarOpen) {
      content?.classList.add('shifted');
    } else {
      content?.classList.remove('shifted');
    }
  }

  logout() {
    console.log('User logged out!');
  }
}
