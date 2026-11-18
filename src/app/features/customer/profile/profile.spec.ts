import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { ProfileComponent } from './profile';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  const authService = {
    getCachedUser: vi.fn(),
    getProfile: vi.fn(),
    logout: vi.fn(),
  };

  beforeEach(async () => {
    authService.getCachedUser.mockReset();
    authService.getCachedUser.mockReturnValue(null);
    authService.getProfile.mockReset();
    authService.getProfile.mockReturnValue(of({
      message: 'Profile fetched successfully',
      user: {
        id: 'user-id',
        fullName: 'Nancy Beauty',
        email: 'nancy@example.com',
        mobile: '1234567890',
        role: 'customer',
      },
    }));

    await TestBed.configureTestingModule({
      imports: [ProfileComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: { navigate: vi.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('loads the user from the profile response and stops showing the loading state', () => {
    expect(component.profile?.fullName).toBe('Nancy Beauty');
    expect(component.loading).toBe(false);
    expect(fixture.nativeElement.textContent).toContain('Nancy Beauty');
    expect(fixture.nativeElement.textContent).not.toContain('Loading profile...');
  });

  it('keeps the cached profile visible when the refresh request fails', () => {
    const cachedUser = {
      id: 'cached-id',
      fullName: 'Saved User',
      email: 'saved@example.com',
      mobile: '1234567890',
      role: 'customer',
    };
    authService.getCachedUser.mockReturnValue(cachedUser);
    authService.getProfile.mockReturnValue(
      throwError(() => new Error('Profile refresh failed')),
    );

    fixture.destroy();
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.profile?.fullName).toBe('Saved User');
    expect(component.loading).toBe(false);
    expect(component.errorMessage).toContain('Showing saved profile');
    expect(fixture.nativeElement.textContent).toContain('Saved User');
    expect(fixture.nativeElement.textContent).not.toContain('Loading profile...');
  });
});
