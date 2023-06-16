import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthenticationService } from 'src/app/share/authentication.service';
import { GenericService } from 'src/app/share/generic.service';
import { NotificacionService, TipoMessage } from 'src/app/share/notification.service';
import { AppearanceAnimation, ConfirmBoxInitializer, DialogLayoutDisplay, DisappearanceAnimation } from '@costlydeveloper/ngx-awesome-popup';

@Component({
  selector: 'app-miembro-all',
  templateUrl: './miembro-all.component.html',
  styleUrls: ['./miembro-all.component.css']
})
export class MiembroAllComponent implements OnInit {

  datos: any; //* Data recibida del API
  isConfirmBoxActive: boolean = false; //* Manejo de ventanas activas
  idEvent: any; //* Id del evento recibido con params
  eventName: string; //* Propiedad encargada de guardar el nombre del evento
  isAutenticated: boolean; //* Variable encargada de marcar si el usuario está autenticado o no
  currentUser: any; //* Información del usuario actual
  destroy$: Subject<boolean> = new Subject<boolean>(); //* Encargado de destruir las suscripciones
  @ViewChild(MatPaginator) paginator!: MatPaginator; //* Encargado del paginador
  @ViewChild(MatSort) sort!: MatSort; //* Encargado de ordenar

  dataSource = new MatTableDataSource<any>();

  displayedColumns = ['id', 'nombreCompleto', "numeroCedula", "estatus1", "correo", "telefono", "confirmado", "presente", "accion"];
  // id INT NOT NULL, 
  // NombreCompleto VARCHAR(250)  NOT NULL, 
  // NumeroCedula VARCHAR(15) UNIQUE NOT NULL, 
  // Estatus1 BIT DEFAULT 0 NOT NULL,  -- Activo o Inactivo
  // Correo VARCHAR(100)  NOT NULL, 
  // Telefono VARCHAR(50)  NOT NULL
  // Presente BIT -- N : M

  constructor(private router: Router,
    private route: ActivatedRoute, private gService: GenericService, private notificacion: NotificacionService,
    private authService: AuthenticationService) {
  } //* Constructor vacío

  //* Método encargado de cargar el id event 
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.idEvent = params['id'] || ' ';
    });
  }

  //* Método encargado de notificar
  notification(valor: boolean): void {
    //* Notificación de padrón - QueryParams
    let isLoaded: any = false;

    isLoaded = this.route.snapshot.queryParams['padron'] === 'true' || false;
    if (isLoaded && valor) {
      this.eventName = this.route.snapshot.queryParams['nombre'] || ' ';
      this.notificacion.mensaje(
        'Evento - Padrón',
        `Se ha cargado exitosamente el padrón del evento ${this.eventName}`,
        TipoMessage.info
      );
      return;
    }

    if (!valor)
      this.notificacion.mensaje(
        'Padrón - Error',
        `El evento seleccionado 
      ${this.route.snapshot.queryParams['nombre'] || ''} se encuentra cerrado o expirado`,
        TipoMessage.error
      );
  }

  //* Validación en caso de que me ingresen un evento ya cerrado

  async ngAfterViewInit(): Promise<void> {
    let valor = await this.isValidEvent();
    this.notification(valor);

    if (valor) {
      //! Quitar el comentario
      //this.listaMiembros();
      this.loadUser();
    } else
      this.onBack();

  }

  listaMiembros(): void {
    this.gService
      .get('padron/', `event_id=${this.idEvent}`) //! Cambiar aquí pá
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        console.log(data);
        this.datos = data;
        this.dataSource = new MatTableDataSource(this.datos);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
  }

  //* Método encargado de obtener la información del usuario
  loadUser(): void {
    this.authService.currentUser.subscribe((x) => (this.currentUser = x));

    this.authService.isAuthenticated.subscribe(
      (valor) => (this.isAutenticated = valor)
    );
  }

  //* Encargado de válidar
  isValidEvent(): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.gService
          .get('get-event', `event_id=${this.idEvent}`)
          .pipe(takeUntil(this.destroy$))
          .subscribe((data: any) => {
            let result: any = data;
            let currentDate: Date = new Date();
            let eventDate: Date = new Date(result.fecha);
            if (result) {
              if ((currentDate.getMonth() == eventDate.getMonth() ? currentDate.getDate() <= (eventDate.getDate() + 1)
                : currentDate.getTime() <= eventDate.getTime()) && (result.abierto)) {
                resolve(true);
              }
            }
            resolve(false);
          });
      }, 100);
    });
  }

  //* Método encargado de notificar si quiere o no marcar al miembro seleccionado como presente
  showConfirmationBox(idMemberSelected: number, status: any, name: string): void {
    if (!this.isConfirmBoxActive) {
      this.isConfirmBoxActive = !this.isConfirmBoxActive; //* Cambiamos el estado
      //* Declaramos las propiedades del confirm box
      const confirmBox = new ConfirmBoxInitializer();

      confirmBox.setTitle('¿Desea confirmar la presencia?');

      confirmBox.setMessage(`¡Confirme para marcar como presente a ${name}!!`);

      confirmBox.setButtonLabels('Sí', 'No');


      //* Elegimos el diseño del confirm box
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.INFO,
        animationIn: AppearanceAnimation.BOUNCE_IN,
        animationOut: DisappearanceAnimation.BOUNCE_OUT
      });

      //* Llamamos al confirm box
      confirmBox.openConfirmBox$().subscribe(resp => {
        //* ¿Qué hacemos?
        if (resp.success) {
          this.notificacion.mensaje(
            'Miembro - Presente',
            `El miembro ${name.toLowerCase().split(" ")[0]} se ha marcado como presente`,
            TipoMessage.success
          );
          //! QUITAR EL COMENTADO
          this.setPresente(idMemberSelected, status, name);
        } else {
          this.notificacion.mensaje(
            'Miembro - Info',
            `Se ha cancelado la acción`,
            TipoMessage.info
          );
        }
      });
    }
  }

  //* Método encargado de cambiar a presente el usuario y debe registrar quién fue
  //* el usuario que lo colocó como presente
  setPresente(idMember: number, estado: any, nombre: string): void {
    //? Si está como Inactivo no se puede marcar como presente
    //? Recuerde el botón de sí o no
    if (estado) {
      let currentDate: Date = new Date();

      //* preparamos la data para el update/put
      const response: any = {
        id_memeber: idMember,
        id_event: this.idEvent,
        id_user: this.currentUser.user.id,
        date: currentDate
      };

      //* Actualizar
      this.gService
        .update('update-member/', response) //! CAMBIAR AQUÍ
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: any) => {
          console.log(data);
        });

      //* Notificar
      this.notificacion.mensaje(
        'Padrón - Presente',
        `Se ha confirmado la asistencia del miembro ${nombre.toLowerCase().split(" ")[0]}`,
        TipoMessage.info
      );
    } else {
      //* Notificar
      this.notificacion.mensaje(
        'Padrón - Error',
        `El miembro ${nombre.toLowerCase().split(" ")[0]} se encuentra inactivo`,
        TipoMessage.error
      );
    }
  }

  //* Método encargado de redirigir para crear un miembro
  crearMiembro(): void {
    this.router.navigate(['/member/create'], {
      relativeTo: this.route,
    });
  }

  //* Método para destruir la suscripción
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  //* Función para Volver a la ventana anterior
  onBack(): void {
    this.router.navigate(['evento/all']);
  }

}
