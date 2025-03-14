import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecaudoService } from 'src/app/services/recaudo.service';
import * as alertify from 'alertifyjs';
import { ModalController } from '@ionic/angular';
import { ListadoFacturasConsultaComponent } from '../../General/listado-facturas-consulta/listado-facturas-consulta.component';

@Component({
  selector: 'app-anulacion-pagos',
  templateUrl: './anulacion-pagos.component.html',
  styleUrls: ['./anulacion-pagos.component.scss'],
})
export class AnulacionPagosComponent  implements OnInit {

  //#region Variables
  empresa: string|null = localStorage.getItem('empresaCOD');
  usuario: string|null = localStorage.getItem('usuario');
  token: string|null = localStorage.getItem('token');

  puntoPago="";
  listadoAnulaciones:any[]=[];
  resultado:any;
  listadoPuntos:any;
  crear:boolean=false;
  editar:boolean=false;


  datos={
    EMPRESA: this.empresa,
    CODIGO_PUNTO_PAGO: "",
    NUMERO_ARQUEO:"",
    NUMERO_MOVIMIENTO:"",
    NUMERO_MOVIMIENTO_DET:"",
    COMENTARIO:"",
    USUARIO:this.usuario,    
    TOKEN:this.token
  }

  datosEliminar={
    EMPRESA: this.empresa,
    CODIGO_PUNTO_PAGO: "",
    ID_ANULACION: "",
    NUMERO_MOVIMIENTO:"",
    NUMERO_MOVIMIENTO_DET:"",
    USUARIO:this.usuario,    
    TOKEN:this.token
  }

  filteredList: any[] = [];
  searchTerm: string = '';

  //#endregion

  constructor(private recaudoService: RecaudoService, 
    private router: Router,
    private modalController: ModalController,) { }

  ngOnInit() {
    this.ListarPuntosPago();
  }

//Cerrar vista de crear o editar
  cerrarTabla(){
    this.crear=false;
    this.editar=false;
    this.ListarAnulaciones();
  }

  //#region Filtrado
  filterList() {
    if (!this.searchTerm.trim()) {
      this.filteredList = this.listadoAnulaciones;
    } else {
      this.filteredList = this.listadoAnulaciones.filter(item =>
        item.NUMERO_ARQUEO.toLowerCase().includes(this.searchTerm.toLowerCase())
        || item.ESTADO_ARQUEO.toLowerCase().includes(this.searchTerm.toLowerCase())
        || item.NUMERO_MOVIMIENTO.toLowerCase().includes(this.searchTerm.toLowerCase())
        || item.FECHA_MOVIMIENTO.toLowerCase().includes(this.searchTerm.toLowerCase())
        || item.NOMBRE_CODIGO_CONVENIO.toLowerCase().includes(this.searchTerm.toLowerCase())
        || item.VALOR_MOVIMIENTO_DET.toLowerCase().includes(this.searchTerm.toLowerCase())
        || item.CODIGO_CLIENTE.toLowerCase().includes(this.searchTerm.toLowerCase())
        || item.FECHA_ANULACION.toLowerCase().includes(this.searchTerm.toLowerCase())
        || item.CODIGO_REFERENCIA.toLowerCase().includes(this.searchTerm.toLowerCase())
        || item.USUARIO_ANULA.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  clearSearch() {
    this.filteredList = this.listadoAnulaciones;
  }
  //#endregion

  //#region Consulta a API
//Consultar puntos de pago
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

//consultar anulaciones realizadas
  ListarAnulaciones(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {

      this.recaudoService.getListarAnulacionesPagos(Number(this.empresa),Number(this.puntoPago),this.usuario,this.token).subscribe(
        (data: any) => {
          this.listadoAnulaciones= data.MOVIMIENTOS_ANULADOS;
          
          this.filteredList = this.listadoAnulaciones;
        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    }

  }

//Mostrar mas información del listado 
  MostrarMas(respuesta: any) {
    respuesta.selected = !respuesta.selected;
  }

  //#endregion

  //#region Envio a API
//Mostrar vista para creación de anulación  
  Crear(){

    this.crear=true;

    this.datos={
      EMPRESA: this.empresa,
    CODIGO_PUNTO_PAGO: "",
    NUMERO_ARQUEO:"",
    NUMERO_MOVIMIENTO:"",
    NUMERO_MOVIMIENTO_DET:"",
    COMENTARIO:"",
    USUARIO:this.usuario,    
    TOKEN:this.token
    };

    this.ListarAnulaciones();
 
}
 async ListarFacturas() {
    const modal = await this.modalController.create({
      component: ListadoFacturasConsultaComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        datos: this.datos,
        backdropDismiss: true,
      }
    });
    modal.style.cssText = `
      --height:auto;
      --max-height: 80%;
      --width:auto;
      --max-width: 90%;
      --border-radius: 10px;
    `;
    modal.onDidDismiss().then((data: any) => {
      console.log("datos: ",data)
      if (data.data != '') {
        this.datos.NUMERO_MOVIMIENTO_DET=data.data.datos.NUMERO_MOVIMIENTO_DET;
      }
    });
    await modal.present();
  }

//Eliminar anulación
  Eliminar(respuesta1:any){
    this.datosEliminar={
      EMPRESA: this.empresa,
      CODIGO_PUNTO_PAGO: respuesta1.CODIGO_PUNTO_PAGO,
      ID_ANULACION: respuesta1.ID_ANULACION,
      NUMERO_MOVIMIENTO:respuesta1.NUMERO_MOVIMIENTO,
      NUMERO_MOVIMIENTO_DET:respuesta1.NUMERO_MOVIMIENTO_DET,
      USUARIO:this.usuario,    
      TOKEN:this.token
    }
    this.EliminarAnulacion();
    
  }


//Enviar anulación creada
  CrearAnulacion(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.postCrearAnulacionPago(this.datos).subscribe(
        (data: any) => {
          this.resultado= data;
          if(this.resultado.COD=="200"){
            alertify.success(this.resultado.RESPUESTA);
            this.datos={
              EMPRESA: this.empresa,
              CODIGO_PUNTO_PAGO: "",
              NUMERO_ARQUEO:"",
              NUMERO_MOVIMIENTO:"",
              NUMERO_MOVIMIENTO_DET:"",
              COMENTARIO:"",
              USUARIO:this.usuario,    
              TOKEN:this.token
            };
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


//Enviar eliminación de la anulación  
  EliminarAnulacion(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.postEliminarAnulacionPago(this.datosEliminar).subscribe(
        (data: any) => {
          this.resultado= data;
          if(this.resultado.COD=="200"){
            alertify.success(this.resultado.RESPUESTA);
            this.ListarAnulaciones();
            
          }else {
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
