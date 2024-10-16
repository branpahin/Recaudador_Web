import { Component, HostListener, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { RecaudoService } from 'src/app/services/recaudo.service';
import { Consultar_Arqueo, Consultar_Arqueo_Param} from 'src/models/usuario.model';
import * as alertify from 'alertifyjs';
import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-consultar-arqueo',
  templateUrl: './consultar-arqueo.component.html',
  styleUrls: ['./consultar-arqueo.component.scss'],
})

export class ConsultarArqueoComponent  implements OnInit {



  consultar_arqueo:Consultar_Arqueo ={
    EMPRESA: 0,
    USUARIO: '',
    ACCION: '',
    CODIGO_PUNTO_PAGO: 0
  }

  consultar_arqueo_param:Consultar_Arqueo_Param ={
    EMPRESA: 0,
    USUARIO: '',
    ACCION: '2',
    NUMERO_ARQUEO: "",
    NUMERO_MOVIMIENTO: "",
    VALOR_MOVIMIENTO_DET: "",
    FECHA_MOVIMIENTO: "",
    CODIGO_CLIENTE:"",
    CODIGO_REFERENCIA:""
  }

  movimiento:any;
  agrupado="S";
  lstfacturas="";
  iframeUrl= "";
  arqueoNum="";
  CODpuntoPago="";
  imprimir=false;
  detalles: boolean=false;
  detallesFac: boolean=false;
  listado: boolean=false;
  resultado : any;
  recaudos:any[]=[];
  recaudosOriginal: any[] = [];
  informacionF:any[]=[];
  recaudosFiltro = [];
  filtroNumeroMovimiento: string = '';
  filtroFecha:string ='';
  filtroTipoPago: string = '';
  filtrovalorRecibido: string = '';
  filtrovalorMovimiento: string = '';
  filtroValorCambio: string = '';
  filtroNumeroCupones: string = '';
  fecha:string='';
  hora: string='';
  habilitarfiltrado=false;


  constructor(private recaudoService: RecaudoService, private http: HttpClient) {}

  empresaCod = localStorage.getItem('empresaCOD') || '';
  nombreEmpresa= localStorage.getItem('empresa')|| '';
  token = localStorage.getItem('token') || '';
  puntoPago= localStorage.getItem('puntoPago')|| '';
  usuario =localStorage.getItem('usuario')||'';
  rol = localStorage.getItem('rol') || '';

  @HostListener('window:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent) {
  if (this.detalles==false && event.key === 'Enter') {
    this.consultarArqueo();
    }
  }

  ngOnInit() {
    this.recaudosOriginal = this.recaudos;
  }

  detallerecaudos(){
    this.detalles=true;
    this.detallesFac = true; 
  }

  cerrarTabla() {
    this.detalles = false; 
    this.consultar_arqueo_param.FECHA_MOVIMIENTO="";
  
  }
  cerrarTablaFac() {
    this.detallesFac = false;
    this.detalleSeleccionado=null;
  
  }
  cerrarlistado() {
    this.listado=false;   
    this.consultar_arqueo_param.FECHA_MOVIMIENTO="";
  }
  detalleSeleccionado: string | null = null;

  mostrarDetalles(detalle:{NUMERO_MOVIMIENTO:any,NUMERO_ARQUEO:any,CODIGO_PUNTO_PAGO:any}): void {
    this.detalleSeleccionado = detalle.NUMERO_MOVIMIENTO;
    this.arqueoNum=detalle.NUMERO_ARQUEO;
    this.CODpuntoPago=detalle.CODIGO_PUNTO_PAGO;
    this.detallesFac = true; 
  }

  fechaConsulta(event: any){
    this.consultar_arqueo_param.FECHA_MOVIMIENTO = formatDate(event.detail.value, 'dd-MM-yyyy', 'en-US');
  }

  filtrar(){
    this.habilitarfiltrado=!this.habilitarfiltrado;
    if(this.habilitarfiltrado==false){
      this.filtroNumeroMovimiento = '';
      this.filtroFecha ='';
      this.filtroTipoPago = '';
      this.filtrovalorRecibido = '';
      this.filtrovalorMovimiento = '';
      this.filtroValorCambio = '';
      this.filtroNumeroCupones = '';
      this.fecha = '';
      this.hora ='';
    }
  }

  filtro(event: any){
    this.fecha = formatDate(event.detail.value, 'd/MM/yyyy', 'en-US');
    this.filtroFecha=this.fecha+" "+this.hora;
    
  }

  Hora(event: any) {
    this.hora = formatDate(event.detail.value, 'h', 'en-US');
    this.filtroFecha=this.fecha+" "+this.hora;
  }

  verificarRol(): boolean {
    return this.rol === 'R_CAJERO';
  }



  consultarArqueo(){
    if(this.consultar_arqueo_param.NUMERO_ARQUEO!=""){
      this.listado=true;
    }else {
      if(this.consultar_arqueo.ACCION!='1'){
        this.listado=false;
        this.detallerecaudos()
      }
    }

    
    if(this.consultar_arqueo.ACCION=='1'){
      this.listado=true;
      this.recaudoService.postConsultarArqueo(this.empresaCod, this.usuario, this.consultar_arqueo.ACCION, this.puntoPago, this.token).subscribe({
        next: data => {
          this.resultado = data;
          this.recaudos=data.RECAUDOS;
          this.informacionF=data.RECAUDOS;
          this.arqueoNum=data.NUMERO_ARQUEO;
          this.CODpuntoPago=data.CODIGO_PUNTO_PAGO;
          if(this.resultado.COD!='200'){
            alertify.error(this.resultado.RESPUESTA);
            }
        },
        error: error => {
          console.error(error);
        }
      });
  }
    if(this.consultar_arqueo.ACCION=='2'){
      this.recaudoService.postConsultarArqueoParam(this.empresaCod, this.usuario, this.consultar_arqueo_param.ACCION, this.consultar_arqueo_param.NUMERO_ARQUEO,this.consultar_arqueo_param.NUMERO_MOVIMIENTO,this.consultar_arqueo_param.VALOR_MOVIMIENTO_DET,this.consultar_arqueo_param.FECHA_MOVIMIENTO,this.consultar_arqueo_param.CODIGO_CLIENTE,this.consultar_arqueo_param.CODIGO_REFERENCIA,this.token).subscribe({
        next: data => {
          this.resultado = data;
          this.recaudos=data.RECAUDOS;
          this.arqueoNum=data.NUMERO_ARQUEO;
          this.CODpuntoPago=data.CODIGO_PUNTO_PAGO;
          this.informacionF=data.RECAUDOS;

          if(this.resultado.COD!='200'){
            alertify.error(this.resultado.RESPUESTA);
            }
        },
        error: error => {
          console.error(error);
        }
      });
    }
  }

  updateSelectedClientes(event: { detail: { checked: any; }; }, informacio: { CODIGO_CLIENTE: any; }) {
    
    const codigoCliente = informacio.CODIGO_CLIENTE;
  
    if (event.detail.checked) {
      if (!this.lstfacturas.includes(codigoCliente)) {
        this.lstfacturas += codigoCliente + ",";
      }
    } else {
      this.lstfacturas = this.lstfacturas.replace(new RegExp(codigoCliente + ",", 'g'), "");
    }
 
  }

  cerrarImp(movimiento=this.movimiento){
    const iframe = document.querySelector('iframe');
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.window.close();
    }
  
    this.imprimir = false;
    this.imprimirTikect(movimiento);
  
  }

  vistaImpresion(recaudo: {NUMERO_MOVIMIENTO:any,NUMERO_ARQUEO:any,CODIGO_PUNTO_PAGO:any}){
    this.imprimir=true;
    this.movimiento= recaudo.NUMERO_MOVIMIENTO;
    this.arqueoNum=recaudo.NUMERO_ARQUEO;
    this.CODpuntoPago=recaudo.CODIGO_PUNTO_PAGO;
    this.imprimirTikect(this.movimiento);
  }

  vistaImpresionDes(){
    this.imprimir=true;
    this.movimiento=this.detalleSeleccionado;
    this.imprimirTikect(this.movimiento);
  }
 
  imprimirTikect(movimiento:any=this.movimiento){
    if(this.lstfacturas==""){
      this.lstfacturas="0";
    }
    
    if(this.detalleSeleccionado){
      this.agrupado="N";
      movimiento=this.detalleSeleccionado;
    }

    this.recaudoService.getImpresiónTicket(this.empresaCod,this.CODpuntoPago,this.arqueoNum,movimiento,this.usuario,this.lstfacturas,this.agrupado,this.token)
    .subscribe(
      (response) => {
        const url = this.recaudoService.url+'api/Recaudo/Impresion_Ticket?EMPRESA='+this.empresaCod+
                    '&CODIGO_PUNTO_PAGO='+this.CODpuntoPago+
                    '&NUMERO_ARQUEO='+this.arqueoNum+
                    '&NUMERO_MOVIMIENTO='+movimiento+
                    '&USUARIO='+this.usuario+
                    '&LSTFACTURAS='+this.lstfacturas+
                    '&AGRUPADO='+this.agrupado+
                    '&TOKEN='+this.token;
                    
        this.http.get(url, { responseType: 'blob' }).subscribe(
          (response: Blob) => {
            const blob = new Blob([response], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);

            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';

            document.body.appendChild(iframe);

            iframe.src = url;

            iframe.onload = () => {
              iframe.contentWindow?.focus();
              iframe.contentWindow?.print();

            };
          },
          error => {
            console.error('Error al imprimir el ticket:', error);
          }
        );
        
      },
      (error) => {
        console.error('Error al obtener el archivo PDF', error);
      }
    );
  }
  

}
