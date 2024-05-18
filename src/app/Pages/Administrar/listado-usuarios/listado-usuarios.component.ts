import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecaudoService } from 'src/app/services/recaudo.service';
import * as alertify from 'alertifyjs';

@Component({
  selector: 'app-listado-usuarios',
  templateUrl: './listado-usuarios.component.html',
  styleUrls: ['./listado-usuarios.component.scss'],
})
export class ListadoUsuariosComponent  implements OnInit {

  empresa: string|null = localStorage.getItem('empresaCOD');
  usuario: string|null = localStorage.getItem('usuario');
  token: string|null = localStorage.getItem('token');


  customPickerOptions: any;

  listadoUsuarios: any []=[];
  listadoPuntos: any []=[];
  listadoRoles: any []=[];
  listadoEstadoUsuario: any []=[];
  listadoSubPuntos:any[]=[];
  UsuariosEncargado:any[]=[];
  resultado:any;
  listEmpresas: any[] = [];
  pago: any[] = [];
  documento:any[] = [];
  horaMax="";
  inicio="";
  fin="";
  horaInicio="";
  horaFin="";
  lstFormaPago="";
  estado="";
  filteredList: any[] = [];
  searchTerm: string = '';

  datos={
    EMPRESA:this.empresa,
    USUARIO:"",
    TIPO_DOCUMENTO:"",
    DOCUMENTO:"",
    NOMBRE:"",
    DIRECCION:"",
    TELEFONO:"",
    ESTADO:"",
    PASSWORD:"",
    CODIGO_PUNTO_PAGO:"",
    SUB_PUNTO_PAGO:"",
    ROL:"",
    TOKEN:this.token
  };

  crear:boolean=false;
  editar:boolean=false;

  constructor(private recaudoService: RecaudoService, private router: Router) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.ListarUsuarios();
    this.filterList();
  }

  Crear(){
    this.crear=true;

    this.datos={
      EMPRESA:this.empresa,
      USUARIO:"",
      TIPO_DOCUMENTO:"",
      DOCUMENTO:"",
      NOMBRE:"",
      DIRECCION:"",
      TELEFONO:"",
      ESTADO:"",
      PASSWORD:"",
      CODIGO_PUNTO_PAGO:"",
      SUB_PUNTO_PAGO:"",
      ROL:"",
      TOKEN:this.token
    };

    this.obtenerEmpresas();
    this.ListarRoles();
    this.ListarPuntosPago();
    this.ListarEstadoUsuario();
    this.consultarDocumento();
    this.ListarSubPuntos();
  }

  cerrarTabla(){
    this.crear=false;
    this.editar=false;
    this.ListarUsuarios();
  }

  filterList() {
    if (!this.searchTerm.trim()) {
      this.filteredList = this.listadoUsuarios;
    } else {
      this.filteredList = this.listadoUsuarios.filter(item =>
        item.USUARIO.toLowerCase().includes(this.searchTerm.toLowerCase())
        || item.NOMBRE.toLowerCase().includes(this.searchTerm.toLowerCase())
        || item.NOMBRE_ESTADO.toLowerCase().includes(this.searchTerm.toLowerCase())
        || item.NOMBRES_CODIGO_PUNTO_PAGO.toLowerCase().includes(this.searchTerm.toLowerCase())
        || item.NOMBRE_ROL.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
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

  ListarUsuarios(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.getListadoUsuarios(Number(this.empresa),this.usuario,this.token).subscribe(
        (data: any) => {
          console.log('Respuesta del servicio:', data);
          if(this.estado=="1"){
            this.listadoUsuarios= data.USUARIOS_ACTIVOS;
          }
          else if(this.estado=="2"){
            this.listadoUsuarios= data.USUARIOS_INACTIVOS;
          }
          this.filteredList = this.listadoUsuarios;
          
        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    }

  }

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

  ListarSubPuntos(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.getListadoSubPuntos(Number(this.empresa),this.usuario,this.token).subscribe(
        (data: any) => {
          console.log('Respuesta del servicio:', data);
          this.listadoSubPuntos= data.LISTADO_SUB_PUNTOS_PAGO;
        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    }

  }

  consultarDocumento(){
    if (this.usuario !== null && this.token !== null && this.empresa !== null) {
      this.recaudoService.getTiposDocumento(Number(this.empresa), this.usuario, this.token).subscribe((data:any)=>{
        this.documento=data.TIPOS_DOCUMENTO;
      })
    }
  }

  CrearUsuario(){
    console.log("Enviado:",this.datos)
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.postCrearUsuario(this.datos).subscribe(
        (data: any) => {
          console.log('Respuesta del servicio:', data);
          this.resultado= data;
          if(this.resultado.COD=="200"){
            alertify.success(this.resultado.RESPUESTA);
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
      this.datos={
        EMPRESA:this.empresa,
        USUARIO:"",
        TIPO_DOCUMENTO:"",
        DOCUMENTO:"",
        NOMBRE:"",
        DIRECCION:"",
        TELEFONO:"",
        ESTADO:"",
        PASSWORD:"",
        CODIGO_PUNTO_PAGO:"",
        SUB_PUNTO_PAGO:"",
        ROL:"",
        TOKEN:this.token
      };
    }
  }
  
  MostrarMas(respuesta: any) {
    respuesta.selected = !respuesta.selected;
  }

  Editar(respuesta1: {

    EMPRESA:any,
    USUARIO:any,
    TIPO_DOCUMENTO:any,
    DOCUMENTO:any,
    NOMBRE:any,
    DIRECCION:any,
    TELEFONO:any,
    ESTADO:any,
    CONTRASENA:any,
    CODIGO_PUNTO_PAGO:any,
    ROL:any,}){

      this.crear=true;

      this.editar=true;
      
      this.datos={
        EMPRESA:respuesta1.EMPRESA,
        USUARIO:respuesta1.USUARIO,
        TIPO_DOCUMENTO:respuesta1.TIPO_DOCUMENTO,
        DOCUMENTO:respuesta1.DOCUMENTO,
        NOMBRE:respuesta1.NOMBRE,
        DIRECCION:respuesta1.DIRECCION,
        TELEFONO:respuesta1.TELEFONO,
        ESTADO:respuesta1.ESTADO,
        PASSWORD:respuesta1.CONTRASENA,
        CODIGO_PUNTO_PAGO:respuesta1.CODIGO_PUNTO_PAGO,
        SUB_PUNTO_PAGO:respuesta1.CODIGO_PUNTO_PAGO,
        ROL:respuesta1.ROL,
        TOKEN:this.token
      };
      this.obtenerEmpresas();
      this.ListarRoles();
      this.ListarPuntosPago();
      this.ListarEstadoUsuario();
      this.consultarDocumento();
  }

  ModificarUsuario(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.postModificarUsuario(this.datos).subscribe(
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
