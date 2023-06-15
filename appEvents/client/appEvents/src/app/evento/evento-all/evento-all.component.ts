import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, identity, takeUntil } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GenericService } from 'src/app/share/generic.service';
import { NotificacionService, TipoMessage } from 'src/app/share/notification.service';
import { AppearanceAnimation, ConfirmBoxInitializer, DialogLayoutDisplay, DisappearanceAnimation } from '@costlydeveloper/ngx-awesome-popup';

@Component({
  selector: 'app-evento-all',
  templateUrl: './evento-all.component.html',
  styleUrls: ['./evento-all.component.css']
})

export class EventoAllComponent implements AfterViewInit {
  datos: any; //* Data del API GET
  respBox: any; //* Data de la respuesta del confirm box
  isConfirmBoxActive: boolean = false; //* Sirve para manejar que no abuse de las confirm boxes
  destroy$: Subject<boolean> = new Subject<boolean>(); //* Destructor de tipo subject
  @ViewChild(MatPaginator) paginator!: MatPaginator; //* Páginación con Mat
  @ViewChild(MatSort) sort!: MatSort; //* MatSort para ordenar la tabla
  dataSource = new MatTableDataSource<any>();

  //* Columnas para la tabla
  displayedColumns = ['nombre', "fecha", "estado", "padron", "reporte", "cierre"];

  constructor(private router: Router,
    private route: ActivatedRoute, private gService: GenericService,
    private notificacion: NotificacionService) {
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
        console.log(data.events);
        //* Ordenamos por fecha
        this.datos = data.events.sort((a: any, b: any) => a.fecha.getTime - b.fecha.getTime);
        console.log('Sort data:');
        console.log(this.datos);
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

  //* Cerrar evento, llama a un API que actualiza el estado del evento
  cerrarEvento(idEvent: number, nombreEvento: string): void {
    //? Para marcar como presente al miembro sí que necesito al usuario
    this.gService.update('close-event', idEvent).pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
      //* Obtener la data
      console.log(data);
      //! Notificación de cerrado 
    });

    this.notificacion.mensaje(
      `Evento`,
      `¡Se ha cerrado el evento: ${nombreEvento}!`,
      TipoMessage.success
    );

    this.refreshData(); //* Por si acaso
  }

  //* Generar reporte del evento
  generarReporte(idEvent: number, nombreEvento: string): void {
    this.router.navigate(['/member/reportePdf/', idEvent], {
      relativeTo: this.route
    });

    this.notificacion.mensaje(
      `Evento`,
      `¡Se ha creado el reporte del evento: ${nombreEvento}!`,
      TipoMessage.success
    );
  }

  //* Desplegar el confirmbox para saber si quiere o no cerrar el evento
  //! No tiene diseño aún, ocupa bootstrap, pero no tengo tiempo
  confirmBoxCerrarEvento(id: any, nombre: string): void {
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
        console.log('Confirm box: ', resp);
        this.isConfirmBoxActive = !this.isConfirmBoxActive; //* Cambiamos de nuevo
        if (resp.success) {
          this.notificacion.mensaje(
            'Evento',
            `Se ha cerrado exitosamente el evento ${nombre}`,
            TipoMessage.info
          );
          this.cerrarEvento(id, nombre);
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

  //* Método encargado de permitir o no generar el pdf
  isReportAvailable(fecha: any): boolean {
    let validadora: boolean = true;
    let fechaActual: Date = new Date();
    let fechaEvento: Date = new Date(fecha);
    validadora = (fechaActual.getTime() >= fechaEvento.getTime()); //* >= o sea incluye el mismo día y los anteriores o está cerrado

    return !validadora; //* Se invierte el valor al ser un disabled
  }

  isCierreAvailabe(abierto: number, fecha: any): boolean {
    let validadora: boolean = true;
    let fechaActual: Date = new Date();
    let fechaEvento: Date = new Date(fecha);
    validadora = (fechaActual.getTime() > fechaEvento.getTime()) && abierto != 0; //* Es mayor o sea ya pasó 1 día al menos y está abierto
    //* en cuanto al estado tiene que ser distinto de 0 o sea cerrado

    return !validadora;
  }

  //* Validación sobre el padrón
  isPadronAvailable(abierto: number, fecha: any): boolean {
    let validadora: boolean = true; //* Inicializamos en false la variable o sea debería estar bien
    let fechaActual: Date = new Date();
    let fechaEvento: Date = new Date(fecha);
    validadora = (fechaActual.getMonth() == fechaEvento.getMonth() ? fechaActual.getDate() <= fechaEvento.getDate() :
      fechaActual.getTime() <= fechaEvento.getTime()) && abierto == 1; //* la fecha actual es menor o igual a la del día del evento

    return !validadora;
  }

  //* Método encargado de refrescar la Data
  refreshData(): void {
    this.gService
      .list('get-eventos/')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        console.log(data);
        this.datos = data.sort((a, b) => a.date.getTime() - b.date.getTime());
        this.dataSource = new MatTableDataSource(this.datos);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
    //* Si no un refresh page de los normales
    //? this.location.reload();
    //? private location: Location -> Constructor
  }

}
