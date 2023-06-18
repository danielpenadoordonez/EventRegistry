import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module';
import { ShareModule } from './share/share.module';
import { HomeModule } from './home/home.module';
import { UserModule } from './user/user.module';
import { VideojuegoModule } from './videojuego/videojuego.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { OrdenModule } from './orden/orden.module';
import { HttpErrorInterceptorService } from './share/http-error-interceptor.service';
import { EventoModule } from './evento/evento.module';
import { MiembroModule } from './miembro/miembro.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, // * importar HttpClientModule después BrowserModule. 
    // * comunicarse con un servidor a través del protocolo HTTP 
    HttpClientModule, // * Debe agregar el import respectivo // importar otras dependencias que sean necesario cargar en el componente principal.
    
    // ? importar los módulos creados propios en orden 
    CoreModule, 
    ShareModule, 
    HomeModule, 
    UserModule, 
    VideojuegoModule, 
    OrdenModule,
    EventoModule,
    MiembroModule,
    // ? al final el gestor de las rutas principal 
    AppRoutingModule,
  ],
  providers: [ { provide: HTTP_INTERCEPTORS, 
    useClass: HttpErrorInterceptorService, multi: true }],
  bootstrap: [AppComponent],
})
export class AppModule {}
