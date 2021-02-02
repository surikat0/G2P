import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallePartidoComponent } from './detalle-partido.component';

describe('DetallePartidoComponent', () => {
  let component: DetallePartidoComponent;
  let fixture: ComponentFixture<DetallePartidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallePartidoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallePartidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
