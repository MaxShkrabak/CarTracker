import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleAdd } from './vehicle-add';

describe('VehicleAdd', () => {
  let component: VehicleAdd;
  let fixture: ComponentFixture<VehicleAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleAdd],
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleAdd);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
