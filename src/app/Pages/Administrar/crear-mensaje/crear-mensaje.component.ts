import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecaudoService } from 'src/app/services/recaudo.service';
import * as alertify from 'alertifyjs';

@Component({
  selector: 'app-crear-mensaje',
  templateUrl: './crear-mensaje.component.html',
  styleUrls: ['./crear-mensaje.component.scss'],
})
export class CrearMensajeComponent  implements OnInit {

  //#region Variables
  empresa: string|null =localStorage.getItem('empresaCOD');
  arqueo: string|null = localStorage.getItem('numeroArqueo');
  usuario: string|null = localStorage.getItem('usuario');
  codigoCaja: string|null = localStorage.getItem('condigoCaja');
  puntoPago: string|null =localStorage.getItem('puntoPago');
  token: string|null =localStorage.getItem('token');

  datos={
    EMPRESA: this.empresa,
    CODIGO_PUNTO_PAGO: "",
    USUARIO:this.usuario,
    TITULO_MENSAJE:"",
    MENSAJE:"",
    TOKEN:this.token
  }
  punto_pago="";
  selectedValues: string[] = []; // Valores seleccionados (CODIGO_PUNTO_PAGO)
  selectedObjects: any[] = []; 

  datosModificar={
    EMPRESA: this.empresa,
    CODIGO_PUNTO_PAGO: "",
    ID_MENSAJE: "",
    ESTADO: "",
    USUARIO:this.usuario,
    TITULO_MENSAJE:"",
    MENSAJE:"",
    TOKEN:this.token
  }
  Editando:any;
  editar:boolean=false;

  listadoMensajesActivos:any[]=[];
  listadoMensajesInactivos:any[]=[];

  listadoPuntos: any []=[];
  respuesta:any;

  //#endregion

  constructor(private recaudoService: RecaudoService, private router: Router) { }

  ngOnInit() {
    this.ListarPuntosPago();
  }

  //#region Consulta a API

  ListarPuntosPago(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.getListarPuntosPagoAdmin(Number(this.empresa),this.usuario,this.token).subscribe(
        (data: any) => {
          this.listadoPuntos= data.PUNTOS_PAGO;
        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    }

  }

  guardarSeleccion() {
    this.selectedObjects = this.selectedValues.map(codigo => ({
      CODIGO_PUNTO_PAGO: codigo,
    }));
    console.log('Objetos seleccionados:', this.selectedObjects);
  }

  ListarMensajes(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.getListarMensajes(Number(this.empresa),Number(this.punto_pago),this.usuario,this.token).subscribe(
        (data: any) => {
          this.listadoMensajesActivos= data.MENSAJES_ACTIVOS;
          this.listadoMensajesInactivos= data.MENSAJES_INACTIVOS;
        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    }

  }

  //#endregion

  //#region Envio a API

  Eliminar(respuesta1:any){
    this.datosModificar={
      EMPRESA: this.empresa,
      CODIGO_PUNTO_PAGO: this.punto_pago,
      ID_MENSAJE: respuesta1.ID_MENSAJE,
      ESTADO: "I",
      USUARIO:this.usuario,
      TITULO_MENSAJE:respuesta1.TITULO,
      MENSAJE:respuesta1.MENSAJE,
      TOKEN:this.token
    }

    this.recaudoService.postModificarMensaje(this.datosModificar).subscribe({
      next: data => {
        this.respuesta = data;
        if(this.respuesta.COD=='200'){
          alertify.success(this.respuesta.RESPUESTA);
          this.datosModificar={
            EMPRESA: this.empresa,
            CODIGO_PUNTO_PAGO: "",
            ID_MENSAJE: "",
            ESTADO: "",
            USUARIO:this.usuario,
            TITULO_MENSAJE:"",
            MENSAJE:"",
            TOKEN:this.token
          }
          this.ListarMensajes();
          }
        else  {
          alertify.error(this.respuesta.RESPUESTA);
        }

      },
      error: error => {
        console.error("Respuesta:",error);
      }
    });
  }

  Activar(respuesta1:any){
    this.datosModificar={
      EMPRESA: this.empresa,
      CODIGO_PUNTO_PAGO: this.punto_pago,
      ID_MENSAJE: respuesta1.ID_MENSAJE,
      ESTADO: "A",
      USUARIO:this.usuario,
      TITULO_MENSAJE:respuesta1.TITULO,
      MENSAJE:respuesta1.MENSAJE,
      TOKEN:this.token
    }

    this.recaudoService.postModificarMensaje(this.datosModificar).subscribe({
      next: data => {
        this.respuesta = data;
        if(this.respuesta.COD=='200'){
          alertify.success(this.respuesta.RESPUESTA);
          this.datosModificar={
            EMPRESA: this.empresa,
            CODIGO_PUNTO_PAGO: "",
            ID_MENSAJE: "",
            ESTADO: "",
            USUARIO:this.usuario,
            TITULO_MENSAJE:"",
            MENSAJE:"",
            TOKEN:this.token
          }
          this.ListarMensajes();
          }
        else  {
          alertify.error(this.respuesta.RESPUESTA);
        }

      },
      error: error => {
        console.error("Respuesta:",error);
      }
    });
  }


  Editar(respuesta1:any){
    this.editar=true;
    this.datos={
      EMPRESA: this.empresa,
      CODIGO_PUNTO_PAGO: this.datos.CODIGO_PUNTO_PAGO,
      USUARIO:this.usuario,
      TITULO_MENSAJE: respuesta1.TITULO,
      MENSAJE:respuesta1.MENSAJE,
      TOKEN:this.token
    }
    this.Editando=respuesta1;
  }

  EditarEnviar(){
    this.datosModificar={
      EMPRESA: this.empresa,
      CODIGO_PUNTO_PAGO: this.datos.CODIGO_PUNTO_PAGO,
      ID_MENSAJE: this.Editando.ID_MENSAJE,
      ESTADO: "A",
      USUARIO:this.usuario,
      TITULO_MENSAJE:this.datos.TITULO_MENSAJE,
      MENSAJE:this.datos.MENSAJE,
      TOKEN:this.token
    }
    this.recaudoService.postModificarMensaje(this.datosModificar).subscribe({
      next: data => {
        this.respuesta = data;
        if(this.respuesta.COD=='200'){
          alertify.success(this.respuesta.RESPUESTA);
          this.datosModificar={
            EMPRESA: this.empresa,
            CODIGO_PUNTO_PAGO: "",
            ID_MENSAJE: "",
            ESTADO: "",
            USUARIO:this.usuario,
            TITULO_MENSAJE:"",
            MENSAJE:"",
            TOKEN:this.token
          }

          this.datos={
            EMPRESA: this.empresa,
            CODIGO_PUNTO_PAGO: this.datos.CODIGO_PUNTO_PAGO,
            USUARIO:this.usuario,
            TITULO_MENSAJE:"",
            MENSAJE:"",
            TOKEN:this.token
          }
          this.editar=false;
          this.ListarMensajes();
          }
        else  {
          alertify.error(this.respuesta.RESPUESTA);
        }

      },
      error: error => {
        console.error("Respuesta:",error);
      }
    });
  }

  // crearMensaje(){
  //   this.recaudoService.postCrearMensaje(this.datos).subscribe({
  //     next: data => {
  //       this.respuesta = data;
  //       if(this.respuesta.COD=='200'){
  //         alertify.success(this.respuesta.RESPUESTA);
  //         this.datos={
  //           EMPRESA: this.empresa,
  //           CODIGO_PUNTO_PAGO: this.datos.CODIGO_PUNTO_PAGO,
  //           USUARIO:this.usuario,
  //           TITULO_MENSAJE:"",
  //           MENSAJE:"",
  //           TOKEN:this.token
  //         }
  //         this.ListarMensajes();
  //         }
  //       else  {
  //         alertify.error(this.respuesta.RESPUESTA);
  //       }

  //     },
  //     error: error => {
  //       console.error("Respuesta:",error);
  //     }
  //   });
    
  // }

  crearMensaje() {
    this.selectedObjects.forEach(obj => {
      this.datos.CODIGO_PUNTO_PAGO = obj.CODIGO_PUNTO_PAGO;
  
      this.recaudoService.postCrearMensaje(this.datos).subscribe({
        next: data => {
          this.respuesta = data;
          
          if (this.respuesta.COD == '200') {
            alertify.success(`Mensaje enviado al código: ${obj.CODIGO_PUNTO_PAGO}`);
          } else {
            alertify.error(`Error al enviar mensaje al código: ${obj.CODIGO_PUNTO_PAGO}`);
          }
        },
        error: error => {
          alertify.error(`Error al enviar mensaje al código: ${obj.CODIGO_PUNTO_PAGO}`);
          console.error(`Error al enviar mensaje al código: ${obj.CODIGO_PUNTO_PAGO}`, error);
        }
      });
    });
    this.datos={
      EMPRESA: this.empresa,
      CODIGO_PUNTO_PAGO: "",
      USUARIO:this.usuario,
      TITULO_MENSAJE:"",
      MENSAJE:"",
      TOKEN:this.token
    }
    this.ListarMensajes();
  }
  //#endregion

}
