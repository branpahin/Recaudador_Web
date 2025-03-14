import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecaudoService } from 'src/app/services/recaudo.service';
import * as alertify from 'alertifyjs';
import * as saveAs from 'file-saver';

@Component({
  selector: 'app-listado-cuadres-punto-pago',
  templateUrl: './listado-cuadres-punto-pago.component.html',
  styleUrls: ['./listado-cuadres-punto-pago.component.scss'],
})
export class ListadoCuadresPuntoPagoComponent  implements OnInit {

  //#region Variables
  empresa: string|null = localStorage.getItem('empresaCOD');
  usuario: string|null = localStorage.getItem('usuario');
  token: string|null = localStorage.getItem('token');

  principal:boolean=false;
  codigo_punto_pago="";
  fechaInicio="";
  fechaFin="";
  listadoCuadres: any []=[] ;
  listadoPuntos: any []=[];
  resultado : any;
  arqueoSelect="";
  recaudos:any[]=[];
  accion="";
  accionCuadre="";
  observacion="";
  confirmacion:boolean=false;

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
  //#endregion

  constructor(private recaudoService: RecaudoService, private router: Router) { }

  ngOnInit() {
    this.ListarPuntosPago();
  }

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

  MostrarMas(respuesta: any) {
    respuesta.selected = !respuesta.selected;
  }

  imprimir(data:any){
    if(this.empresa !== null && this.usuario !== null && this.token !== null){
    
      this.recaudoService.getImprimirCuadre(Number(this.empresa), data.NUMERO_ARQUEO, this.token).subscribe(
        (response: Blob) => {
          const fileName = `Cierre_Arqueo_${data.NUMERO_ARQUEO}.pdf`;
          const blob = new Blob([response], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
  
          // Abre el archivo PDF en una nueva pestaña
          const newWindow = window.open(url, '_blank');
          if (newWindow) {
            newWindow.focus(); // Asegúrate de que la nueva pestaña tenga el foco
          } else {
            alertify.warning("Por favor habilita ventanas emergentes para ver el PDF.");
          }
  
          alertify.success("Archivo PDF generado con éxito.");
        },
        (error) => {
          alertify.error("Error al descargar el archivo: ");
        }
      );
    }
  }

  Aprobar(codPuntoPago:string,numeroArqueo: string){
    this.codigo_punto_pago=codPuntoPago;
    this.arqueoSelect=numeroArqueo;
    this.accionCuadre="1"
    this.confirmacion=true;
  }
  Rechazar(codPuntoPago:string,numeroArqueo: string){
    this.codigo_punto_pago=codPuntoPago;
    this.arqueoSelect=numeroArqueo;
    this.accionCuadre="2"
    this.confirmacion=true;
  }
  cerrarAlerta(){
    this.confirmacion=false;
  }

  ConsultarArq(){
    this.tablas=true;
    this.principal=true;
    this.seleccion=false;
    this.ListarPuntosPago();
  }

  ListarCuadresPunto(){
    
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.getConsultarCuadresPunto(Number(this.empresa),this.accion,Number(this.codigo_punto_pago),this.usuario,this.token,).subscribe(
        (data: any) => {

          if(this.accion=="1"){
            this.listadoCuadres= data.CUADRES_PENDIENTES;
          }
          else if(this.accion=="2"){
            this.listadoCuadres= data.CUADRES_VALIDADOS;
          }
          else if(this.accion=="3"){
            this.listadoCuadres= data.CUADRES_EXPIRADOS;
          }
          
        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    }

  }

  //#endregion

  //#region Envio a API

  AccionCuadrePunto(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.postAccionCuadrePunto(this.empresa,this.codigo_punto_pago,this.arqueoSelect,this.accionCuadre,this.observacion,this.usuario,this.token,).subscribe(
        (data: any) => {
          this.resultado= data;
          if(this.resultado.COD=="200"){
            
            alertify.success(this.resultado.RESPUESTA);
            this.confirmacion=false;
            this.ListarCuadresPunto();
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
