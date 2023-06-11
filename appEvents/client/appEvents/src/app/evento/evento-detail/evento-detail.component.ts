import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from 'src/app/share/generic.service';

@Component({
  selector: 'app-evento-detail',
  templateUrl: './evento-detail.component.html',
  styleUrls: ['./evento-detail.component.css']
})
export class EventoDetailComponent implements OnInit {
  datos: any; //* Datos del API
  datosDialog: any; //* Datos del dialog
  destroy$: Subject<boolean> = new Subject<boolean>(); //* Destruir cuando sea necesario

  constructor(
    @Inject(MAT_DIALOG_DATA) data,
    private dialogRef: MatDialogRef<EventoDetailComponent>,
    private gService: GenericService
  ) {
    this.datosDialog = data;
  }

  ngOnInit(): void {
    if(this.datosDialog.id){
      this.obtenerEvento(this.datosDialog.id);
    }
  }

  obtenerEvento(id: any){
    this.gService
    .get('get-event', `event_id=${id}`)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data:any)=>{
        this.datos=data; 
    });
  }

  close(){
    this.dialogRef.close();
  }

}
