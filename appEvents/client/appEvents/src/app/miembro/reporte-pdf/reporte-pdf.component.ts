import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericService } from 'src/app/share/generic.service';
import { Subject, takeUntil } from 'rxjs';
import { NotificacionService, TipoMessage } from 'src/app/share/notification.service';
import { AuthenticationService } from 'src/app/share/authentication.service';

@Component({
  selector: 'app-reporte-pdf',
  templateUrl: './reporte-pdf.component.html',
  styleUrls: ['./reporte-pdf.component.css']

})
export class ReportePdfComponent implements OnInit {
  datos: any; //* Datos del reporte
  idEvent: any; //* Identificador del evento
  isAutenticated: boolean; //* Verifica si está autenticado o no
  currentUser: any; //* Usuario actual en el sistema
  eventName: any; //* Variable encargada de guardar el nombre del evento en query params
  destroy$: Subject<boolean> = new Subject<boolean>(); //* Encargado de destruir la suscripción

  constructor(private gService: GenericService, private route: ActivatedRoute,
    private notificacion: NotificacionService, private router: Router, private authService: AuthenticationService,) {
    //* Constructor vacío
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.idEvent = params['id'] || ' ';
      if (this.idEvent == ' ') {
        this.notificacion.mensaje(
          'Reporte PDF - Error',
          'Por favor, ingrese un evento válido',
          TipoMessage.error
        );
        this.onBack();
      } else {
        this.eventName = this.route.snapshot.queryParams['name'] || ' ';
      }
    });
    this.loadUser();
  }

  //* Sucede luego de cargar los params
  async ngAfterViewInit(): Promise<void> {
    //! Validaciones tochas
    let valor = await this.isValidReport();
    this.notification(valor);

    if (valor) {
      //? quitar comentario
      //! this.listaMiembrosPadron(); //* Cargamos la lista
    } else
      this.onBack(); //* Redirigimos
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
  notification(valor: boolean): void {
    if (valor) {
      this.notificacion.mensaje(
        `Reporte PDF - Evento`,
        `¡Se ha creado correctamente el reporte del evento ${': ' + this.eventName || this.idEvent}!`,
        TipoMessage.success
      );
    } else {
      this.notificacion.mensaje(
        `Reporte PDF - Error`,
        `¡No se puede generar el reporte del evento: ${this.eventName != ' ' ? ': ' + this.eventName : ' '}!`,
        TipoMessage.warning
      );
    }
  }

  //* Método encargado de verificar si el evento ingresado admite un reporte
  isValidReport(): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.gService
          .get('get-event', `event_id=${this.idEvent}`)
          .pipe(takeUntil(this.destroy$))
          .subscribe((data: any) => {
            let result: any = data;
            let usuario: number = data.id_Usuario;
            let currentDate: Date = new Date();
            let eventDate: Date = new Date(result.fecha);
            if (result) {
              //* Para generar un reporte tiene ser el mismo día o mayor o tiene que estar cerrado
              if ((currentDate.getMonth() == eventDate.getMonth() ? currentDate.getDate() >= (eventDate.getDate() + 1)
                : currentDate.getTime() >= eventDate.getTime()) || (!result.abierto)) { //* O sea cerrado
                //* Además, tiene que pasar la aprobación del usuario
                if (((this.currentUser.user.profile === 'Administrador') || (this.currentUser.user.id === usuario)) && (this.isAutenticated))
                  resolve(true);
              }
            }
            resolve(false);
          });
      }, 100);
    });
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

  //* Función encargada de cargar la data del usuario
  loadUser(): void {
    //* Subscripción a la información del usuario actual
    this.authService.currentUser.subscribe((x) => (this.currentUser = x));
    //? Este mismo será necesario para válidar en el HTML

    //* Subscripción al booleano que indica si esta autenticado
    this.authService.isAuthenticated.subscribe(
      (valor) => (this.isAutenticated = valor)
    );
  }

  //* Método para regresar a la ventana anterior, como en padrón
  onBack(): void {
    this.router.navigate(['evento/all']);
  }

}
