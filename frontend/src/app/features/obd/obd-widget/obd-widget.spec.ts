import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObdWidget } from './obd-widget';

describe('ObdWidget', () => {
  let component: ObdWidget;
  let fixture: ComponentFixture<ObdWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObdWidget],
    }).compileComponents();

    fixture = TestBed.createComponent(ObdWidget);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
