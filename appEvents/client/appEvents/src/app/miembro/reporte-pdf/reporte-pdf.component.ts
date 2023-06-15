import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericService } from 'src/app/share/generic.service';
import { Subject, takeUntil } from 'rxjs';
import { NotificacionService, TipoMessage } from 'src/app/share/notification.service';

@Component({
  selector: 'app-reporte-pdf',
  templateUrl: './reporte-pdf.component.html',
  styleUrls: ['./reporte-pdf.component.css']

})
export class ReportePdfComponent implements OnInit {
  datos: any; //* Datos del reporte
  idEvent: any; //* Identificador del evento
  eventName: any; //* Variable encargada de guardar el nombre del evento en query params
  destroy$: Subject<boolean> = new Subject<boolean>(); //* Encargado de destruir la suscripción

  constructor(private gService: GenericService, private route: ActivatedRoute,
    private notificacion: NotificacionService, private router: Router) {
    //* Constructor vacío
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.idEvent = params['id'] || ' ';
      if (this.idEvent == ' ') {
        this.notificacion.mensaje(
          'Reporte PDF',
          'Por favor, ingrese un evento válido',
          TipoMessage.error
        );
        this.onBack();
      } else {
        this.eventName = this.route.snapshot.queryParams['name'] || ' ';
        this.notification()
      }
    });
  }

  //* Sucede luego de cargar los params
  ngAfterViewInit(): void {
    //! Validaciones tochas
    //! Cargar data según lo especificado en la historia [HTML]

    //? quitar comentario
    //! this.listaMiembrosPadron();
  }

  //* Carga la lista de los miembros asistentes a X evento y otros datos
  listaMiembrosPadron(): void {
    this.gService
      .get('members-padron', `event_id=${this.idEvent}`)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.datos = data;
      });
  }

  //* Método encargado de notificar
  notification(): void {
    this.notificacion.mensaje(
      `Evento`,
      `¡Se ha creado el reporte del evento ${': ' + this.eventName || this.idEvent}!`,
      TipoMessage.success
    );
  }

  //* Método encargado de cargar el PDF
  openPDF(): void {
    //* Configuramos

    //* htmlData: id del elemento HTML
    let DATA: any = document.getElementById('htmlData');
    html2canvas(DATA).then((canvas) => {
      //* Configuración del ancho y alto del Canvas de la imagen
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      //* devuelve un data URI, el cual contiene una representación
      //* de la imagen en el formato especificado por el parámetro type
      const FILEURI = canvas.toDataURL('image/png');
      //* Orientación, unidad, formato
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      //* Agregar imagen al PDF
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      PDF.save(`reportEvent${this.eventName || this.idEvent}.pdf`);
    });
  }

  //* Método para regresar a la ventana anterior, como en padrón
  onBack(): void {
    this.router.navigate(['evento/all']);
  }

}
