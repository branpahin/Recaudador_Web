import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecaudoService } from 'src/app/services/recaudo.service';
import * as alertify from 'alertifyjs';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-consulta-arqueos-punto-pago',
  templateUrl: './consulta-arqueos-punto-pago.component.html',
  styleUrls: ['./consulta-arqueos-punto-pago.component.scss'],
})
export class ConsultaArqueosPuntoPagoComponent  implements OnInit {

  //#region Variables
  empresa: string|null = localStorage.getItem('empresaCOD');
  usuario: string|null = localStorage.getItem('usuario');
  puntoPago=localStorage.getItem('puntoPago')|| '';
  token: string|null = localStorage.getItem('token');
  rol = localStorage.getItem('rol') || '';

  principal:boolean=false;
  codigo_punto_pago="";
  fechaInicio="";
  fechaFin="";
  listadoArqueos: any []=[] ;
  listadoPuntos: any []=[];
  resultado : any;
  arqueoSelect="";
  recaudos:any[]=[];
  informacionF:any[]=[];
  pago:any []=[];
  detalleSeleccionado: string | null = null;

  datosAnulacion={
    EMPRESA: this.empresa,
    CODIGO_PUNTO_PAGO: "",
    NUMERO_ARQUEO:"",
    NUMERO_MOVIMIENTO:"",
    NUMERO_MOVIMIENTO_DET:"",
    COMENTARIO:"",
    USUARIO:this.usuario,    
    TOKEN:this.token
  };

  recaudosFiltro = [];
  filtroNombreEmpresa: string = '';
  filtroNombrePuntoPago: string = '';
  filtroNombreCaja: string = '';
  filtroNumeroArqueo: string = '';
  filtroUsuario: string = '';
  filtroFechaArqueo: string = '';
  filtroEstado: string = '';
  filtroNumeroMovimientos: string = '';
  filtroNumeroMovimientosDet: string = '';
  filtroValorMovimientos: string = '';
  filtroNumeroMovimiento: string = '';
  filtroFecha:string ='';
  filtroTipoPago: string = '';
  filtrovalorRecibido: string = '';
  filtrovalorMovimiento: string = '';
  filtroValorCambio: string = '';
  filtroNumeroCupones: string = '';
  fecha:string='';
  fechaArqueo:string='';
  filtroNumeroMovimientoDet:string='';
  filtroNombreConvenio:string='';
  filtroFacturaConvenio:string='';
  filtroCodigoCliente:string='';
  filtroCodigoReferencia:string='';
  filtroFechaVencimiento:string='';
  filtroValorMovimientoDet:string='';
  filtroFormaPago:string='';
  filtroMigrado:string='';
  accion:string='1';
  habilitarfiltrado=false;
  detalles: boolean=false;
  detallesFac: boolean=false;
  seleccion:boolean=true;
  tablas:boolean=false;
  Cuadres:boolean=false;
  Entregas:boolean=false;
  comentarioAnulacion:boolean=false;

  //#endregion

  constructor(private recaudoService: RecaudoService, 
    private router: Router,
    private loadingController: LoadingController,) { }

  ngOnInit() {}

  //#region Consulta a API
  ListarPuntosPago(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.getListarPuntosPago(Number(this.empresa),this.usuario,this.token).subscribe(
        (data: any) => {
          this.listadoPuntos= data.PUNTOS_PAGO;
        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    }

  }
  limpiarFiltros(){
    this.filtroNombreEmpresa = '';
    this.filtroNombrePuntoPago = '';
    this.filtroNombreCaja = '';
    this.filtroNumeroArqueo = '';
    this.filtroUsuario = '';
    this.filtroFechaArqueo = '';
    this.filtroEstado = '';
    this.filtroNumeroMovimientos = '';
    this.filtroNumeroMovimientosDet = '';
    this.filtroValorMovimientos  = '';
    this.filtroNumeroMovimiento = '';
    this.filtroFecha ='';
    this.filtroTipoPago = '';
    this.filtrovalorRecibido = '';
    this.filtrovalorMovimiento = '';
    this.filtroValorCambio = '';
    this.filtroNumeroCupones = '';
    this.fecha = '';
    this.fechaArqueo = '';
    this.filtroNumeroMovimientoDet='';
    this.filtroNombreConvenio='';
    this.filtroFacturaConvenio='';
    this.filtroCodigoCliente='';
    this.filtroCodigoReferencia='';
    this.filtroFechaVencimiento='';
    this.filtroValorMovimientoDet='';
    this.filtroFormaPago='';
    this.filtroMigrado='';
  }

  filtrar(){
    this.habilitarfiltrado=!this.habilitarfiltrado;
    this.formaPago();
    if(this.habilitarfiltrado==false){
      this.limpiarFiltros();
    }
  }

  filtro(event: any){
    this.fecha = formatDate(event.detail.value, 'd/MM/yyyy', 'en-US');
    this.filtroFecha=this.fecha;
    
  }

  filtroFechaGen(event: any){
    this.fechaArqueo = formatDate(event.detail.value, 'd/MM/yyyy', 'en-US');
    this.filtroFechaArqueo=this.fechaArqueo;
    
  }

  filtroFechaVen(event: any){
    this.filtroFechaVencimiento = formatDate(event.detail.value, 'd/MM/yyyy', 'en-US');
    
  }

  cerrarTablaFac() {
    this.detallesFac = false;
    this.detalles=true;
    this.detalleSeleccionado=null;
  
  }

  formaPago(){
    if (this.empresa !== null && this.puntoPago !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.getFormaPago(Number(this.empresa),Number(this.puntoPago),this.accion, this.usuario, this.token).subscribe(
        (data: any) => {
          this.pago = data.FORMAS_PAGO;
        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    }

  }

  mostrarDetalles2(numeroMovimiento: string): void {
    this.detalleSeleccionado = numeroMovimiento;
    this.datosAnulacion.NUMERO_MOVIMIENTO=numeroMovimiento;
    this.habilitarfiltrado=false;
    this.detalles=false;
    this.detallesFac = true;
    this.limpiarFiltros();
  }


  cerrarTabla() {
    if(this.detalles==true){
      this.detalles=false;
      this.tablas=true;
    }
    else{
      this.tablas=false;
      this.detalles=false;
      this.Cuadres=false;
      this.seleccion=true;
      this.principal=false;
      this.Entregas=false;
      this.codigo_punto_pago="";
      this.fechaInicio="";
      this.fechaFin="";

      this.listadoArqueos=[];

    }
  }

  fechaIni(event: any){
    this.fechaInicio = formatDate(event.detail.value, 'dd-MM-yyyy', 'en-US');
    
  }

  fechafin(event: any){
    this.fechaFin = formatDate(event.detail.value, 'dd-MM-yyyy', 'en-US');
    
  }

  async mostrarDetalles(numeroArqueo: string, codPuntoPago:string){
    
    this.arqueoSelect=numeroArqueo;
    this.datosAnulacion.NUMERO_ARQUEO=numeroArqueo;
    this.datosAnulacion.CODIGO_PUNTO_PAGO=codPuntoPago;
    this.habilitarfiltrado=false;
    this.tablas=false;
    this.principal=true;
    this.detalles=true;
    this.ListarArqueosDet();
    this.limpiarFiltros();
  }

  ConsultarArq(){
    this.tablas=true;
    this.principal=true;
    this.seleccion=false;
    this.ListarPuntosPago();
  }

  ConsultarCuadres(){
    this.tablas=false;
    this.principal=true;
    this.seleccion=false;
    this.Cuadres=true;
    this.Entregas=false;
  }

  ConsultarEntregas(){
    this.tablas=false;
    this.principal=true;
    this.seleccion=false;
    this.Cuadres=false;
    this.Entregas=true;
  }

  ListarArqueosPunto(){
    
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      if(this.fechaInicio==""){
        this.fechaInicio= new Date().toISOString();
        this.fechaInicio= formatDate(this.fechaInicio,'dd-MM-yyyy', 'en-US');
      }
      if(this.fechaFin==""){
        this.fechaFin= new Date().toISOString();
        this.fechaFin= formatDate(this.fechaFin,'dd-MM-yyyy', 'en-US');
      }
      this.recaudoService.getConsultarArqueoPuntos(Number(this.empresa),Number(this.codigo_punto_pago),this.usuario,this.token,this.fechaInicio,this.fechaFin).subscribe(
        (data: any) => {
          this.listadoArqueos= data.LISTADO_ARQUEOS;
        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    }

  }

  async ListarArqueosDet(){
    const loading = await this.loadingController.create({
      spinner: 'crescent', // Puedes cambiar el tipo de spinner ('bubbles', 'dots', 'lines', etc.)
      cssClass: 'custom-spinner' // Clase opcional para personalización
    });
    this.recaudos=[];
    this.informacionF=[];
    await loading.present();
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.getConsultarMovimientoArqueo(Number(this.empresa),Number(this.codigo_punto_pago),this.arqueoSelect,this.usuario,this.token).subscribe(
        async (data: any) => {
          this.resultado= data;
          this.recaudos=data.RECAUDOS;
          this.informacionF=data.RECAUDOS;
          
          await loading.dismiss();
        },
        async (error) => {
          await loading.dismiss();
          alertify.error("Error al llamar al servicio ",error);
          console.error('Error al llamar al servicio:', error);
        }
      );
    }
  }

  Anulacion(informacion:any){
    this.datosAnulacion.NUMERO_MOVIMIENTO_DET=informacion.NUMERO_MOVIMIENTO_DET;
    this.comentarioAnulacion=true;
  }

  cerrarAlerta(){
    this.comentarioAnulacion=false;
  }

  //#endregion

  //#region Envio a API
  CrearAnulacion(){
    this.comentarioAnulacion=false;
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      
      this.recaudoService.postCrearAnulacionPago(this.datosAnulacion).subscribe(
        (data: any) => {
          this.resultado= data;
          if(this.resultado.COD=="200"){
            alertify.success(this.resultado.RESPUESTA);
            this.datosAnulacion={
              EMPRESA: this.empresa,
              CODIGO_PUNTO_PAGO: "",
              NUMERO_ARQUEO:"",
              NUMERO_MOVIMIENTO:"",
              NUMERO_MOVIMIENTO_DET:"",
              COMENTARIO:"",
              USUARIO:this.usuario,    
              TOKEN:this.token
            };
            
            this.ListarArqueosPunto();
            this.cerrarTablaFac();
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

  //#endregion

}
