import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecaudoService } from 'src/app/services/recaudo.service';
import * as alertify from 'alertifyjs';

interface Datos{
  EMPRESA:string | null;
  CODIGO_PUNTO_PAGO:string;
  CODIGO_CAJA?:string;
  NOMBRE:string;
  ESTADO:string;
  USUARIO:string | null;
  TOKEN:string | null;
}

@Component({
  selector: 'app-administrar-cajas',
  templateUrl: './administrar-cajas.component.html',
  styleUrls: ['./administrar-cajas.component.scss'],
})
export class AdministrarCajasComponent  implements OnInit {
  empresa: string|null = localStorage.getItem('empresaCOD');
  usuario: string|null = localStorage.getItem('usuario');
  token: string|null = localStorage.getItem('token');


  customPickerOptions: any;
  listadoCajasActivas: any []=[];
  listadoCajasInactivas: any []=[];
  listadoPuntos: any []=[];
  listadoRoles: any []=[];
  listadoEstadoUsuario: any []=[];
  UsuariosEncargado:any[]=[];
  resultado:any;
  listEmpresas: any[] = [];
  pago: any[] = [];
  documento:any[] = [];
  puntoPago="";
  horaMax="";
  inicio="";
  fin="";
  horaInicio="";
  horaFin="";
  lstFormaPago="";
  estado="";

  datos: Datos ={
    EMPRESA:this.empresa,
    CODIGO_PUNTO_PAGO:"",
    NOMBRE:"",
    ESTADO:"",
    USUARIO:this.usuario,
    TOKEN:this.token
  };

  crear:boolean=false;
  editar:boolean=false;

  constructor(private recaudoService: RecaudoService, private router: Router) { }

  ngOnInit() { 
    this.ListarPuntosPago();
  }

//Activar modulo visual para creación
  Crear(){
    this.crear=true;

    this.datos={
      EMPRESA:this.empresa,
      CODIGO_PUNTO_PAGO:"",
      NOMBRE:"",
      ESTADO:"",
      USUARIO:this.usuario,
      TOKEN:this.token
    };

    this.obtenerEmpresas();
    this.ListarRoles();
    this.ListarPuntosPago();
    this.ListarEstadoUsuario();
    this.consultarDocumento();
  }

//Cierre de vista crear o editar
  cerrarTabla(){
    this.crear=false;
    this.editar=false;
    this.ListarCajas();
  }

//Consultar puntos de pago
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


//Consultar Empresas
  obtenerEmpresas(){

    this.recaudoService.getListEmpresas().subscribe(
      (data: any) => {
        this.listEmpresas = data.EMPRESAS; 
        
      },
      (error) => {
        console.error('Error al obtener empresas:', error);
      }
    );
   
  }


//Consultar Cajas
  ListarCajas(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {

      this.recaudoService.getConsultarCajasPunto(Number(this.empresa),Number(this.puntoPago),this.usuario,this.token).subscribe(
        (data: any) => {
          console.log('Respuesta del servicio:', data);
            this.listadoCajasActivas= data.CAJAS_ACTIVAS;
            this.listadoCajasInactivas= data.CAJAS_INACTIVAS;

          
        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    }

  }


//Consultar Roles existentes
  ListarRoles(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {

      this.recaudoService.getListadoRoles(Number(this.empresa),this.usuario,this.token).subscribe(
        (data: any) => {
          console.log('Respuesta del servicio:', data);
          this.listadoRoles= data.LISTADO_ROLES;
        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    }

  }


//Consultar Estados de usuario
  ListarEstadoUsuario(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {

      this.recaudoService.getListadoEstadoUsuarios(Number(this.empresa),this.usuario,this.token).subscribe(
        (data: any) => {
          console.log('Respuesta del servicio:', data);
          this.listadoEstadoUsuario= data.ESTADOS_USUARIOS;
        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    }

  }


//Consultar tipos de documentos
  consultarDocumento(){
    if (this.usuario !== null && this.token !== null && this.empresa !== null) {
      this.recaudoService.getTiposDocumento(Number(this.empresa), this.usuario, this.token).subscribe((data:any)=>{
        this.documento=data.TIPOS_DOCUMENTO;
      })
    }
  }


//Crear caja
  CrearCaja(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.postCrearCaja(this.datos).subscribe(
        (data: any) => {
          console.log('Respuesta del servicio:', data);
          this.resultado= data;
          if(this.resultado.COD=="200"){
            alertify.success(this.resultado.RESPUESTA);
            this.datos={
              EMPRESA:this.empresa,
              CODIGO_PUNTO_PAGO:"",
              NOMBRE:"",
              ESTADO:"",
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

  
 //Editar Caja 
  Editar(respuesta1: {

    EMPRESA:any,
    CODIGO_PUNTO_PAGO:any,
    CODIGO_CAJA:any,
    NOMBRE_CAJA:any,
    ESTADO:any,
    IDENTIFICADOR:any}){

      this.crear=true;

      this.editar=true;
      
      this.datos={
        EMPRESA:respuesta1.EMPRESA,
        CODIGO_PUNTO_PAGO:respuesta1.CODIGO_PUNTO_PAGO,
        CODIGO_CAJA:respuesta1.CODIGO_CAJA,
        NOMBRE:respuesta1.NOMBRE_CAJA,
        ESTADO:respuesta1.ESTADO,
        USUARIO:this.usuario,
        TOKEN:this.token
      };

      this.obtenerEmpresas();
      this.ListarRoles();
      this.ListarPuntosPago();
      this.ListarEstadoUsuario();
      this.consultarDocumento();
  }


//Enviar modificacion de la edicion de caja
  ModificarCaja(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.postModificarCaja(this.datos).subscribe(
        (data: any) => {
          console.log('Respuesta del servicio:', data);
          this.resultado= data;
          if(this.resultado.COD=="200"){
            alertify.success(this.resultado.RESPUESTA);
            this.cerrarTabla();
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
}
