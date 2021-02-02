import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleTorneoOctavosComponent } from './detalle-torneo-octavos.component';

describe('DetalleTorneoOctavosComponent', () => {
  let component: DetalleTorneoOctavosComponent;
  let fixture: ComponentFixture<DetalleTorneoOctavosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleTorneoOctavosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleTorneoOctavosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
