import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericService } from 'src/app/share/generic.service';
import { NotificacionService, TipoMessage } from 'src/app/share/notification.service';
import { AppearanceAnimation, ConfirmBoxInitializer, DialogLayoutDisplay, DisappearanceAnimation } from '@costlydeveloper/ngx-awesome-popup';
import { AuthenticationService } from 'src/app/share/authentication.service';

@Component({
  selector: 'app-evento-all',
  templateUrl: './evento-all.component.html',
  styleUrls: ['./evento-all.component.css']
})

export class EventoAllComponent implements AfterViewInit {
  datos: any; //* Data del API GET
  respBox: any; //* Data de la respuesta del confirm box
  isAutenticated: boolean; //* Estado auténticado
  currentUser: any; //* Usuario logeado
  isConfirmBoxActive: boolean = false; //* Sirve para manejar que no abuse de las confirm boxes
  destroy$: Subject<boolean> = new Subject<boolean>(); //* Destructor de tipo subject
  @ViewChild(MatPaginator) paginator!: MatPaginator; //* Páginación con Mat
  @ViewChild(MatSort) sort!: MatSort; //* MatSort para ordenar la tabla
  dataSource = new MatTableDataSource<any>();

  //* Columnas para la tabla
  displayedColumns = ['nombre', "fecha", "estado", "padron", "reporte", "cierre"];

  constructor(private router: Router,
    private route: ActivatedRoute, private gService: GenericService,
    private notificacion: NotificacionService, private location: Location, private authService: AuthenticationService,) {
  }

  ngOnInit(): void {
    //* Variables del params
    let isCreate: any = false;
    let nombreEvento: string = '';

    //* Encargado de notificar un update
    isCreate = this.route.snapshot.queryParams['create'] === 'true' || false;
    nombreEvento = this.route.snapshot.queryParams['nombre'] || ' ';
    if (isCreate) {
      this.notificacion.mensaje(
        `Evento`,
        `¡Se ha creado el evento: ${nombreEvento}!`,
        TipoMessage.success
      );
    }
    //* Cargamos al usuario
    this.loadUser();
  }

  ngAfterViewInit(): void {
    this.listaEventos();
  }

  //* Carga la lista de eventos desde el API e inicializa los data source
  listaEventos(): void {
    this.gService
      .list('get-events')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        //* Filtramos & asignamos en función del rol
        if (this.currentUser.user.profile === 'Administrador' && this.isAutenticated) {
          this.datos = data.events;
        } else if (this.isAutenticated) {
          this.datos = data.events.filter((x: any) => x.usuario == this.currentUser.user.id);
        }
        //* Ordenamos la data por fecha
        this.datos = this.datos.sort((a: any, b: any) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
        console.log(this.datos)
        //* Establecemos la data al data source
        this.dataSource = new MatTableDataSource(this.datos);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
  }

  //* A la hora de destruir el observable [Angular]
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  //* Crear video juego y redirigir
  crearEvento(): void {
    this.router.navigate(['/evento/create'], {
      relativeTo: this.route,
    });
  }

  //? Se puede hacer siempre y cuando el evento esté abierto
  //* Sirve para registrar la asistencia
  editarPadron(idEvent: number, nombreEvent: string): void {
    //* params, no queryparams
    this.router.navigate(['/member/all-padron/', idEvent], {
      relativeTo: this.route,
      queryParams: {
        padron: 'true',
        nombre: `${nombreEvent}`
      }
    });
  }

  //* Generar reporte del evento
  generarReporte(idEvent: number, nombreEvento: string): void {
    this.router.navigate(['/member/reportePdf/', idEvent], {
      relativeTo: this.route, queryParams: {
        name: nombreEvento
      }
    });
  }

  //* Cerrar evento, llama a un API que actualiza el estado del evento
  cerrarEvento(idEvent: number, nombreEvento: string, descripcion: string, fecha: Date): void {
    const api_data: any = { //* Constante con toda la data necesaria para el api
      id: idEvent,
      id_usuario: this.currentUser.user.id,
      nombre: nombreEvento,
      descripcion: descripcion,
      fecha: fecha,
      abierto: 0 //! IMPORTANTE PUESTO QUE SE CIERRA
    };
    this.gService.update('update-event?event_id=', api_data).pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
      //* Obtener la data
      this.notificacion.mensaje(
        'Evento - Info',
        `Se ha cerrado exitosamente el evento: ${nombreEvento}`,
        TipoMessage.success
      );
    });
    this.refreshData(); //* Necesario para refrescar la página
  }

  //* Desplegar el confirmbox para saber si quiere o no cerrar el evento
  confirmBoxCerrarEvento(id: any, nombre: string, descripcion : string, fecha : Date): void {
    if (!this.isConfirmBoxActive) {
      this.isConfirmBoxActive = !this.isConfirmBoxActive; //* Cambiamos el estado

      //* Declaramos las propiedades del confirm box
      const confirmBox = new ConfirmBoxInitializer();

      confirmBox.setTitle('¿Desea cerrar el evento?');

      confirmBox.setMessage(`¡Confirme para cerrar el evento ${nombre}!!`);

      confirmBox.setButtonLabels('Sí', 'No');


      //* Elegimos el diseño del confirm box
      confirmBox.setConfig({
        layoutType: DialogLayoutDisplay.INFO, // SUCCESS | INFO | NONE | DANGER | WARNING
        animationIn: AppearanceAnimation.BOUNCE_IN,
        animationOut: DisappearanceAnimation.BOUNCE_OUT
      });

      //* Llamamos al confirm box
      confirmBox.openConfirmBox$().subscribe(resp => {
        this.isConfirmBoxActive = !this.isConfirmBoxActive; //* Cambiamos de nuevo
        if (resp.success) {
          //* Método encargado de cerrar el evento
          this.cerrarEvento(id, nombre, descripcion, fecha);
        } else {
          this.notificacion.mensaje(
            'Evento',
            'Operación cancelada',
            TipoMessage.info
          );
        }
      });
    }
  }

  //! WARNING, POR ALGÚN MOTIVO EL GET DATE RESTA 1 DÍA A LAS FECHAS CON FORMATO yyyy-MM-dd

  //* Método encargado de permitir o no generar el pdf
  isReportAvailable(fecha: any): boolean {
    let validadora: boolean = true;
    let fechaActual: Date = new Date();
    let fechaEvento: Date = new Date(fecha);
    validadora = (fechaActual.getTime() >= this.addDays(fechaEvento, 1).getTime()); //* >= o sea incluye el mismo día y los anteriores o está cerrado

    return !validadora; //* Se invierte el valor al ser un disabled
  }

  isCierreAvailabe(abierto: boolean, fecha: any): boolean {
    let validadora: boolean = true;
    let fechaActual: Date = new Date();
    let fechaEvento: Date = new Date(fecha);
    validadora = (fechaActual.getMonth() == this.addDays(fechaEvento, 1).getMonth() ? (fechaActual.getDate() > this.addDays(fechaEvento, 1).getDate()) :
    (fechaActual.getTime() > this.addDays(fechaEvento, 1).getTime())) && abierto;
    //* Es mayor o sea ya pasó

    return !validadora;
  }

  //* Validación sobre el padrón
  //? Solamente disponible si es el mismo día
  isPadronAvailable(abierto: boolean, fecha: any): boolean {
    let validadora: boolean = true; //* Inicializamos en false la variable o sea debería estar bien
    let fechaActual: Date = new Date();
    let fechaEvento: Date = new Date(fecha);
    //validadora = (fechaActual.getDate() <= this.addDays(fechaEvento, 1).getDate());
      //! la fecha actual es menor o igual a la del día del evento - Removido

    validadora = (fechaActual.getMonth() == fechaEvento.getMonth() && fechaActual.getDate() == this.addDays(fechaEvento, 1).getDate() && abierto);
    //? Solamente si es el mismo día

    return !validadora;
  }

  //* Método encargado de sumar o restar días a una fecha, ya dependerá de como se use
  addDays = (fecha: Date, dias: number): Date => {
    const fechaModificada = new Date(fecha);
    fechaModificada.setDate(fechaModificada.getDate() + dias);
    return fechaModificada;
  }

  //* Método para cargar la data del usuario
  loadUser = (): void => {
    //* Subscripción a la información del usuario actual
    this.authService.currentUser.subscribe((x) => (this.currentUser = x));

    //* Subscripción al booleano que indica si esta autenticado
    this.authService.isAuthenticated.subscribe(
      (valor) => (this.isAutenticated = valor)
    );
  }

  //* Método encargado de refrescar la Data
  refreshData(): void {
    window.location.reload();
  }

}
