import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { SalonServiceApiService } from '../../../core/services/salon-service-api.service';
import { ServiceDetailsComponent } from './service-details';

describe('ServiceDetailsComponent', () => {
  let component: ServiceDetailsComponent;
  let fixture: ComponentFixture<ServiceDetailsComponent>;

  const serviceApi = {
    getServiceById: vi.fn(),
  };

  beforeEach(async () => {
    serviceApi.getServiceById.mockReset();
    serviceApi.getServiceById.mockReturnValue(of({
      message: 'Salon service details fetched successfully',
      service: {
        _id: 'service-1',
        name: 'Hair Spa',
        category: 'Hair',
        description: 'Deep conditioning treatment',
        price: 1200,
        duration: 60,
        image: '',
        benefits: ['Smoothness'],
        isActive: true,
      },
    }));

    await TestBed.configureTestingModule({
      imports: [ServiceDetailsComponent],
      providers: [
        provideRouter([]),
        { provide: SalonServiceApiService, useValue: serviceApi },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => 'service-1',
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders the service returned by the API and exits loading', () => {
    expect(component.loading).toBe(false);
    expect(component.service?.name).toBe('Hair Spa');
    expect(fixture.nativeElement.textContent).toContain('Deep conditioning treatment');
    expect(fixture.nativeElement.textContent).not.toContain('Loading service details...');
  });

  it('exits loading and displays an error when the request fails', () => {
    serviceApi.getServiceById.mockReturnValue(
      throwError(() => new Error('Request failed')),
    );

    component.loadServiceDetails();
    fixture.detectChanges();

    expect(component.loading).toBe(false);
    expect(component.errorMessage).toBe('Unable to load service details.');
    expect(fixture.nativeElement.textContent).toContain('Service Not Found');
  });
});
