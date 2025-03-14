import { Component,OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecaudoService } from 'src/app/services/recaudo.service';
import * as alertify from 'alertifyjs';
import { LoadingController, MenuController, ModalController} from '@ionic/angular';
import { interval } from 'rxjs';
import { InformacionUsuarioComponent } from '../../Autenticacion/informacion-usuario/informacion-usuario.component';
import { CargarArchivoOfflineComponent } from '../../Administrar/cargar-archivo-offline/cargar-archivo-offline.component';
import { ReabrirArqueoComponent } from '../../Administrar/reabrir-arqueo/reabrir-arqueo.component';
import { TypeRuteImg, TypeRuteImgPunto} from 'src/models/rutes';




@Component({
  selector: 'app-inicio-arqueo',
  templateUrl: './inicio-arqueo.component.html',
  styleUrls: ['./inicio-arqueo.component.scss'],
})


export class InicioArqueoComponent  implements OnInit {

  //#region Variables
  nombrePuntoPago: string|null =localStorage.getItem('nombrePuntoPago');
  puntoPago: string|null =localStorage.getItem('puntoPago');
  usuario =localStorage.getItem('usuario') ||'';
  token =localStorage.getItem('token') || '';
  codCaja=localStorage.getItem('condigoCaja') || '';
  empresa = localStorage.getItem('empresaCOD') || '';
  arqueo= localStorage.getItem('numeroArqueo') || '';
  
  
  Punteo:boolean=false;
  recaudos:any;
  admin:boolean=false;
  adminSuper:boolean=false;


  datosTurno={
    EMPRESA: this.empresa,
    CODIGO_PUNTO_PAGO: this.puntoPago,
    USUARIO: this.usuario,
    CODIGO_CAJA: this.codCaja,
    PREFERENCIAL:"0",   
    TOKEN:this.token
  };


  mostrarInicio:boolean = true;
  mostrarContenido: boolean = false;
  mostrarContenido2: boolean = false;
  mostrarContenido3: boolean = false;
  mostrarContenido4: boolean = false;
  mostrarContenido5: boolean = false;
  mostrarBoton: boolean = true;
  mostrarBoton2: boolean = true;
  mostrarBoton3: boolean = true;
  mostrarBoton4: boolean = true;
  mostrarBoton5: boolean = true;
  mostrarContenidoAdmin: boolean = false;
  mostrarContenidoListar:boolean=false;
  mostrarContenidoPuntosPagoAdmin:boolean=false;
  mostrarContenidoListaUsuarios:boolean=false;
  mostrarContenidoAdministrarCajas:boolean=false;
  mostrarContenidoAsobancaria:boolean=false;
  mostrarContenidoTrasladoFechas:boolean=false;
  mostrarMensaje:boolean=false;
  mostrarContenidoConvenios:boolean=false;
  mostrarContenidoFacturas:boolean=false;
  mostrarListadoAnulaciones:boolean=false;
  mostrarVistaCierreCaja:boolean=false;
  Sincro:boolean=false;
  mostrarVistaReporteador:boolean=false;
  parametrizacionBarras:boolean=false;
  informacionParametrizacion:boolean=false;
  mostrarAsignacionReportes:boolean=false;
  mostrarCargarArchivo:boolean=false;

  turno:boolean=true;
  turnero:any;
  seleccionar:boolean=false;
  mostrarListaDeBotones:boolean=false;
  mostrarReportesGen:boolean=false;
  mostrarListaDeBotonesAdmin:boolean=false;
  informacionUser:boolean=false;
  resultado:any;
  modulos: any []=[];
  mensajes="";
  listadoMensajesActivos:any []=[];
  indiceModuloSeleccionado: number | null = null;

  mensajeCerrar:boolean=false;
  isToastOpen:boolean=false;
  intervalId: any;
  loading:any;
  load:boolean=false;
  //#endregion
  
  constructor(public recaudoService: RecaudoService, 
    private router: Router, 
    private activatedRoute: ActivatedRoute,
    private menuCtrl: MenuController, 
    private modalController: ModalController,
    private loadingController: LoadingController) { }

  
  async ngOnInit() {
    this.load=false;
    this.loading = await this.loadingController.create({
      spinner: 'crescent', // Puedes cambiar el tipo de spinner ('bubbles', 'dots', 'lines', etc.)
      cssClass: 'custom-spinner' // Clase opcional para personalización
    });
    await this.loading.present();
    
    interval(6000)
      .subscribe(() => {
        this.ListarMensajes();
        this.isToastOpen = true;
      });

    this.obtenerRol();
    
    
    this.EstadoTurnero();
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

//#region Consultas iniciales

  calcularPosicionVertical(index: number): string {
    const alturaMensaje = 60;
    const separacionVertical = 20;
    const posicionVertical = index * (alturaMensaje + separacionVertical);
    return `${posicionVertical}px`;
  }

  ListarMensajes(){
  
    this.recaudoService.getListarMensajes(Number(this.empresa),Number(this.puntoPago),this.usuario,this.token).subscribe(
      (data: any) => {
        this.listadoMensajesActivos= data.MENSAJES_ACTIVOS;
        this.isToastOpen = false;
      },
      (error) => {
        console.error('Error al llamar al servicio:', error);
      }
    );
  }

  EstadoTurnero(){
    this.recaudoService.getEstadoTurnero(Number(this.empresa),this.usuario,Number(this.codCaja),this.token).subscribe(
      (data: any) => {
        this.turnero= data.ESTADO_TURNERO;
        if(this.turnero=="ACTIVO"){
          this.turno=false;
        }else{
          this.turno=true;
        }
      },
      (error) => {
        console.error('Error al llamar al servicio:', error);
      }
    );
  }
//#endregion

//#region Obtener paramteros de modulos y permisos
  
  obtenerRol(){
    const usuario = localStorage.getItem('usuario') || '';
    const empresa = localStorage.getItem('empresaCOD') || '';
    const rol=localStorage.getItem('rol');
    
    this.recaudoService.getObtenerRol(this.usuario, this.empresa, this.token).subscribe(async (data) => {
      this.resultado = data;
  
      if(rol!=this.resultado.IDENTIFICADOR_ROL){
        await this.loading.dismiss();
        this.load=true;
        alertify.error('¡¡El usuario cambío de Roll o expiro la sesión, se cerrara la sesión!!');
        setTimeout(() => {
          this.cerrarSesion();
        }, 5000);

      }else{
        await this.loading.dismiss();
        this.load=true;
        alertify.success('¡¡Acceso exitoso!!');
        localStorage.setItem('rol', this.resultado.IDENTIFICADOR_ROL);
        this.permisos();
        this.obtenerModulos();
      }
     
    }, (error) => {
      console.error('Error al cerrar sesión:', error);
      alertify.alert("La sesión ha sido cerrada", () => {
        this.cerrarSesion();
        alertify.message('OK');
        });
      
    });

  }

  obtenerModulos(){
    const usuario = localStorage.getItem('usuario') || '';
    const rol = localStorage.getItem('rol') || '';
    const empresa = localStorage.getItem('empresaCOD') || '';
    const token = localStorage.getItem('token') || '';
    

    this.recaudoService.getObtenerModulo(empresa, usuario, rol, token).subscribe({
      next: data => {
        this.modulos = data.MODULOS;
        
      },
      error: error => {
        console.error(error);
      }
    } );

  }

  url(): boolean {
    return  window.location.href.includes('produccion_torres') || window.location.href.includes('localhost') || window.location.href.includes('prueba'); // Retorna true si contiene alguno de los términos
  }

  cerrarMenu() {
    this.menuCtrl.close();
  }

  cerrarPunteo(){
    this.Punteo=false;
  }

  cerrarFacturasConvenio(){
    this.mostrarContenidoFacturas=false;
  }

  cerrarAnulaciones(){
    this.mostrarListadoAnulaciones=false;
  }

  cerrarSincro(){
    this.Sincro=false;
    if(!this.Sincro){
      this.recaudoService.sincronizacionCambio.emit(true);
    }
  }

  cerrarParametrizacionBarras(){
    this.parametrizacionBarras=false;
  }
  

  inicio() {
    this.parametrizacionBarras=false;
    this.informacionParametrizacion=false;
    this.mostrarVistaCierreCaja=false;
    this.mostrarVistaReporteador=false;
    this.mostrarListadoAnulaciones=false;
    this.mostrarContenidoFacturas=false
    this.mostrarContenidoConvenios=false;
    this.mostrarMensaje=false;
    this.mostrarContenidoAsobancaria=false;
    this.mostrarContenidoListaUsuarios=false;
    this.mostrarContenidoTrasladoFechas=false;
    this.mostrarContenidoAdministrarCajas=false;
    this.mostrarContenidoPuntosPagoAdmin=false;
    this.mostrarContenidoListar=false;
    this.mostrarContenidoAdmin=false;
    this.mostrarContenido5 = false;
    this.mostrarContenido = false;
    this.mostrarContenido2 = false;
    this.mostrarContenido3 = false;
    this.mostrarContenido4 = false;
    this.mostrarInicio=true;
    location.reload();
  }

  obtenerIcono(nombreModulo: string): { iconName: string, iconClass: string } {
    switch (nombreModulo) {
      case '1':
        return { iconName: 'add-circle-sharp', iconClass: 'Crear' };
      case '2':
        return { iconName: 'search', iconClass: 'Buscar' };
      case '3':
        return { iconName: 'cash', iconClass: 'Entrega' };
      case '4':
        return { iconName: 'calculator', iconClass: 'Cuadre' };
      case '5':
        return { iconName: 'pricetags', iconClass: 'recaudar' };
      case '6':
        return { iconName: 'clipboard-outline', iconClass: 'recaudar' };
      case '7':
        return { iconName: 'document-attach-outline', iconClass: 'reportes' };
      case '8':
        return { iconName: 'grid-outline', iconClass: 'admin' };
      case '9':
        return { iconName: 'search', iconClass: 'Buscar' };
      default:
        return { iconName: 'Buscar', iconClass: 'reload-outline' }; // un icono por defecto en caso de que no se encuentre ningún icono adecuado
    }
  }

  obtenerIcono2(nombreModulo: string): { iconName: string, iconClass: string } {
    switch (nombreModulo) {
      case '1':
        return { iconName: 'document-attach-outline', iconClass: 'asigCaja' };
      case '2':
        return { iconName: 'document-attach-outline', iconClass: 'asigCaja' };
      case '3':
        return { iconName: 'document-attach-outline', iconClass: 'asigCaja' };
      default:
        return { iconName: 'Buscar', iconClass: 'reload-outline' }; // un icono por defecto en caso de que no se encuentre ningún icono adecuado
    }
  }
  obtenerIcono3(nombreModulo: string): { iconName: string, iconClass: string } {
    switch (nombreModulo) {
      case '1':
        return { iconName: 'desktop-outline', iconClass: 'asigCaja' };
      case '2':
        return { iconName: 'search', iconClass: 'asigCaja' };
      case '3':
        return { iconName: 'business-outline', iconClass: 'asigCaja' };
      case '4':
        return { iconName: 'people-outline', iconClass: 'asigCaja' };
      case '5':
        return { iconName: 'albums-outline', iconClass: 'asigCaja' };
      case '6':
        return { iconName: 'calendar-number-outline', iconClass: 'asigCaja' };
      case '7':
        return { iconName: 'chatbubble-ellipses-outline', iconClass: 'asigCaja' };
      case '8':
        return { iconName: 'layers-outline', iconClass: 'asigCaja' };
      case '9':
        return { iconName: 'receipt-outline', iconClass: 'asigCaja' };
      case '10':
        return { iconName: 'trash-bin-outline', iconClass: 'asigCaja' };
      case '11':
        return { iconName: 'cube-outline', iconClass: 'asigCaja' };
      case '12' :
        return {iconName: 'qr-code-outline', iconClass: 'asigCaja'}
      case '13' :
        return {iconName: 'newspaper-outline', iconClass: 'asigCaja'}
      case '14' :
        return {iconName: 'documents-outline', iconClass: 'asigCaja'}
      default:
        return { iconName: 'alert-outline', iconClass: 'Buscar' };
    }
  }

  toggleContenido(indice: number, modulo:any) {
    if(modulo.NOMBRE_MODULO.includes("Crear") || modulo.NOMBRE_MODULO.includes("Buscar") || modulo.NOMBRE_MODULO.includes("Entrega") || modulo.NOMBRE_MODULO.includes("Cuadre") || modulo.NOMBRE_MODULO.includes("Recaudar") ){
      this.indiceModuloSeleccionado = indice;
    }

    switch (modulo.MODULO) {
      case '1':
        this.mostrarCargarArchivo=false;
        this.mostrarVistaCierreCaja=false;
        this.mostrarVistaReporteador=false;
        this.mostrarListadoAnulaciones=false;
        this.mostrarContenidoFacturas=false
        this.mostrarContenidoConvenios=false;
        this.mostrarMensaje=false;
        this.mostrarContenidoAsobancaria=false;
        this.mostrarContenidoAdministrarCajas=false;
        this.mostrarContenidoTrasladoFechas=false;
        this.mostrarContenidoListaUsuarios=false;
        this.mostrarContenidoPuntosPagoAdmin=false;
        this.mostrarContenidoListar=false;
        this.mostrarContenidoAdmin=false;
        this.mostrarContenido5 = false;
        this.mostrarContenido = true;
        this.mostrarContenido2 = false;
        this.mostrarContenido3 = false;
        this.mostrarContenido4 = false;
        this.mostrarInicio=false;
        this.mostrarListaDeBotonesAdmin=false;
        this.mostrarListaDeBotones=false;
        this.mostrarReportesGen = false;
        this.parametrizacionBarras=false;
        this.informacionParametrizacion=false;
        this.mostrarAsignacionReportes=false;
        this.cerrarMenu();
        break;
      case '2':
        this.mostrarCargarArchivo=false;
        this.mostrarVistaCierreCaja=false;
        this.mostrarVistaReporteador=false;
        this.mostrarListadoAnulaciones=false;
        this.mostrarContenidoFacturas=false
        this.mostrarContenidoConvenios=false;
        this.mostrarMensaje=false;
        this.mostrarContenidoAsobancaria=false;
        this.mostrarContenidoAdministrarCajas=false;
        this.mostrarContenidoTrasladoFechas=false;
        this.mostrarContenidoListaUsuarios=false;
        this.mostrarContenidoPuntosPagoAdmin=false;
        this.mostrarContenidoListar=false;
        this.mostrarContenidoAdmin=false;
        this.mostrarContenido5 = false;
        this.mostrarContenido2 = true;
        this.mostrarContenido = false;
        this.mostrarContenido3 = false;
        this.mostrarContenido4 = false;
        this.mostrarInicio=false;
        this.mostrarListaDeBotonesAdmin=false;
        this.mostrarListaDeBotones=false;
        this.mostrarReportesGen = false;
        this.parametrizacionBarras=false;
        this.informacionParametrizacion=false;
        this.mostrarAsignacionReportes=false;
        this.cerrarMenu();
        break;
      case '3':
        this.mostrarCargarArchivo=false;
        this.mostrarVistaCierreCaja=false;
        this.mostrarVistaReporteador=false;
        this.mostrarListadoAnulaciones=false;
        this.mostrarContenidoFacturas=false
        this.mostrarContenidoConvenios=false;
        this.mostrarMensaje=false;
        this.mostrarContenidoAsobancaria=false;
        this.mostrarContenidoAdministrarCajas=false;
        this.mostrarContenidoTrasladoFechas=false;
        this.mostrarContenidoListaUsuarios=false;
        this.mostrarContenidoPuntosPagoAdmin=false;
        this.mostrarContenidoListar=false;
        this.mostrarContenidoAdmin=false;
        this.mostrarContenido5 = false;
        this.mostrarContenido3 = true;
        this.mostrarContenido2 = false;
        this.mostrarContenido = false;
        this.mostrarContenido4 = false;
        this.mostrarInicio=false;
        this.mostrarListaDeBotonesAdmin=false;
        this.mostrarListaDeBotones=false;
        this.mostrarReportesGen = false;
        this.parametrizacionBarras=false;
        this.informacionParametrizacion=false;
        this.mostrarAsignacionReportes=false;
        this.cerrarMenu();
        break;
      case '4':
        this.mostrarCargarArchivo=false;
        this.mostrarVistaCierreCaja=false;
        this.mostrarVistaReporteador=false;
        this.mostrarListadoAnulaciones=false;
        this.mostrarContenidoFacturas=false
        this.mostrarContenidoConvenios=false;
        this.mostrarMensaje=false;
        this.mostrarContenidoAsobancaria=false;
        this.mostrarContenidoAdministrarCajas=false;
        this.mostrarContenidoTrasladoFechas=false;
        this.mostrarContenidoListaUsuarios=false;
        this.mostrarContenidoPuntosPagoAdmin=false;
        this.mostrarContenidoListar=false;
        this.mostrarContenidoAdmin=false;
        this.mostrarContenido5 = false;
        this.mostrarContenido4 = true;
        this.mostrarContenido2 = false;
        this.mostrarContenido3 = false;
        this.mostrarContenido = false;
        this.mostrarInicio=false;
        this.mostrarListaDeBotonesAdmin=false;
        this.mostrarListaDeBotones=false;
        this.mostrarReportesGen = false;
        this.parametrizacionBarras=false;
        this.informacionParametrizacion=false;
        this.mostrarAsignacionReportes=false;
        this.cerrarMenu();
        break;
      case '5':
        this.mostrarCargarArchivo=false;
        this.mostrarVistaCierreCaja=false;
        this.mostrarVistaReporteador=false;
        this.mostrarListadoAnulaciones=false;
        this.mostrarContenidoFacturas=false
        this.mostrarContenidoConvenios=false;
        this.mostrarMensaje=false;
        this.mostrarContenidoAsobancaria=false;
        this.mostrarContenidoAdministrarCajas=false;
        this.mostrarContenidoTrasladoFechas=false;
        this.mostrarContenidoListaUsuarios=false;
        this.mostrarContenidoPuntosPagoAdmin=false;
        this.mostrarContenidoListar=false;
        this.mostrarContenidoAdmin=false;
        this.mostrarContenido5 = true;
        this.mostrarContenido4 = false;
        this.mostrarContenido2 = false;
        this.mostrarContenido3 = false;
        this.mostrarContenido = false;
        this.mostrarInicio=false;
        this.mostrarListaDeBotonesAdmin=false;
        this.mostrarListaDeBotones=false;
        this.mostrarReportesGen = false;
        this.parametrizacionBarras=false;
        this.informacionParametrizacion=false;
        this.mostrarAsignacionReportes=false;
        this.cerrarMenu();
        break;
      case '6':
        this.Punteo=true;
        this.mostrarCargarArchivo=false;
        this.mostrarVistaCierreCaja=false;
        this.mostrarVistaReporteador=false;
        this.mostrarListadoAnulaciones=false;
        this.mostrarContenidoFacturas=false;
        this.mostrarContenidoConvenios=false;
        this.mostrarMensaje=false;
        this.mostrarContenidoAsobancaria = false;
        this.mostrarContenidoAdministrarCajas=false;
        this.mostrarContenidoListaUsuarios=false;
        this.mostrarContenidoPuntosPagoAdmin=false;
        this.mostrarContenidoTrasladoFechas=false;
        this.mostrarContenidoListar=false;
        this.mostrarContenidoAdmin=false;
        this.mostrarContenido5 = false;
        this.mostrarContenido4 = false;
        this.mostrarContenido2 = false;
        this.mostrarContenido3 = false;
        this.mostrarContenido = false;
        this.mostrarInicio=true;
        this.indiceModuloSeleccionado=null;
        this.cerrarMenu();
        this.mostrarListaDeBotonesAdmin=false;
        this.mostrarListaDeBotones=false;
        this.mostrarReportesGen = false;
        this.parametrizacionBarras=false;
        this.informacionParametrizacion=false;
        this.mostrarAsignacionReportes=false;
        this.cerrarMenu();
        break;
      case '7':
        this.mostrarListaDeBotones = !this.mostrarListaDeBotones;
        this.mostrarListaDeBotonesAdmin=false;
        this.mostrarReportesGen = false;
      break;
      case '8':
        this.mostrarListaDeBotonesAdmin = !this.mostrarListaDeBotonesAdmin;
        this.mostrarListaDeBotones=false;
        this.mostrarReportesGen = false;
      break;
      case '9':
        this.Sincro=true;
        this.mostrarVistaCierreCaja=false;
        this.mostrarVistaReporteador=false;
        this.mostrarListadoAnulaciones=false;
        this.mostrarContenidoFacturas=false;
        this.mostrarContenidoConvenios=false;
        this.mostrarMensaje=false;
        this.mostrarContenidoAsobancaria = false;
        this.mostrarContenidoAdministrarCajas=false;
        this.mostrarContenidoListaUsuarios=false;
        this.mostrarContenidoPuntosPagoAdmin=false;
        this.mostrarContenidoTrasladoFechas=false;
        this.mostrarContenidoListar=false;
        this.mostrarContenidoAdmin=false;
        this.mostrarContenido5 = false;
        this.mostrarContenido4 = false;
        this.mostrarContenido2 = false;
        this.mostrarContenido3 = false;
        this.mostrarContenido = false;
        this.Punteo=false;
        this.mostrarInicio=true;
        this.recaudoService.sincronizacionCambio.emit(false);
        this.indiceModuloSeleccionado=null;
        this.mostrarListaDeBotonesAdmin=false;
        this.mostrarListaDeBotones=false;
        this.mostrarReportesGen = false;
        this.parametrizacionBarras=false;
        this.informacionParametrizacion=false;
        this.mostrarAsignacionReportes=false;
        this.cerrarMenu();
        
      break;
      default:

        break;
    }
  }
  toggleContenido2(indice: number, modulo:any) {
    this.indiceModuloSeleccionado=null;

    switch (modulo.SUB_MODULO) {
      case '1':
        
        this.cargarArchivo();
        break;
      case '2':
        this.mostrarCargarArchivo=false;
        this.mostrarVistaCierreCaja=false;
        this.mostrarListadoAnulaciones=false;
        this.mostrarVistaReporteador=false;
        this.mostrarContenidoFacturas=false
        this.mostrarContenidoConvenios=false;
        this.mostrarMensaje=false;
        this.mostrarContenidoAsobancaria = !this.mostrarContenidoAsobancaria;
        this.mostrarContenidoAdministrarCajas=false;
        this.mostrarContenidoListaUsuarios=false;
        this.mostrarContenidoPuntosPagoAdmin=false;
        this.mostrarContenidoTrasladoFechas=false;
        this.mostrarContenidoListar=false;
        this.mostrarContenidoAdmin=false;
        this.mostrarContenido5 = false;
        this.mostrarContenido4 = false;
        this.mostrarContenido2 = false;
        this.mostrarContenido3 = false;
        this.mostrarContenido = false;
        this.mostrarInicio=false;
        this.parametrizacionBarras=false;
        this.informacionParametrizacion=false;
        this.mostrarAsignacionReportes=false;
        this.cerrarMenu();
        break;
      case '3':
        this.mostrarCargarArchivo=false;
        this.mostrarVistaCierreCaja=false;
        this.mostrarVistaReporteador=!this.mostrarVistaReporteador;
        this.mostrarListadoAnulaciones=false;
        this.mostrarContenidoFacturas=false;
        this.mostrarContenidoConvenios=false;
        this.mostrarMensaje=false;
        this.mostrarContenidoAsobancaria = false;
        this.mostrarContenidoAdministrarCajas=false;
        this.mostrarContenidoListaUsuarios=false;
        this.mostrarContenidoPuntosPagoAdmin=false;
        this.mostrarContenidoTrasladoFechas=false;
        this.mostrarContenidoListar=false;
        this.mostrarContenidoAdmin=false;
        this.mostrarContenido5 = false;
        this.mostrarContenido4 = false;
        this.mostrarContenido2 = false;
        this.mostrarContenido3 = false;
        this.mostrarContenido = false;
        this.mostrarInicio=false;
        this.parametrizacionBarras=false;
        this.informacionParametrizacion=false;
        this.mostrarAsignacionReportes=false;
        this.cerrarMenu();
        break;
      default:

        break;
    }
  }

  toggleContenido3(indice: number, modulo:any) {
    this.indiceModuloSeleccionado=null;
    this.cerrarMenu();
    switch (modulo.SUB_MODULO) {
      case '1':
        this.mostrarCargarArchivo=false;
        this.mostrarVistaCierreCaja=false;
        this.mostrarVistaReporteador=false;
        this.mostrarListadoAnulaciones=false;
        this.mostrarContenidoFacturas=false
        this.mostrarContenidoConvenios=false;
        this.mostrarMensaje=false;
        this.mostrarContenidoAsobancaria=false;
        this.mostrarContenidoAdministrarCajas=false;
        this.mostrarContenidoTrasladoFechas=false;
        this.mostrarContenidoListaUsuarios=false;
        this.mostrarContenidoPuntosPagoAdmin=false;
        this.mostrarContenidoListar=false;
        this.mostrarContenidoAdmin=true;
        this.mostrarContenido5 = false;
        this.mostrarContenido4 = false;
        this.mostrarContenido2 = false;
        this.mostrarContenido3 = false;
        this.mostrarContenido = false;
        this.mostrarInicio=false;
        this.parametrizacionBarras=false;
        this.informacionParametrizacion=false;
        this.mostrarAsignacionReportes=false;
        break;
      case '2':
        this.mostrarCargarArchivo=false;
        this.mostrarVistaCierreCaja=false;
        this.mostrarVistaReporteador=false;
        this.mostrarListadoAnulaciones=false;
        this.mostrarContenidoFacturas=false
        this.mostrarContenidoConvenios=false;
        this.mostrarMensaje=false;
        this.mostrarContenidoAsobancaria=false;
        this.mostrarContenidoAdministrarCajas=false;
        this.mostrarContenidoTrasladoFechas=false;
        this.mostrarContenidoListaUsuarios=false;
        this.mostrarContenidoPuntosPagoAdmin=false;
        this.mostrarContenidoListar=true;
        this.mostrarContenidoAdmin=false;
        this.mostrarContenido5 = false;
        this.mostrarContenido4 = false;
        this.mostrarContenido2 = false;
        this.mostrarContenido3 = false;
        this.mostrarContenido = false;
        this.mostrarInicio=false;
        this.parametrizacionBarras=false;
        this.informacionParametrizacion=false;
        this.mostrarAsignacionReportes=false;
        break;
      case '3':
        this.mostrarCargarArchivo=false;
        this.mostrarVistaCierreCaja=false;
        this.mostrarVistaReporteador=false;
        this.mostrarListadoAnulaciones=false;
        this.mostrarContenidoFacturas=false
        this.mostrarContenidoConvenios=false;
        this.mostrarMensaje=false;
        this.mostrarContenidoAsobancaria=false;
        this.mostrarContenidoAdministrarCajas=false;
        this.mostrarContenidoTrasladoFechas=false;
        this.mostrarContenidoListaUsuarios=false;
        this.mostrarContenidoPuntosPagoAdmin=true;
        this.mostrarContenidoListar=false;
        this.mostrarContenidoAdmin=false;
        this.mostrarContenido5 = false;
        this.mostrarContenido4 = false;
        this.mostrarContenido2 = false;
        this.mostrarContenido3 = false;
        this.mostrarContenido = false;
        this.mostrarInicio=false;
        this.parametrizacionBarras=false;
        this.informacionParametrizacion=false;
        this.mostrarAsignacionReportes=false;
        break;
      case '4':
        this.mostrarCargarArchivo=false;
        this.mostrarVistaCierreCaja=false;
        this.mostrarVistaReporteador=false;
        this.mostrarListadoAnulaciones=false;
        this.mostrarContenidoFacturas=false
        this.mostrarContenidoConvenios=false;
        this.mostrarMensaje=false;
        this.mostrarContenidoAsobancaria=false;
        this.mostrarContenidoAdministrarCajas=false;
        this.mostrarContenidoTrasladoFechas=false;
        this.mostrarContenidoListaUsuarios=true;
        this.mostrarContenidoPuntosPagoAdmin=false;
        this.mostrarContenidoListar=false;
        this.mostrarContenidoAdmin=false;
        this.mostrarContenido5 = false;
        this.mostrarContenido4 = false;
        this.mostrarContenido2 = false;
        this.mostrarContenido3 = false;
        this.mostrarContenido = false;
        this.mostrarInicio=false;
        this.parametrizacionBarras=false;
        this.informacionParametrizacion=false;
        this.mostrarAsignacionReportes=false;
        break;
      case '5':
        this.mostrarCargarArchivo=false;
        this.mostrarVistaCierreCaja=false;
        this.mostrarVistaReporteador=false;
        this.mostrarListadoAnulaciones=false;
        this.mostrarContenidoFacturas=false
        this.mostrarContenidoConvenios=false;
        this.mostrarMensaje=false;
        this.mostrarContenidoAsobancaria=false;
        this.mostrarContenidoAdministrarCajas=true;
        this.mostrarContenidoTrasladoFechas=false;
        this.mostrarContenidoListaUsuarios=false;
        this.mostrarContenidoPuntosPagoAdmin=false;
        this.mostrarContenidoListar=false;
        this.mostrarContenidoAdmin=false;
        this.mostrarContenido5 = false;
        this.mostrarContenido4 = false;
        this.mostrarContenido2 = false;
        this.mostrarContenido3 = false;
        this.mostrarContenido = false;
        this.mostrarInicio=false;
        this.parametrizacionBarras=false;
        this.informacionParametrizacion=false;
        this.mostrarAsignacionReportes=false;
        break;
      case '6':
        this.mostrarCargarArchivo=false;
        this.mostrarVistaCierreCaja=false;
        this.mostrarVistaReporteador=false;
        this.mostrarListadoAnulaciones=false;
        this.mostrarContenidoFacturas=false
        this.mostrarContenidoConvenios=false;
        this.mostrarMensaje=false;
        this.mostrarContenidoAsobancaria=false;
        this.mostrarContenidoTrasladoFechas=true;
        this.mostrarContenidoAdministrarCajas=false;
        this.mostrarContenidoListaUsuarios=false;
        this.mostrarContenidoPuntosPagoAdmin=false;
        this.mostrarContenidoListar=false;
        this.mostrarContenidoAdmin=false;
        this.mostrarContenido5 = false;
        this.mostrarContenido4 = false;
        this.mostrarContenido2 = false;
        this.mostrarContenido3 = false;
        this.mostrarContenido = false;
        this.mostrarInicio=false;
        this.parametrizacionBarras=false;
        this.informacionParametrizacion=false;
        this.mostrarAsignacionReportes=false;
        break;
      case '7':
        this.mostrarCargarArchivo=false;
        this.mostrarVistaCierreCaja=false;
        this.mostrarListadoAnulaciones=false;
        this.mostrarVistaReporteador=false;
        this.mostrarContenidoFacturas=false
        this.mostrarContenidoConvenios=false;
        this.mostrarMensaje=!this.mostrarMensaje
        this.mostrarContenidoAsobancaria = false;
        this.mostrarContenidoAdministrarCajas=false;
        this.mostrarContenidoListaUsuarios=false;
        this.mostrarContenidoPuntosPagoAdmin=false;
        this.mostrarContenidoTrasladoFechas=false;
        this.mostrarContenidoListar=false;
        this.mostrarContenidoAdmin=false;
        this.mostrarContenido5 = false;
        this.mostrarContenido4 = false;
        this.mostrarContenido2 = false;
        this.mostrarContenido3 = false;
        this.mostrarContenido = false;
        this.mostrarInicio=false;
        this.parametrizacionBarras=false;
        this.informacionParametrizacion=false;
        this.mostrarAsignacionReportes=false;
        break;
      case '8':
        this.mostrarCargarArchivo=false;
        this.mostrarVistaCierreCaja=false;
        this.mostrarListadoAnulaciones=false;
        this.mostrarVistaReporteador=false;
        this.mostrarContenidoFacturas=false
        this.mostrarContenidoConvenios=!this.mostrarContenidoConvenios;
        this.mostrarMensaje=false;
        this.mostrarContenidoAsobancaria = false;
        this.mostrarContenidoAdministrarCajas=false;
        this.mostrarContenidoTrasladoFechas=false;
        this.mostrarContenidoListaUsuarios=false;
        this.mostrarContenidoPuntosPagoAdmin=false;
        this.mostrarContenidoListar=false;
        this.mostrarContenidoAdmin=false;
        this.mostrarContenido5 = false;
        this.mostrarContenido4 = false;
        this.mostrarContenido2 = false;
        this.mostrarContenido3 = false;
        this.mostrarContenido = false;
        this.mostrarInicio=false;
        this.parametrizacionBarras=false;
        this.informacionParametrizacion=false;
        this.mostrarAsignacionReportes=false;
        break;
      case '9':
        this.mostrarCargarArchivo=false;
        this.mostrarVistaCierreCaja=false;
        this.mostrarListadoAnulaciones=false;
        this.mostrarVistaReporteador=false;
        this.mostrarContenidoFacturas=!this.mostrarContenidoFacturas;
        this.mostrarContenidoConvenios=false;
        this.mostrarMensaje=false;
        this.mostrarContenidoAsobancaria = false;
        this.mostrarContenidoTrasladoFechas=false;
        this.mostrarContenidoAdministrarCajas=false;
        this.mostrarContenidoListaUsuarios=false;
        this.mostrarContenidoPuntosPagoAdmin=false;
        this.mostrarContenidoListar=false;
        this.mostrarContenidoAdmin=false;
        this.mostrarContenido5 = false;
        this.mostrarContenido4 = false;
        this.mostrarContenido2 = false;
        this.mostrarContenido3 = false;
        this.mostrarContenido = false;
        this.mostrarInicio=true;
        this.parametrizacionBarras=false;
        this.informacionParametrizacion=false;
        this.mostrarAsignacionReportes=false;
        break;
      case '10':
        this.mostrarCargarArchivo=false;
        this.mostrarVistaCierreCaja=false;
        this.mostrarListadoAnulaciones=!this.mostrarListadoAnulaciones;
        this.mostrarVistaReporteador=false;
        this.mostrarContenidoFacturas=false;
        this.mostrarContenidoConvenios=false;
        this.mostrarMensaje=false;
        this.mostrarContenidoAsobancaria = false;
        this.mostrarContenidoAdministrarCajas=false;
        this.mostrarContenidoListaUsuarios=false;
        this.mostrarContenidoPuntosPagoAdmin=false;
        this.mostrarContenidoTrasladoFechas=false;
        this.mostrarContenidoListar=false;
        this.mostrarContenidoAdmin=false;
        this.mostrarContenido5 = false;
        this.mostrarContenido4 = false;
        this.mostrarContenido2 = false;
        this.mostrarContenido3 = false;
        this.mostrarContenido = false;
        this.mostrarInicio=true;
        this.parametrizacionBarras=false;
        this.informacionParametrizacion=false;
        this.mostrarAsignacionReportes=false;
        break;
      case '11':
        this.mostrarCargarArchivo=false;
        this.mostrarVistaCierreCaja=!this.mostrarVistaCierreCaja;
        this.mostrarVistaReporteador=false;
        this.mostrarListadoAnulaciones=false;
        this.mostrarContenidoFacturas=false;
        this.mostrarContenidoConvenios=false;
        this.mostrarMensaje=false;
        this.mostrarContenidoAsobancaria = false;
        this.mostrarContenidoAdministrarCajas=false;
        this.mostrarContenidoListaUsuarios=false;
        this.mostrarContenidoPuntosPagoAdmin=false;
        this.mostrarContenidoTrasladoFechas=false;
        this.mostrarContenidoListar=false;
        this.mostrarContenidoAdmin=false;
        this.mostrarContenido5 = false;
        this.mostrarContenido4 = false;
        this.mostrarContenido2 = false;
        this.mostrarContenido3 = false;
        this.mostrarContenido = false;
        this.mostrarInicio=false;
        this.parametrizacionBarras=false;
        this.informacionParametrizacion=false;
        this.mostrarAsignacionReportes=false;
        break;
      case '12':
        this.mostrarCargarArchivo=false;
        this.parametrizacionBarras=!this.parametrizacionBarras;
        this.mostrarAsignacionReportes=false;
        this.informacionParametrizacion=false;
        this.mostrarVistaCierreCaja=false;
        this.mostrarVistaReporteador=false;
        this.mostrarListadoAnulaciones=false;
        this.mostrarContenidoFacturas=false;
        this.mostrarContenidoConvenios=false;
        this.mostrarMensaje=false;
        this.mostrarContenidoAsobancaria = false;
        this.mostrarContenidoAdministrarCajas=false;
        this.mostrarContenidoListaUsuarios=false;
        this.mostrarContenidoPuntosPagoAdmin=false;
        this.mostrarContenidoTrasladoFechas=false;
        this.mostrarContenidoListar=false;
        this.mostrarContenidoAdmin=false;
        this.mostrarContenido5 = false;
        this.mostrarContenido4 = false;
        this.mostrarContenido2 = false;
        this.mostrarContenido3 = false;
        this.mostrarContenido = false;
        this.mostrarInicio=true;
        break;
      case '13':
        this.mostrarCargarArchivo=false;
        this.informacionParametrizacion=!this.informacionParametrizacion;
        this.mostrarAsignacionReportes=false;
        this.parametrizacionBarras=false
        this.mostrarVistaCierreCaja=false;
        this.mostrarVistaReporteador=false;
        this.mostrarListadoAnulaciones=false;
        this.mostrarContenidoFacturas=false;
        this.mostrarContenidoConvenios=false;
        this.mostrarMensaje=false;
        this.mostrarContenidoAsobancaria = false;
        this.mostrarContenidoAdministrarCajas=false;
        this.mostrarContenidoListaUsuarios=false;
        this.mostrarContenidoPuntosPagoAdmin=false;
        this.mostrarContenidoTrasladoFechas=false;
        this.mostrarContenidoListar=false;
        this.mostrarContenidoAdmin=false;
        this.mostrarContenido5 = false;
        this.mostrarContenido4 = false;
        this.mostrarContenido2 = false;
        this.mostrarContenido3 = false;
        this.mostrarContenido = false;
        this.mostrarInicio=false;
        break;
      case '14':
        this.mostrarCargarArchivo=false;
        this.informacionParametrizacion=false;
        this.mostrarAsignacionReportes=!this.mostrarAsignacionReportes;
        this.parametrizacionBarras=false
        this.mostrarVistaCierreCaja=false;
        this.mostrarVistaReporteador=false;
        this.mostrarListadoAnulaciones=false;
        this.mostrarContenidoFacturas=false;
        this.mostrarContenidoConvenios=false;
        this.mostrarMensaje=false;
        this.mostrarContenidoAsobancaria = false;
        this.mostrarContenidoAdministrarCajas=false;
        this.mostrarContenidoListaUsuarios=false;
        this.mostrarContenidoPuntosPagoAdmin=false;
        this.mostrarContenidoTrasladoFechas=false;
        this.mostrarContenidoListar=false;
        this.mostrarContenidoAdmin=false;
        this.mostrarContenido5 = false;
        this.mostrarContenido4 = false;
        this.mostrarContenido2 = false;
        this.mostrarContenido3 = false;
        this.mostrarContenido = false;
        this.mostrarInicio=false;
        break;
        case '15':
        this.ReabrirArqueo();
        break;
      default:

        break;
        
    }
  }

  permisos(){
    
    const rol= localStorage.getItem('rol') || '';
    
    
      if(this.resultado.IDENTIFICADOR_ROL=='R_CAJERO' || this.resultado.IDENTIFICADOR_ROL=='R_CAJERO_EXT'){
        this.admin=false;
      }
      else if(this.resultado.IDENTIFICADOR_ROL=='R_CAJERO_ENC'){
        this.admin=true;
      }
      else if(this.resultado.IDENTIFICADOR_ROL=='R_ADMINISTRADOR'){
        this.admin=true;
        this.adminSuper=true
      }
    
    
      this.consultarArqueo();
 
  }

//#endregion

//#region Parametros adicionales de vistas de modulos

  mostrarLista() {
    this.mostrarListaDeBotones = !this.mostrarListaDeBotones;
  }

  mostrarListaReportes() {
    this.mostrarReportesGen = !this.mostrarReportesGen;
  }

  mostrarListaAdmin() {
    this.mostrarListaDeBotonesAdmin = !this.mostrarListaDeBotonesAdmin;
  }

  consultarArqueo(){
    const token = localStorage.getItem('token') || '';
    const puntoPago= localStorage.getItem('puntoPago')|| '';
    const usuario= localStorage.getItem('usuario')|| '';
      this.recaudoService.postConsultarArqueo(this.empresa, usuario, "1", puntoPago, token).subscribe({
        next: data => {
          
          this.recaudos=data;
          if(this.recaudos.COD!='200'){
            alertify.error(this.recaudos.RESPUESTA);
            localStorage.setItem('numeroArqueo',this.recaudos.NUMERO_ARQUEO);
            this.arqueo="0";
          }
          else{
            localStorage.setItem('numeroArqueo',this.recaudos.NUMERO_ARQUEO);
            localStorage.setItem('numeroMovimiento',this.recaudos.RECAUDOS.NUMERO_MOVIMIENTO);
          }
        },
        error: error => {
          console.error(error);
        }
      });
  }

  infoUsuario(){
    this.informacionUser=!this.informacionUser;
  }

  async cargarArchivo() {
    const modal = await this.modalController.create({
      component: CargarArchivoOfflineComponent,
      cssClass: 'my-custom-class'
    });
    modal.style.cssText = `
      --height:auto;
      max-height: 100%;
      --width:auto;
      --max-width: 90%;
      --border-radius: 10px;
    `;
    return await modal.present();
  }

  async ReabrirArqueo() {
    const modal = await this.modalController.create({
      component: ReabrirArqueoComponent,
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

  preferencial(event:{ detail: { checked: any; }; } ){
    if (event.detail.checked) {
      this.datosTurno.PREFERENCIAL="1";
      this.seleccionar=true;
    
    }else {
      this.datosTurno.PREFERENCIAL="0";
      this.seleccionar=false;
    }
  }
  activarCajaTurno(){
    
    this.turno=false;
    this.recaudoService.postActivarCajero(this.datosTurno).subscribe((data) => {
      
    }, );

  }
  finalizarCajaTurno(){
    this.seleccionar=false;
    this.turno=true;
    this.datosTurno.PREFERENCIAL="0";
    this.recaudoService.postFinalizarCajero(this.datosTurno).subscribe((data) => {
      
    }, );

  }

//#endregion

//#region Cierre de sesion

  cerrarSesion() {
    
    if (this.token !== null && this.usuario!== null && this.empresa!==null) {
      this.recaudoService.postCerrarSesion(this.token,this.usuario,this.empresa).subscribe(
        (data) => {
          localStorage.clear();
          
          

          this.router.navigate(['/login']).then(() => {
         
            location.reload();
            
          });
        },
        (error) => {
          console.error('Error al cerrar sesión:', error);
          localStorage.clear();
          this.router.navigate(['/login']).then(() => {
         
            location.reload();
            
          });
          
        }
      );
    }
  }

//#endregion

}
