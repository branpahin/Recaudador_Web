import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecaudoService } from 'src/app/services/recaudo.service';
import * as alertify from 'alertifyjs';

@Component({
  selector: 'app-anulacion-pagos',
  templateUrl: './anulacion-pagos.component.html',
  styleUrls: ['./anulacion-pagos.component.scss'],
})
export class AnulacionPagosComponent  implements OnInit {

  empresa: string|null = localStorage.getItem('empresaCOD');
  usuario: string|null = localStorage.getItem('usuario');
  token: string|null = localStorage.getItem('token');

  puntoPago="";
  listadoAnulaciones:any[]=[];
  resultado:any;
  listadoPuntos:any;
  crear:boolean=false;
  editar:boolean=false;


  datos={
    EMPRESA: this.empresa,
    CODIGO_PUNTO_PAGO: "",
    NUMERO_ARQUEO:"",
    NUMERO_MOVIMIENTO:"",
    NUMERO_MOVIMIENTO_DET:"",
    COMENTARIO:"",
    USUARIO:this.usuario,    
    TOKEN:this.token
  }

  datosEliminar={
    EMPRESA: this.empresa,
    CODIGO_PUNTO_PAGO: "",
    ID_ANULACION: "",
    NUMERO_MOVIMIENTO:"",
    NUMERO_MOVIMIENTO_DET:"",
    USUARIO:this.usuario,    
    TOKEN:this.token
  }



  constructor(private recaudoService: RecaudoService, private router: Router) { }

  ngOnInit() {
    this.ListarPuntosPago();
  }

//Cerrar vista de crear o editar
  cerrarTabla(){
    this.crear=false;
    this.editar=false;
    this.ListarAnulaciones();
  }


//Consultar puntos de pago
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


//consultar anulaciones realizadas
  ListarAnulaciones(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {

      this.recaudoService.getListarAnulacionesPagos(Number(this.empresa),Number(this.puntoPago),this.usuario,this.token).subscribe(
        (data: any) => {
          console.log('Respuesta del servicio:', data);
          this.listadoAnulaciones= data.MOVIMIENTOS_ANULADOS;
        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    }

  }


//Mostrar mas información del listado 
  MostrarMas(respuesta: any) {
    respuesta.selected = !respuesta.selected;
  }


//Mostrar vista para creación de anulación  
  Crear(){

    this.crear=true;

    this.datos={
      EMPRESA: this.empresa,
    CODIGO_PUNTO_PAGO: "",
    NUMERO_ARQUEO:"",
    NUMERO_MOVIMIENTO:"",
    NUMERO_MOVIMIENTO_DET:"",
    COMENTARIO:"",
    USUARIO:this.usuario,    
    TOKEN:this.token
    };

    this.ListarAnulaciones();
 
}

//Eliminar anulación
  Eliminar(respuesta1:any){
    this.datosEliminar={
      EMPRESA: this.empresa,
      CODIGO_PUNTO_PAGO: respuesta1.CODIGO_PUNTO_PAGO,
      ID_ANULACION: respuesta1.ID_ANULACION,
      NUMERO_MOVIMIENTO:respuesta1.NUMERO_MOVIMIENTO,
      NUMERO_MOVIMIENTO_DET:respuesta1.NUMERO_MOVIMIENTO_DET,
      USUARIO:this.usuario,    
      TOKEN:this.token
    }
    this.EliminarAnulacion();
    
  }


//Enviar anulación creada
  CrearAnulacion(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.postCrearAnulacionPago(this.datos).subscribe(
        (data: any) => {
          console.log('Respuesta del servicio:', data);
          this.resultado= data;
          if(this.resultado.COD=="200"){
            alertify.success(this.resultado.RESPUESTA);
            this.datos={
              EMPRESA: this.empresa,
              CODIGO_PUNTO_PAGO: "",
              NUMERO_ARQUEO:"",
              NUMERO_MOVIMIENTO:"",
              NUMERO_MOVIMIENTO_DET:"",
              COMENTARIO:"",
              USUARIO:this.usuario,    
              TOKEN:this.token
            };
          }
          else {
            alertify.error(this.resultado.RESPUESTA);
          }
          
        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
          alertify.error(error);
        }
      );
      
    }
  }


//Enviar eliminación de la anulación  
  EliminarAnulacion(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.postEliminarAnulacionPago(this.datosEliminar).subscribe(
        (data: any) => {
          console.log('Respuesta del servicio:', data);
          this.resultado= data;
          if(this.resultado.COD=="200"){
            alertify.success(this.resultado.RESPUESTA);
            this.ListarAnulaciones();
            
          }else {
            alertify.error(this.resultado.RESPUESTA);
          }
          
        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
          alertify.error(error);
        }
      );
      
    }
  }


}
