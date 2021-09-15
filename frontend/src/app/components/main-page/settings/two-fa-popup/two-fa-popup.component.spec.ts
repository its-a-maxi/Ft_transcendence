import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoFaPopupComponent } from './two-fa-popup.component';

describe('TwoFaPopupComponent', () => {
  let component: TwoFaPopupComponent;
  let fixture: ComponentFixture<TwoFaPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TwoFaPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TwoFaPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
