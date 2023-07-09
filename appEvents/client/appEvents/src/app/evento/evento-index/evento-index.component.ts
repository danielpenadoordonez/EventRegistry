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
    this.mensajes();
  }

  //* Nota: RECUERDE QUE NO ES LO MISMO PARAMS QUE QUERYPARAMS

  mensajes(): void {
    //* Variables del params
    let isUpdate: any = false;
    let nombreEvento: string = '';

    //* Encargado de notificar un update
    isUpdate = this.route.snapshot.queryParams['update'] === 'true' || false;
    nombreEvento = this.route.snapshot.queryParams['nombre'] || ' ';
    if (isUpdate) {
      this.notificacion.mensaje(
        `Evento`,
        `¡Se ha modificado el evento: ${nombreEvento}!`,
        TipoMessage.success
      );
    }
  }

  //* Cargamos una lista con los eventos
  listaEventos(): void {
    this.gSevice.list('get-events').pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        //* Filtramos & asignamos en función del rol
        if (this.currentUser.user.profile === 'Administrador' && this.isAutenticated) {
          //? Administrador puede ver todos, estén expirados o no
          this.datos = data.events;
        } else if (this.isAutenticated) {
          //? Pueden ver todos mientras no hayan expirado pá
          const currentDate = new Date(); //* Fecha de hoy
          const daysToAdd = -1; //* Le restamos uno, ya que va 1 día atrás y ocupamos emparejar

          currentDate.setDate(currentDate.getDate() + daysToAdd);
          this.datos = data.events.filter((event: any) => new Date(event.fecha) >= currentDate);
        }
        //* Ordenamos la data
        this.datos = this.datos.sort((a: any, b: any) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
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

  //* Método encargado de válidar si se puede editar o no un evento
  //* Recibe la fecha desde el front y el abierto, que es boolean por venir del api
  isEditAvailable = (fecha: string, abierto: boolean, idUser: number): boolean => {
    let validadora: boolean = false; //* Variable encargada de válidar, empieza en false por seguridad
    //? Va a ser editable, antes del día del evento, a partir de ese día y posteriores ya no lo será
    let fechaActual: Date = new Date();
    //* OJO, RECUERDE QUE JS SIEMPRE RESTA 1 DÍA A LAS FECHAS QUE VIENEN POR STRING
    let fechaEvento: Date = new Date(fecha);

    const daysToAdd = 1; //* Fijamos el número de días a añadir

    fechaEvento.setDate(fechaEvento.getDate() + daysToAdd); //* Añadimos los días

    //* Si es admin pasa por aquí directamente o que el id del usuario sea el mismo y entonces, puede editar
    if (this.currentUser.user.profile === 'Administrador' || idUser === this.currentUser.user.id) {
      //* Muy importante que esté abierto, en caso de estarlo retornará true
      validadora = ((fechaActual.getMonth() == fechaEvento.getMonth() ? fechaEvento.getDate() < fechaActual.getDate() :
        fechaEvento.getTime() < fechaActual.getTime()) && abierto);
    }

    return validadora;
  }

}
