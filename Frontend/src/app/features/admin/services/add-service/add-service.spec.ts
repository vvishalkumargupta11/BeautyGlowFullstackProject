import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SalonServiceApiService } from '../../../../core/services/salon-service-api.service';
import { AddServiceComponent } from './add-service';

describe('AddServiceComponent', () => {
  let component: AddServiceComponent;
  let fixture: ComponentFixture<AddServiceComponent>;

  const serviceApi = {
    createService: vi.fn(),
    uploadServiceImage: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddServiceComponent],
      providers: [
        provideRouter([]),
        { provide: SalonServiceApiService, useValue: serviceApi },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders the service image upload control', () => {
    const fileInput = fixture.nativeElement.querySelector(
      '#serviceImage',
    ) as HTMLInputElement | null;

    expect(fileInput).not.toBeNull();
    expect(fixture.nativeElement.textContent).toContain('Service Image');
    expect(fixture.nativeElement.textContent).toContain('Supported formats');
  });
});
