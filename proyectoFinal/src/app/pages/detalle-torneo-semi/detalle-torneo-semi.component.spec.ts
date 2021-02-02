import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleTorneoSemiComponent } from './detalle-torneo-semi.component';

describe('DetalleTorneoSemiComponent', () => {
  let component: DetalleTorneoSemiComponent;
  let fixture: ComponentFixture<DetalleTorneoSemiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleTorneoSemiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleTorneoSemiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
