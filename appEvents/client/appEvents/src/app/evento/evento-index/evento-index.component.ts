import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { GenericService } from 'src/app/share/generic.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NotificacionService, TipoMessage } from 'src/app/share/notification.service';
import { EventoDetailComponent } from '../evento-detail/evento-detail.component';
import { AuthenticationService } from 'src/app/share/authentication.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

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
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.listaEventos();
  }

  ngOnInit(): void {
    //! Si no se encuentra autenticado sacar con un router, ejemplo de seguridad en orden y header
    this.loadUser();

    //* Encargado de notificar un update
    this.route.params.subscribe((params: Params) => {
      const isUpdate = params['update'];
      if (isUpdate != undefined && isUpdate != null) {
        const nombreEvento = params['nombre'];
        this.notificacion.mensaje(
          `Evento`,
          `¡Se ha modificado el evento: ${nombreEvento}!`,
          TipoMessage.success
        );
      }
    });
  }

  //* Cargamos una lista con los eventos
  listaEventos(): void {
    this.gSevice.list('get-events').pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        //* Ordenamos la data
        this.datos = data.events.sort((a: any, b: any) => a.fecha.getTime - b.fecha.getTime);
      });
  }

  //* Cargamos el detalle del evento mediante el click en el html
  detalleEvento(id: number): void { //* Id númerico de evento
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.data = {
      id: id
    };
    this.dialog.open(EventoDetailComponent, dialogConfig);
  }

  //* Editar un evento por su id y redigir
  editarEvento(id: number): void {
    this.router.navigate(['/evento/update', id], {
      relativeTo: this.route,
    });
  }

  //* Método encargado de cargar la data del usuario
  loadUser(): void {
    //* Subscripción a la información del usuario actual
    this.authService.currentUser.subscribe((x) => (this.currentUser = x));
    //? Este mismo será necesario para válidar en el HTML

    //* Subscripción al booleano que indica si esta autenticado
    this.authService.isAuthenticated.subscribe(
      (valor) => (this.isAutenticated = valor)
    );
  }

}
