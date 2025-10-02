import { Component, OnInit, HostListener, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isDarkMode = false;
  mobileMenuOpen = false;
  screenWidth = 0;
  private routerSubscription: any;
  private isBrowser: boolean;

  navItems: NavItem[] = [
    { path: '/home', label: 'Dashboard', icon: 'home' },
    { path: '/about', label: 'About', icon: 'info' },
    { path: '/login', label: 'Login', icon: 'log-in' },
    { path: '/register', label: 'Register', icon: 'user-plus' }
  ];


  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.screenWidth = window.innerWidth;
      this.checkTheme();
      this.applyTheme();

      // Close mobile menu on route change
      this.routerSubscription = this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(() => {
          this.closeMenu();
        });
    }
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    if (this.isBrowser) {
      this.screenWidth = (event.target as Window).innerWidth;
      if (this.screenWidth >= 768 && this.mobileMenuOpen) {
        this.closeMenu();
      }
    }
  }

  @HostListener('window:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent): void {
    if (this.mobileMenuOpen) {
      this.closeMenu();
    }
  }

  checkTheme(): void {
    if (!this.isBrowser) return;

    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.isDarkMode = savedTheme ? savedTheme === 'dark' : systemPrefersDark;
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    if (this.isBrowser) {
      localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    }
    this.applyTheme();
  }

  applyTheme(): void {
    if (!this.isBrowser) return;

    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  toggleMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    if (this.isBrowser) {
      document.body.style.overflow = this.mobileMenuOpen ? 'hidden' : 'auto';
    }
  }

  closeMenu(): void {
    this.mobileMenuOpen = false;
    if (this.isBrowser) {
      document.body.style.overflow = 'auto';
    }
  }

  onNavigate(): void {
    if (this.screenWidth < 768) {
      this.closeMenu();
    }
  }

  // Prevent body scroll when mobile menu is open
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    if (this.mobileMenuOpen && this.isBrowser) {
      window.scrollTo(0, 0);
    }
  }
}