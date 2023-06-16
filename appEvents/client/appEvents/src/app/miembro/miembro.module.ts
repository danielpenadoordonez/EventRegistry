import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MiembroRoutingModule } from './miembro-routing.module';
import { FormMemberComponent } from './form-member/form-member.component';
import { ReportePdfComponent } from './reporte-pdf/reporte-pdf.component';
import { MiembroAllComponent } from './miembro-all/miembro-all.component';
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
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {
  ConfirmBoxConfigModule,
  DialogConfigModule,
  NgxAwesomePopupModule,
  ToastNotificationConfigModule,
} from '@costlydeveloper/ngx-awesome-popup';


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
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxAwesomePopupModule.forRoot({
      colorList: {
        success: '#3caea3',
        info: '#2f8ee5',
        warning: '#ffc107',
        danger: '#e46464',
        customOne: '#3ebb1a',
        customTwo: '#bd47fa',
      },
    }),
    DialogConfigModule.forRoot(),
    ConfirmBoxConfigModule.forRoot({
      confirmBoxCoreConfig: {
        width: '50%',
        height: '50%',
        buttonPosition: 'right',
        dispatch: {
          title: 'Default title',
          message: 'Default message'
        },
        confirmLabel: 'Confirm',
        declineLabel: 'Decline',
        disableIcon: true,
        allowHtmlMessage: true,
      }
    }),
    ToastNotificationConfigModule.forRoot()
  ]
})
export class MiembroModule { }
