import { Injectable } from '@angular/core';
import { ToastrService, IndividualConfig } from 'ngx-toastr';
export enum TipoMessage {
  error,
  info,
  success,
  warning,
}
@Injectable({
  providedIn: 'root',
})

export class NotificacionService {
  options: IndividualConfig;
  respNotificacion : any;

  constructor(private toastr: ToastrService) {
    this.options = this.toastr.toastrConfig;

    //Habilitar formato HTML dentro de la notificación
    this.options.enableHtml = true;

    /* Top Right, Bottom Right, Bottom Left, Top Left, Top Full Width, Bottom Full Width, Top Center, Bottom Center */
    this.options.positionClass = 'toast-top-center';
    //Tiempo que se presenta el mensaje
    // this.options.timeOut = 5000;
    this.options.disableTimeOut = true;
    this.options.closeButton = true;
    this.respNotificacion = undefined; //* Asignamos como indefinido
  }
  /*
Presentar mensaje de notificación
Toast Type: success, info, warning, error
 */
  public mensaje(titulo: string, mensaje: string, tipo: TipoMessage): void {
    this.toastr.show(mensaje, titulo, this.options, 'toast-' + TipoMessage[tipo]);
  }

  //* No funciona
  public mensajeConfirmacion() : any {
    this.toastr.warning('¿Estás seguro de realizar esta acción?', 'Confirmar', {
      timeOut: 0,
      closeButton: true,
      positionClass: 'toast-top-center',
      enableHtml: true,
      disableTimeOut: true,
      progressBar: true
    }).onTap.subscribe((action : any) => {
      if (action) {
        return 'True';
      } else {
        return 'No';
      }
    });
  }

}
