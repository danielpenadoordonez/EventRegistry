import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiembroAllComponent } from './miembro-all.component';

describe('MiembroAllComponent', () => {
  let component: MiembroAllComponent;
  let fixture: ComponentFixture<MiembroAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiembroAllComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiembroAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
