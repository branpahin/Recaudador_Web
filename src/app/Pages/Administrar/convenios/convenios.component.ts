import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecaudoService } from 'src/app/services/recaudo.service';
import * as alertify from 'alertifyjs';


@Component({
  selector: 'app-convenios',
  templateUrl: './convenios.component.html',
  styleUrls: ['./convenios.component.scss'],
})
export class ConveniosComponent  implements OnInit {

  empresa: string|null =localStorage.getItem('empresaCOD');
  arqueo: string|null = localStorage.getItem('numeroArqueo');
  usuario: string|null = localStorage.getItem('usuario');
  codigoCaja: string|null = localStorage.getItem('condigoCaja');
  puntoPago: string|null =localStorage.getItem('puntoPago');
  token: string|null =localStorage.getItem('token');

  datos={
    EMPRESA: this.empresa,
    NOMBRE: "",
    NIT:"",
    CIERRE_CAJAS:"",
    USUARIO:this.usuario,
    TOKEN:this.token
  }

  datosModificar={
    EMPRESA: this.empresa,
    ID_CONVENIO: "",
    NOMBRE: "",
    NIT: "",
    CIERRE_CAJAS:"",
    ESTADO:"",
    USUARIO:this.usuario,
    TOKEN:this.token
  }
  Editando:any;
  editar:boolean=false;
  mostrarCampos:boolean=false;

  listadoConveniosActivos:any[]=[];
  listadoConveniosInactivos:any[]=[];

  listadoPuntos: any []=[];
  respuesta:any;

  constructor(private recaudoService: RecaudoService) { }

  ngOnInit() {
    this.ListarConvenios();
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

  MostrarCampoCrear(){
    this.mostrarCampos=true;
  }

  ListarConvenios(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.getListarConvenios(Number(this.empresa),this.usuario,this.token).subscribe(
        (data: any) => {
          console.log('Respuesta del servicio:', data);
          this.listadoConveniosActivos= data.CONVENIOS_ACTIVOS;
          this.listadoConveniosInactivos= data.CONVENIOS_INACTIVOS;
        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    }

  }

  Eliminar(respuesta1:any){
    this.datosModificar={
      EMPRESA: this.empresa,
      ID_CONVENIO: respuesta1.CODIGO_CONVENIO,
      NOMBRE: respuesta1.NOMBRE_CONVENIO,
      NIT: respuesta1.NIT_CONVENIO,
      CIERRE_CAJAS:respuesta1.CIERRE_CAJAS,
      ESTADO:"I",
      USUARIO:this.usuario,
      TOKEN:this.token
    }

    this.recaudoService.postModificarConvenio(this.datosModificar).subscribe({
      next: data => {
        this.respuesta = data;
        if(this.respuesta.COD=='200'){
          alertify.success(this.respuesta.RESPUESTA);
          this.datosModificar={
            EMPRESA: this.empresa,
            ID_CONVENIO: "",
            NOMBRE: "",
            NIT: "",
            CIERRE_CAJAS:"",
            ESTADO:"",
            USUARIO:this.usuario,
            TOKEN:this.token
          }
          this.ListarConvenios();
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

  Activar(respuesta1:any){
    this.datosModificar={
      EMPRESA: this.empresa,
      ID_CONVENIO: respuesta1.CODIGO_CONVENIO,
      NOMBRE: respuesta1.NOMBRE_CONVENIO,
      NIT: respuesta1.NIT_CONVENIO,
      CIERRE_CAJAS: respuesta1.CIERRE_CAJAS,
      ESTADO:"A",
      USUARIO:this.usuario,
      TOKEN:this.token
    }

    this.recaudoService.postModificarConvenio(this.datosModificar).subscribe({
      next: data => {
        this.respuesta = data;
        if(this.respuesta.COD=='200'){
          alertify.success(this.respuesta.RESPUESTA);
          this.datosModificar={
            EMPRESA: this.empresa,
            ID_CONVENIO: "",
            NOMBRE: "",
            NIT: "",
            CIERRE_CAJAS:"",
            ESTADO:"",
            USUARIO:this.usuario,
            TOKEN:this.token
          }
          this.ListarConvenios();
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


  Editar(respuesta1:any){
    this.editar=true;
    this.datos={
      EMPRESA: this.empresa,
      NOMBRE: respuesta1.NOMBRE_CONVENIO,
      NIT: respuesta1.NIT_CONVENIO,
      CIERRE_CAJAS:respuesta1.CIERRE_CAJAS,
      USUARIO:this.usuario,
      TOKEN:this.token
    }
    this.Editando=respuesta1;
    this.mostrarCampos=true;
  }

  EditarEnviar(){
    this.datosModificar={
      EMPRESA: this.empresa,
      ID_CONVENIO: this.Editando.CODIGO_CONVENIO,
      NOMBRE: this.datos.NOMBRE,
      NIT: this.datos.NIT,
      CIERRE_CAJAS: this.datos.CIERRE_CAJAS,
      ESTADO:this.Editando.ESTADO_CONVENIO,
      USUARIO:this.usuario,
      TOKEN:this.token
    }
    this.recaudoService.postModificarConvenio(this.datosModificar).subscribe({
      next: data => {
        this.respuesta = data;
        if(this.respuesta.COD=='200'){
          alertify.success(this.respuesta.RESPUESTA);
          this.datosModificar={
            EMPRESA: this.empresa,
            ID_CONVENIO: "",
            NOMBRE: "",
            NIT: "",
            CIERRE_CAJAS: "",
            ESTADO:"",
            USUARIO:this.usuario,
            TOKEN:this.token
          }

          this.datos={
            EMPRESA: this.empresa,
            NOMBRE: "",
            NIT:"",
            CIERRE_CAJAS:"",
            USUARIO:this.usuario,
            TOKEN:this.token
          }
          this.mostrarCampos=false;
          this.editar=false;
          this.ListarConvenios();
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

  crearConvenio(){
    this.recaudoService.postCrearConvenio(this.datos).subscribe({
      next: data => {
        this.respuesta = data;
        if(this.respuesta.COD=='200'){
          alertify.success(this.respuesta.RESPUESTA);
          this.datos={
            EMPRESA: this.empresa,
            NOMBRE: "",
            NIT:"",
            CIERRE_CAJAS:"",
            USUARIO:this.usuario,
            TOKEN:this.token
          }
          this.ListarConvenios();
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
