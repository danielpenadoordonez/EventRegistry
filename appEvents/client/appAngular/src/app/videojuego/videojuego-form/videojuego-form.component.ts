import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject,takeUntil } from 'rxjs';
import { GenericService } from 'src/app/share/generic.service';

@Component({
  selector: 'app-videojuego-form',
  templateUrl: './videojuego-form.component.html',
  styleUrls: ['./videojuego-form.component.css']
})
export class VideojuegoFormComponent implements OnInit{
  titleForm:string='Crear';
  destroy$: Subject<boolean> = new Subject<boolean>();
  generosList:any;
  videojuegoInfo:any;
  respVideojuego:any;
  submitted = false;
  videojuegoForm:FormGroup;
  idVideojuego: number = 0;
  isCreate:boolean=true;

  constructor(private fb: FormBuilder, private gService: GenericService,
    private router: Router,private activeRouter: ActivatedRoute) {
      this.formularioReactive();
      this.listaGeneros();
    
  }
  ngOnInit(): void {
    //Verificar si se envio un id por parametro para crear formulario para actualizar
    this.activeRouter.params.subscribe((params:Params)=>{
      this.idVideojuego=params['id'];
      if(this.idVideojuego!=undefined){
        this.isCreate=false;
        this.titleForm="Actualizar";
         //Obtener videojuego a actualizar del API
         this.gService.get('videojuego',this.idVideojuego).pipe(takeUntil(this.destroy$))
         .subscribe((data:any)=>{
          this.videojuegoInfo=data;
          this.videojuegoForm.setValue({
            id:this.videojuegoInfo.id,
            nombre:this.videojuegoInfo.nombre,
            descripcion:this.videojuegoInfo.descripcion,
            precio:this.videojuegoInfo.precio,
            publicar:this.videojuegoInfo.publicar,
            generos:this.videojuegoInfo.generos.map(({id}) => id)
          })
         });
      }

    });
   
       

  }
  //Crear Formulario
  formularioReactive(){
    //[null, Validators.required]
    this.videojuegoForm=this.fb.group({
      id:[null,null],
      nombre:[null,Validators.compose([
        Validators.required, Validators.minLength(2),Validators.maxLength(20)
      ])],
      descripcion:[null, Validators.required],
      precio: [null, Validators.required],
      publicar:[true, Validators.required],
      generos:[null, Validators.required]
    });
   
  }
  listaGeneros() {
    this.generosList = null;
    this.gService
      .list('genero')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        // console.log(data);
        this.generosList = data;
      });
  }
 
  public errorHandling = (control: string, error: string) => {
    return this.videojuegoForm.controls[control].hasError(error);
  };
  //Crear Videojueogo
  crearVideojuego(): void {
    //Establecer submit verdadero
    this.submitted=true;
    //Verificar validación
    if(this.videojuegoForm.invalid){
      return;
    }
    
    //Obtener id Generos del Formulario y Crear arreglo con {id: value}
    let gFormat:any=this.videojuegoForm.get('generos').value.map(x=>({['id']: x }));
    //Asignar valor al formulario 
    this.videojuegoForm.patchValue({ generos:gFormat});
    console.log(this.videojuegoForm.value);
    //Accion API create enviando toda la informacion del formulario
    this.gService.create('videojuego',this.videojuegoForm.value)
    .pipe(takeUntil(this.destroy$)) .subscribe((data: any) => {
      //Obtener respuesta
      this.respVideojuego=data;
      this.router.navigate(['/videojuego/all'],{
        queryParams: {create:'true'}
      });
    });
  
  }
  //Actualizar Videojuego
  actualizarVideojuego(){
    //Establecer submit verdadero
    this.submitted=true;
    //Verificar validación
    if(this.videojuegoForm.invalid){
      return;
    }
    
    //Obtener id Generos del Formulario y Crear arreglo con {id: value}
    let gFormat:any=this.videojuegoForm.get('generos').value.map(x=>({['id']: x }));
    //Asignar valor al formulario 
    this.videojuegoForm.patchValue({ generos:gFormat});
    console.log(this.videojuegoForm.value);
    //Accion API create enviando toda la informacion del formulario
    this.gService.update('videojuego',this.videojuegoForm.value)
    .pipe(takeUntil(this.destroy$)) .subscribe((data: any) => {
      //Obtener respuesta
      this.respVideojuego=data;
      this.router.navigate(['/videojuego/all'],{
        queryParams: {update:'true'}
      });
    });
  }
  onReset() {
    this.submitted = false;
    this.videojuegoForm.reset();
  }
  onBack() {
    this.router.navigate(['/videojuego/all']);
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    // Desinscribirse
    this.destroy$.unsubscribe();
  }
}
