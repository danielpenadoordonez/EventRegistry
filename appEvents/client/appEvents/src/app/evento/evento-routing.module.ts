import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormEventoComponent } from './form-evento/form-evento.component';
import { EventoAllComponent } from './evento-all/evento-all.component';
import { EventoIndexComponent } from './evento-index/evento-index.component';
import { EventoDetailComponent } from './evento-detail/evento-detail.component';
import { AuthGuard } from '../share/guards/auth.guard';

const routes: Routes = [
  //! Respetar orden de las rutas - WARNING
  {
    path: 'evento',
    component: EventoIndexComponent,
    canActivate: [AuthGuard],
    data: {
      roles: ['Administrador', 'Moderador', 'Miembro'],
    },
  },
  {
    path: 'evento/',
    component: EventoIndexComponent,
    canActivate: [AuthGuard],
    data: {
      roles: ['Administrador', 'Moderador', 'Miembro'],
    }
  },
  {
    path: 'evento/all',
    component: EventoAllComponent,
    canActivate: [AuthGuard],
    data: {
      roles: ['Administrador', 'Moderador', 'Miembro'],
    }
  },
  {
    path: 'evento/create',
    component: FormEventoComponent,
    canActivate: [AuthGuard],
    data: {
      roles: ['Administrador', 'Moderador', 'Miembro'],
    }
  },
  {
    path: 'evento/id',
    component: EventoDetailComponent,
    canActivate: [AuthGuard],
    data: {
      roles: ['Administrador', 'Moderador', 'Miembro'],
    }
  },
  {
    path: 'evento/update/:id',
    component: FormEventoComponent,
    canActivate: [AuthGuard],
    data: {
      roles: ['Administrador'],
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class EventoRoutingModule { }


