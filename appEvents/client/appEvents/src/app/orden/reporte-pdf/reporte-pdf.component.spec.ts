import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportePDFComponent } from './reporte-pdf.component';

describe('ReportePDFComponent', () => {
  let component: ReportePDFComponent;
  let fixture: ComponentFixture<ReportePDFComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportePDFComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportePDFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
