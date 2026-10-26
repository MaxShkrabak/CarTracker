import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleStatsCard } from './vehicle-stats-card';

describe('VehicleStatsCard', () => {
  let component: VehicleStatsCard;
  let fixture: ComponentFixture<VehicleStatsCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleStatsCard],
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleStatsCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
