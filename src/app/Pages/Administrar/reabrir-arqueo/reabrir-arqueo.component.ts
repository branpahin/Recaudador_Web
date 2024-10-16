import { Component, OnInit } from '@angular/core';
import { RecaudoService } from 'src/app/services/recaudo.service';
import * as alertify from 'alertifyjs';

@Component({
  selector: 'app-reabrir-arqueo',
  templateUrl: './reabrir-arqueo.component.html',
  styleUrls: ['./reabrir-arqueo.component.scss'],
})
export class ReabrirArqueoComponent  implements OnInit {
  empresa: string|null = localStorage.getItem('empresaCOD');
  usuario = localStorage.getItem('usuario') || '';
  token: string|null = localStorage.getItem('token');
  codigo_punto_pago="";
  respuesta="";
  datos:any;
  listadoPuntos: any []=[];
  numero_cupones:string="";
  valor_reportado="";
  reabrir:boolean=false;
  datosEnviar={
    EMPRESA:this.empresa,
    CODIGO_PUNTO_PAGO:"",
    NUMERO_ARQUEO:"",
    NUMERO_CUPONES_REPORTADOS:"",
    VALOR_RECAUDADO_REPORTADO:"",
    USUARIO:this.usuario,
    TOKEN:this.token
  }
  constructor(private recaudoService: RecaudoService) { }

  ngOnInit() {
    this.ListarPuntosPago()
  }

  async formatoNumero() {
    this.datosEnviar.VALOR_RECAUDADO_REPORTADO=this.datosEnviar.VALOR_RECAUDADO_REPORTADO.replace(/\./g, '');
    this.datosEnviar.NUMERO_CUPONES_REPORTADOS= this.datosEnviar.NUMERO_CUPONES_REPORTADOS.replace(/\./g, '')

  }

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

  MostrarMas(respuesta: any) {
    respuesta.selected = !respuesta.selected;
  }

  async ReabrirArqueo(empresa:string, codPuntoPago:string, numeroArqueo:string, numeroCupones:string, valorReportado:string){
    await this.formatoNumero();

    this.recaudoService.postReabrirArqueo(this.datosEnviar).subscribe(
      (data: any) => {
        if(data.COD=="200"){

          alertify.success(data.RESPUESTA);
          this.ListarReabrirArqueo()
        }else{
          alertify.error(data.RESPUESTA);
        }
      },
      (error) => {
        console.error('Error al llamar al servicio:', error);
        alertify.error(error)
      }
    );
  }

  editar(empresa:string, codPuntoPago:string, numeroArqueo:string, numeroCupones:string, valorReportado:string){
    this.datosEnviar={
      EMPRESA:empresa,
      CODIGO_PUNTO_PAGO:codPuntoPago,
      NUMERO_ARQUEO:numeroArqueo,
      NUMERO_CUPONES_REPORTADOS:numeroCupones,
      VALOR_RECAUDADO_REPORTADO:valorReportado,
      USUARIO:this.usuario,
      TOKEN:this.token
    }
    if(this.numero_cupones!="" && this.numero_cupones != numeroCupones){
      this.datosEnviar.NUMERO_CUPONES_REPORTADOS=this.numero_cupones;
    }
    if(this.valor_reportado!="" && this.valor_reportado != valorReportado){
      this.datosEnviar.VALOR_RECAUDADO_REPORTADO=this.valor_reportado;
    }
    if(this.numero_cupones=="" && this.valor_reportado==""){
      this.datosEnviar={
        EMPRESA:empresa,
        CODIGO_PUNTO_PAGO:"",
        NUMERO_ARQUEO:"",
        NUMERO_CUPONES_REPORTADOS:"",
        VALOR_RECAUDADO_REPORTADO:"",
        USUARIO:this.usuario,
        TOKEN:this.token
      }
    }

  }

  ListarReabrirArqueo(){
    if (this.token !== null) {
      this.recaudoService.getListadoReabrirArqueo(Number(this.empresa),this.codigo_punto_pago,this.usuario,this.token).subscribe(
        (data: any) => {
          if(data.COD!='200'){
            this.respuesta=data.RESPUESTA;
          }else{
            this.datos=data.REABRIR_ARQUEOS;
            this.respuesta=""
          }
        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    }

  }

}
