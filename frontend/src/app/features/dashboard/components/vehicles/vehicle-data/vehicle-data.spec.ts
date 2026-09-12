import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleData } from './vehicle-data';

describe('VehicleData', () => {
  let component: VehicleData;
  let fixture: ComponentFixture<VehicleData>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleData],
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleData);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
