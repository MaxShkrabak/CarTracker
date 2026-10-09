import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleListCard } from './vehicle-list-card';

describe('VehicleListCard', () => {
  let component: VehicleListCard;
  let fixture: ComponentFixture<VehicleListCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleListCard],
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleListCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
