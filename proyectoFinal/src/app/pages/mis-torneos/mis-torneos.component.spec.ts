import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisTorneosComponent } from './mis-torneos.component';

describe('MisTorneosComponent', () => {
  let component: MisTorneosComponent;
  let fixture: ComponentFixture<MisTorneosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MisTorneosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MisTorneosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
