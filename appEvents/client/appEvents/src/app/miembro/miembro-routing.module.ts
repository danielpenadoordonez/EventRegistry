import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../share/guards/auth.guard';
import { MiembroAllComponent } from './miembro-all/miembro-all.component';
import { FormMemberComponent } from './form-member/form-member.component';
import { ReportePdfComponent } from './reporte-pdf/reporte-pdf.component';

const routes: Routes = [
{
  path: 'member/create',
  component: FormMemberComponent,
  canActivate: [AuthGuard],
  data: {
    roles: ['Administrador', 'Moderador', 'Miembro'],
  },
},
{
  path: 'member/all-padron/:id',
  component: MiembroAllComponent,
  canActivate: [AuthGuard],
  data: {
    roles: ['Administrador', 'Moderador', 'Miembro'],
  },
},
{
  path: 'member/reportePdf/:id',
  component: ReportePdfComponent,
  canActivate: [AuthGuard],
  data: {
    roles: ['Administrador', 'Moderador', 'Miembro'],
  },
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class MiembroRoutingModule { }
