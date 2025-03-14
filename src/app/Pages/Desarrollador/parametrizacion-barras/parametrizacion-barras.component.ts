import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecaudoService } from 'src/app/services/recaudo.service';
import * as alertify from 'alertifyjs';

interface Detalle{
  CAMPO: string;
  ORDEN: string;
  POSICION_INICIAL:string;
  CARACTERES: string;  
  OBLIGATORIO: string; 
}

interface Detalle2{
  CAMPO: string;
  ORDEN: string;
  POSICION_INICIAL:string;
  CARACTERES: string;  
  OBLIGATORIO: string; 
}
interface CampoSelec{
 CAMPO:string
}

@Component({
  selector: 'app-parametrizacion-barras',
  templateUrl: './parametrizacion-barras.component.html',
  styleUrls: ['./parametrizacion-barras.component.scss'],
})
export class ParametrizacionBarrasComponent  implements OnInit {

  //#region Variables
  empresa=localStorage.getItem('empresaCOD') || '';
  usuario= localStorage.getItem('usuario')|| '';
  token=localStorage.getItem('token')|| '';

  FacturasBarras:any[]=[];
  listadoCamposBarras:any[]=[];

  resultado:any;
  campoGuardado={
    CAMPO:""
  }
  campoSeleccionado=[] as CampoSelec[];

  facturas="";
  ConvenioSeleccion="";

  datos={
    EMPRESA: this.empresa,
    CODIGO_CONVENIO: "",
    CODIGO_CONVENIO_DET: "",  
    LONGITUD_BARRA: "", 
    IDENTIFICADOR_BARRA: "", 
    CAMPOS: [] as Detalle[] ,
    USUARIO: this.usuario,
    TOKEN:this.token
  }
  datosNuevos={
    EMPRESA: this.empresa,
    CODIGO_CONVENIO: "",
    CODIGO_CONVENIO_DET: "",  
    LONGITUD_BARRA: "", 
    IDENTIFICADOR_BARRA: "", 
    CAMPOS: [] as Detalle2[] ,
    USUARIO: this.usuario,
    TOKEN:this.token
  }

  detalle={
    CAMPO: "",
    ORDEN: "",
    POSICION_INICIAL:"",
    CARACTERES: "", 
    OBLIGATORIO: "" 
  }
  datosEliminar={
    EMPRESA:this.empresa,
    CODIGO_CONVENIO: "",
    CODIGO_CONVENIO_DET: "",
    CAMPO: "",           
    USUARIO:this.usuario,
    TOKEN: this.token
  }


 
  filteredList: any[] = [];
  searchTerm: string = '';
  crear:boolean=false;
  editar:boolean=false;
  mostrarMas:boolean=false;
  mostrarModificar:boolean=false;
  mostrarCamposAgregar:boolean=false;
  
  //#endregion

  constructor(private recaudoService: RecaudoService, private router: Router) { }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.ListarFacturasBarras();
    this.filterList();
  }

  //#region Filtrado
  filterList() {
    if (!this.searchTerm.trim()) {
      this.filteredList = this.FacturasBarras;
    } else {
      this.filteredList = this.FacturasBarras.filter(item =>
        item.NOMBRE_CONVENIO.toLowerCase().includes(this.searchTerm.toLowerCase())
        || item.NIT.toLowerCase().includes(this.searchTerm.toLowerCase())
        || item.NOMBRE_CONVENIO_DET.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  clearSearch() {
    this.filteredList = this.FacturasBarras;
  }

  //#endregion

  //#region Consultas a API
  ListarCamposBarras(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.getListadoCamposBarra(Number(this.empresa),this.usuario,this.token).subscribe(
        (data: any) => {
          
          this.listadoCamposBarras= data.CAMPOS_PARAMETROS_BARRA;
        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    }
  }
  

  ListarFacturasBarras(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.getListadoFacturasBarras(Number(this.empresa),this.usuario,this.token).subscribe(
        (data: any) => {
          
          if(this.facturas=="ACTIVAS"){
            this.FacturasBarras= data.FACTURAS_BARRAS_ACTIVAS;
          }
          else if(this.facturas=="PENDIENTES"){
            this.FacturasBarras= data.FACTURAS_BARRAS_PENDIENTES;
          }
          this.filteredList = this.FacturasBarras;

        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    }

  }

  //#endregion

  //#region Manejo de ventanas
  cerrarTabla(){
    this.crear=false;
    this.editar=false;
    this.mostrarCamposAgregar=false;
    this.ListarFacturasBarras();
  }

  
  MostrarMas(respuesta: any) {
    respuesta.selected = !respuesta.selected;
  }

  //#endregion

  //#region Agrgar o quitar campos
  agregarCampo(){
    if(this.mostrarModificar){
      this.mostrarCamposAgregar=true;
      const campo : Detalle2 = { ...this.detalle};
      this.datosNuevos.CAMPOS.push(campo);
      this.detalle={
        CAMPO: "",
        ORDEN: "",
        POSICION_INICIAL:"",
        CARACTERES: "", 
        OBLIGATORIO: "" 
      }
      
    
    }else{
      this.mostrarCamposAgregar=false;
      const campo : Detalle = { ...this.detalle};
      this.datos.CAMPOS.push(campo);
      this.detalle={
        CAMPO: "",
        ORDEN: "",
        POSICION_INICIAL:"",
        CARACTERES: "", 
        OBLIGATORIO: "" 
      }
      

      
    }
  }

  campoRepetido(campo: string): boolean {
    return this.datos.CAMPOS.some(item => item.CAMPO === campo);
  }

  eliminar(datos:{ CODIGO_CONVENIO: any; CODIGO_CONVENIO_DET: any},parametro:{CAMPO:any}){
    this.datosEliminar.CAMPO=parametro.CAMPO;
    this.datosEliminar.CODIGO_CONVENIO=datos.CODIGO_CONVENIO;
    this.datosEliminar.CODIGO_CONVENIO_DET=datos.CODIGO_CONVENIO_DET;

    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.postEliminarFacturaBarra(this.datosEliminar).subscribe(
        (data: any) => {
          
          this.resultado= data;
          if(this.resultado.COD=="200"){
            alertify.success(this.resultado.RESPUESTA);
            
            this.datos.CAMPOS = this.datos.CAMPOS.filter(detalle => detalle.CAMPO !== parametro.CAMPO);
            this.datosNuevos.CAMPOS = this.datosNuevos.CAMPOS.filter(detalle => detalle.CAMPO !== parametro.CAMPO);
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

  eliminarFila(detalle:{ CAMPO: any; ORDEN: string; POSICION_INICIAL:string; CARACTERES:string; OBLIGATORIO:string}){
    const campo = detalle.CAMPO;
    if(this.mostrarCamposAgregar){

      this.datosNuevos.CAMPOS = this.datosNuevos.CAMPOS.filter(detalle => detalle.CAMPO !== campo);
    }else{
      this.datos.CAMPOS = this.datos.CAMPOS.filter(detalle => detalle.CAMPO !== campo);
    }
  }


  Editar(respuesta1: any){
    this.datos={
      EMPRESA: this.empresa,
      CODIGO_CONVENIO: respuesta1.CODIGO_CONVENIO,
      CODIGO_CONVENIO_DET: respuesta1.CODIGO_CONVENIO_DET,  
      LONGITUD_BARRA: respuesta1.LONGITUD_BARRA, 
      IDENTIFICADOR_BARRA: respuesta1.IDENTIFICADOR_BARRA, 
      CAMPOS: [] as Detalle[] ,
      USUARIO: this.usuario,
      TOKEN:this.token
    };
    if(respuesta1.CAMPOS!=null || respuesta1.CAMPOS!=undefined){
      this.mostrarModificar=true;
      for (const detalle of respuesta1.CAMPOS) {
        const nuevoDetalle: Detalle = { ...detalle };
        this.datos.CAMPOS.push(nuevoDetalle); 
      }
    }else{
      this.mostrarModificar=false;
    
    }
    
    this.crear=true;
    this.ListarCamposBarras();
   
  }

  //#endregion

  //#region Envio a API
  ModificarFacturaBarras(){
    if(this.mostrarCamposAgregar){
      this.datosNuevos.EMPRESA= this.empresa,
      this.datosNuevos.CODIGO_CONVENIO=this.datos.CODIGO_CONVENIO,
      this.datosNuevos.CODIGO_CONVENIO_DET=this.datos.CODIGO_CONVENIO_DET,  
      this.datosNuevos.LONGITUD_BARRA=this.datos.LONGITUD_BARRA, 
      this.datosNuevos.IDENTIFICADOR_BARRA=this.datos.IDENTIFICADOR_BARRA, 
      this.datosNuevos.USUARIO= this.usuario,
      this.datosNuevos.TOKEN=this.token

      
      this.CrearFacturaBarras();
    }else{
      if (this.empresa !== null && this.usuario !== null && this.token !== null) {
        this.recaudoService.postModificarFacturaBarra(this.datos).subscribe(
          (data: any) => {
            
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

  CrearFacturaBarras(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      if(this.mostrarCamposAgregar){
        this.recaudoService.postCrearFacturaBarra(this.datosNuevos).subscribe(
          (data: any) => {
            
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
      }else{
        this.recaudoService.postCrearFacturaBarra(this.datos).subscribe(
          (data: any) => {
            
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

  //#endregion

}
