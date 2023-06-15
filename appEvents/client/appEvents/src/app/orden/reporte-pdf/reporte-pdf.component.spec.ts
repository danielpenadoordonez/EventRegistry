import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportePdfComponent } from './reporte-pdf.component';

describe('ReportePdfComponent', () => {
  let component: ReportePdfComponent;
  let fixture: ComponentFixture<ReportePdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportePdfComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportePdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
