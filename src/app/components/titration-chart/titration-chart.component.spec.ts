import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitrationChartComponent } from './titration-chart.component';

describe('TitrationChartComponent', () => {
  let component: TitrationChartComponent;
  let fixture: ComponentFixture<TitrationChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TitrationChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TitrationChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
