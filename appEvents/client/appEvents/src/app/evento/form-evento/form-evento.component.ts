import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject, take, takeUntil } from 'rxjs';
import { AuthenticationService } from 'src/app/share/authentication.service';
import { GenericService } from 'src/app/share/generic.service';
import { NotificacionService, TipoMessage } from 'src/app/share/notification.service';
import * as XLSX from 'xlsx';
export enum ErrorType {
  Required,
  MaxLength,
  MultiFile,
  Accept //* Format
}

@Component({
  selector: 'app-form-evento',
  templateUrl: './form-evento.component.html',
  styleUrls: ['./form-evento.component.css']
})

/*
Id INT IDENTITY(100, 2) NOT NULL, -- Empieza en 100 y va subiendo de 2 en 2
Id_Usuario INT NOT NULL, -- Usuario que organiza el evento, se utiliza el user service
Nombre VARCHAR(100) NOT NULL,
Descripcion VARCHAR(500)  NOT NULL,
Fecha DATE NOT NULL, -- Día completo, no implica hora, se utilizará un datepicker de material
Abierto BIT DEFAULT 1 -- Sirve para saber si el evento está Abierto (1) o Cerrado (0) o no
*/

export class FormEventoComponent implements OnInit {
  //* Variables de trabajo
  currentUser: any; //* Usuario actual
  isAutenticated: boolean; //* Está o no autenticado, debería checar que esté autentificado
  titleForm: string = 'Crear Evento';
  destroy$: Subject<boolean> = new Subject<boolean>(); //* Observable encargado de destruir las suscripciones
  eventInfo: any; //* Información del evento [UPDATE]
  respEvento: any; //* Respuesta del API GET/POST
  respExcel: any; //* Respuesta del API POST de Excel upload
  submitted = false; //* Subido o no
  eventoForm: FormGroup; //* Formulario
  idEvent: number = 0; //* Respuesta del query params en caso de ser update
  isCreate: boolean = true; //* Is create or update?
  srcFileResult: any; //* Guardar información del Excel

  //* Propiedades para trabajar en el front
  minDate: Date; //* Fecha mínima
  maxDate: Date; //* Fecha máxima
  stringFileInputError: string = ''; //* Propiedad encargada de manejar errores en el front

  //? Encargado de controlar el text area
  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  constructor(private fb: FormBuilder,
    private authService: AuthenticationService, private gService: GenericService,
    private router: Router, private activeRouter: ActivatedRoute,
    private notificacion: NotificacionService, private _ngZone: NgZone
  ) {
    this.formularioReactive();
  }

  ngOnInit(): void {
    //* Verificar si llaga algún query params para saber si es update or create
    this.activeRouter.params.subscribe((params: Params) => {
      this.idEvent = params['id'];
      if (this.idEvent != undefined) {
        this.isCreate = false; //* Es update
        this.titleForm = "Actualizar Evento"; //* Cambiamos el título
        //* Obtener el evento y actualizar del API
        this.gService.get('get-event', `event_id=${this.idEvent}`).pipe(takeUntil(this.destroy$))
          .subscribe((data: any) => {
            //* Cargamos la data
            this.eventInfo = data;
            //* Asigmanos las data
            this.eventoForm.setValue({
              id: this.eventInfo.id,
              id_usuario: this.eventInfo.id_Usuario,
              nombre: this.eventInfo.nombre,
              descripcion: this.eventInfo.descripcion,
              fecha: this.eventInfo.fecha,
              abierto: this.eventInfo.abierto
            })
          });
      }
    });
    this.cargarUsuario();
    this.loadDates();
  }


  //* Cargamos la información del usuario desde el servicio
  cargarUsuario(): void {
    //* Subscripción a la información del usuario actual
    this.authService.currentUser.subscribe((x) => (this.currentUser = x));
    //? Este mismo será necesario para válidar en el HTML

    //* Subscripción al booleano que indica si esta autenticado
    this.authService.isAuthenticated.subscribe(
      (valor) => (this.isAutenticated = valor)
    );
  }

  //* Declaración y orden del grupo de componentes del formulario con sus correspondientes validación según sea necesario
  formularioReactive(): void {
    this.eventoForm = this.fb.group({
      id: null, //* Id del evento
      id_usuario: null, //* Se obtiene del servicio
      nombre: [null, Validators.compose([
        Validators.required, Validators.minLength(5), Validators.maxLength(100), Validators.pattern(/[\w\[\]`ÑñáÁéÉíÍóÓúÚäÄëËïÏöÖüÜ!@#$%\^&*()={}:;<>+'-/\s/]*/)])
      ], //* Nombre del evento
      descripcion: [null, Validators.compose([
        Validators.required, Validators.minLength(20), Validators.maxLength(500), Validators.pattern(/[\w\[\]`ÑñáÁéÉíÍóÓúÚäÄëËïÏöÖüÜ!@#$%\^&*()={}:;<>+'-/\s/]*/)])
      ], //* Descripción del evento
      fecha: [null, Validators.compose([
        Validators.required, Validators.minLength(6), Validators.maxLength(10)])
      ], //* Fecha del evento, viene del date picker
      abierto: null //* Por defecto es 1 (abierto)
    });
  }


  //* Método para cargar las fechas
  loadDates(): void {
    //* Fijamos las fechas del filtro
    const currentTime = new Date();
    this.minDate = new Date();
    this.minDate.setDate(currentTime.getDate() + 1);
    this.maxDate = new Date();
    this.maxDate.setDate(currentTime.getDate() + 90);
  }

  //* En caso de crear evento
  crearEvento(): void {
    //* Verificar validación del formulario
    if (this.eventoForm.invalid) {
      this.notificacion.mensaje(
        'Aviso - Evento - Crear',
        'Ha ocurrido un error a la hora de crear el evento, por favor verifique todos los campos',
        TipoMessage.warning
      );
      return;
    }

    if (this.srcFileResult === undefined) {
      this.notificacion.mensaje(
        'Evento - Padrón',
        'Por favor, suba el padrón de registro',
        TipoMessage.warning
      );
      return;
    }

    //* Establecer el submit verdadero
    this.submitted = true;

    //* Establecer valores de campos estáticos
    //? Recuerde que el id es de tipo identity, por lo que no es necesario
    //? El estado se usa default.

    this.eventoForm.get('id_usuario').setValue(this.currentUser.user.id);
    this.eventoForm.get('abierto').setValue(1);

    //* Acción del API create enviando toda la informacion del formulario
    this.gService.create('save-event', this.eventoForm.value)
      .pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
        //* Obtener respuesta
        this.respEvento = data;
        this.uploadExcelFile(); //? Importantísimo
        this.router.navigate(['/evento/all'],
          {
            queryParams: {
              create: 'true',
              nombre: `${this.eventoForm.value.nombre}`
            }
          });
      });
  }

  //* En caso de actualizar un evento
  //? SE HACE DISABLED DEL PADRÓN
  actualizarEvento(): void {
    //* Si son iguales
    //! [required]="isCreate"

    if (this.eventInfo.fecha == this.eventoForm.value.fecha) {
      this.eventoForm.get('fecha').removeValidators(Validators.required);
    } else
      this.eventoForm.get('fecha').addValidators(Validators.required);

    //* Verificar validación del formulario
    if (this.eventoForm.invalid) {
      this.notificacion.mensaje(
        'Aviso - Evento - Actualizar',
        'Ha ocurrido un error a la hora de crear el evento, por favor verifique todos los campos',
        TipoMessage.warning
      );
      return;
    }

    //* Establecer el submit verdadero
    this.submitted = true;

    //! El usuario no se actualiza, ni id, ni estado
    //? Puedo actualizar fecha, nombre y descripción [FRONT]

    //! Parcheamos valores REVISAR CON EL BACK
    this.eventoForm.get('id_usuario').setValue(this.currentUser.user.id);
    this.eventoForm.get('abierto').setValue(1); //* Establecemos el evento como abierto, puesto que solo puedo editar eventos abiertos

    this.gService.update('update-event?event_id=', this.eventoForm.value)
      .pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
        //* Obtener respuesta del API
        this.respEvento = data;
        this.router.navigate(['/evento'],
          {
            queryParams: {
              update: 'true',
              nombre: `${this.eventoForm.value.nombre}`
            }
          });
      });
  }

  //* Método para leer el documento de Excel en Angular CLI
  //* Ya que Angular Material NO acepta input file
  onFileChange(event: any): void {
    //* Leemos el archivo mediante el event y queryselector
    const target: DataTransfer = <DataTransfer>(event.target);
    const inputNode: any = event.target as HTMLInputElement;
    const file = inputNode.files[0];

    //* Validaciones necesarias
    if (typeof (FileReader) === 'undefined' || !file) {
      this.errorFileHandling(TipoMessage.error, ErrorType.Required);
      //* Retornamos
      return;
    }

    if (target.files.length !== 1) {
      this.errorFileHandling(TipoMessage.error, ErrorType.MultiFile);
      return;
    }

    if (target.files[0].type != 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      //* Accept se refiere a los formatos aceptados
      this.errorFileHandling(TipoMessage.error, ErrorType.Accept);
      return;
    }

    if (target.files[0].size > 655360) { //* Obtenemos el primero para comprobar, en el front se trabaja en bits, aquí en bytes así que / 8
      this.errorFileHandling(TipoMessage.error, ErrorType.MaxLength);
      return;
    }

    //* En caso de pasar las validaciones

    //* Limpiar propiedades de bugs
    this.stringFileInputError = '';

    //* Notificaciones
    this.notificacion.mensaje(
      'Evento - Padrón',
      `Se ha ${this.srcFileResult !== undefined ? 'actualizado' : 'subido'} el padrón`,
      this.srcFileResult !== undefined ? TipoMessage.info : TipoMessage.success
    );

    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(target.files[0]);
    reader.onload = (e: any) => {
      //* Creamos el libro de trabajo
      const binarystr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });

      //* Seleccionamos la primera hoja
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      //* Salvamos la data en la variable
      this.srcFileResult = XLSX.utils.sheet_to_json(ws);
      console.log(this.srcFileResult);
    };
  }

  //* Subir el padrón, es necesario usar un timeout para que no cree conflicto con las llaves
  //? Recuerde hacer skip a los repetidos
  uploadExcelFile(): void {
    //* Enviar en un API POST
    //! Revisar esa URL
    //TODO puede ser que necesite ser serializa o con formato especial
    const rspdata = { //* Enviar data
      data: [this.respEvento]
    };
    // !
    console.log('Esto es lo que se enviaría al API');
    console.log(rspdata);
    // !
    this.gService.create('load-padron', rspdata)
      .pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
        //* Obtener respuesta
        this.respExcel = rspdata;
        console.log(`Respuesta API EXCEL: \n ${data}`)
        //* Llamamos al método para registrar la relación N:M
        //! DESCOMENTAR
        //? this.uploadMemberAssitance(this.respExcel.data);
      });
    //! BORRAR
    //this.uploadMemberAssitance(this.respExcel.data);
  }

  //* Método encargado de enviar el array especial para la tabla N:M de asistencia de miembros
  uploadMemberAssitance = (data: any): void => {
    //* Preparamos lo que se va a enviar
    let rspAssitance: [any];
    let index: number = 0; //* Encargado de contar
    for (let register of data) {
      //! EL ID DEL EVENTO NO LO TENEMOS PÁ...
      //? EN TODO CASO UNA SOLUCIÓN PODRÍA SER USAR EL STORE PROCEDURE
      rspAssitance[index] = { 'Id_Evento': 1, 'Id_Member': data[index].Id_member, 'Fecha_Hora': Date.now(), 'Id_Usuario': this.currentUser.user.id };
      //* El resto de campos van a estar por default
      index++; //* Contamos
    }
    //! Visualizamos
    console.log('Respuesta de asistencia')
    console.log(rspAssitance);
    this.gService.create('load-asistencia', rspAssitance)
      .pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
        console.log(`Respuesta del API registrar asistencia: \n ${data}`)
      });
  }

  //* Manejo de errores
  //* Público puesto que se usa en todo lado
  public errorHandling = (control: string, error: string): any => {
    return this.eventoForm.controls[control].hasError(error);
  };

  //* Encargado de manejar las dimensiones del text area
  triggerResize() {
    //* Espera a cambios de forma responsiva
    this._ngZone.onStable.pipe(take(1)).subscribe(() => this.autosize.resizeToFitContent(true));
  }

  //* Método encargado de manejar los errores del input file
  //* Recibe el valor del evento y un error value
  errorFileHandling = (messageType: TipoMessage, errorHandling: ErrorType): void => {
    //* Proceso necesario
    let message: string = ''; //* Dependiendo del tipo de mensaje y el errotype
    let messageTitle: string = 'Evento - Padrón'; //* Encargado de manejar el título del mensaje
    switch (errorHandling) {
      case ErrorType.Required:
        message = 'Por favor, ingrese un documento válido';
        this.srcFileResult = 'Required';
        break;
      case ErrorType.MaxLength:
        message = '¡El tamaño máximo del archivo es de 5 megabytes!!';
        this.srcFileResult = 'MaxLength';
        break;
      case ErrorType.MultiFile:
        message = 'No se pueden ingresar más de 1 archivo';
        this.srcFileResult = 'MultiFile';
        break;
      case ErrorType.Accept:
        message = 'Por favor, ingrese un archivo de tipo Excel en formato .xlsx';
        this.srcFileResult = 'Accept';
        break;
      default:
        message = 'Unknow error'
        this.srcFileResult = 'Unknow';
    }
    //* Notificamos
    this.notificacion.mensaje(
      messageTitle,
      message,
      messageType
    );
    //* Ajustamos a undefined pá
    this.srcFileResult = undefined;
  };


  //* Filtro para datepicker
  dateFilter = (d: Date | null): boolean => {
    const currentDate = new Date();
    const enterDate = (d || new Date());
    //* Avoid the user to select the same or previous day
    return !(currentDate.getTime() >= enterDate.getTime());
  };


  //* Reiniciar
  onReset(): void {
    this.submitted = false;
    this.eventoForm.reset();
    this.respExcel = undefined; //* Limpiamos
  }

  //* Volver
  onBack(): void {
    if (this.isCreate) {
      this.router.navigate(['/evento/all']);
      return; //? Puede ser redundante
    } else {
      this.router.navigate(['/evento/']);
      return;
    }
  }

  //* Para destruir y desinscribirse
  ngOnDestroy(): void {
    this.destroy$.next(true);
    //* Desinscribirse
    this.destroy$.unsubscribe();
  }

}
