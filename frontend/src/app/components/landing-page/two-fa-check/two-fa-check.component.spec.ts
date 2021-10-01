import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoFaCheckComponent } from './two-fa-check.component';

describe('TwoFaCheckComponent', () => {
  let component: TwoFaCheckComponent;
  let fixture: ComponentFixture<TwoFaCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TwoFaCheckComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TwoFaCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
