import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { GenericService } from 'src/app/share/generic.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CartService } from 'src/app/share/cart.service';
import { NotificacionService, TipoMessage } from 'src/app/share/notification.service';
import { EventoDetailComponent } from '../evento-detail/evento-detail.component';
import { AuthenticationService } from 'src/app/share/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-evento-index',
  templateUrl: './evento-index.component.html',
  styleUrls: ['./evento-index.component.css']
})
export class EventoIndexComponent implements OnInit {
  datos: any; //* Data de la lista de usuarios
  destroy$: Subject<boolean> = new Subject<boolean>(); //* Controlador de APIs
  isAutenticated: boolean; //* Está o no autenticado
  currentUser: any; //* Usuario actual

  constructor(
    private gSevice: GenericService,
    private dialog: MatDialog,
    private notificacion: NotificacionService,
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.listaEventos();
  }

  ngOnInit() {
    //* Subscripción a la información del usuario actual
    this.authService.currentUser.subscribe((x) => (this.currentUser = x));
    //? Este mismo será necesario para válidar en el HTML

    //* Subscripción al booleano que indica si esta autenticado
    this.authService.isAuthenticated.subscribe(
      (valor) => (this.isAutenticated = valor)
    );

    //! Si no se encuentra autenticado sacar con un router, ejemplo de seguridad en orden y header
  }

  //* Cargamos una lista con los eventos
  listaEventos() {
    this.gSevice.list('get-events').pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        console.log(data);
        this.datos = data;
      });
  }

  //* Cargamos el detalle del evento mediante el click en el html
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
    //* Recuerde que en el formulario es tanto para create como update pá
  }

}
