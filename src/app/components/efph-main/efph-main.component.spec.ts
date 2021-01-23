import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EfphMainComponent } from './efph-main.component';

describe('EfphBufferComponent', () => {
  let component: EfphMainComponent;
  let fixture: ComponentFixture<EfphMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EfphMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EfphMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
