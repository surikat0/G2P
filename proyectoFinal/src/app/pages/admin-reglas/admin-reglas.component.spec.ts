import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReglasComponent } from './admin-reglas.component';

describe('AdminReglasComponent', () => {
  let component: AdminReglasComponent;
  let fixture: ComponentFixture<AdminReglasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminReglasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminReglasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
