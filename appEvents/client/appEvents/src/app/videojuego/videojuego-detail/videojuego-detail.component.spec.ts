import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideojuegoDetailComponent } from './videojuego-detail.component';

describe('VideojuegoDetailComponent', () => {
  let component: VideojuegoDetailComponent;
  let fixture: ComponentFixture<VideojuegoDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideojuegoDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideojuegoDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
