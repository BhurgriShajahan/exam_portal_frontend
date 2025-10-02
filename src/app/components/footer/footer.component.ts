import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  navItems = [
    { label: 'Home', path: '/home' },
    { label: 'Projects', path: '/#projects' },
    { label: 'Contact', path: '/#contact' }
  ];
}
