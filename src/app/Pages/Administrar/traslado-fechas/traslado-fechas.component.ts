import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecaudoService } from 'src/app/services/recaudo.service';
import * as alertify from 'alertifyjs';

@Component({
  selector: 'app-traslado-fechas',
  templateUrl: './traslado-fechas.component.html',
  styleUrls: ['./traslado-fechas.component.scss'],
})
export class TrasladoFechasComponent  implements OnInit {

  empresa: string|null =localStorage.getItem('empresaCOD');
  arqueo: string|null = localStorage.getItem('numeroArqueo');
  usuario: string|null = localStorage.getItem('usuario');
  codigoCaja: string|null = localStorage.getItem('condigoCaja');
  puntoPago: string|null =localStorage.getItem('puntoPago');
  token: string|null =localStorage.getItem('token');

  datos={
    EMPRESA:this.empresa,
    CODIGO_PUNTO_PAGO:"",
    FECHA:"",
    FECHA_TRASLADO:"",
    USUARIO:this.usuario,
    TOKEN:this.token
  }

  listadoPuntos: any []=[];
  respuesta:any;

  constructor(private recaudoService: RecaudoService, private router: Router) { }

  ngOnInit() {
    this.ListarPuntosPago();
  }


  ListarPuntosPago(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.getListarPuntosPagoAdmin(Number(this.empresa),this.usuario,this.token).subscribe(
        (data: any) => {
          console.log('Respuesta del servicio:', data);
          this.listadoPuntos= data.PUNTOS_PAGO;
        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    }

  }

  fecha(event:any){
    this.datos.FECHA = formatDate(event.detail.value, 'dd/MM/yyyy', 'en-US');
  }

  fechaTraslado(event:any){
    this.datos.FECHA_TRASLADO = formatDate(event.detail.value, 'dd/MM/yyyy', 'en-US');
  }

  TrasladarFecha(){
    this.recaudoService.postTrasladoFecha(this.datos).subscribe({
      next: data => {
        this.respuesta = data;
        if(this.respuesta.COD=='200'){
          alertify.success(this.respuesta.RESPUESTA);
          }
        else  {
          alertify.error(this.respuesta.RESPUESTA);
        }

      },
      error: error => {
        console.log("Respuesta:",error);
      }
    });
    
  }


}
