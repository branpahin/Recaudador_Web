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
interface CampoSelec{
 CAMPO:string
}

@Component({
  selector: 'app-parametrizacion-barras',
  templateUrl: './parametrizacion-barras.component.html',
  styleUrls: ['./parametrizacion-barras.component.scss'],
})
export class ParametrizacionBarrasComponent  implements OnInit {

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

  detalle={
    CAMPO: "",
    ORDEN: "",
    POSICION_INICIAL:"",
    CARACTERES: "", 
    OBLIGATORIO: "" 
  }

 
  filteredList: any[] = [];
  searchTerm: string = '';
  crear:boolean=false;
  editar:boolean=false;
  mostrarMas:boolean=false;
  mostrarModificar:boolean=false;
  

  constructor(private recaudoService: RecaudoService, private router: Router) { }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.ListarFacturasBarras();
    this.filterList();
  }

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


  ListarCamposBarras(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.getListadoCamposBarra(Number(this.empresa),this.usuario,this.token).subscribe(
        (data: any) => {
          console.log('Respuesta del servicio:', data);
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
          console.log('Respuesta del servicio:', data);
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

  cerrarTabla(){
    this.crear=false;
    this.editar=false;
    this.ListarFacturasBarras();
  }

  
  MostrarMas(respuesta: any) {
    respuesta.selected = !respuesta.selected;
  }

  agregarCampo(){
    const campo : Detalle = { ...this.detalle};
    this.datos.CAMPOS.push(campo);
    this.detalle={
      CAMPO: "",
      ORDEN: "",
      POSICION_INICIAL:"",
      CARACTERES: "", 
      OBLIGATORIO: "" 
    }
    console.log("campos:",this.datos.CAMPOS)
  }

  campoRepetido(campo: string): boolean {
    return this.datos.CAMPOS.some(item => item.CAMPO === campo);
  }

  eliminarFila(detalle:{ CAMPO: any; ORDEN: string; POSICION_INICIAL:string; CARACTERES:string; OBLIGATORIO:string}){
    const campo = detalle.CAMPO;
    this.datos.CAMPOS = this.datos.CAMPOS.filter(detalle => detalle.CAMPO !== campo);
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
    console.log("datos:",this.datos)
    this.crear=true;
    this.ListarCamposBarras();
   
  }

  ModificarFacturaBarras(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.postModificarFacturaBarra(this.datos).subscribe(
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

  CrearFacturaBarras(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.postCrearFacturaBarra(this.datos).subscribe(
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
