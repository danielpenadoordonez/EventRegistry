import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VideojuegoAllComponent } from './videojuego-all/videojuego-all.component';
import { VideojuegoDetailComponent } from './videojuego-detail/videojuego-detail.component';
import { VideojuegoFormComponent } from './videojuego-form/videojuego-form.component';
import { VideojuegoIndexComponent } from './videojuego-index/videojuego-index.component';

const routes: Routes = [
  {path:'videojuego', component: VideojuegoIndexComponent},

  {path:'videojuego/all', component: VideojuegoAllComponent},

  {path:'videojuego/create', component: VideojuegoFormComponent},

  //Ruta solo de ejemplo detalle no se utiliza en la aplicacion
  {path:'videojuego/:id', component: VideojuegoDetailComponent},

  {path:'videojuego/update/:id', component: VideojuegoFormComponent},
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VideojuegoRoutingModule { }
