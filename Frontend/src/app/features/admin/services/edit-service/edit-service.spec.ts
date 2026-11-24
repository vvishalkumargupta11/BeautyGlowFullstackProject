import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { SalonServiceApiService } from '../../../../core/services/salon-service-api.service';
import { EditServiceComponent } from './edit-service';

describe('EditServiceComponent', () => {
  let component: EditServiceComponent;
  let fixture: ComponentFixture<EditServiceComponent>;

  const serviceApi = {
    getServiceById: vi.fn(),
    updateService: vi.fn(),
  };

  beforeEach(async () => {
    serviceApi.getServiceById.mockReset();
    serviceApi.getServiceById.mockReturnValue(of({
      message: 'Salon service details fetched successfully',
      service: {
        _id: 'service-1',
        name: 'Hair Styling',
        category: 'Hair',
        description: 'Styling service',
        price: 500,
        duration: 45,
        image: '',
        benefits: ['Shine'],
        isActive: true,
      },
    }));

    await TestBed.configureTestingModule({
      imports: [EditServiceComponent],
      providers: [
        provideRouter([]),
        {
          provide: SalonServiceApiService,
          useValue: serviceApi,
        },
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

    fixture = TestBed.createComponent(EditServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('loads service details and exits the loading state', () => {
    expect(component.loading).toBe(false);
    expect(component.serviceForm.getRawValue()).toMatchObject({
      name: 'Hair Styling',
      category: 'Hair',
      description: 'Styling service',
      price: 500,
      duration: 45,
      benefits: 'Shine',
    });
    expect(fixture.nativeElement.textContent).not.toContain('Loading service details...');
    expect(fixture.nativeElement.textContent).toContain('Service Information');
  });

  it('exits the loading state and displays an error when loading fails', () => {
    serviceApi.getServiceById.mockReturnValue(
      throwError(() => ({ error: { message: 'Service not found' } })),
    );

    component.loadService();
    fixture.detectChanges();

    expect(component.loading).toBe(false);
    expect(component.errorMessage).toBe('Service not found');
    expect(fixture.nativeElement.textContent).not.toContain('Loading service details...');
    expect(fixture.nativeElement.textContent).toContain('Service not found');
  });
});
