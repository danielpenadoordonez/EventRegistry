import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventoIndexComponent } from './evento-index.component';

describe('EventoIndexComponent', () => {
  let component: EventoIndexComponent;
  let fixture: ComponentFixture<EventoIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventoIndexComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventoIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
