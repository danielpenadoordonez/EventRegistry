import { Component } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { GenericService } from 'src/app/share/generic.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CartService } from 'src/app/share/cart.service';
import { NotificacionService, TipoMessage } from 'src/app/share/notification.service';
import { EventoDetailComponent } from '../evento-detail/evento-detail.component';

@Component({
  selector: 'app-evento-index',
  templateUrl: './evento-index.component.html',
  styleUrls: ['./evento-index.component.css']
})
export class EventoIndexComponent {
  datos: any;
  destroy$: Subject<boolean> = new Subject<boolean>();

  //! OBTENER INFO DEL USUARIO PARA VÁLIDAR
  //! Y VÁLIDAR MEDIANTE RUTA CON ROLES, CUANDO HAYA LOGIN FUNCIONAL

  constructor(
    private gSevice: GenericService,
    private dialog: MatDialog,
    private cartService: CartService,
    private notificacion: NotificacionService
  ) {
    this.listaEventos();
  }

  //* Cargamos una lista con los eventos
  listaEventos() {
    this.gSevice.list('evento/').pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        console.log(data);
        this.datos = data;
      });
  }

  detalleEvento(id: number) { //* Id númerico de evento
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.data = {
      id: id
    };
    this.dialog.open(EventoDetailComponent, dialogConfig);
  }

  //? Recuerde que esto puede desactivarse por temas de fecha y rol
  editarEvento(id: number) {

  }

}
