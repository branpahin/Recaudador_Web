
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable} from 'rxjs';
import { Injectable, EventEmitter } from '@angular/core';
import { TypeUrlProduccion, TypeUrlPruebas, TypePuerto, TypePuertoPunto} from 'src/models/sites';
import { TypeRuteImg, TypeRuteImgPunto} from 'src/models/rutes';




@Injectable({
  providedIn: 'root'
})
export class RecaudoService {

  contraseña:string | undefined;
  codConvenioDet:string | undefined;

//private myAppUrl = 'http://localhost:36920/';

//#PRUEBAS
  // private myAppUrl = TypeUrlPruebas.PRUEBAS + TypePuerto.PRUEBAS;

//#PRODUCCION
  private myAppUrl = TypeUrlProduccion.PROD_PRIVADO + TypePuerto.PROD_PRIVADO;

//#PRODUCCION HTTPS
  // private myAppUrl = TypeUrlProduccion.PROD_PRIVADO_HTTPS + TypePuerto.PROD_PRIVADO_HTTPS;

//#PRODUCCION PUBLICA
  // private myAppUrl = TypeUrlProduccion.PROD_PUBLICO + TypePuerto.PROD_PUBLICO;

  url=this.myAppUrl;
  ruteImg="";

//#region Servicios Autenticacion
  private myApiUrlEmpresas = 'api/Autenticacion/Empresas';
    private empresasSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    empresas$: Observable<any[]> = this.empresasSubject.asObservable();
    sincronizacionCambio: EventEmitter<boolean> = new EventEmitter<boolean>();

  private myApiUrlPuntosPago = 'api/Autenticacion/Puntos_Pago';
  private myApiUrlAutenticar = 'api/Autenticacion/Autenticar';
  private myApiUrlInformacionUsuario = 'api/Autenticacion/Informacion_Usuario';
  private myApiUrlModificarInformacion = 'api/Autenticacion/Modificar_Informacion_Usuario';
  private myApiUrlCerrarSesion = 'api/Autenticacion/Cerrar_sesion';
//#endregion

//#region Servicios General
  private myApiUrlObtenerRol = 'api/General/Obtener_Rol';
  private myApiUrlObtenerModulos = 'api/General/Obtener_modulos';
  private myApiUrlTipoEntregas = 'api/General/Tipo_Entregas';
  private myApiUrlInformacionPuntoPago = 'api/General/Informacion_Punto_Pago';
  private myApiUrlTiposDocumento = 'api/General/Tipos_Documento';
  private myApiUrlCajasPuntoPago = 'api/General/Cajas_Punto_Pago';
  private myApiUrlFormaPago = 'api/General/Forma_Pago';
  private myApiUrlConveniosReferenciaWS = 'api/General/Convenios_referencia'; 
  private myApiUrlConveniosManualWS = 'api/General/Convenios_manual';
  private myApiUrlListadoTipoVencimientoFactura= 'api/General/Listado_Tipo_Vencimineto_Factura';
  private myApiUrlListadoTipoAsobancariaFactura= 'api/General/Listado_Tipo_Asobancaria_Factura';
  private myApiUrlListadoTipoCuentaAsobancaria= 'api/General/Listado_Tipo_Cuenta_Asobancaria';
  private myApiUrlListadoBancosAsobancaria= 'api/General/Listado_Bancos_Asobancaria';
  private myApiUrlListadoConveniosSincronizador= 'api/General/Listado_Convenios_Sincronizador';
  private myApiUrlListadoSubPuntos= 'api/General/Listado_Sub_Puntos_Pago';
  private myApiUrlEstadoTurnero= 'api/General/Estado_Turnero';
  private myApiUrlListadoCamposBarra= 'api/General/Listado_Campos_Barra';
  private myApiUrlListadoConsultaParametros= 'api/General/Listado_Consulta_Parametros';
  private myApiUrlListadoConsultaTablas= 'api/General/Listado_Consulta_Tablas';
  private myApiUrlListadoPagosAsobancaria= 'api/General/Listado_Pagos_Asobancaria'; 
  private myApiUrlListadoTipoPunteo= 'api/General/Listado_Tipo_Punteo'; 
  private myApiUrlListarFacturasAnular= 'api/Administrador/Consultar_Facturas_Movimiento';
//#endregion

//#region Servicios Arqueo
  private myApiUrl = 'api/Arqueo/';
  private myApiUrlCrearArqueo='api/Arqueo/Crear_Arqueo';
  private myApiUrlConsultarArqueo='api/Arqueo/Consultar_Arqueo';
  private myApiUrlEstadoArqueo='api/Arqueo/Estado_Arqueo';
  private myApiUrlEntregaArqueo='api/Arqueo/Entregas_Arqueo';
  private myApiUrlCierreArqueo='api/Arqueo/Cerrar_Arqueo';
  private myApiUrlValorCierre='api/Arqueo/Valor_Cierre_Arqueo';
  private myApiUrlValorEntregaFinal='api/Arqueo/Valores_Entrega_Final';
//#endregion

//#region Servicios Recaudo
  private myApiUrlConsultaRecaudo = 'api/Recaudo/Consulta_Recaudo';
  private myApiUrlRecaudar = 'api/Recaudo/Recaudar';
  private myApiUrlImpresionTicket = 'api/Recaudo/Impresion_Ticket';
  private myApiUrlActivarCajero = 'api/Recaudo/Activar_Cajero_Disponible';
  private myApiUrlFinalizarCajero = 'api/Recaudo/Finalizar_Cajero_Disponible';
  private myApiUrlTransaccionDatafono = 'api/Recaudo/Transaccion_Datafono';
  private myApiUrlAnularTransaccionDatafono = 'api/Recaudo/Anular_Transaccion_Datafono';
//#endregion

//#region Servicios Reportes Cajero
  private myApiUrlListarMovimientosPunteo = 'api/Punteo/Listar_movimientos_punteo';
  private myApiUrlReestablecerMovimientosPunteo = 'api/Punteo/Restablecer_punteo';
  private myApiUrlModificarMovimientosPunteo = 'api/Punteo/Validar_Punteo';
//#endregion

//#region Servicios Reportes Admin
  private myApiUrlListarAsobancaria = 'api/Administrador/Listado_Asobancaria_Excel_Convenios';
  private myApiUrlGenerarAsobancaria = 'api/Administrador/Generar_Asobancarias_Excel';
//#endregion

//#region Servicios Administrar
  private myApiUrlListarCajas = 'api/CajeroEncargado/Listar_Cajas_Punto_Pago';
  private myApiUrlListarUsuariosSinAsignar = 'api/CajeroEncargado/Cajeros_Sin_Asignar';
  private myApiUrlListarPuntosPago = 'api/CajeroEncargado/Listado_Puntos_Pago_Encargado';
  private myApiUrlListarPuntosPagoAdmin = 'api/Administrador/Listado_Puntos_Pago';
  private myApiUrlListarEstadosPuntoPago = 'api/General/Listado_Estados_Punto_Pago';
  private myApiUrlListarTipoPuntoPago = 'api/General/Listado_Tipo_Punto_Pago';
  private myApiUrlListarUsuarios = 'api/Administrador/Listado_Usuarios';
  private myApiUrlListarRoles = 'api/General/Listado_Roles';
  private myApiUrlListarEstadosUsuarios = 'api/General/Listado_Estados_Usuario';
  private myApiUrlListarAdministrarCajas = 'api/Administrador/Listado_Cajas_Punto_Pago';
  private myApiUrlUsuariosEncargado = 'api/General/Listado_Usuarios_Encargados';
  private myApiUrlModificarCajas = 'api/CajeroEncargado/Modificar_Asignacion_Cajas';
  private myApiUrlReestablecerCajas = 'api/CajeroEncargado/Reestablecer_Asignacion_Cajas';
  private myApiUrlConsultarArqueosPuntos = 'api/CajeroEncargado/Consulta_Arqueos_Punto_Pago';
  private myApiUrlEliminarAsignacionCaja = 'api/CajeroEncargado/Eliminar_Asignacion_Caja';
  private myApiUrlConsultarMovimientoArqueo = 'api/CajeroEncargado/Consultar_Movimientos_Arqueo';
  private myApiUrlConsultarCuadresPuntoPago = 'api/CajeroEncargado/Listado_Cuadres_Punto_Pago';
  private myApiUrlConsultarEntregasPuntoPago = 'api/CajeroEncargado/Listado_Entregas_Punto_Pago';
  private myApiUrlConsultarEntregasPuntoDet = 'api/CajeroEncargado/Consultar_Entregas_Detalle';
  private myApiUrlAccionCuadrePuntoPago = 'api/CajeroEncargado/Accion_Cuadre_Punto_Pago';
  private myApiUrlAccionEntregaPuntoPago = 'api/CajeroEncargado/Accion_Entrega_Punto_Pago';
  private myApiUrlCrearPuntosPago = 'api/Administrador/Crear_Punto_Pago';
  private myApiUrlModificarPuntoPago= 'api/Administrador/Modificar_Punto_Pago';
  private myApiUrlCrearUsuario = 'api/Administrador/Crear_Usuario';
  private myApiUrlModificarUsuario= 'api/Administrador/Modificar_Usuario';
  private myApiUrlCrearCaja = 'api/Administrador/Crear_Caja_Punto_Pago';
  private myApiUrlModificarCaja= 'api/Administrador/Modificar_Caja_Punto_Pago';
  private myApiUrlTrasladoFecha= 'api/Administrador/Traslado_Fecha_Recaudos_Recatenderos';
  private myApiUrlCrearMensaje= 'api/Administrador/Crear_Mensaje_Punto_Pago';
  private myApiUrlListarMensajes= 'api/Administrador/Listado_Mensaje_Activos_Punto_Pago';
  private myApiUrlModificarMensajes= 'api/Administrador/Modificar_Mensaje_Punto_Pago';
  private myApiUrlListarConvenios= 'api/Administrador/Listado_Convenios';
  private myApiUrlCrearConvenio= 'api/Administrador/Crear_Convenio';
  private myApiUrlModificarConvenio= 'api/Administrador/Modificar_Convenio';
  private myApiUrlListadoFacturasConvenio= 'api/Administrador/Listado_Facturas';
  private myApiUrlCrearFacturaConvenio= 'api/Administrador/Crear_Factura_Convenio';
  private myApiUrlModificarFacturaConvenio= 'api/Administrador/Modificar_Factura_Convenio';
  private myApiUrlListarAnulacionesPagos= 'api/Administrador/Listado_Anulaciones_Punto_Pago';
  private myApiUrlCrearAnulacionPagos= 'api/Administrador/Crear_Anulacion_Punto_Pago';
  private myApiUrlEliminarAnulacionPagos= 'api/Administrador/Eliminar_Anulacion_Punto_Pago';
  private myApiUrlEstadoSincronizador= 'api/Sincronizador/Consultar_Estado_Sincronizador';
  private myApiUrlModificarEstadoSincronizador= 'api/Sincronizador/Modificar_Estado_Sincronizador';
  private myApiUrlPagosAgrupados= 'api/Sincronizador/Pagos_Agrupados_Sincronizador';
  private myApiUrlCierreCaja= 'api/Administrador/Cerrar_Caja_Convenio';
  private myApiUrlListadoCajasConvenioCierre= 'api/General/Listado_Cajas_Convenio_Cierre_Cajas';
  private myApiUrlListadoConvenioCierre= 'api/General/Listado_Convenios_Cierre';
  private myApiUrlListadoSubPuntosPago= 'api/Administrador/Listado_Sub_Puntos_Pago';
  private myApiUrlCrearSubPuntoPago= 'api/Administrador/Crear_Sub_Puntos_Pago';
  private myApiUrlEliminarSubPuntoPago= 'api/Administrador/Eliminar_Sub_Puntos_Pago';
  private myApiUrlConsultarCajasActivasSac= 'api/Administrador/Consultar_Cajas_Activas_SAC';
  private myApiUrlCargarArchivo= 'api/Administrador/Offline';
  private myApiUrlListarReabrirArqueo='api/Administrador/Listado_Reabrir_Arqueos';
  private myApiUrlReabrirArqueo='api/Administrador/Modificar_Reabrir_Arqueo';
  private myApiUrlImpresionCuadre='api/Administrador/Impresion_Cuadre_Arqueo';
//#endregion  
  
//#region Servicios Reporteador
  private myApiUrlListadoReportesReporteador= 'api/Reporteador/Listado_Reportes_Reporteador';
  private myApiUrlListadoParametrosReporte= 'api/Reporteador/Listado_Parametros_Reporte';
  private myApiUrlGenerarReporteExcel= 'api/Reporteador/Generar_Reporte_Excel';
  private myApiUrlModificarEstadoReporte= 'api/Reporteador/Modificar_Estado_Reporte';
  private myApiUrlListadoFacturas= 'api/Reporteador/Listado_Facturas';
//#endregion

//#region Servicios Desarrolador
  private myApiUrlListadoFacturasBarras= 'api/Desarrollador/Listado_Facturas_Barras';
  private myApiUrlCrearFacturaBarra= 'api/Desarrollador/Crear_Factura_Barra';
  private myApiUrlModificarFacturaBarra= 'api/Desarrollador/Modificar_Factura_Barra';
  private myApiUrlConsultarInformacionParametros= 'api/Desarrollador/Consultar_Informacion_Parametros';
  private myApiUrlConsultarInformacionTablas= 'api/Desarrollador/Consultar_Informacion_Tablas';
  private myApiUrlListadoReportesAsignados= 'api/Desarrollador/Listado_Reportes_Asignados';
  private myApiUrlCrearAsignacionReporte= 'api/Desarrollador/Crear_Asignaciones_Reporte';
  private myApiUrlEliminarAsignacionReporte= 'api/Desarrollador/Eliminar_Asignacion_Reporte';
  private myApiUrlEliminarFacturaBarra= 'api/Desarrollador/Eliminar_Factura_Barra';
//#endregion 
  

  constructor(private http: HttpClient) {
    switch (this.url) {
      case TypeUrlPruebas.PRUEBAS + TypePuerto.PRUEBAS:
        this.ruteImg = TypeRuteImg.PRUEBAS;
        break;
    
      case TypeUrlProduccion.PROD_PRIVADO + TypePuerto.PROD_PRIVADO:
      case TypeUrlProduccion.PROD_PRIVADO_HTTPS + TypePuerto.PROD_PRIVADO_HTTPS:
        this.ruteImg = TypeRuteImg.PROD_PRIVADO;
        break;
    
      case TypeUrlProduccion.PROD_PUBLICO + TypePuerto.PROD_PUBLICO:
        this.ruteImg = TypeRuteImg.PROD_PUBLICO;
        break;

      case TypeUrlProduccion.PROD_PRIVADO + TypePuertoPunto.PROD_PRIVADO_CIRCUNVALAR:
      case TypeUrlProduccion.PROD_PRIVADO_HTTPS + TypePuertoPunto.PROD_PRIVADO_CIRCUNVALAR_HTTPS: 
        this.ruteImg = TypeRuteImgPunto.PROD_PRIVADO_CIRCUNVALAR;
        break;

      case TypeUrlProduccion.PROD_PRIVADO + TypePuertoPunto.PROD_PRIVADO_CUBA:
      case TypeUrlProduccion.PROD_PRIVADO_HTTPS + TypePuertoPunto.PROD_PRIVADO_CUBA_HTTPS: 
        this.ruteImg = TypeRuteImgPunto.PROD_PRIVADO_CUBA;
        break;

      case TypeUrlProduccion.PROD_PRIVADO + TypePuertoPunto.PROD_PRIVADO_CARTAGO_MOVIL:
      case TypeUrlProduccion.PROD_PRIVADO_HTTPS + TypePuertoPunto.PROD_PRIVADO_CARTAGO_MOVIL_HTTPS: 
        this.ruteImg = TypeRuteImgPunto.PROD_PRIVADO_CARTAGO_MOVIL;
        break;

      case TypeUrlProduccion.PROD_PRIVADO + TypePuertoPunto.PROD_PRIVADO_TORRES:
      case TypeUrlProduccion.PROD_PRIVADO_HTTPS + TypePuertoPunto.PROD_PRIVADO_TORRES_HTTPS: 
        this.ruteImg = TypeRuteImgPunto.PROD_PRIVADO_TORRES;
        break;

      case TypeUrlProduccion.PROD_PRIVADO + TypePuertoPunto.PROD_PRIVADO_EXTERNOS:
      case TypeUrlProduccion.PROD_PRIVADO_HTTPS + TypePuertoPunto.PROD_PRIVADO_EXTERNOS_HTTPS: 
        this.ruteImg = TypeRuteImgPunto.PROD_PRIVADO_EXTERNOS;
        break;
    
      default:
        console.error('URL no reconocida:', this.url);
        break;
    }
   }

 
//#region Autenticacion
  getListEmpresas(): Observable<any>{
    return this.http.get(this.myAppUrl + this.myApiUrlEmpresas);    
  }
  setListEmpresas(empresas: any[]) {
    this.empresasSubject.next(empresas);
  }


  getListPuntosPago(empresa: number): Observable<any>{
    return this.http.get(this.myAppUrl + this.myApiUrlPuntosPago+'?empresa='+empresa);
  }

  postAutenticarUsuario(USUARIO: string, PASSWORD: string, EMPRESA: string, CODIGO_PUNTO_PAGO:string): Observable<any>{
    return this.http.post(this.myAppUrl + this.myApiUrlAutenticar, {USUARIO, PASSWORD, EMPRESA,CODIGO_PUNTO_PAGO});
  }

  getInformacionUsuario(empresa:string, usuario:string, token: string): Observable<any> {
    return this.http.get(this.myAppUrl + this.myApiUrlInformacionUsuario+'?empresa='+empresa+'&usuario='+usuario+'&tokeN='+token);
  }
  
  postModificarInformacion(datos:any){
    return this.http.post(this.myAppUrl + this.myApiUrlModificarInformacion, datos);
  }

  postCerrarSesion(token: string, usuario:string, empresa:string): Observable<any> {
    const body = { TOKEN: token, USUARIO:usuario, EMPRESA:empresa};
    return this.http.post(this.myAppUrl + this.myApiUrlCerrarSesion, body);
  }

  setContraseña(contraseña:string){
    this.contraseña=contraseña
  }
  getContraseña(){
    return this.contraseña
  }
//#endregion

//#region General
  private enviarAlumbrado = new BehaviorSubject<boolean>(false);
  private enviarManual = new BehaviorSubject<boolean>(false);
  private CodConvenioDet = new BehaviorSubject<boolean>(false);
  public enviarAlumbrado$ = this.enviarAlumbrado.asObservable();
  public enviarManual$ = this.enviarManual.asObservable();
  public CodConvenioDet$ = this.CodConvenioDet.asObservable();

  getObtenerRol(USUARIO: string, EMPRESA: string, TOKEN: string): Observable<any> {
    return this.http.get(this.myAppUrl + this.myApiUrlObtenerRol+"?EMPRESA="+EMPRESA+"&USUARIO="+USUARIO+"&TOKEN="+ TOKEN);
  }

  getObtenerModulo(EMPRESA: string, USUARIO: string, ROL: string, TOKEN: string): Observable<any> {
    return this.http.get(this.myAppUrl + this.myApiUrlObtenerModulos+"?EMPRESA=" +EMPRESA+ "&USUARIO="+USUARIO+"&ROL="+ROL+"&TOKEN="+ TOKEN);
  }

  getTipoEntregas(empresa: number, accion: number, usuario: string, token:string): Observable<any> {
    return this.http.get(this.myAppUrl + this.myApiUrlTipoEntregas+'?empresa='+empresa+'&accion='+accion+'&usuario='+usuario+'&token='+token);
  }

  getInformacionPuntoPago(empresa: number, codigo_punto_pago: number, usuario: string, token:string): Observable<any> {
    return this.http.get(this.myAppUrl + this.myApiUrlInformacionPuntoPago+'?EMPRESA='+empresa+'&CODIGO_PUNTO_PAGO='+codigo_punto_pago+'&usuario='+usuario+'&token='+token);
  }

  getTiposDocumento(empresa: number, usuario: string, token:string): Observable<any> {
    return this.http.get(this.myAppUrl + this.myApiUrlTiposDocumento+'?EMPRESA='+empresa+'&usuario='+usuario+'&token='+token);
  }

  getCajasPuntoPago(empresa: number, codigo_punto_pago: number, usuario:string, token:string): Observable<any> {
    return this.http.get(this.myAppUrl + this.myApiUrlCajasPuntoPago+'?EMPRESA='+empresa+'&CODIGO_PUNTO_PAGO='+codigo_punto_pago+'&usuario='+usuario+'&token='+token);
  }

  getFormaPago(empresa: number, codigoPuntoPago:number, accion: string, usuario: string, token:string): Observable<any> {
    return this.http.get(this.myAppUrl + this.myApiUrlFormaPago+'?empresa='+empresa+'&codigo_punto_pago='+codigoPuntoPago+'&accion='+accion+'&usuario='+usuario+'&token='+token);
  }

  getConveniosReferenciaWS(empresa: number,  usuario: string, token:string): Observable<any> {
    return this.http.get(this.myAppUrl + this.myApiUrlConveniosReferenciaWS+'?empresa='+empresa+'&usuario='+usuario+'&token='+token);
  }
  
  getConveniosManualWS(empresa: number, usuario: string, token:string): Observable<any> {
    return this.http.get(this.myAppUrl + this.myApiUrlConveniosManualWS+'?empresa='+empresa+'&usuario='+usuario+'&token='+token);
  }

  getTipoVencimientoFactura(empresa: number, usuario: string, token:string): Observable<any> {
    return this.http.get(this.myAppUrl + this.myApiUrlListadoTipoVencimientoFactura+'?empresa='+empresa+'&usuario='+usuario+'&token='+token);
  }

  getTipoAsobancariaFactura(empresa: number, usuario: string, token:string): Observable<any> {
    return this.http.get(this.myAppUrl + this.myApiUrlListadoTipoAsobancariaFactura+'?empresa='+empresa+'&usuario='+usuario+'&token='+token);
  }

  getTipoCuentaAsobancaria(empresa: number, usuario: string, token:string): Observable<any> {
    return this.http.get(this.myAppUrl + this.myApiUrlListadoTipoCuentaAsobancaria+'?empresa='+empresa+'&usuario='+usuario+'&token='+token);
  }

  getBancosAsobancaria(empresa: number, usuario: string, token:string): Observable<any> {
    return this.http.get(this.myAppUrl + this.myApiUrlListadoBancosAsobancaria+'?empresa='+empresa+'&usuario='+usuario+'&token='+token);
  }
  getListadoSubPuntos(empresa: number, usuario: string, token:string): Observable<any> {
    return this.http.get(this.myAppUrl + this.myApiUrlListadoSubPuntos+'?empresa='+empresa+'&usuario='+usuario+'&token='+token);
  }

  getEstadoTurnero(empresa: number, usuario: string, codigo_caja: number, token:string): Observable<any> {
    return this.http.get(this.myAppUrl + this.myApiUrlEstadoTurnero+'?empresa='+empresa+'&usuario='+usuario+'&CODIGO_CAJA='+codigo_caja+'&token='+token);
  }

  getListadoCamposBarra(empresa: number, usuario: string, token:string): Observable<any> {
    return this.http.get(this.myAppUrl + this.myApiUrlListadoCamposBarra+'?empresa='+empresa+'&usuario='+usuario+'&token='+token);
  }

  getListadoConsultarParametros(empresa: number, usuario: string, token:string): Observable<any> {
    return this.http.get(this.myAppUrl + this.myApiUrlListadoConsultaParametros+'?empresa='+empresa+'&usuario='+usuario+'&token='+token);
  }

  getListadoConsultarTablas(empresa: number, usuario: string, token:string): Observable<any> {
    return this.http.get(this.myAppUrl + this.myApiUrlListadoConsultaTablas+'?empresa='+empresa+'&usuario='+usuario+'&token='+token);
  }

  getListadoPagosAsobancaria(empresa: number, usuario: string, token:string): Observable<any> {
    return this.http.get(this.myAppUrl + this.myApiUrlListadoPagosAsobancaria+'?empresa='+empresa+'&usuario='+usuario+'&token='+token);
  }

  getListadoTipoPunteo(empresa: number, usuario: string, token:string): Observable<any> {
    return this.http.get(this.myAppUrl + this.myApiUrlListadoTipoPunteo+'?empresa='+empresa+'&usuario='+usuario+'&token='+token);
  }

  enviarEstadoAlumbrado(barras: boolean, manual:boolean) {
    this.enviarAlumbrado.next(barras);
    this.enviarManual.next(manual);
  }
  
  enviarConConvenioDet(codConvenioDet: boolean) {
    this.CodConvenioDet.next(codConvenioDet);
  }

  getLisadoConveniosSincronizador(empresa: number, usuario: string, token:string): Observable<any> {
    return this.http.get(this.myAppUrl + this.myApiUrlListadoConveniosSincronizador+'?empresa='+empresa+'&usuario='+usuario+'&token='+token);
  }

  postListarFac(datos:any):  Observable<any> {
    const body = { EMPRESA: datos.EMPRESA,
                  CODIGO_PUNTO_PAGO: datos.CODIGO_PUNTO_PAGO, 
                  NUMERO_ARQUEO:datos.NUMERO_ARQUEO,
                  NUMERO_MOVIMIENTO:datos.NUMERO_MOVIMIENTO,
                  USUARIO: datos.USUARIO,
                  TOKEN: datos.TOKEN 
                 };

    return this.http.post(this.myAppUrl+this.myApiUrlListarFacturasAnular, body);
  }
//#endregion

//#region Arqueo
  getListarEmpresas(): Observable<any>{
    return this.http.get(this.myAppUrl + this.myApiUrl);
  }

  postCrearArqueo(empresa:string, codigo_caja:string, codigo_punto_pago:string, usuario:string, token:string):  Observable<any> {
    const body = { EMPRESA: empresa,
                  CODIGO_CAJA: codigo_caja, 
                  CODIGO_PUNTO_PAGO: codigo_punto_pago, 
                  USUARIO: usuario,
                  TOKEN: token 
                 };

    return this.http.post(this.myAppUrl+this.myApiUrlCrearArqueo, body);
  }
  postConsultarArqueo(empresa:string, usuario:string, accion:string, condigo_punto_pago:string, token:string):  Observable<any> {
    const body = { EMPRESA: empresa,
                  USUARIO: usuario, 
                  ACCION: accion,
                  CODIGO_PUNTO_PAGO: condigo_punto_pago,
                  TOKEN: token};

    return this.http.post(this.myAppUrl+this.myApiUrlConsultarArqueo, body);
  }

  postConsultarArqueoParam(empresa:string, usuario:string, accion:string='2', numero_arqueo:string, numero_movimiento:string, valor_movimiento:string, fecha_movimiento:string,cliente:string , referencia:string, token:string):  Observable<any> {
    const body = { EMPRESA: empresa,
                  USUARIO: usuario, 
                  ACCION: accion,
                  NUMERO_ARQUEO:numero_arqueo,
                  NUMERO_MOVIMIENTO:numero_movimiento,
                  VALOR_MOVIMIENTO_DET:valor_movimiento,
                  FECHA_MOVIMIENTO:fecha_movimiento,
                  CODIGO_CLIENTE: cliente,
                  CODIGO_REFERENCIA: referencia,
                  TOKEN:token
                };

    return this.http.post(this.myAppUrl+this.myApiUrlConsultarArqueo, body);
  }
  postEstadoArqueo(empresa:string, numero_arqueo:string, configo_punto_pago:string, usuario:string, token:string): Observable<any>{
    const body = { EMPRESA:empresa,    
                  NUMERO_ARQUEO: numero_arqueo,
                  CODIGO_PUNTO_PAGO:configo_punto_pago,
                  USUARIO: usuario,
                  TOKEN: token
    };
    return this.http.post(this.myAppUrl+this.myApiUrlEstadoArqueo,body);
  }

  postEntregaArqueo(datos: any): Observable<any> {
    return this.http.post(this.myAppUrl + this.myApiUrlEntregaArqueo, datos);
  }

  postCierreArqueo(datos: any): Observable<any> {
    return this.http.post(this.myAppUrl + this.myApiUrlCierreArqueo, datos);
  }

  postValorCierre(datos: any): Observable<any> {
    return this.http.post(this.myAppUrl + this.myApiUrlValorCierre, datos);
  }

  postValorEntregaFinal(datos: any): Observable<any> {
    return this.http.post(this.myAppUrl + this.myApiUrlValorEntregaFinal, datos);
  }
//#endregion

//#region Recaudar
  postConsultarRecaudo(datos: any): Observable<any>{

    return this.http.post(this.myAppUrl+this.myApiUrlConsultaRecaudo,datos);
  }

  postRecaudar(datos: any): Observable<any>{
    return this.http.post(this.myAppUrl+this.myApiUrlRecaudar,datos);
  };

  postTrasaccionDatafono(datos: any): Observable<any>{
    return this.http.post(this.myAppUrl+this.myApiUrlTransaccionDatafono,datos);
  };

  postAnularTransaccionDatafono(datos: any): Observable<any>{
    return this.http.post(this.myAppUrl+this.myApiUrlAnularTransaccionDatafono,datos);
  };

  getImpresiónTicket(empresa: string, condigo_punto_pago: string, numero_arqueo: string, numero_movimiento: string, usuario: string, lstfactura: string, agrupado: string, token: string): Observable<HttpResponse<Blob>> {
    const url = `${this.myAppUrl}${this.myApiUrlImpresionTicket}`;

    // Configuración para recibir una respuesta de tipo blob (archivo)
    const options = {
      responseType: 'blob' as 'json',
      observe: 'response' as 'body'
    };

    return this.http.get<HttpResponse<Blob>>(url, {
      params: {
        empresa,
        CODIGO_PUNTO_PAGO: condigo_punto_pago,
        NUMERO_ARQUEO: numero_arqueo,
        NUMERO_MOVIMIENTO: numero_movimiento,
        usuario,
        LSTFACTURAS: lstfactura,
        AGRUPADO: agrupado,
        token
      },
      ...options
    });
  }

  setCodigoConvenioDet(codigo:string){
    
    this.codConvenioDet=codigo
  }

  getCodigoConvenioDet(){
    return this.codConvenioDet
  }

  postActivarCajero(datos: any): Observable<any>{
    return this.http.post(this.myAppUrl+this.myApiUrlActivarCajero,datos);
  };

  postFinalizarCajero(datos: any): Observable<any>{
    return this.http.post(this.myAppUrl+this.myApiUrlFinalizarCajero,datos);
  };

//#endregion
  
//#region Reportes Cajero
  getListarMovimientosPunteo(empresa: number, usuario: string, token: string, numero_arqueo: string){
    return this.http.get(this.myAppUrl + this.myApiUrlListarMovimientosPunteo+'?empresa='+empresa+'&usuario='+usuario+'&token='+token+'&numero_arqueo='+numero_arqueo);
  }
  getReestablecerMovimientosPunteo(empresa: number, usuario: string, token: string, numero_arqueo: string){
    return this.http.get(this.myAppUrl + this.myApiUrlReestablecerMovimientosPunteo+'?empresa='+empresa+'&usuario='+usuario+'&token='+token+'&numero_arqueo='+numero_arqueo);
  }

  postModificarMovimiento(datos: any): Observable<any>{
    return this.http.post(this.myAppUrl+this.myApiUrlModificarMovimientosPunteo,datos);
  };
//#endregion

//#region Reportes Admin
  getListarAsobancaria(empresa: number, codigo_punto_pago:string, usuario: string, token: string){
    return this.http.get(this.myAppUrl + this.myApiUrlListarAsobancaria+'?empresa='+empresa+'&CODIGO_PUNTO_PAGO='+codigo_punto_pago+'&USUARIO='+usuario+'&token='+token);
  }

  postGenerarAsobancaria(datos:any): Observable<any> {
    return this.http.post(this.myAppUrl + this.myApiUrlGenerarAsobancaria, datos);
  }
//#endregion
  
//#region Administrar

  getListarCajas(empresa: number, usuario: string, token: string){
    return this.http.get(this.myAppUrl + this.myApiUrlListarCajas+'?empresa='+empresa+'&usuario='+usuario+'&token='+token);
  }

  getListarUsuarios(empresa: number, codigo_punto_pago:string, usuario: string, token: string){
    return this.http.get(this.myAppUrl + this.myApiUrlListarUsuariosSinAsignar+'?empresa='+empresa+"&codigo_punto_pago="+codigo_punto_pago+'&usuario='+usuario+'&token='+token);
  }
  getListarPuntosPago(empresa: number, usuario: string, token: string){
    return this.http.get(this.myAppUrl + this.myApiUrlListarPuntosPago+'?empresa='+empresa+'&usuario='+usuario+'&token='+token);
  }

  getListarPuntosPagoAdmin(empresa: number, usuario: string, token: string){
    return this.http.get(this.myAppUrl + this.myApiUrlListarPuntosPagoAdmin+'?empresa='+empresa+'&usuario='+usuario+'&token='+token);
  }

  getListarEstadosPuntoPago(empresa: number, usuario: string, token: string){
    return this.http.get(this.myAppUrl + this.myApiUrlListarEstadosPuntoPago+'?empresa='+empresa+'&usuario='+usuario+'&token='+token);
  }

  getListarTipoPuntoPago(empresa: number, usuario: string, token: string){
    return this.http.get(this.myAppUrl + this.myApiUrlListarTipoPuntoPago+'?empresa='+empresa+'&usuario='+usuario+'&token='+token);
  }

  getListarUsuariosEncargado(empresa: number, usuario: string, token: string){
    return this.http.get(this.myAppUrl + this.myApiUrlUsuariosEncargado +'?empresa='+empresa+'&usuario='+usuario+'&token='+token);
  }

  getListadoUsuarios(empresa: number, usuario: string, token: string){
    return this.http.get(this.myAppUrl + this.myApiUrlListarUsuarios +'?empresa='+empresa+'&usuario='+usuario+'&token='+token);
  }

  getListadoRoles(empresa: number, usuario: string, token: string){
    return this.http.get(this.myAppUrl + this.myApiUrlListarRoles +'?empresa='+empresa+'&usuario='+usuario+'&token='+token);
  }

  getListadoEstadoUsuarios(empresa: number, usuario: string, token: string){
    return this.http.get(this.myAppUrl + this.myApiUrlListarEstadosUsuarios+'?empresa='+empresa+'&usuario='+usuario+'&token='+token);
  }

  postModificarCajas(datos: any): Observable<any> {
    return this.http.post(this.myAppUrl + this.myApiUrlModificarCajas, datos);
  }

  postReestablecerCajas(empresa:string,usuario:string,empresa_Asignada:string,token:string): Observable<any> {
    const body = { EMPRESA:empresa,    
      USUARIO: usuario,
      CODIGO_PUNTO_PAGO:empresa_Asignada,
      TOKEN: token
    };
    return this.http.post(this.myAppUrl + this.myApiUrlReestablecerCajas, body);
  }

  postEliminarAsignacionCajas(empresa:string,usuario:string,usuario_asignado:string, empresa_Asignada:string,codigo_caja:string, token:string): Observable<any> {
    const body = { EMPRESA:empresa,    
      USUARIO: usuario,
      USUARIO_ASIGNADO: usuario_asignado,
      CODIGO_PUNTO_PAGO:empresa_Asignada,
      CODIGO_CAJA:codigo_caja,
      TOKEN: token
    };
    return this.http.post(this.myAppUrl + this.myApiUrlEliminarAsignacionCaja, body);
  }

  getConsultarArqueoPuntos(empresa: number, condigo_punto_pago:number,usuario: string,token: string, fechaInicio:string, fechaFin:string){
    return this.http.get(this.myAppUrl + this.myApiUrlConsultarArqueosPuntos+'?empresa='+empresa+'&CODIGO_PUNTO_PAGO='+condigo_punto_pago+'&usuario='+usuario+'&token='+token+'&FECHA_INICIO='+fechaInicio+'&FECHA_FIN='+fechaFin);
  }

  getConsultarMovimientoArqueo(empresa: number, condigo_punto_pago:number,numero_arqueo:string,usuario: string,token: string){
    return this.http.get(this.myAppUrl + this.myApiUrlConsultarMovimientoArqueo+'?empresa='+empresa+'&CODIGO_PUNTO_PAGO='+condigo_punto_pago+'&NUMERO_ARQUEO='+numero_arqueo+'&usuario='+usuario+'&token='+token);
  }

  getConsultarCuadresPunto(empresa: number, accion:string, condigo_punto_pago:number, usuario: string, token: string){
    return this.http.get(this.myAppUrl + this.myApiUrlConsultarCuadresPuntoPago+'?empresa='+empresa+'&ACCION='+accion+'&CODIGO_PUNTO_PAGO='+condigo_punto_pago+'&usuario='+usuario+'&token='+token);
  }

  getConsultarEntregasPunto(empresa: number, accion:string, condigo_punto_pago:number, usuario: string, token: string){
    return this.http.get(this.myAppUrl + this.myApiUrlConsultarEntregasPuntoPago+'?empresa='+empresa+'&ACCION='+accion+'&CODIGO_PUNTO_PAGO='+condigo_punto_pago+'&usuario='+usuario+'&token='+token);
  }

  getConsultarEntregasPuntoDet(empresa: number, condigo_punto_pago:number, numero_arqueo:string, numero_entrega:string, usuario: string, token: string){
    return this.http.get(this.myAppUrl + this.myApiUrlConsultarEntregasPuntoDet+'?empresa='+empresa+'&CODIGO_PUNTO_PAGO='+condigo_punto_pago+'&NUMERO_ARQUEO='+numero_arqueo+'&NUMERO_ENTREGA='+numero_entrega+'&usuario='+usuario+'&token='+token);
  }


  postAccionCuadrePunto(empresa:string,codigo_punto_pago:string,numero_arqueo:string, accion:string, observacion:string, usuario:string, token:string): Observable<any> {
    const body = { EMPRESA:empresa, 
      CODIGO_PUNTO_PAGO:codigo_punto_pago,
      NUMERO_ARQUEO:numero_arqueo,
      ACCION:accion,
      OBSERVACION:observacion,
      USUARIO: usuario,
      TOKEN: token
    };
    return this.http.post(this.myAppUrl + this.myApiUrlAccionCuadrePuntoPago, body);
  }

  postAccionEntregaPunto(empresa:string,codigo_punto_pago:string,numero_arqueo:string, entrega: string, accion:string, observacion:string, usuario:string, token:string): Observable<any> {
    const body = { EMPRESA:empresa, 
      CODIGO_PUNTO_PAGO:codigo_punto_pago,
      NUMERO_ARQUEO:numero_arqueo,
      NUMERO_ENTREGA:entrega,
      ACCION:accion,
      OBSERVACION:observacion,
      USUARIO: usuario,
      TOKEN: token
    };
    return this.http.post(this.myAppUrl + this.myApiUrlAccionEntregaPuntoPago, body);
  }

  getConsultarCajasPunto(empresa: number, condigo_punto_pago:number, usuario: string, token: string){
    return this.http.get(this.myAppUrl + this.myApiUrlListarAdministrarCajas+'?empresa='+empresa+'&CODIGO_PUNTO_PAGO='+condigo_punto_pago+'&usuario='+usuario+'&token='+token);
  }

  postCrearPuntoPago(datos: any): Observable<any>{
    return this.http.post(this.myAppUrl+this.myApiUrlCrearPuntosPago,datos);
  };

  postModificarPuntoPago(datos: any): Observable<any>{
    return this.http.post(this.myAppUrl+this.myApiUrlModificarPuntoPago,datos);
  };

  postModificarUsuario(datos: any): Observable<any>{
    return this.http.post(this.myAppUrl+this.myApiUrlModificarUsuario,datos);
  };

  postCrearUsuario(datos: any): Observable<any>{
    return this.http.post(this.myAppUrl+this.myApiUrlCrearUsuario,datos);
  };

  postCrearCaja(datos: any): Observable<any>{
    return this.http.post(this.myAppUrl+this.myApiUrlCrearCaja,datos);
  };

  postModificarCaja(datos: any): Observable<any>{
    return this.http.post(this.myAppUrl+this.myApiUrlModificarCaja,datos);
  };

  postTrasladoFecha(datos: any): Observable<any>{
    return this.http.post(this.myAppUrl+this.myApiUrlTrasladoFecha,datos);
  };

  postCrearMensaje(datos: any): Observable<any>{
    return this.http.post(this.myAppUrl+this.myApiUrlCrearMensaje,datos);
  };

  getListarMensajes(empresa: number, condigo_punto_pago:number, usuario: string, token: string){
    return this.http.get(this.myAppUrl + this.myApiUrlListarMensajes+'?empresa='+empresa+'&CODIGO_PUNTO_PAGO='+condigo_punto_pago+'&usuario='+usuario+'&token='+token);
  }

  postModificarMensaje(datos: any): Observable<any>{
    return this.http.post(this.myAppUrl+this.myApiUrlModificarMensajes,datos);
  };

  getListarConvenios(empresa: number, usuario: string, token: string){
    return this.http.get(this.myAppUrl + this.myApiUrlListarConvenios+'?empresa='+empresa+'&usuario='+usuario+'&token='+token);
  }

  postCrearConvenio(datos: any): Observable<any>{
    return this.http.post(this.myAppUrl+this.myApiUrlCrearConvenio,datos);
  };

  postModificarConvenio(datos: any): Observable<any>{
    return this.http.post(this.myAppUrl+this.myApiUrlModificarConvenio,datos);
  };

  getListarFacturasConvenio(empresa: number, usuario: string, token: string){
    return this.http.get(this.myAppUrl + this.myApiUrlListadoFacturasConvenio+'?empresa='+empresa+'&usuario='+usuario+'&token='+token);
  }

  postCrearFacturaConvenio(datos: any): Observable<any>{
    return this.http.post(this.myAppUrl+this.myApiUrlCrearFacturaConvenio,datos);
  };

  postModificarFacturaConvenio(datos: any): Observable<any>{
    return this.http.post(this.myAppUrl+this.myApiUrlModificarFacturaConvenio,datos);
  };

  getListarAnulacionesPagos(empresa: number, condigo_punto_pago:number, usuario: string, token: string){
    return this.http.get(this.myAppUrl + this.myApiUrlListarAnulacionesPagos+'?empresa='+empresa+'&CODIGO_PUNTO_PAGO='+condigo_punto_pago+'&usuario='+usuario+'&token='+token);
  }

  postCrearAnulacionPago(datos: any): Observable<any>{
    return this.http.post(this.myAppUrl+this.myApiUrlCrearAnulacionPagos,datos);
  };

  postEliminarAnulacionPago(datos: any): Observable<any>{
    return this.http.post(this.myAppUrl+this.myApiUrlEliminarAnulacionPagos,datos);
  };

  getEstadoSincronizador(empresa: number, usuario: string, token: string){
    return this.http.get(this.myAppUrl + this.myApiUrlEstadoSincronizador+'?empresa='+empresa+'&usuario='+usuario+'&token='+token);
  };

  postModificarEstadoSincronizador(datos: any): Observable<any>{
    return this.http.post(this.myAppUrl+this.myApiUrlModificarEstadoSincronizador,datos);
  };

  postPagosAgrupadosSincro(datos: any): Observable<any>{
    return this.http.post(this.myAppUrl+this.myApiUrlPagosAgrupados,datos);
  };

  postCierreCaja(datos: any): Observable<any>{
    return this.http.post(this.myAppUrl+this.myApiUrlCierreCaja,datos);
  };

  getListadoCajasConvenioCierre(empresa: number, codigo_convenio:string, condigo_punto_pago:string, usuario: string, token: string){
    return this.http.get(this.myAppUrl + this.myApiUrlListadoCajasConvenioCierre+'?empresa='+empresa+'&codigo_convenio='+codigo_convenio+'&CODIGO_PUNTO_PAGO='+condigo_punto_pago+'&usuario='+usuario+'&token='+token);
  };

  getListadoConvenioCierre(empresa: number, usuario: string, token: string){
    return this.http.get(this.myAppUrl + this.myApiUrlListadoConvenioCierre+'?empresa='+empresa+'&usuario='+usuario+'&token='+token);
  };

  getListadoSubPuntosPago(empresa: number,  usuario: string, token:string): Observable<any> {
    return this.http.get(this.myAppUrl + this.myApiUrlListadoSubPuntosPago+'?empresa='+empresa+'&usuario='+usuario+'&token='+token);
  }

  getListadoCajasActivasSac(token:string,fecha: string): Observable<any> {
    return this.http.get(this.myAppUrl + this.myApiUrlConsultarCajasActivasSac+'?token='+token+'&fecha='+fecha);
  }
  getListadoReabrirArqueo(empresa: number, condigo_punto_pago:string, usuario: string, token: string): Observable<any> {
    return this.http.get(this.myAppUrl + this.myApiUrlListarReabrirArqueo+'?empresa='+empresa+'&codigo_punto_pago='+condigo_punto_pago+'&usuario='+usuario+'&token='+token);
  }

  getImprimirCuadre(empresa: number, numeroArqueo: number, token: string): Observable<Blob> {
    const url = `${this.myAppUrl}${this.myApiUrlImpresionCuadre}?empresa=${empresa}&numero_arqueo=${numeroArqueo}&token=${token}`;
  
    // No es necesario el 'as' casting aquí, simplemente especifica el tipo correctamente
    return this.http.get(url, { responseType: 'blob' });
  }


  postCrearSubPuntoPago(datos: any): Observable<any>{
    return this.http.post(this.myAppUrl+this.myApiUrlCrearSubPuntoPago,datos);
  };
  postEliminarSubPuntoPago(datos: any): Observable<any>{
    return this.http.post(this.myAppUrl+this.myApiUrlEliminarSubPuntoPago,datos);
  };
  postCargarArchivo(file: File, empresa: string, usuario: string, token: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('DOCUMENTO_CIERRE', file, file.name);
    formData.append('EMPRESA', empresa);
    formData.append('USUARIO', usuario);
    formData.append('TOKEN', token);

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    return this.http.post(this.myAppUrl+this.myApiUrlCargarArchivo, formData, { headers: headers });
  }

  postReabrirArqueo(datos: any): Observable<any>{
    return this.http.post(this.myAppUrl+this.myApiUrlReabrirArqueo,datos);
  };
//#endregion

//#region Reporteador

  getReportesReporteador(empresa: number, usuario: string, token: string){
    return this.http.get(this.myAppUrl + this.myApiUrlListadoReportesReporteador+'?empresa='+empresa+'&usuario='+usuario+'&token='+token);
  };


  getParametrosReporte(empresa: number, id_reporte:number, usuario: string, token: string){
    return this.http.get(this.myAppUrl + this.myApiUrlListadoParametrosReporte+'?empresa='+empresa+'&ID_REPORTE='+id_reporte+'&usuario='+usuario+'&token='+token);
  };

  getListadoFacturas(empresa: number, convenio:number, usuario: string, token: string){
    return this.http.get(this.myAppUrl + this.myApiUrlListadoFacturas+'?empresa='+empresa+'&CONVENIO='+convenio+'&usuario='+usuario+'&token='+token);
  };

  postGenerarReporteExcel(datos:any): Observable<any> {
    return this.http.post(this.myAppUrl + this.myApiUrlGenerarReporteExcel, datos);
  }

  postModificarEstadoReporte(datos:any): Observable<any> {
    return this.http.post(this.myAppUrl + this.myApiUrlModificarEstadoReporte, datos);
  }
//#endregion

//#region Desarrollador
  getListadoFacturasBarras(empresa: number, usuario: string, token:string): Observable<any> {
    return this.http.get(this.myAppUrl + this.myApiUrlListadoFacturasBarras+'?empresa='+empresa+'&usuario='+usuario+'&token='+token);
  }
  getListadoReportesAsignados(empresa: number, usuario: string, token:string): Observable<any> {
    return this.http.get(this.myAppUrl + this.myApiUrlListadoReportesAsignados+'?empresa='+empresa+'&usuario='+usuario+'&token='+token);
  }
  postModificarFacturaBarra(datos: any): Observable<any> {
    return this.http.post(this.myAppUrl + this.myApiUrlModificarFacturaBarra, datos);
  }
  postCrearFacturaBarra(datos: any): Observable<any> {
    return this.http.post(this.myAppUrl + this.myApiUrlCrearFacturaBarra, datos);
  }
  postConsultarInfoParametros(datos: any): Observable<any> {
    return this.http.post(this.myAppUrl + this.myApiUrlConsultarInformacionParametros, datos);
  }
  postConsultarInfoTablas(datos: any): Observable<any> {
    return this.http.post(this.myAppUrl + this.myApiUrlConsultarInformacionTablas, datos);
  }
  postCrearAsignacionReporte(datos: any): Observable<any> {
    return this.http.post(this.myAppUrl + this.myApiUrlCrearAsignacionReporte, datos);
  }
  postEliminarAsignacionReporte(datos: any): Observable<any> {
    return this.http.post(this.myAppUrl + this.myApiUrlEliminarAsignacionReporte, datos);
  }
  postEliminarFacturaBarra(datos: any): Observable<any> {
    return this.http.post(this.myAppUrl + this.myApiUrlEliminarFacturaBarra, datos);
  }
//#endregion 
  
}


