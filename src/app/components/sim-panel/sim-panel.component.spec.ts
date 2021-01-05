import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimPanelComponent } from './sim-panel.component';

describe('SimPanelComponent', () => {
  let component: SimPanelComponent;
  let fixture: ComponentFixture<SimPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
