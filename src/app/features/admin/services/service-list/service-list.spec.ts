import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { SalonServiceApiService } from '../../../../core/services/salon-service-api.service';
import { ServiceListComponent } from './service-list';

describe('ServiceListComponent', () => {
  let component: ServiceListComponent;
  let fixture: ComponentFixture<ServiceListComponent>;

  const serviceApi = {
    getAllServices: vi.fn(),
    deleteService: vi.fn(),
  };

  beforeEach(async () => {
    serviceApi.getAllServices.mockReset();
    serviceApi.getAllServices.mockReturnValue(of({
      message: 'Salon services fetched successfully',
      total: 1,
      services: [{
        _id: 'service-1',
        name: 'Hair Styling',
        category: 'Hair',
        description: 'Styling service',
        price: 500,
        duration: 45,
        image: '',
        benefits: [],
        isActive: true,
      }],
    }));

    await TestBed.configureTestingModule({
      imports: [ServiceListComponent],
      providers: [
        provideRouter([]),
        { provide: SalonServiceApiService, useValue: serviceApi },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders services and exits the loading state', () => {
    expect(component.loading()).toBe(false);
    expect(component.services()).toHaveLength(1);
    expect(fixture.nativeElement.textContent).toContain('Hair Styling');
    expect(fixture.nativeElement.textContent).not.toContain('Loading services...');
  });

  it('exits the loading state and displays an error when the request fails', () => {
    serviceApi.getAllServices.mockReturnValue(
      throwError(() => new Error('Request failed')),
    );

    component.loadServices();
    fixture.detectChanges();

    expect(component.loading()).toBe(false);
    expect(component.errorMessage()).toBe('Unable to load salon services.');
  });
});
