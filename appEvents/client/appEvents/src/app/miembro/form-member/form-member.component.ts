import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from 'src/app/share/generic.service';
import { NotificacionService, TipoMessage } from 'src/app/share/notification.service';

@Component({
  selector: 'app-form-member',
  templateUrl: './form-member.component.html',
  styleUrls: ['./form-member.component.css']
})
export class FormMemberComponent implements OnInit {
  titleForm: string = 'Crear'; //* El título que puede variar en función de un posible update/create
  destroy$: Subject<boolean> = new Subject<boolean>(); //* Destruir la suscripción
  memberInfo: any; //* Respuesta del API ante un GET
  respMember: any; //* Respuesta del API a la hora de POST/PUT
  submitted = false; //* Subido
  memberForm: FormGroup; //* Formulario
  idMember: number = 0; //* En caso de trabajar un update
  idEvent: number; //* Sirve para redireccionar
  isCreate: boolean = true; //* Es crear o actualizar?

  constructor(private fb: FormBuilder, private gService: GenericService,
    private router: Router, private activeRouter: ActivatedRoute, private notificacion: NotificacionService) {
    this.formularioReactive(); //* Inicializamos el formulario
  }


  //* Método encargado de cargar y revisar si es update
  ngOnInit(): void {
    //* Cargamos el query params
    this.idEvent = this.activeRouter.snapshot.queryParams['id_event'] || 0;
    this.activeRouter.params.subscribe((params: Params) => {
      //* Cargamos el param
      this.idMember = params['id'];
      if (this.idMember != undefined) {
        this.isCreate = false;
        this.titleForm = "Actualizar";
        //* Obtener data del miembro en caso de ser update, a actualizar del API
        this.gService.get('get-member', `member_id=${this.idMember}`).pipe(takeUntil(this.destroy$))
          .subscribe((data: any) => {
            this.memberInfo = data;
            this.memberForm.setValue({
              id: this.memberInfo.id,
              nombre_completo: this.memberInfo.id,
              numero_cedula: this.memberInfo.numero_cedula,
              estado: this.memberInfo.estado,
              correo: this.memberInfo.crreo,
              telefono: this.memberInfo.telefono,
              confirmado: this.memberInfo.confirmado,
            })
          });
      }
    });
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
        Validators.required, Validators.minLength(10), Validators.maxLength(150), Validators.pattern(/(^[A-Za-z]{3,17})([ ]{0,1})([A-Za-z]{3,17})([ ]{0,1})([A-Za-z]{3,17})([ ]{0,1})([A-Za-z]{3,17})$/)])
      ],
      //? Fieldtext - Mask
      numero_cedula: [null, Validators.compose([
        Validators.required, Validators.minLength(11), Validators.maxLength(15), Validators.pattern(/([1-7]{1})[?-](\d{4})[?-](\d{4})$/)])
      ],
      //? Radio button
      estado: [null, Validators.required],
      //? Field text
      correo: [null, Validators.compose([
        Validators.required, Validators.minLength(10), Validators.maxLength(100), Validators.email,
        Validators.pattern(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)])
      ],
      //? Field text - Mask
      telefono: [null, Validators.compose([
        Validators.required, Validators.minLength(9), Validators.maxLength(50), Validators.pattern(/[0-9]{4}-[0-9]{2}-[0-9]{3}$/)])
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

  //* Méotodo encargado del manejo de errores
  public errorHandling = (control: string, error: string) => {
    return this.memberForm.controls[control].hasError(error);
  };


  //* Método encargado de crear miembros
  crearMiembro(): void {
    //* Verificar validación del form
    if (this.memberForm.invalid) {
      return;
    }

    //* Establecer submit verdadero
    this.submitted = true;

    console.log(this.memberForm.value);
    //* Acción API create enviando toda la informacion del formulario
    this.gService.create('videojuego', this.memberForm.value)
      .pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
        //* Obtener la respuesta del
        this.respMember = data;
        //! Notificar aquí y en update
        this.notificacion.mensaje(
          'Form - Miembro',
          `¡Se ha añadido el miembro ${this.memberForm.value.nombre_completo || ''} al padrón!`,
          TipoMessage.success
        );
        this.onBack(); //* Regresar
      });
  }

  //? Por si acaso llega a ser necesario idk
  actualizarMiembro(): void {
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

  //* Reiniciamos
  onReset(): void {
    this.submitted = false;
    this.memberForm.reset();
  }

  onBack(): void {
    this.router.navigate([`member/all-padron/${this.idEvent}`]);
  }

  //* Desinscribirse
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }


}
