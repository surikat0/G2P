import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleTorneoDieciseisavosComponent } from './detalle-torneo-dieciseisavos.component';

describe('DetalleTorneoDieciseisavosComponent', () => {
  let component: DetalleTorneoDieciseisavosComponent;
  let fixture: ComponentFixture<DetalleTorneoDieciseisavosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleTorneoDieciseisavosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleTorneoDieciseisavosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
