import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecaudoService } from 'src/app/services/recaudo.service';
import * as alertify from 'alertifyjs';

@Component({
  selector: 'app-listado-entrgas-punto-pago',
  templateUrl: './listado-entrgas-punto-pago.component.html',
  styleUrls: ['./listado-entrgas-punto-pago.component.scss'],
})
export class ListadoEntrgasPuntoPagoComponent  implements OnInit {

  //#region Variables
  empresa: string|null = localStorage.getItem('empresaCOD');
  usuario: string|null = localStorage.getItem('usuario');
  token: string|null = localStorage.getItem('token');
  puntoPago=localStorage.getItem('puntoPago')|| '';

  principal:boolean=false;
  codigo_punto_pago="";
  fechaInicio="";
  fechaFin="";
  listadoEntregas: any []=[] ;
  listadoEntregasDet: any []=[] ;
  listadoPuntos: any []=[];
  resultado : any;
  arqueoSelect="";
  entregaSelect="";
  recaudos:any[]=[];
  accion="";
  accionEntrega="";
  observacion="";

  recaudosFiltro = [];
  filtroNumeroMovimiento: string = '';
  filtroFecha:string ='';
  filtroTipoPago: string = '';
  filtrovalorRecibido: string = '';
  filtrovalorMovimiento: string = '';
  filtroValorCambio: string = '';
  filtroNumeroCupones: string = '';
  fecha:string='';
  habilitarfiltrado=false;
  detalles: boolean=false;
  detallesFac: boolean=false;
  seleccion:boolean=true;
  tablas:boolean=false;
  confirmacion:boolean=false;

  //#endregion

  constructor(private recaudoService: RecaudoService, private router: Router) { }

  ngOnInit() {
    this.ListarPuntosPago();
    this.principal=true; 
  }

  //#region Consulta a API y filtros

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

  filtrar(){
    this.habilitarfiltrado=!this.habilitarfiltrado;
    if(this.habilitarfiltrado==false){
      this.filtroNumeroMovimiento = '';
      this.filtroFecha ='';
      this.fecha ='';
      this.filtroTipoPago = '';
    }
  }

  filtro(event: any){
    this.fecha = formatDate(event.detail.value, 'dd/MM/yyyy', 'en-US');
    this.filtroFecha=this.fecha;
    
  }

  detallerecaudos(){
    this.detalles=true;
    this.detallesFac = true; 
  }

  cerrarTabla() {
    this.detalles = false;
    this.principal=true; 
  }

  fechaIni(event: any){
    this.fechaInicio = formatDate(event.detail.value, 'dd-MM-yyyy', 'en-US');
    
  }

  fechafin(event: any){
    this.fechaFin = formatDate(event.detail.value, 'dd-MM-yyyy', 'en-US');
    
  }

  mostrarDetalles(numeroArqueo: string, numeroEntrega:string){
    this.arqueoSelect=numeroArqueo;
    this.entregaSelect=numeroEntrega;
    this.principal=false;
    this.detalles=true;
    this.ListarEntregasPuntoDet();
  }

  ConsultarArq(){
    this.tablas=true;
    this.principal=true;
    this.seleccion=false;
    this.ListarPuntosPago();
  }

  Aprobar(codPuntoPago:string,numeroArqueo: string, numeroEntrega: string){
    this.codigo_punto_pago=codPuntoPago;
    this.arqueoSelect=numeroArqueo;
    this.entregaSelect=numeroEntrega;
    this.accionEntrega="1"
    this.confirmacion=true;
  }
  Rechazar(codPuntoPago:string,numeroArqueo: string, numeroEntrega: string){
    this.codigo_punto_pago=codPuntoPago;
    this.arqueoSelect=numeroArqueo;
    this.entregaSelect=numeroEntrega;
    this.accionEntrega="2"
    this.confirmacion=true;
  }

  cerrarAlerta(){
    this.confirmacion=false;
  }

  ListarEntregasPunto(){
    
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.getConsultarEntregasPunto(Number(this.empresa),this.accion,Number(this.codigo_punto_pago),this.usuario,this.token,).subscribe(
        (data: any) => {

          if(this.accion=="1"){
            this.listadoEntregas= data.ENTREGAS_PENDIENTES;
          }
          else if(this.accion=="2"){
            this.listadoEntregas= data.ENTREGAS_VALIDADAS;
          }
          else if(this.accion=="3"){
            this.listadoEntregas= data.ENTREGAS_RECHAZADAS;
          }
          
        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    }

  }

  MostrarMas(respuesta: any) {
    respuesta.selected = !respuesta.selected;
  }

  ListarEntregasPuntoDet(){
    
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.getConsultarEntregasPuntoDet(Number(this.empresa),Number(this.codigo_punto_pago),this.arqueoSelect,this.entregaSelect,this.usuario,this.token,).subscribe(
        (data: any) => {
          this.listadoEntregasDet= data.ENTREGAS_DETALLE;
        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    }

  }

  //#endregion

  //#region Envio a API

  AccionEntregaPunto(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.postAccionEntregaPunto(this.empresa,this.codigo_punto_pago,this.arqueoSelect,this.entregaSelect,this.accionEntrega,this.observacion,this.usuario,this.token,).subscribe(
        (data: any) => {
          this.resultado= data;
          if(this.resultado.COD=="200"){
            
            alertify.success(this.resultado.RESPUESTA);
            this.confirmacion=false;
            this.ListarEntregasPunto();
            this.observacion="";
          }
          else {
            alertify.error(this.resultado.RESPUESTA);
            this.observacion="";
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
