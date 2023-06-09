import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthenticationService } from 'src/app/share/authentication.service';
import { GenericService } from 'src/app/share/generic.service';

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
  titleForm: string = 'Crear';
  destroy$: Subject<boolean> = new Subject<boolean>();
  eventInfo: any; //* Información del evento [UPDATE]
  respEvento: any; //* Respuesta del API GET/POST
  submitted = false; //* Subido o no
  eventoForm: FormGroup; //* Formulario
  idEvento: number = 0; //* Respuesta del query params en caso de ser update
  isCreate: boolean = true; //* Is create or update?

  constructor(private fb: FormBuilder,
    private authService: AuthenticationService, private gService: GenericService,
    private router: Router, private activeRouter: ActivatedRoute
  ) {
    this.formularioReactive();
  }

  ngOnInit() {
    //* Todo el desmadre
    this.cargarUsuario();
  }


  //* Cargamos la información del usuario desde el servicio
  cargarUsuario() {
    //* Subscripción a la información del usuario actual
    this.authService.currentUser.subscribe((x) => (this.currentUser = x));
    //? Este mismo será necesario para válidar en el HTML

    //* Subscripción al booleano que indica si esta autenticado
    this.authService.isAuthenticated.subscribe(
      (valor) => (this.isAutenticated = valor)
    );
  }

  //* Declaración y orden del grupo de componentes del formulario con sus correspondientes validación según sea necesario
  formularioReactive() {
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

  //* Filtro para datepicker
  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    //* Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  };

  crearEvento(){

  }

  actualizarEvento(){

  }

  //* Manejo de errores
  public errorHandling = (control: string, error: string) => {
    return this.eventoForm.controls[control].hasError(error);
  };

  //* Reiniciar
  onReset() {
    this.submitted = false;
    this.eventoForm.reset();
  }

  //* Volver
  onBack() {
    this.router.navigate(['/evento/all']);
  }

  //* Para destruir y desinscribirse
  ngOnDestroy() {
    this.destroy$.next(true);
    //* Desinscribirse
    this.destroy$.unsubscribe();
  }

}
