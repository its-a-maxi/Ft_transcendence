import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserListHiddenComponent } from './user-list-hidden.component';

describe('UserListHiddenComponent', () => {
  let component: UserListHiddenComponent;
  let fixture: ComponentFixture<UserListHiddenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserListHiddenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserListHiddenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
