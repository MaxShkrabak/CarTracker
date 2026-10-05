import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleAddCard } from './vehicle-add-card';

describe('VehicleAddCard', () => {
  let component: VehicleAddCard;
  let fixture: ComponentFixture<VehicleAddCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleAddCard],
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleAddCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
