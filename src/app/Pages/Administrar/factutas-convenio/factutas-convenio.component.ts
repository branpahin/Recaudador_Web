import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecaudoService } from 'src/app/services/recaudo.service';
import * as alertify from 'alertifyjs';
import { formatDate } from '@angular/common';
import { LoadingController } from '@ionic/angular';

interface Datos{
  EMPRESA: string;
  CODIGO_CONVENIO: string;
  CODIGO_CONVENIO_DET?:string;
  NOMBRE_FACTURA: string;  
  CODIGO_BARRAS: string; 
  MANUAL: string;
  PAGO_LINEA: string;
  EFECTIVO: string;
  CHEQUE: string;
  TARJETA: string;
  TARJETA_EXITO: string;
  MIXTO: string;
  // MIXTO_MANUAL: string;
  // TARJETA_MANUAL: string;
  TIPO_VENCIMIENTO: string;
  DIAS_VENCIMIENTO: string;
  FECHA_FINALIZACION: string;
  ASOBANCARIA: string;
  TIPO_ASOBANCARIA: string;
  PUNTEO:string;
  CORREO_ASOBANCARIA: string;
  BANCO: string;
  TIPO_CUENTA: string;
  NUMERO_CUENTA: string;
  BANCO_RECAUDADOR: string;
  EXCEL: string;
  BUSQUEDA_REFERENCIA:string;
  ESTADO:string;
  PAGOS_ASOBANCARIA:string;
  USUARIO: string;
  TOKEN: string;
}

@Component({
  selector: 'app-factutas-convenio',
  templateUrl: './factutas-convenio.component.html',
  styleUrls: ['./factutas-convenio.component.scss'],
})
export class FactutasConvenioComponent  implements OnInit {
  empresa=localStorage.getItem('empresaCOD') || '';
  usuario= localStorage.getItem('usuario')|| '';
  token=localStorage.getItem('token')|| '';

  TipoVencimiento:any[]=[];
  TipoAsobancaria:any[]=[];
  PagosAsobancaria:any[]=[];
  TipoPunteo:any[]=[];
  TipoCuentaAsobancaria:any[]=[];
  BancosAsobancaria:any[]=[];
  FacturasConvenio:any[]=[];
  listadoConveniosActivos:any[]=[];

  resultado:any;

  facturas="";
  ConvenioSeleccion="";
  datos:Datos={
    EMPRESA: this.empresa,
    CODIGO_CONVENIO: "",
    NOMBRE_FACTURA: "",  
    CODIGO_BARRAS: "", 
    MANUAL: "", 
    PAGO_LINEA: "",
    EFECTIVO: "",
    CHEQUE: "",
    TARJETA: "",
    TARJETA_EXITO: "",
    MIXTO: "",
    // MIXTO_MANUAL:"",
    // TARJETA_MANUAL:"",
    TIPO_VENCIMIENTO: "",
    DIAS_VENCIMIENTO: "",
    FECHA_FINALIZACION: "",
    ASOBANCARIA: "",
    TIPO_ASOBANCARIA: "",
    PUNTEO:"",
    CORREO_ASOBANCARIA: "",
    BANCO: "",
    TIPO_CUENTA: "",
    NUMERO_CUENTA: "",
    BANCO_RECAUDADOR: "",
    EXCEL: "",
    BUSQUEDA_REFERENCIA:"",
    ESTADO:"",
    PAGOS_ASOBANCARIA:"",
    USUARIO: this.usuario,
    TOKEN:this.token
  }


  datosModificar={
    EMPRESA:this.empresa,
    CODIGO_CONVENIO:"",
    CODIGO_CONVENIO_DET: "",
    NOMBRE_FACTURA:"", 
    CODIGO_BARRAS:"",
    MANUAL:"", 
    PAGO_LINEA:"", 
    EFECTIVO:"",
    CHEQUE:"",     
    TARJETA:"",   
    TARJETA_EXITO:"",
    MIXTO:"",
    // MIXTO_MANUAL:"",
    // TARJETA_MANUAL:"",
    TIPO_VENCIMIENTO:"",
    DIAS_VENCIMIENTO:"",
    FECHA_FINALIZACION:"",
    ASOBANCARIA:"",
    TIPO_ASOBANCARIA:"",
    PUNTEO:"",
    CORREO_ASOBANCARIA:"",
    BANCO:"",        
    TIPO_CUENTA:"",
    NUMERO_CUENTA:"",    
    BANCO_RECAUDADOR:"",
    EXCEL:"",
    BUSQUEDA_REFERENCIA:"",
    ESTADO:"",
    PAGOS_ASOBANCARIA:"",
    USUARIO: this.usuario,    
    TOKEN: this.token
  }
  
  seleccion=[{
    CODIGO:"S",
    DESCRIPCION:"SI"
  },
  {
    CODIGO:"N",
    DESCRIPCION:"NO"
  }]

  seleccion2=[{
    CODIGO:"A",
    DESCRIPCION:"Activo"
  },
  {
    CODIGO:"I",
    DESCRIPCION:"Inactivo"
  }]

 
  
  seleccionar:any[]=this.seleccion;
  seleccionarEstado:any[]=this.seleccion2;
  filteredList: any[] = [];
  fecha="";
  searchTerm: string = '';
  crear:boolean=false;
  editar:boolean=false;
  mostrarMas:boolean=false;
  

  constructor(private recaudoService: RecaudoService, private router: Router,private loadingController: LoadingController,) { }

  ngOnInit() {
    this.ListarConvenios();
    this.ListarTipoVencimientoFactura();
    this.ListarTiposAsobancaria();
    this.ListarBancosAsobancaria();
    this.ListarTiposCuentaAsobancaria();
    this.ListarPagosAsobancaria();
    this.ListarTipoPunteo();
  }

  ionViewWillEnter() {
    this.ListarFacturasConvenio();
    this.filterList();
  }

  filterList() {
    if (!this.searchTerm.trim()) {
      this.filteredList = this.FacturasConvenio;
    } else {
      this.filteredList = this.FacturasConvenio.filter(item =>
        item.NOMBRE_CONVENIO.toLowerCase().includes(this.searchTerm.toLowerCase())
        || item.NIT_CONVENIO.toLowerCase().includes(this.searchTerm.toLowerCase())
        || item.NOMBRE_CONVENIO_DET.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  clearSearch() {
    this.filteredList = this.FacturasConvenio;
  }

  ListarTipoVencimientoFactura(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.getTipoVencimientoFactura(Number(this.empresa),this.usuario,this.token).subscribe(
        (data: any) => {
          this.TipoVencimiento= data.TIPOS_VENCIMIENTO;
        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    }

  }

  ListarPagosAsobancaria(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.getListadoPagosAsobancaria(Number(this.empresa),this.usuario,this.token).subscribe(
        (data: any) => {
          this.PagosAsobancaria= data.PAGOS_ASOBANCARIA;
        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    }

  }

  ListarTipoPunteo(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.getListadoTipoPunteo(Number(this.empresa),this.usuario,this.token).subscribe(
        (data: any) => {
          this.TipoPunteo= data.TIPOS_PUNTEO;
        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    }

  }

  ListarTiposAsobancaria(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.getTipoAsobancariaFactura(Number(this.empresa),this.usuario,this.token).subscribe(
        (data: any) => {
          this.TipoAsobancaria= data.TIPOS_ASOBANCARIA;
        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    }

  }

  ListarTiposCuentaAsobancaria(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.getTipoCuentaAsobancaria(Number(this.empresa),this.usuario,this.token).subscribe(
        (data: any) => {
          this.TipoCuentaAsobancaria= data.TIPOS_CUENTA;
        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    }

  }

  ListarBancosAsobancaria(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.getBancosAsobancaria(Number(this.empresa),this.usuario,this.token).subscribe(
        (data: any) => {
          this.BancosAsobancaria= data.BANCOS;
        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    }

  }

  ListarConvenios(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.getListarConvenios(Number(this.empresa),this.usuario,this.token).subscribe(
        (data: any) => {
          this.listadoConveniosActivos= data.CONVENIOS_ACTIVOS;
          
        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    }
  }
  

  async ListarFacturasConvenio(){
    const loading = await this.loadingController.create({
      spinner: 'crescent', // Puedes cambiar el tipo de spinner ('bubbles', 'dots', 'lines', etc.)
      cssClass: 'custom-spinner' // Clase opcional para personalización
    });
    await loading.present();
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.getListarFacturasConvenio(Number(this.empresa),this.usuario,this.token).subscribe(
        async (data: any) => {
          if(this.facturas=="ACTIVAS"){
            this.FacturasConvenio= data.LISTADO_FACTURAS_ACTIVAS;
          }
          else if(this.facturas=="INACTIVAS"){
            this.FacturasConvenio= data.LISTADO_FACTURAS_INACTIVAS;
          }
          this.filteredList = this.FacturasConvenio;
          await loading.dismiss();
        },
        async (error) => {
          await loading.present();
          console.error('Error al llamar al servicio:', error);
        }
      );
    }

  }

  cerrarTabla(){
    this.crear=false;
    this.editar=false;
    this.fecha="";
    this.ListarFacturasConvenio();
  }

  CrearFacturaConvenio(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.postCrearFacturaConvenio(this.datos).subscribe(
        (data: any) => {
          this.resultado= data;
          if(this.resultado.COD=="200"){
            alertify.success(this.resultado.RESPUESTA);
            this.datos={
              EMPRESA: this.empresa,
              CODIGO_CONVENIO: "",
              NOMBRE_FACTURA: "",  
              CODIGO_BARRAS: "", 
              MANUAL: "", 
              PAGO_LINEA: "", 
              EFECTIVO: "",
              CHEQUE: "",
              TARJETA: "",
              TARJETA_EXITO: "",
              MIXTO: "",
              // MIXTO_MANUAL:"",
              // TARJETA_MANUAL:"",
              TIPO_VENCIMIENTO: "",
              DIAS_VENCIMIENTO: "",
              FECHA_FINALIZACION: "",
              ASOBANCARIA: "",
              TIPO_ASOBANCARIA: "",
              PUNTEO:"",
              CORREO_ASOBANCARIA: "",
              BANCO: "",
              TIPO_CUENTA: "",
              NUMERO_CUENTA: "",
              BANCO_RECAUDADOR: "",
              EXCEL: "",
              BUSQUEDA_REFERENCIA:"",
              ESTADO:"",
              PAGOS_ASOBANCARIA:"",
              USUARIO: this.usuario,
              TOKEN:this.token
            };
            this.fecha="";
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
  Crear(){

    this.crear=true;
    
    
    this.datos={
      EMPRESA: this.empresa,
      CODIGO_CONVENIO: "",
      NOMBRE_FACTURA: "",  
      CODIGO_BARRAS: "", 
      MANUAL: "", 
      PAGO_LINEA: "",
      EFECTIVO: "",
      CHEQUE: "",
      TARJETA: "",
      TARJETA_EXITO: "",
      MIXTO: "",
      // MIXTO_MANUAL:"",
      // TARJETA_MANUAL:"",
      TIPO_VENCIMIENTO: "",
      DIAS_VENCIMIENTO: "",
      FECHA_FINALIZACION: "",
      ASOBANCARIA: "",
      TIPO_ASOBANCARIA: "",
      PUNTEO:"",
      CORREO_ASOBANCARIA: "",
      BANCO: "",
      TIPO_CUENTA: "",
      NUMERO_CUENTA: "",
      BANCO_RECAUDADOR: "",
      EXCEL: "",
      BUSQUEDA_REFERENCIA:"",
      ESTADO:"",
      PAGOS_ASOBANCARIA:"",
      USUARIO: this.usuario,
      TOKEN:this.token
    };
    this.fecha="";

    this.ListarConvenios();
    this.ListarTipoVencimientoFactura();
    this.ListarTiposAsobancaria();
    this.ListarBancosAsobancaria();
    this.ListarTiposCuentaAsobancaria();
}

MostrarMas(respuesta: any) {
  respuesta.selected = !respuesta.selected;
}

filtro(event: any){
  this.datos.FECHA_FINALIZACION = formatDate(event.detail.value, 'd/MM/yyyy', 'en-US');
  
}

  Editar(respuesta1: any){

    this.crear=true;

    this.editar=true;

    if(respuesta1.ASOBANCARIA=="NO"){
      respuesta1.ASOBANCARIA="N";
    }
    else if(respuesta1.ASOBANCARIA=="SI"){
      respuesta1.ASOBANCARIA="S"

    }

    if(respuesta1.CODIGO_BARRAS=="NO"){
      respuesta1.CODIGO_BARRAS="N";
    }
    else if(respuesta1.CODIGO_BARRAS=="SI"){
      respuesta1.CODIGO_BARRAS="S"
    }
    if(respuesta1.TIPO_RECAUDO_MANUAL=="NO"){
      respuesta1.TIPO_RECAUDO_MANUAL="N";
    }
    else if(respuesta1.TIPO_RECAUDO_MANUAL=="SI"){
      respuesta1.TIPO_RECAUDO_MANUAL="S"
    }
    if(respuesta1.TIPO_RECAUDO_WS=="NO"){
      respuesta1.TIPO_RECAUDO_WS="N";
    }
    else if(respuesta1.TIPO_RECAUDO_WS=="SI"){
      respuesta1.TIPO_RECAUDO_WS="S"
    }

    if(respuesta1.RECAUDO_EFECTIVO=="NO"){
      respuesta1.RECAUDO_EFECTIVO="N";
    }
    else if(respuesta1.RECAUDO_EFECTIVO=="SI"){
      respuesta1.RECAUDO_EFECTIVO="S"
    }

    if(respuesta1.RECAUDO_CHEQUE=="NO"){
      respuesta1.RECAUDO_CHEQUE="N";
    }
    else if(respuesta1.RECAUDO_CHEQUE=="SI"){
      respuesta1.RECAUDO_CHEQUE="S"
    }

    if(respuesta1.RECAUDO_DATAFONO=="NO"){
      respuesta1.RECAUDO_DATAFONO="N";
    }
    else if(respuesta1.RECAUDO_DATAFONO=="SI"){
      respuesta1.RECAUDO_DATAFONO="S"
    }

    if(respuesta1.RECAUDO_DATAFONO_EXITO=="NO"){
      respuesta1.RECAUDO_DATAFONO_EXITO="N";
    }
    else if(respuesta1.RECAUDO_DATAFONO_EXITO=="SI"){
      respuesta1.RECAUDO_DATAFONO_EXITO="S"
    }

    if(respuesta1.RECAUDO_MIXTO=="NO"){
      respuesta1.RECAUDO_MIXTO="N";
    }
    else if(respuesta1.RECAUDO_MIXTO=="SI"){
      respuesta1.RECAUDO_MIXTO="S"
    }

    // if(respuesta1.MIXTO_MANUAL=="NO"){
    //   respuesta1.MIXTO_MANUAL="N";
    // }
    // else if(respuesta1.MIXTO_MANUAL=="SI"){
    //   respuesta1.MIXTO_MANUAL="S"
    // }
    // if(respuesta1.TARJETA_MANUAL=="NO"){
    //   respuesta1.TARJETA_MANUAL="N";
    // }
    // else if(respuesta1.TARJETA_MANUAL=="SI"){
    //   respuesta1.TARJETA_MANUAL="S"
    // }
    if(respuesta1.EXCEL=="NO"){
      respuesta1.EXCEL="N";
    }
    else if(respuesta1.EXCEL=="SI"){
      respuesta1.EXCEL="S"
    }

    if(respuesta1.BUSQUEDA_REFERENCIA=="NO"){
      respuesta1.BUSQUEDA_REFERENCIA="N";
    }
    else if(respuesta1.BUSQUEDA_REFERENCIA=="SI"){
      respuesta1.BUSQUEDA_REFERENCIA="S"
    }



    
    this.datos={
      EMPRESA: this.empresa,
      CODIGO_CONVENIO: respuesta1.CODIGO_CONVENIO,
      CODIGO_CONVENIO_DET: respuesta1.CODIGO_CONVENIO_DET,
      NOMBRE_FACTURA: respuesta1.NOMBRE_CONVENIO_DET,  
      CODIGO_BARRAS: respuesta1.CODIGO_BARRAS, 
      MANUAL: respuesta1.TIPO_RECAUDO_MANUAL, 
      PAGO_LINEA: respuesta1.TIPO_RECAUDO_WS,
      EFECTIVO: respuesta1.RECAUDO_EFECTIVO,
      CHEQUE: respuesta1.RECAUDO_CHEQUE,
      TARJETA: respuesta1.RECAUDO_DATAFONO,
      TARJETA_EXITO: respuesta1.RECAUDO_DATAFONO_EXITO,
      MIXTO: respuesta1.RECAUDO_MIXTO,
      // MIXTO_MANUAL: respuesta1.MIXTO_MANUAL,
      // TARJETA_MANUAL: respuesta1.TARJETA_MANUAL,
      TIPO_VENCIMIENTO: respuesta1.TIPO_VENCIMIENTO,
      DIAS_VENCIMIENTO: respuesta1.DIAS_VENCIMIENTO,
      FECHA_FINALIZACION: respuesta1.FECHA_FINALIZACION,
      ASOBANCARIA: respuesta1.ASOBANCARIA,
      TIPO_ASOBANCARIA: respuesta1.TIPO_ASOBANCARIA,
      PUNTEO:respuesta1.PUNTEO,
      CORREO_ASOBANCARIA: respuesta1.CORREO_ASOBANCARIA,
      BANCO: respuesta1.BANCO,
      TIPO_CUENTA: respuesta1.TIPO_CUENTA,
      NUMERO_CUENTA: respuesta1.NUMERO_CUENTA,
      BANCO_RECAUDADOR: respuesta1.BANCO_RECAUDADOR,
      EXCEL: respuesta1.EXCEL,
      BUSQUEDA_REFERENCIA:respuesta1.BUSQUEDA_REFERENCIA,
      ESTADO:respuesta1.ESTADO,
      PAGOS_ASOBANCARIA:respuesta1.PAGOS_ASOBANCARIA,
      USUARIO: this.usuario,
      TOKEN:this.token
    };
    
    if(this.datos.FECHA_FINALIZACION!=""){
      let fechaCompleta = this.datos.FECHA_FINALIZACION;
    // Obtener las partes de la fecha y la hora
    let partes = fechaCompleta.split(' ');
    let fecha = partes[0];
    let hora = partes[1] + ' ' + partes[2]; // Combinar la hora y AM/PM

    // Separar las partes de la fecha (día, mes, año) y convertirlas en un formato compatible con Date
    let partesFecha = fecha.split('/');
    let dia = partesFecha[0].padStart(2, '0'); // Agregar un 0 al principio si es necesario
    let mes = partesFecha[1].padStart(2, '0'); // Agregar un 0 al principio si es necesario
    let anio = partesFecha[2];

    // Separar las partes de la hora (horas, minutos, segundos) y convertirlas en un formato compatible con Date
    let partesHora = hora.split(':');
    let horas = partesHora[0].padStart(2, '0'); // Agregar un 0 al principio si es necesario
    let minutos = partesHora[1].padStart(2, '0'); // Agregar un 0 al principio si es necesario
    let segundos = '00'; // Establecer los segundos como 00

    // Crear la cadena de fecha y hora en el formato "YYYY-MM-DDTHH:mm:ss"
    let fechaHora = `${anio}-${mes}-${dia}T00:00:00`;

    // Crear el objeto Date con la cadena formateada
    this.fecha = fechaHora;
    
    }
    

    this.ListarConvenios();
    this.ListarTipoVencimientoFactura();
    this.ListarTiposAsobancaria();
    this.ListarBancosAsobancaria();
    this.ListarTiposCuentaAsobancaria();
  }

  ModificarFacturaConvenio(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      
      this.recaudoService.postModificarFacturaConvenio(this.datos).subscribe(
        (data: any) => {
          this.resultado= data;
          if(this.resultado.COD=="200"){
            alertify.success(this.resultado.RESPUESTA);

            this.fecha="";
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

  calculateWidth(text: string): string {
    // Puedes ajustar el ancho base y el factor de multiplicación según tus necesidades
    const baseWidth = 100; // Ancho base en píxeles
    const multiplier = 12; // Factor de multiplicación

    const width = baseWidth + text.length;
    return `${width}px`;
  }

}
