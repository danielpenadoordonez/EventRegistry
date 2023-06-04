import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { InicioComponent } from './inicio/inicio.component';
import { AcercaDeComponent } from './acerca-de/acerca-de.component';

@NgModule({
  declarations: [InicioComponent, AcercaDeComponent],
  imports: [CommonModule, HomeRoutingModule],
  exports: [],
})
export class HomeModule {}
