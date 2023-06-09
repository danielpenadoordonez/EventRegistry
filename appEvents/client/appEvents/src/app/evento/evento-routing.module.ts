import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormEventoComponent } from './form-evento/form-evento.component';
import { EventoAllComponent } from './evento-all/evento-all.component';
import { EventoIndexComponent } from './evento-index/evento-index.component';
import { EventoDetailComponent } from './evento-detail/evento-detail.component';
import { ReportePdfComponent } from './reporte-pdf/reporte-pdf.component';
import { FormPadronComponent } from './form-padron/form-padron.component';

const routes: Routes = [
  //! Respetar orden de las rutas - WARNING
  {
    path: 'evento',
    component: EventoIndexComponent
    /* 
     ? Seguridad próximamente
    * canActivate: [AuthGuard],
     * data: {
     *   roles: ['ADMIN'],
     * },
    */
  },
  {
    path: 'evento/all',
    component: EventoAllComponent
  },
  {
    path: 'evento/create',
    component: FormEventoComponent
  },
  {
    path: 'evento/id',
    component: EventoDetailComponent
  },
  {
    path: 'evento/update/:id',
    component: FormEventoComponent
  },
  {
    path: 'evento/update-padron/:id',
    component: FormPadronComponent
  },
  {
    path: 'evento/reportePDF/:id',
    component: ReportePdfComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class EventoRoutingModule { }


