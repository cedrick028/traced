import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingsCardComponent } from './savings-card.component';

describe('SavingsCardComponent', () => {
  let component: SavingsCardComponent;
  let fixture: ComponentFixture<SavingsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SavingsCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SavingsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
