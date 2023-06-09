import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventoRoutingModule } from './evento-routing.module';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { FormEventoComponent } from './form-evento/form-evento.component';
import { EventoAllComponent } from './evento-all/evento-all.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import {MatDividerModule} from '@angular/material/divider'; 
import {MatDialogModule} from "@angular/material/dialog";
import { EventoIndexComponent } from './evento-index/evento-index.component';
import { EventoDetailComponent } from './evento-detail/evento-detail.component';
import { ReportePdfComponent } from './reporte-pdf/reporte-pdf.component';
import { FormPadronComponent } from './form-padron/form-padron.component';


@NgModule({
  declarations: [
    FormEventoComponent,
    EventoAllComponent,
    EventoIndexComponent,
    EventoDetailComponent,
    ReportePdfComponent,
    FormPadronComponent
  ],
  imports: [
    CommonModule,
    EventoRoutingModule,
    MatGridListModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDividerModule,
    MatDialogModule
  ]
})
export class EventoModule { }
