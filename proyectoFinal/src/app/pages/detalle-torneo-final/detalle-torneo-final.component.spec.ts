import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleTorneoFinalComponent } from './detalle-torneo-final.component';

describe('DetalleTorneoFinalComponent', () => {
  let component: DetalleTorneoFinalComponent;
  let fixture: ComponentFixture<DetalleTorneoFinalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleTorneoFinalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleTorneoFinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
