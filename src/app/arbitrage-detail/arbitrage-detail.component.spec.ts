import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArbitrageDetailComponent } from './arbitrage-detail.component';

describe('ArbitrageDetailComponent', () => {
  let component: ArbitrageDetailComponent;
  let fixture: ComponentFixture<ArbitrageDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArbitrageDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArbitrageDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
