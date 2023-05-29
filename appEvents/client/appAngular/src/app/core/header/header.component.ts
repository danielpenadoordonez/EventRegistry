import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/share/authentication.service';
import { CartService } from 'src/app/share/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isAutenticated: boolean;
  currentUser: any;
  qtyItems:Number = 0;
  constructor( private cartService: CartService,
    private authService: AuthenticationService,
    private router: Router) { }

  ngOnInit(): void {
      //Valores de prueba
   /*  this.isAutenticated=true;
    let user = { 
      name:"Tom", 
      email:"tHanks@prueba.com" 
   }; 
    this.currentUser=user; */
    //Subscripción a la información del usuario actual
    this.authService.currentUser.subscribe((x) => (this.currentUser = x));
    
    //Subscripción al booleano que indica si esta autenticado
    this.authService.isAuthenticated.subscribe(
      (valor) => (this.isAutenticated = valor)
    );
    //Suscribirse al observable que gestiona la cantidad de items del carrito
    this.cartService.countItems.subscribe((value)=>{
      this.qtyItems=value;
    });
  }
  login(){
    this.router.navigate(['usuario/login']);
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['usuario/login']);
  }

}
