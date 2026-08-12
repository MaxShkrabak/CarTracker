import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Obd } from './obd';

describe('Obd', () => {
  let component: Obd;
  let fixture: ComponentFixture<Obd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Obd],
    }).compileComponents();

    fixture = TestBed.createComponent(Obd);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
