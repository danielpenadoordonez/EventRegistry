import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideojuegoIndexComponent } from './videojuego-index.component';

describe('VideojuegoIndexComponent', () => {
  let component: VideojuegoIndexComponent;
  let fixture: ComponentFixture<VideojuegoIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideojuegoIndexComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideojuegoIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
