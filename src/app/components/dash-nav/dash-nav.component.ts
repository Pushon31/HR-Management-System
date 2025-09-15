import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dash-nav',
  templateUrl: './dash-nav.component.html',
  styleUrls: ['./dash-nav.component.scss']
})
export class DashNavComponent {
  @Input() role: string = 'Employee'; // Input property, HTML এ pass করা হবে
  username = 'Fahim Ahmed';               // dummy username, প্রয়োজনমতো API থেকে আসবে

  isSidebarOpen = false;

  // Sidebar toggle function
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    const content = document.querySelector('.main-content');
    if (this.isSidebarOpen) {
      content?.classList.add('shifted');  // optional: sidebar open হলে main content shift
    } else {
      content?.classList.remove('shifted');
    }
  }

  // Logout function
  logout() {
    console.log(`${this.username} logged out!`);
    // এখানে API call করে redirect বা token clear করতে পারো
  }
}
