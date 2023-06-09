import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideojuegoFormComponent } from './videojuego-form.component';

describe('VideojuegoFormComponent', () => {
  let component: VideojuegoFormComponent;
  let fixture: ComponentFixture<VideojuegoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideojuegoFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideojuegoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
