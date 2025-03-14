import { Component, OnInit } from '@angular/core';
import { RecaudoService } from 'src/app/services/recaudo.service';
import * as alertify from 'alertifyjs';
import { formatDate } from '@angular/common';
import { DetalleCierre } from 'src/models/usuario.model';
import { CajasSacComponent } from '../cajas-sac/cajas-sac.component';
import { LoadingController, ModalController } from '@ionic/angular';



@Component({
  selector: 'app-cierre-caja',
  templateUrl: './cierre-caja.component.html',
  styleUrls: ['./cierre-caja.component.scss'],


  
})
export class CierreCajaComponent  implements OnInit {

  //#region Variables
  empresa: string|null = localStorage.getItem('empresaCOD');
  usuario: string|null = localStorage.getItem('usuario');
  token: string|null = localStorage.getItem('token');

  resultado:any;
  listado=[] as DetalleCierre[];
  listadoPuntos: any []=[];
  listadoConvenios: any []=[];
  listadoCajasConvenios: any []=[];

  detalle={
    PUNTO_PAGO: "",
    CONVENIO: "",
    ID_CAJA:"",
    IDENTIFICADOR: "",
    FECHA:""
  }

  datos={
    EMPRESA: this.empresa,
    CODIGO_PUNTO_PAGO: "",
    CODIGO_CONVENIO:"",
    FECHA_CIERRE:"",
    IDENTIFICADOR_PUNTO_PAGO: "",
    USUARIO: this.usuario,    
    TOKEN: this.token
  }
  //#endregion

  constructor(private recaudoService: RecaudoService,  
    private modalController: ModalController,
    private loadingController: LoadingController,) { }

  ngOnInit() 
  {
    this.ListarPuntosPago();
  }

  //#region Consulta a API

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


  ListarConveniosCierre(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.getListadoConvenioCierre(Number(this.empresa),this.usuario,this.token).subscribe(
        (data: any) => {
          this.listadoConvenios= data.CONVENIOS_CIERRE;
          this.datos.CODIGO_CONVENIO="";
          this.datos.IDENTIFICADOR_PUNTO_PAGO="";
        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    }

  }

  ListarCajasConveniosCierre(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.getListadoCajasConvenioCierre(Number(this.empresa),this.datos.CODIGO_CONVENIO,this.datos.CODIGO_PUNTO_PAGO,this.usuario,this.token).subscribe(
        (data: any) => {
          this.listadoCajasConvenios= data.CAJAS_CIERRE;
        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    }

  }

  filtroFecha(event: any){
    this.datos.FECHA_CIERRE = formatDate(event.detail.value, 'd/MM/yyyy', 'en-US');   

  }

  async CajasActivasSac() {
    const modal = await this.modalController.create({
      component: CajasSacComponent,
      cssClass: 'my-custom-class'
    });
    modal.style.cssText = `
      --height:auto;
      --max-height: 80%;
      --width:auto;
      --max-width: 90%;
      --border-radius: 10px;
    `;
    return await modal.present();
  }
  //#endregion

  //#region Envio a API
  async CerrarCaja(){
    const loading = await this.loadingController.create({
      spinner: 'crescent', // Puedes cambiar el tipo de spinner ('bubbles', 'dots', 'lines', etc.)
      cssClass: 'custom-spinner' // Clase opcional para personalización
    });
    

    if(this.datos.FECHA_CIERRE==""){
      this.datos.FECHA_CIERRE= new Date().toISOString();
      this.datos.FECHA_CIERRE= formatDate(this.datos.FECHA_CIERRE,'dd-MM-yyyy', 'en-US');
    }
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      await loading.present();
      this.recaudoService.postCierreCaja(this.datos).subscribe(
        async (data: any) => {
          this.resultado= data;
          await loading.dismiss();
          const detallecodigo = this.listado.find(detalle => detalle.ID_CAJA===this.datos.IDENTIFICADOR_PUNTO_PAGO);
          if(this.resultado.COD=="200" && detallecodigo?.ID_CAJA!=this.datos.IDENTIFICADOR_PUNTO_PAGO && detallecodigo?.FECHA!=this.datos.FECHA_CIERRE){
            alertify.success(this.resultado.RESPUESTA);

            const detalleEmpresa = this.listadoPuntos.find(detalle => detalle.CODIGO_PUNTO_PAGO === this.datos.CODIGO_PUNTO_PAGO);
            const detalleConvenio = this.listadoConvenios.find(detalle => detalle.CODIGO_CONVENIO === this.datos.CODIGO_CONVENIO);
            const detalleIdentificador = this.listadoCajasConvenios.find(detalle => detalle.VALOR_CAJA === this.datos.IDENTIFICADOR_PUNTO_PAGO);

            this.detalle={
              PUNTO_PAGO: detalleEmpresa.NOMBRE,
              CONVENIO: detalleConvenio.NOMBRE_CODIGO_CONVENIO,
              ID_CAJA:detalleIdentificador.VALOR_CAJA,
              IDENTIFICADOR: detalleIdentificador.NOMBRE_CAJA,
              FECHA:this.datos.FECHA_CIERRE
            }

            const nuevoDetalle: DetalleCierre = { ...this.detalle };
            this.listado.push(nuevoDetalle);

            this.datos={
              EMPRESA: this.empresa,
              CODIGO_PUNTO_PAGO: "",
              CODIGO_CONVENIO:"",
              FECHA_CIERRE:"",
              IDENTIFICADOR_PUNTO_PAGO: "",
              USUARIO: this.usuario,    
              TOKEN: this.token
            };

           
          }else if(detallecodigo?.ID_CAJA==this.datos.IDENTIFICADOR_PUNTO_PAGO && detallecodigo?.FECHA==this.datos.FECHA_CIERRE){
            await loading.dismiss();
            alertify.error("La caja ya fue cerrada con fecha: "+this.datos.FECHA_CIERRE);
          }
          else {
            await loading.dismiss();
            alertify.error(this.resultado.RESPUESTA);
          }
          
        },
        async (error) => {
          await loading.dismiss();
          console.error('Error al llamar al servicio:', error);
          alertify.error("Problemas de conexión",error);
        }
      );
      
    }
  }
  //#endregion

}
