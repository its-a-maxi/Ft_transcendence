import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetPasswordComponent } from './get-password.component';

describe('GetPasswordComponent', () => {
  let component: GetPasswordComponent;
  let fixture: ComponentFixture<GetPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetPasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
