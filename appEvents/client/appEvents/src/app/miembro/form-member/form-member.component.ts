import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthenticationService } from 'src/app/share/authentication.service';
import { GenericService } from 'src/app/share/generic.service';
import { NotificacionService, TipoMessage } from 'src/app/share/notification.service';

@Component({
  selector: 'app-form-member',
  templateUrl: './form-member.component.html',
  styleUrls: ['./form-member.component.css']
})
export class FormMemberComponent implements OnInit {
  titleForm: string = 'Añadir Miembro al Padrón'; //* El título que puede variar en función de un posible update/create
  currentUser: any; //* Información del usuario actual logeado en el sistema
  isAutenticated: boolean; //* Propiedad encargada de manejar si el usuario está o no autenticado
  destroy$: Subject<boolean> = new Subject<boolean>(); //* Destruir la suscripción
  memberInfo: any; //* Respuesta del API ante un GET
  respMember: any; //* Respuesta del API a la hora de POST/PUT
  submitted = false; //* Subido
  isChecked: boolean = false; //* Sirve para controlar el estado del checkbox, inicia el false obvio
  memberForm: FormGroup; //* Formulario
  regexNombre: RegExp = new RegExp('(^[A-Za-zÑñáÁéÉíÍóÓúÚäÄëËïÏöÖüÜ]{3,17})([ ]{0,1})([A-Za-zÑñáÁéÉíÍóÓúÚäÄëËïÏöÖüÜ]{3,17})([ ]{0,1})([A-Za-zÑñáÁéÉíÍóÓúÚäÄëËïÏöÖüÜ]{3,17})([ ]{0,1})([A-Za-zÑñáÁéÉíÍóÓúÚäÄëËïÏöÖüÜ]{3,17})$');
  idMember: number = 0; //* En caso de trabajar un update
  idEvent: number; //* Sirve para redireccionar
  isCreate: boolean = true; //* Es crear o actualizar?

  constructor(private fb: FormBuilder, private gService: GenericService,
    private router: Router, private activeRouter: ActivatedRoute, private notificacion: NotificacionService, private authService: AuthenticationService) {
    this.formularioReactive(); //* Inicializamos el formulario
  }


  //* Método encargado de cargar y revisar si es update
  ngOnInit(): void {
    //* Cargamos el query params
    this.idEvent = this.activeRouter.snapshot.queryParams['id_event'] || 0;

    if (this.idEvent == 0) {
      this.onErrorBack();
      return;
    }

    //* Cargamos los params
    this.activeRouter.params.subscribe((params: Params) => {
      //* Cargamos el param
      this.idMember = params['id'];
      if (this.idMember != undefined) {
        this.isCreate = false;
        this.titleForm = "Actualizar Miembro del padrón";
        //* Obtener data del miembro en caso de ser update, a actualizar del API
        this.gService.get('get-member', `member_id=${this.idMember}`).pipe(takeUntil(this.destroy$))
          .subscribe((data: any) => {
            this.memberInfo = data;
            this.memberForm.setValue({
              id: this.memberInfo.id,
              nombre_completo: this.memberInfo.id,
              cedula: this.memberInfo.cedula,
              status: this.memberInfo.status,
              correo: this.memberInfo.crreo,
              telefono: this.memberInfo.telefono,
              confirmado: this.memberInfo.confirmado,
            })
          });
      }
    });
  }

  ngAfterViewInit(): void {
    this.loadUser();
  }

  //* id INT NOT NULL, 
  //* NombreCompleto VARCHAR(250)  NOT NULL, 
  //* NumeroCedula VARCHAR(15) UNIQUE NOT NULL, 
  //* Estatus1 BIT DEFAULT 0 NOT NULL,  -- Activo o Inactivo
  //* Correo VARCHAR(100)  NOT NULL, 
  //* Telefono VARCHAR(50)  NOT NULL
  //* Confirmado BIT 

  formularioReactive(): void {
    this.memberForm = this.fb.group({
      //? Hidden
      id: null,
      //? Fieldtext
      nombre_completo: [null, Validators.compose([
        Validators.required, Validators.minLength(10), Validators.maxLength(150), Validators.pattern(this.regexNombre)])
      ],
      //? Fieldtext - Mask
      cedula: [null, Validators.compose([
        Validators.required, Validators.minLength(9), Validators.maxLength(15), Validators.pattern(/([1-7]{1})(\d{4})(\d{4})$/)])
      ],
      //? Radio button
      status: [null, Validators.required],
      //? Field text
      correo: [null, Validators.compose([
        Validators.required, Validators.minLength(10), Validators.maxLength(100), Validators.email,
        Validators.pattern(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)])
      ],
      //? Field text - Mask
      telefono: [null, Validators.compose([
        Validators.required, Validators.minLength(8), Validators.maxLength(50), Validators.pattern(/[0-9]{4}[0-9]{2}[0-9]{3}$/)])
      ],
      //? Checkbox
      confirmado: [null, Validators.requiredTrue],
    });
  }

  //* Para teléfono y cédula
  //? [specialCharacters]="[ '[' ,']' , '\\' ]"
  //? preffix / suffix
  //* {{ | mask: '0000-00-000'}}
  //* Usar placeholder


  loadUser(): void {
    this.authService.currentUser.subscribe((x) => (this.currentUser = x));

    this.authService.isAuthenticated.subscribe(
      (valor) => (this.isAutenticated = valor)
    );
  }

  //* Método encargado de crear miembros
  crearMiembro(): void {
    //* Verificar validación del form
    if (this.memberForm.invalid || !this.isAutenticated) {
      this.notificacion.mensaje(
        'Form - Miembro',
        `Ha ocurrido un error con el formulario, por favor verificar todos los campos!!`,
        TipoMessage.error
      );
      return;
    }

    //! Igualmente resulta necesario válidar que no exista alguien ya con esa cédula o correo electrónico

    //* Establecer submit verdadero
    this.submitted = true;

    //* patch de estado     this.videojuegoForm.patchValue({ generos:gFormat});
    let stateValue: number = this.memberForm.value.status == true ? 1 : 0;

    //? Es necesario inster a confirmado en la N:M Confirmado NECESITA cast en el back

    this.memberForm.patchValue({ status: stateValue });

    console.log(this.memberForm.value);
    //* Acción API create enviando toda la informacion del formulario
    this.gService.create('save-member', this.memberForm.value)
      .pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
        //* Obtener la respuesta del
        this.respMember = data;
        this.notificacion.mensaje(
          'Form - Miembro',
          `¡Se ha añadido el miembro ${this.memberForm.value.nombre_completo || ''} al padrón!`,
          TipoMessage.success
        );
        //* Llamamos al registro de asistencia
        this.registerAssistance();
      });
  }

  //* Método encargado de registrar asistencia al evento
  registerAssistance = (): void => {
    //* Formato del confirmado
    let confirmed: number = this.memberForm.value.confirmado == true ? 1 : 0;
    //* Formato de la fecha default para el API
    const dateNow = new Date();
    //* Respuesta que se le va a enviar al API en el formato solicitado
    const rspData: any = {
      event_id: this.idEvent,
      //? member_id: this.memberForm.value.id, //? No se necesita en este caso
      confirmed: confirmed,
      date_time: dateNow,
      was_present: 0, //* Default
      id_usuario: this.currentUser.user.id
    };
    this.gService.create('register-assistance', rspData)
      .pipe(takeUntil(this.destroy$)).
      subscribe((data: any) => {
        this.onBack(); //* Regresamos!
      });
  }

  //? Por si acaso llega a ser necesario idk
  actualizarMiembro(): void {
    //* Ajustamos los validators de los controles
    //! La cédula no es un campo editable, ni correo y además, deberían ser unique
    this.memberForm.get('nombre_completo').removeValidators(Validators.required);
    this.memberForm.get('cedula').removeValidators(Validators.required);
    this.memberForm.get('correo').removeValidators(Validators.required);
    this.memberForm.get('telefono').removeValidators(Validators.required);

    //* Verificar validación del form
    if (this.memberForm.invalid) {
      return;
    }

    //* Establecer submit verdadero
    this.submitted = true;

    this.notificacion.mensaje(
      'Form - Miembro',
      `Se ha actualizado la información del miembro ${this.memberForm.value.nombre_completo || ''} del padrón`,
      TipoMessage.info
    );
  }

  //* Méotodo encargado del manejo de errores
  public errorHandling = (control: string, error: string): any => {
    return this.memberForm.controls[control].hasError(error);
  };

  //* Reiniciamos
  onReset(): void {
    this.submitted = false;
    this.memberForm.reset();
  }

  onBack(): void {
    this.router.navigate([`member/all-padron/${this.idEvent}`]);
  }

  //* Es totalmente necesario el query params del id, por lo que si no se recibe se redirecciona
  onErrorBack(): void {
    this.notificacion.mensaje(
      'Form - miembro',
      'Ha ocurrido un error, no se específico el evento para añadir al miembro',
      TipoMessage.error
    );
    this.router.navigate(['evento/all']);
  }

  //* Desinscribirse
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }


}
