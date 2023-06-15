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
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from "@angular/material/dialog";
import { EventoIndexComponent } from './evento-index/evento-index.component';
import { EventoDetailComponent } from './evento-detail/evento-detail.component';
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
    FormEventoComponent,
    EventoAllComponent,
    EventoIndexComponent,
    EventoDetailComponent,
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
    MatDialogModule,
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
export class EventoModule { }
