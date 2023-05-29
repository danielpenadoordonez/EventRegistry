import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../share/guards/auth.guard';
import { OrdenIndexComponent } from './orden-index/orden-index.component';
import { ReporteGraficoComponent } from './reporte-grafico/reporte-grafico.component';
import { ReportePDFComponent } from './reporte-pdf/reporte-pdf.component';

const routes: Routes = [
  {
    path: 'orden',
    component: OrdenIndexComponent,
    canActivate: [AuthGuard],
    data: {
      roles: ['ADMIN'],
    },
  },
  {
    path: 'orden/rGrafico',
    component: ReporteGraficoComponent,
  },
  {
    path: 'orden/rPDF',
    component: ReportePDFComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdenRoutingModule {}
