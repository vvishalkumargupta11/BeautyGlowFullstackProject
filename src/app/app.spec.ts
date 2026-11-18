import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { App } from './app';

describe('App', () => {
  let fixture: ComponentFixture<App>;
  const authenticated = signal(false);
  const cachedUser = signal<{ role: string } | null>(null);
  const authService = {
    isLoggedIn: vi.fn(() => authenticated()),
    getCachedUser: vi.fn(() => cachedUser()),
    logout: vi.fn(),
  };

  beforeEach(async () => {
    authenticated.set(false);
    cachedUser.set(null);
    authService.isLoggedIn.mockClear();
    authService.getCachedUser.mockClear();

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    fixture.detectChanges();
  });

  it('switches navbar links when authentication state changes', () => {
    const navbar = fixture.nativeElement.querySelector('.site-navbar');

    expect(navbar.textContent).toContain('Login');
    expect(navbar.textContent).toContain('Register');
    expect(navbar.textContent).not.toContain('My Profile');

    authenticated.set(true);
    fixture.detectChanges();

    expect(navbar.textContent).toContain('My Profile');
    expect(navbar.textContent).toContain('Logout');
    expect(navbar.textContent).not.toContain('Login');
    expect(navbar.textContent).not.toContain('Register');
  });

  it('shows admin navigation only to logged-in admins', () => {
    authenticated.set(true);
    cachedUser.set({ role: 'admin' });
    fixture.detectChanges();

    const navbar = fixture.nativeElement.querySelector('.site-navbar');
    expect(navbar.textContent).toContain('Dashboard');
    expect(navbar.textContent).toContain('Manage Services');
    expect(navbar.textContent).toContain('Customers');
    expect(navbar.textContent).toContain('My Profile');
    expect(navbar.textContent).toContain('Logout');
    expect(navbar.querySelector('.public-nav')).toBeTruthy();
    expect(navbar.querySelector('.admin-account-nav')).toBeTruthy();

    cachedUser.set({ role: 'customer' });
    fixture.detectChanges();

    expect(navbar.textContent).not.toContain('Manage Services');
    expect(navbar.textContent).not.toContain('Customers');
  });

  it('opens and closes the responsive navigation menu', () => {
    const menu = fixture.nativeElement.querySelector('#navbarMenu');
    const toggle = fixture.nativeElement.querySelector('.navbar-toggler');

    expect(menu.classList.contains('show')).toBe(false);
    toggle.click();
    fixture.detectChanges();

    expect(menu.classList.contains('show')).toBe(true);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');

    menu.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    expect(menu.classList.contains('show')).toBe(false);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });
});
