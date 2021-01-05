import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EfphBufferComponent } from './efph-buffer.component';

describe('EfphBufferComponent', () => {
  let component: EfphBufferComponent;
  let fixture: ComponentFixture<EfphBufferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EfphBufferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EfphBufferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
