import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { SalonServiceApiService } from '../../../core/services/salon-service-api.service';
import { ServiceListComponent } from './service-list';

describe('ServiceListComponent', () => {
  let component: ServiceListComponent;
  let fixture: ComponentFixture<ServiceListComponent>;

  const serviceApi = {
    getAllServices: vi.fn(),
  };

  beforeEach(async () => {
    serviceApi.getAllServices.mockReset();
    serviceApi.getAllServices.mockReturnValue(of({
      message: 'Salon services fetched successfully',
      total: 2,
      services: [{
        _id: 'service-1',
        name: 'New Facial Service',
        category: 'Skin',
        description: 'A newly added facial treatment',
        price: 800,
        duration: 45,
        image: '',
        benefits: [],
        isActive: true,
      }, {
        _id: 'service-2',
        name: 'Bridal Makeup',
        category: 'Makeup',
        description: 'Wedding makeup',
        price: 5000,
        duration: 120,
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

  it('renders services returned by the API', () => {
    expect(component.loading()).toBe(false);
    expect(component.services()).toHaveLength(2);
    expect(fixture.nativeElement.textContent).toContain('New Facial Service');
    expect(fixture.nativeElement.textContent).toContain('Bridal Makeup');
    expect(fixture.nativeElement.textContent).not.toContain('Loading services...');
  });

  it('exits the loading state and displays an error when loading fails', () => {
    serviceApi.getAllServices.mockReturnValue(
      throwError(() => new Error('Request failed')),
    );

    component.loadServices();
    fixture.detectChanges();

    expect(component.loading()).toBe(false);
    expect(component.errorMessage()).toBe(
      'Unable to load services. Please try again later.',
    );
  });
});
