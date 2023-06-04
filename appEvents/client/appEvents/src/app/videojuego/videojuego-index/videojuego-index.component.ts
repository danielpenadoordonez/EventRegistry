import { Component } from '@angular/core';
import { map, takeUntil } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import { GenericService } from 'src/app/share/generic.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { VideojuegoDetailComponent } from '../videojuego-detail/videojuego-detail.component';
import { CartService } from 'src/app/share/cart.service';
import { NotificacionService, TipoMessage } from 'src/app/share/notification.service';

@Component({
  selector: 'app-videojuego-index',
  templateUrl: './videojuego-index.component.html',
  styleUrls: ['./videojuego-index.component.css']
})
export class VideojuegoIndexComponent {
  datos: any;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private gSevice: GenericService,
    private dialog:MatDialog,
    private cartService:CartService,
    private notificacion:NotificacionService
  ) {
    this.listaVideojuegos();
  }

  listaVideojuegos() {
    this.gSevice
      .list('videojuego/')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        console.log(data);
        this.datos = data;
      });
  }
  detalleVideojuego(id:number){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.disableClose=false;
    dialogConfig.data={
      id:id
    };
    this.dialog.open(VideojuegoDetailComponent,dialogConfig);
  }
  comprar(id:number){
    this.gSevice
    .get('videojuego',id)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data:any)=>{
      //Agregar videojuego obtenido del API al carrito
      this.cartService.addToCart(data);
      //Notificar al usuario
      this.notificacion.mensaje(
        'Orden',
        'Videojuego: '+data.nombre+' agregado a la orden',
        TipoMessage.success
      );
    });
  }
}
