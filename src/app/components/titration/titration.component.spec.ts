import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitrationComponent } from './titration.component';

describe('TitrationComponent', () => {
  let component: TitrationComponent;
  let fixture: ComponentFixture<TitrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TitrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TitrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
