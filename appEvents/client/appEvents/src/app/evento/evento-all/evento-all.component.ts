import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GenericService } from 'src/app/share/generic.service';
import { NotificacionService, TipoMessage } from 'src/app/share/notification.service';
import { AppearanceAnimation, ConfirmBoxEvokeService, ConfirmBoxInitializer, DialogLayoutDisplay, DisappearanceAnimation } from '@costlydeveloper/ngx-awesome-popup';

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
  displayedColumns = ['nombre', "fecha", "estado", "acciones"];

  constructor(private router: Router,
    private route: ActivatedRoute, private gService: GenericService,
    private notificacion: NotificacionService, private confirmBoxEvokeService: ConfirmBoxEvokeService) {
  }

  ngOnInit(): void {
    //* Encargado de notificar un create
    console.log('Sí funciona el on init');
    this.route.params.subscribe((params: Params) => {
      const isCreate = params['create']; //* Obtenemos el params que debería ser true
      if (isCreate != undefined && isCreate != null) {
        const nombreEvent = params['nombre'];
        this.notificacion.mensaje(
          'Evento',
          `¡Se ha creado exitosamente el evento ${nombreEvent}!`,
          TipoMessage.success
        );
      }
    });
  }

  ngAfterViewInit(): void {
    this.listaEventos();
  }

  //* Carga la lista de eventos desde el API e inicializa los data source
  listaEventos(): void {
    this.gService
      .list('get-eventos/')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        console.log(data);
        //* Ordenamos por fecha
        this.datos = data.sort((a, b) => a.date.getTime() - b.date.getTime());
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

  //! RECUERDE LAS CONDICIONES PARA PDOER USAR ESTOS BOTONES
  //? Se puede hacer siempre y cuando el evento esté abierto
  //* Sirve para registrar la asistencia
  editarPadron(id: any): void {
    this.router.navigate(['/evento/update-padron/'], {
      queryParams: { id: id }
    });
  }

  //* Cerrar evento, llama a un API que actualiza el estado del evento
  cerrarEvento(id: any): void {
    this.gService.update('close-event', id).pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
      //* Obtener la data
      console.log(data);
    });
    this.refreshData();
    //* Notificar que se cerró el evento, tal vez con query params y redirigiendo como update
  }

  //* Generar reporte del evento
  generarReporte(id: any) : void {
    this.router.navigate(['/evento/reportePDF/'], {
      queryParams: { id: id }
    });
  }

  //* Desplegar el confirmbox para saber si quiere o no cerrar el evento
  //! No tiene diseño aún, ocupa bootstrap, pero no tengo tiempo
  confirmBoxCerrarEvento(id: any, nombre : string): void {
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
          this.cerrarEvento(id);
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
