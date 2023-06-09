import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericService } from 'src/app/share/generic.service';

@Component({
  selector: 'app-evento-all',
  templateUrl: './evento-all.component.html',
  styleUrls: ['./evento-all.component.css']
})

export class EventoAllComponent implements AfterViewInit {
  datos: any; //* Data del API GET
  destroy$: Subject<boolean> = new Subject<boolean>(); //* Destructor de tipo subject
  @ViewChild(MatPaginator) paginator!: MatPaginator; //* Páginación con Mat
  @ViewChild(MatSort) sort!: MatSort; //* MatSort para ordenar la tabla
  dataSource = new MatTableDataSource<any>();

  //* Columnas para la tabla
  displayedColumns = ['nombre', "fecha", "estado", "acciones"];

  constructor(private router: Router,
    private route: ActivatedRoute, private gService: GenericService) {
  }

  ngAfterViewInit(): void {
    this.listaEventos();
  }

  //* Carga la lista de eventos desde el API e inicializa los data source
  listaEventos() {
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
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  //* Crear video juego y redirigir
  crearEvento() {
    this.router.navigate(['/evento/create'], {
      relativeTo: this.route,
    });
  }

  //! RECUERDE LAS CONDICIONES PARA PDOER USAR ESTOS BOTONES
  //? Se puede hacer siempre y cuando el evento esté abierto
  //* Sirve para registrar la asistencia
  editarPadron(id: any) {
    this.router.navigate(['/evento/update-padron/'], {
      queryParams: { id: id }
    });
  }

  //* Cerrar evento, llama a un API que actualiza el estado del evento
  cerrarEvento(id: any) {
    this.gService.update('close-event', id).pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
      //* Obtener la data
      console.log(data);
    })
    this.refreshData();
  }

  //* Generar reporte del evento
  generarReporte(id: any) {
    this.router.navigate(['/evento/reportePDF/'], {
      queryParams: { id: id }
    });
  }

  //* Método encargado de refrescar la Data
  refreshData() {
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
