import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { min } from 'rxjs';
import { AuthenticationService } from 'src/app/share/authentication.service';
import { NotificacionService, TipoMessage } from 'src/app/share/notification.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css'],
})

export class UserLoginComponent implements OnInit {
  hide = true;
  formulario: FormGroup;
  makeSubmit: boolean = false;
  infoUsuario: any;
  constructor(
    public fb: FormBuilder,
    private authService: AuthenticationService,
    private notificacion: NotificacionService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.reactiveForm();
  }

  //* Definir el formulario con su reglas de validación
  //? Recuerde colocarlo en el html igualmente
  reactiveForm() {
    this.formulario = this.fb.group({
      username: [null, Validators.compose([
        Validators.required, Validators.pattern('^[a-zA-Z0-9_.-]*$'), Validators.minLength(5), Validators.maxLength(16)
      ])],
      password: [null, Validators.compose([
        Validators.required, Validators.minLength(8), Validators.maxLength(32)
      ])],
    });
  }

  ngOnInit(): void {
    this.mensajes();
  }

  mensajes() {
    let register = false; //* Si se registra
    let auth = ''; //* El auth guard realiza esto
    //* Obtener parámetros de la URL
    this.route.queryParams.subscribe((params) => {
      register = params['register'] === 'true' || false;
      auth = params['auth'] || '';
      if (register) {
        this.notificacion.mensaje(
          'Usuario',
          'Registro satisfactorio! Especifique su credenciales para ingresar',
          TipoMessage.success
        );
      }
      if (auth) {
        this.notificacion.mensaje(
          'Usuario',
          'Acceso denegado',
          TipoMessage.warning
        );
      }
    });

  }

  onReset() {
    this.formulario.reset();
  }

  submitForm() {
    this.makeSubmit = true;

    //* Validación
    if (this.formulario.invalid) {
      //* Notificar
      this.notificacion.mensaje(
        'Aviso - Usuario',
        'Ha ocurrido un error a la hora de enviar el formulario, verifique los campos',
        TipoMessage.warning
      );
      return;
    }

    //? WARNING, recuerde cambiar la ruta global de las APIs y la ruta de dicha API en FLASK
    //! La validación de si hay o no Match, debe hacerse en el back, retornar el error 401!
    //? Igual leer bien la respuesta del apí con la data en el authservice
    this.authService.loginUser(this.formulario.value)
      .subscribe((respuesta: any) => {
        //* Redirigimos si pasa bien todo
        //? Tener cuidado de como reaccione Python nada más
        this.router.navigate(['/']);
      })
  }

  /* 
  * Manejar errores de formulario en Angular
   */

  public errorHandling = (control: string, error: string) => {
    return (
      this.formulario.controls[control].hasError(error) &&
      this.formulario.controls[control].invalid &&
      (this.makeSubmit || this.formulario.controls[control].touched)
    );
  };
}
