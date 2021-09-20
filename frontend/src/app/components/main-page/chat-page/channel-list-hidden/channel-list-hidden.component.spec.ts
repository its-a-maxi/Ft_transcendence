import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelListHiddenComponent } from './channel-list-hidden.component';

describe('ChannelListHiddenComponent', () => {
  let component: ChannelListHiddenComponent;
  let fixture: ComponentFixture<ChannelListHiddenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChannelListHiddenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelListHiddenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
