import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MiembroRoutingModule } from './miembro-routing.module';
import { FormMemberComponent } from './form-member/form-member.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDividerModule } from '@angular/material/divider';
import { ReportePdfComponent } from './reporte-pdf/reporte-pdf.component';
import { MiembroAllComponent } from './miembro-all/miembro-all.component';


@NgModule({
  declarations: [
    FormMemberComponent,
    ReportePdfComponent,
    MiembroAllComponent
  ],
  imports: [
    CommonModule,
    MiembroRoutingModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDividerModule,
    ReactiveFormsModule
  ]
})
export class MiembroModule { }
