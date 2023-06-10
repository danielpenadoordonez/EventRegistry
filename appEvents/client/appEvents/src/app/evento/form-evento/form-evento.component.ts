import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthenticationService } from 'src/app/share/authentication.service';
import { GenericService } from 'src/app/share/generic.service';
import { NotificacionService, TipoMessage } from 'src/app/share/notification.service';

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
  destroy$: Subject<boolean> = new Subject<boolean>();
  eventInfo: any; //* Información del evento [UPDATE]
  respEvento: any; //* Respuesta del API GET/POST
  submitted = false; //* Subido o no
  eventoForm: FormGroup; //* Formulario
  idEvent: number = 0; //* Respuesta del query params en caso de ser update
  isCreate: boolean = true; //* Is create or update?
  srcFileResult: any; //* Guardar información del Excel
  minDate: Date; //* Fecha mínima
  maxDate: Date; //* Fecha máxima

  constructor(private fb: FormBuilder,
    private authService: AuthenticationService, private gService: GenericService,
    private router: Router, private activeRouter: ActivatedRoute, private notificacion: NotificacionService
  ) {
    this.loadDates();
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
        this.gService.get('get-event', this.idEvent).pipe(takeUntil(this.destroy$))
          .subscribe((data: any) => {
            //* Cargamos la data
            this.eventInfo = data;
            //* Asigmanos las data
            this.eventoForm.setValue({
              id_usuario: this.eventInfo.id_usuario,
              nombre: this.eventInfo.nombre,
              descripcion: this.eventInfo.descripcion,
              fecha: this.eventInfo.fecha,
              estado: this.eventInfo.estado
            })
          });
      }
    });
    this.cargarUsuario();
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
      id_usuario: null, //* Se obtiene del servicio
      nombre: [null, Validators.compose([
        Validators.required, Validators.minLength(5), Validators.maxLength(100), Validators.pattern(/[\w\[\]`ñáéíóúäëïöü!@#$%\^&*()={}:;<>+'-/\s/]*/)])
      ], //* Nombre del evento
      descripcion: [null, Validators.compose([
        Validators.required, Validators.minLength(20), Validators.maxLength(500), Validators.pattern(/[\w\[\]`ñáéíóúäëïöü!@#$%\^&*()={}:;<>+'-/\s/]*/)])
      ], //* Descripción del evento
      fecha: [null, Validators.compose([
        Validators.required, Validators.minLength(6), Validators.maxLength(10), Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)])
      ], //* Fecha del evento, viene del date picker
      estado: null //* Por defecto es 1
    });
  }


  //* Método para cargar las fechas
  loadDates(): void {
    //* Fijamos las fechas del filtro
    const currentTime = new Date();
    this.minDate = new Date();
    this.minDate.setDate(currentTime.getDate() + 1);
    this.maxDate = new Date();
    this.maxDate.setDate(currentTime.getTime() + 90);
  }

  //* Filtro para datepicker
  myFilter = (d: Date | null): boolean => {
    const currentDate = new Date();
    //* Avoid the user to select the same or previous day
    return currentDate.getTime() >= d.getTime();
  };

  //* En caso de crear evento
  crearEvento(): void {
    //* Verificar validación del formulario
    if (this.eventoForm.invalid) {
      this.notificacion.mensaje(
        `Aviso - Evento - ${this.isCreate ? 'Crear' : 'Actualizar'}`,
        'Ha ocurrido un error a la hora de crear el evento, por favor verifique todos los campos',
        TipoMessage.warning
      );
      return;
    }

    //* Establecer el submit verdadero
    this.submitted = true;

    //* Establecer valores de campos estáticos
    //? Recuerde que el id es de tipo identity, por lo que no es necesario
    //? El estado se usa default.

    this.eventoForm.get('id_usuario').setValue(this.currentUser.id);
    this.eventoForm.get('estado').setValue(1);

    //* Acción del API create enviando toda la informacion del formulario
    this.gService.create('save-event', this.eventoForm.value)
      .pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
        //* Obtener respuesta
        this.respEvento = data;
        this.router.navigate(['/evento/all'],
          {
            queryParams: {
              create: 'true',
              nombre: `${this.eventoForm.get('nombre')}`
            }
          });
      });
  }

  //* En caso de actualizar un evento
  //? SE HACE DISABLED DEL PADRÓN
  actualizarEvento(): void {
    //* Verificar validación del formulario
    if (this.eventoForm.invalid) {
      this.notificacion.mensaje(
        `Aviso - Evento - ${this.isCreate ? 'Crear' : 'Actualizar'}`,
        'Ha ocurrido un error a la hora de crear el evento, por favor verifique todos los campos',
        TipoMessage.warning
      );
      return;
    }

    //* Establecer el submit verdadero
    this.submitted = true;

    //! El usuario no se actualiza, ni id, ni estado
    //? Puedo actualizar fecha, nombre y descripción [FRONT]

    this.gService.update('event-update', this.eventoForm.value)
      .pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
        //* Obtener respuesta del API
        this.respEvento = data;
        this.router.navigate(['/evento/'],
          {
            queryParams: {
              update: 'true',
              nombre: `${this.eventoForm.get('nombre')}`
            }
          });
      });
  }

  //* Manejo del padrón en formato Excel
  onFileSelected() {
    const inputNode: any = document.querySelector('#file');

    if (typeof (FileReader) !== 'undefined') {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.srcFileResult = e.target.result;
      };

      reader.readAsArrayBuffer(inputNode.files[0]);
    }
  }

  /* 
  function readFileAndSend() {
  const fileInput = document.getElementById('myFileInput');
  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = function(event) {
      const contents = event.target.result;
      sendFileContents(contents);
    };

    reader.readAsText(file);
  }
}
  */

  //* Manejo de errores
  public errorHandling = (control: string, error: string) => {
    return this.eventoForm.controls[control].hasError(error);
  };

  //* Reiniciar
  onReset(): void {
    this.submitted = false;
    this.eventoForm.reset();
  }

  //* Volver
  onBack(): void {
    this.router.navigate(['/evento/all']);
  }

  //* Para destruir y desinscribirse
  ngOnDestroy(): void {
    this.destroy$.next(true);
    //* Desinscribirse
    this.destroy$.unsubscribe();
  }

}
