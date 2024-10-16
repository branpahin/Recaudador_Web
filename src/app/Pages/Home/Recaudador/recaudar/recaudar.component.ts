import { Component, OnInit, HostListener, ViewChild,  AfterViewChecked, ChangeDetectorRef, ElementRef} from '@angular/core';
import { Router } from '@angular/router';
import { RecaudoService } from 'src/app/services/recaudo.service';
import * as alertify from 'alertifyjs';
import { IonInput, LoadingController, MenuController, ModalController } from '@ionic/angular';
import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ListadoFacturasComponent } from 'src/app/Pages/General/listado-facturas/listado-facturas.component';



interface Detalle {
  CODIGO_CONVENIO: string;
  CODIGO_CONVENIO_DET: string;
  MANUAL: string;
  BUSQUEDA_REFERENCIA : string;
  CODIGO_CLIENTE: string;
  CODIGO_REFERENCIA: string;
  VALOR_MOVIMIENTO_DET:string;
  FECHA_VENCIMIENTO:string;
  CODIGO_BARRAS:string;
  
}

interface Detalle2 {
  CODIGO_CONVENIO: string;
  NOMBRE_CONVENIO: string;
  CODIGO_CLIENTE: string;
  CODIGO_REFERENCIA: string;
  CODIGO_CONVENIO_DET: string;
  NOMBRE_CONVENIO_DET: string;
  
}

interface DatosConsulta {
  EMPRESA: string;
  CODIGO_PUNTO_PAGO: string;
  NUMERO_ARQUEO: string;
  USUARIO: string;
  ACCION: string;
  NIT: string;
  DOCUMENTO_IDENTIDAD?: string;
  CODIGO_CONVENIO: string;
  CODIGO_CONVENIO_DET: string;
  REFERENCIA: string;
  VALOR_MOVIMIENTO_DET?:string;
  TOKEN: string;
}

@Component({
  selector: 'app-recaudar',
  templateUrl: './recaudar.component.html',
  styleUrls: ['./recaudar.component.scss'],
})
export class RecaudarComponent  implements OnInit {

  empresa=localStorage.getItem('empresaCOD') || '';
  nombreEmpresa=localStorage.getItem('empresa')|| '';
  usuario= localStorage.getItem('usuario')|| '';
  codigoCaja= localStorage.getItem('condigoCaja')|| '';
  puntoPago=localStorage.getItem('puntoPago')|| '';
  nombrePuntoPago=localStorage.getItem('nombrePuntoPago')|| '';
  CODconvenio=localStorage.getItem('CODconvenio') || '';
  CODconvenioDetConst=this.recaudoService.getCodigoConvenioDet() || '';
  CODconvenioDet=localStorage.getItem('CODconvenioDet') || '';
  NITConvenio=localStorage.getItem('NITConvenio') || '';
  token=localStorage.getItem('token')|| '';
  rol = localStorage.getItem('rol') || '';
  alumbrados=localStorage.getItem('alumbrado') || '';

  Numero_Transaccion="";
  accionpunto="1";
  
  arqueo="";
  detalle={
    CODIGO_CONVENIO: "0",
    CODIGO_CONVENIO_DET: "0",
    MANUAL: "N",
    BUSQUEDA_REFERENCIA :"N",
    CODIGO_CLIENTE: "",
    CODIGO_REFERENCIA:"",
    VALOR_MOVIMIENTO_DET:"",
    FECHA_VENCIMIENTO:"",
    CODIGO_BARRAS:""
  };

  detalle2={
    CODIGO_CONVENIO: "",
    NOMBRE_CONVENIO: "",
    CODIGO_CLIENTE: "",
    CODIGO_REFERENCIA:"",
    CODIGO_CONVENIO_DET: "",
    NOMBRE_CONVENIO_DET: ""
  };
  
  nombres_convenio= [] as Detalle2[];
  facturasInvertidas:any[]=[];
  focus:boolean=false;

  valorReferencia="";


  datos = {
    EMPRESA: this.empresa,
    NUMERO_ARQUEO: this.arqueo,
    CODIGO_PUNTO_PAGO: this.puntoPago,
    CODIGO_CAJA:this.codigoCaja,
    USUARIO: this.usuario,
    VALOR_MOVIMIENTO:"0",
    NUMERO_CUPONES_MOVIMIENTO:"",
    VALOR_RECIBIDO:"",
    VALOR_CAMBIO: "0",
    FORMA_PAGO:"",
    NUMERO_DOCUMENTO:"",
    COMENTARIO:"",
    FACTURAS: [] as Detalle[],
    NUMERO_TRANSACCION:"",
    TOKEN: this.token
  };

  datosAnulacion={
    EMPRESA: this.empresa,
    NUMERO_ARQUEO: this.arqueo,
    CODIGO_PUNTO_PAGO: this.puntoPago,
    CODIGO_CAJA: this.codigoCaja,
    NUMERO_TRANSACCION: this.Numero_Transaccion,
    USUARIO: this.usuario,    
    TOKEN: this.token
  }

  datosMix = {
    EMPRESA: this.empresa,
    NUMERO_ARQUEO: this.arqueo,
    CODIGO_PUNTO_PAGO: this.puntoPago,
    CODIGO_CAJA:this.codigoCaja,
    USUARIO: this.usuario,
    VALOR_EFECTIVO:"",
    VALOR_TARJETA:"",
    VALOR_MOVIMIENTO:"0",
    NUMERO_CUPONES_MOVIMIENTO:"",
    VALOR_RECIBIDO:"",
    VALOR_CAMBIO: "0",
    FORMA_PAGO:"",
    NUMERO_DOCUMENTO:"",
    COMENTARIO:"",
    FACTURAS: [] as Detalle[],
    NUMERO_TRANSACCION:"",
    TOKEN: this.token
  };

  datosTurno={
    EMPRESA: this.empresa,
    CODIGO_PUNTO_PAGO: this.puntoPago,
    USUARIO: this.usuario,
    CODIGO_CAJA: this.codigoCaja,
    PREFERENCIAL:"0",   
    TOKEN:this.token
  };

  turno:boolean=true;
  turnero:any;
  seleccionar:boolean=false;

  accion=1;
  codigo_barras="";

  datosConsulta = {
    EMPRESA: this.empresa,
    CODIGO_PUNTO_PAGO: this.puntoPago,
    NUMERO_ARQUEO:this.arqueo,
    USUARIO: this.usuario,
    CODIGO_CONVENIO_DET:"",
    ACCION:"1",
    CODIGO_BARRAS:"",
    TOKEN: this.token
  };
  datosConsulta2:DatosConsulta = {
    EMPRESA: this.empresa,
    CODIGO_PUNTO_PAGO: this.puntoPago,
    NUMERO_ARQUEO:this.arqueo,
    USUARIO: this.usuario,
    ACCION:"2",
    NIT:"",
    CODIGO_CONVENIO:"0",
    CODIGO_CONVENIO_DET:"0",
    REFERENCIA:"",
    TOKEN: this.token
  }

  documento="";
  ciclo="";
  direccion="";
  propietario="";
  contadorEnter = 0;
  IDtransaccion:boolean=false;
  mostrarID:boolean=false;
  visual1:boolean=true;
  visual2:boolean=false;
  visual3:boolean=false;
  resultado: any;
  resultados2: any [] = [];
  pago:any []=[];
  recaudos:any;
  impresion:any;
  agrupado="S";
  estadoCheckbox:boolean = false;
  estadoCheckboxTodo:boolean = false;
  CheckboxFact:boolean =false;
  lstfacturas="";
  nombreConvenio: any;
  nombreConvenioDetalle: any;
  movimiento="";
  desagruparSeleccionado:boolean=false;
  desagrupar:boolean=false;
  seleccionarTodos:boolean=false;
  desFormaPago="";
  confirmar:boolean=false;
  redondear:boolean=false;
  mostrarCampos:boolean=false;
  referencia:boolean=false;
  inputTimer : any;
  fecha:string='';
  mostrarCamposDoc=false;
  confirmar_Lista:boolean=false;
  mostrarCamposManuales:boolean=false;
  mostrarSoloBarra:boolean=false;
  mostrarBarra:boolean=false;
  mostrarDocumento:boolean=false;
  mostrarValor:boolean=false;
  recaudado:boolean=false;
  limpia:boolean=false;

  @ViewChild('myInput',{static:false}) myInput:IonInput | undefined;
  @ViewChild('myInput2',{static:false}) myInput2:IonInput | undefined;
  @ViewChild('myInput3',{static:false}) myInput3:IonInput | undefined;
  @ViewChild('inputElement') inputElement: ElementRef | undefined;

  @HostListener('window:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent) {
    if (event.key === 'F2' && this.confirmar==false && this.mostrarID==false && this.recaudado==false) {
        this.limpiarYEnviar();
      }
    else if (event.key === 'F2' && this.mostrarID==true && this.confirmar==false && this.recaudado==false) {
      this.confirmacion();
    }

    else if (event.key === 'F2' && this.confirmar==true && this.mostrarID==false && this.recaudado==false) {
      this.recaudarFinal();
    }
  
    if (event.key === 'F4') {
      this.vistaImpresion();
      }
    if (event.key === 'F9') {
      event.preventDefault(); // Evitar la acción por defecto del navegador
      this.setFocus2();
    }

    if (event.ctrlKey && event.key === 'B') {
      event.preventDefault(); // Evitar la acción por defecto del navegador
      this.setFocus2();
    }

    if (event.key === 'F8') {
      this.Confirmacionlimpiar();
    }
    if (event.ctrlKey && event.key === 'B') {
      this.igualar();
    }
    if (event.ctrlKey && event.key === 'b') {
      this.igualar();
    }
    if(this.confirmar_Lista==true){
      if(event.key === 'Enter'){
        this.agregarDetalle();
        this.confirmar_Lista=false;
      }
    }
    if(this.limpia==true){
      if(event.key === 'Enter'){
        this.limpiar();
      }else if(event.key === 'Escape'){
        this.cerrarTabla();
      }
    }
  }

  iframeUrl= "";

  imprimir=false;


  constructor(private recaudoService: RecaudoService, private router: Router, 
    private menuCtrl: MenuController, 
    private cd: ChangeDetectorRef, 
    private http: HttpClient, 
    private modalController: ModalController,
    private loadingController: LoadingController,
    
  ) { 
    this.recaudoService.enviarAlumbrado$.subscribe((barras) => {
      if(barras){
        this.mostrarCamposManuales=false;
        this.mostrarSoloBarra=true;
      }
    });

    this.recaudoService.enviarManual$.subscribe((manual) => {
      if(manual){
        const CODconvenio=localStorage.getItem('CODconvenio') || '';
        this.mostrarCamposManuales=true;
        this.mostrarSoloBarra=true;
        if(CODconvenio=="17"){
          this.mostrarDocumento=true;
        }else{
          this.mostrarDocumento=false;
        }
      }

    });

    this.recaudoService.CodConvenioDet$.subscribe((codConvenioDet) => {
      if(codConvenioDet){
        this.mostrarValor=true;
      }else{
        this.mostrarValor=false;
      }

    });

    this.recaudos = {
      NUMERO_ARQUEO: ''
    }

  }
  openEndMenu() {
    this.menuCtrl.toggle('end');
  }

  ngOnInit() {
    this.visual2=false;
    this.visual3=false;
    this.mostrarSoloBarra=false;
    this.mostrarCamposManuales=false;
    this.imprimir=false;
    this.datos.FORMA_PAGO="1";
    this.setFocus();
    this.consultarArqueo();
  }
  

  setFocus(){
    setTimeout(() => {
      this.myInput?.setFocus();
    }, 0);
  }
  setFocus2(){
    this.myInput2?.setFocus();
  }
  setFocus3(){
    this.myInput3?.setFocus();
  }

  get colorValorCambio(): string {
    const valorCambioNumber = parseFloat(this.datos.VALOR_CAMBIO);
    return valorCambioNumber < 0 ? 'red' : 'green'; // Cambia a 'black' si es negativo
  }

  agrupar(event: { detail: { checked: any; }; }){
    if (event.detail.checked) {
      this.agrupado="N";
      this.desagruparSeleccionado = true;
    } else {
      this.agrupado="S";
      this.lstfacturas="0";
      this.desagruparSeleccionado = false;
      this.estadoCheckboxTodo = false;
      this.CheckboxFact = false;
      this.seleccionarTodos=false;
    }
    
  }

  seleccionarTodo(event:{ detail: { checked: any; }; } ){
    if (event.detail.checked) {
      this.seleccionarTodos = event.detail.checked;
      this.lstfacturas="";
      this.CheckboxFact=true;
      for (const detalle of this.datos.FACTURAS) {
       
        this.updateSelectedClientes({ detail: { checked: this.seleccionarTodos } }, detalle);
      }
    }else {
      this.seleccionarTodos = event.detail.checked;
      this.CheckboxFact=false;
      this.lstfacturas="";
    }
  }

  updateSelectedClientes(event: { detail: { checked: any; }; }, detalle: { CODIGO_CLIENTE: any; }) {
    
    const codigoCliente = detalle.CODIGO_CLIENTE;
  
    if (event.detail.checked) {
      if (!this.lstfacturas.includes(codigoCliente)) {
        this.lstfacturas += codigoCliente + ",";
      }
    } else {
      this.lstfacturas = this.lstfacturas.replace(new RegExp(codigoCliente + ",", 'g'), "");
    }
  }


  barraManual(event: { detail: { checked: any; }; }){
    if (event.detail.checked) {
      this.mostrarBarra = true;
    } else {
      this.mostrarBarra = false;
    } 
  }


  eliminarFila(detalle:{ CODIGO_CLIENTE: any; VALOR_MOVIMIENTO_DET: string; }){
    const codigoCliente = detalle.CODIGO_CLIENTE;
    const valorMovimientoDet = detalle.VALOR_MOVIMIENTO_DET;
    this.datos.FACTURAS = this.datos.FACTURAS.filter(detalle => detalle.CODIGO_CLIENTE !== codigoCliente);
    this.datos.VALOR_MOVIMIENTO = String(Number(this.datos.VALOR_MOVIMIENTO)-Number(valorMovimientoDet));
    this.datos.NUMERO_CUPONES_MOVIMIENTO=String(Number(this.datos.NUMERO_CUPONES_MOVIMIENTO)-1);
    this.nombres_convenio=this.nombres_convenio.filter(detalle => detalle.CODIGO_CLIENTE !==codigoCliente);

    this.facturasInvertidas = [...this.datos.FACTURAS].reverse();
    this.calcular();
  }

  agregarDetalle() {
    
    this.confirmar_Lista=false;
    const nuevoDetalle: Detalle = { ...this.detalle, };
    const nuevoDetalle2: Detalle2 = { ...this.detalle2, };
    if(this.datos.FORMA_PAGO=="2" || this.datos.FORMA_PAGO=="3" || this.datos.FORMA_PAGO=="5" || this.datos.FORMA_PAGO=="6" || this.datos.FORMA_PAGO=="7"){
      const ultimoDetalle = this.datos.FACTURAS[this.datos.FACTURAS.length - 1];
      const nuevoCodigoConvenio = nuevoDetalle.CODIGO_CONVENIO;
      // if(this.datos.FORMA_PAGO=="5"){
      //   // const mockEvent = { detail: { checked: true } };
      //   // this.redondeo(mockEvent);
      // }
      
      if (ultimoDetalle) {
        if(ultimoDetalle.CODIGO_CONVENIO === nuevoCodigoConvenio){
          
          
          this.nombres_convenio.push(nuevoDetalle2);
          this.datos.FACTURAS.push(nuevoDetalle);
          this.datosConsulta.CODIGO_BARRAS="";
          this.detalle.CODIGO_CLIENTE="";
          this.detalle.CODIGO_REFERENCIA="";
          this.detalle.VALOR_MOVIMIENTO_DET="";
          this.datosConsulta2.NIT = "";
          this.documento="";
          this.referencia =false;
          this.facturasInvertidas = [...this.datos.FACTURAS].reverse();
        }else {
        alertify.error("NO SE PUEDE REALIZAR PAGOS DE CONVENIOS DIFERENTES POR ESTE MEDIO DE PAGO");
        
        } 
      }else{
        
        this.nombres_convenio.push(nuevoDetalle2);
        this.datos.FACTURAS.push(nuevoDetalle);
        this.datosConsulta.CODIGO_BARRAS="";
        this.detalle.CODIGO_CLIENTE="";
        this.detalle.CODIGO_REFERENCIA="";
        this.detalle.VALOR_MOVIMIENTO_DET="";
        this.datosConsulta2.NIT = "";
        this.documento="";
        this.referencia =false;
        this.facturasInvertidas = [...this.datos.FACTURAS].reverse();
      }
    }
    else if(this.datos.FORMA_PAGO=="4"){
      const nuevoCodigoConvenio = nuevoDetalle.CODIGO_CONVENIO;

      if (nuevoCodigoConvenio == "2") {

        
        
        
        this.nombres_convenio.push(nuevoDetalle2);
        this.datos.FACTURAS.push(nuevoDetalle);
        this.datosConsulta.CODIGO_BARRAS="";
        this.detalle.CODIGO_CLIENTE="";
        this.detalle.CODIGO_REFERENCIA="";
        this.detalle.VALOR_MOVIMIENTO_DET="";
        this.datosConsulta2.NIT = "";
        this.documento="";
        this.referencia =false;
        this.facturasInvertidas = [...this.datos.FACTURAS].reverse();
      } else {
        alertify.error("SOLO SE PUEDE PAGAR ENERGIA CON ESTE METODO DE PAGO");
        
      }
    }
    else{
      
      this.nombres_convenio.push(nuevoDetalle2);
      this.datos.FACTURAS.push(nuevoDetalle);
      this.datosConsulta.CODIGO_BARRAS="";
      this.detalle.CODIGO_CLIENTE="";
      this.detalle.CODIGO_REFERENCIA="";
      this.detalle.VALOR_MOVIMIENTO_DET="";
      this.datosConsulta2.NIT = "";
      this.documento="";
      this.referencia =false;
      this.facturasInvertidas = [...this.datos.FACTURAS].reverse();
    }
    this.calcular();

  }

  
  
  buscarBarras() {
    this.visual1=true;
    this.setFocus();
    this.visual2=false;
    this.visual3=false;
    this.mostrarSoloBarra=false;
    this.mostrarCamposManuales=false;
  }
  buscarReferencia() {
    this.visual2=true;
    this.visual1=false;
    this.visual3=false;
    this.mostrarSoloBarra=false;
    this.mostrarCamposManuales=false;
  }
  
  buscarManual() {
    this.visual3=true;
    this.visual2=false;
    this.visual1=false;  
  }

  formaPago(){
    if (this.empresa !== null && this.puntoPago !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.getFormaPago(Number(this.empresa),Number(this.puntoPago),this.accionpunto, this.usuario, this.token).subscribe(
        (data: any) => {
          
          this.pago = data.FORMAS_PAGO;
        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    }

  }

  formaPagoMixto(){
    if(this.datos.FORMA_PAGO=="5" || this.datos.FORMA_PAGO=="7"){
      this.mostrarCampos=true;
      this.datosMix = {
        EMPRESA: this.empresa,
        NUMERO_ARQUEO: this.arqueo,
        CODIGO_PUNTO_PAGO: this.puntoPago,
        CODIGO_CAJA:this.codigoCaja,
        USUARIO: this.usuario,
        VALOR_RECIBIDO:"",
        VALOR_MOVIMIENTO:this.datos.VALOR_MOVIMIENTO,
        NUMERO_CUPONES_MOVIMIENTO:this.datos.NUMERO_CUPONES_MOVIMIENTO,
        VALOR_EFECTIVO:"",
        VALOR_TARJETA:"",
        VALOR_CAMBIO: "",
        FORMA_PAGO:this.datos.FORMA_PAGO,
        NUMERO_DOCUMENTO:"",
        COMENTARIO:this.datos.COMENTARIO,
        FACTURAS: [] as Detalle[],
        NUMERO_TRANSACCION:"",
        TOKEN: this.token
      };
    }else{
      this.mostrarCampos=false;
    }

    if(this.datos.FORMA_PAGO=="3" || this.datos.FORMA_PAGO=="2" || this.datos.FORMA_PAGO=="4" || this.datos.FORMA_PAGO=="6"){
      this.mostrarCamposDoc=true;
    }
    else{
      this.mostrarCamposDoc=false;
    }
    if(this.datos.FORMA_PAGO=="2" || this.datos.FORMA_PAGO=="3" || this.datos.FORMA_PAGO=="5" || this.datos.FORMA_PAGO=="7" || this.datos.FORMA_PAGO=="6"){
      let codigosIguales = true;
      let codigoAnterior = null;
  
      for (const detalle of this.datos.FACTURAS) {
        if (codigoAnterior === null) {
          codigoAnterior = detalle.CODIGO_CONVENIO;
        } else if (detalle.CODIGO_CONVENIO !== codigoAnterior) {
          codigosIguales = false;
          break; // No es necesario seguir recorriendo si encontramos códigos diferentes
        }
      }
  
      if (codigosIguales) {
        
      } else {
        alertify.error("NO SE PUEDE REALIZAR PAGOS DE CONVENIOS DIFERENTES POR ESTE MEDIO DE PAGO");
        
      }
    }
    if(this.datos.FORMA_PAGO=="4"){
      let codigosIguales = true;
      let codigoAnterior = null;
  
      for (const detalle of this.datos.FACTURAS) {
        if (codigoAnterior === null) {
          codigoAnterior = detalle.CODIGO_CONVENIO;
        } else if (detalle.CODIGO_CONVENIO !="2") {
          codigosIguales = false;
          break; // No es necesario seguir recorriendo si encontramos códigos diferentes
        }
      }
  
      if (codigosIguales) {
        
      } else {
        alertify.error("SOLO PUEDE PAGAR ENERGIA CON ESTE METODO DE PAGO");
        
      }
    }
    this.setFocus();
  
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

  confirmacion(){
    if(this.datos.FORMA_PAGO=='1'){
      this.recaudarFinal();
    }else{
      this.confirmar=true;
      this.IDtransaccion=true;
      this.mostrarID=false;
      this.pago.forEach(date => {
  
        if(date.CODIGO==this.datos.FORMA_PAGO){
          this.desFormaPago=date.DESCRIPCION;
        }
        
  
      });
    }

  }

  async ListarFacturas() {
    const modal = await this.modalController.create({
      component: ListadoFacturasComponent,
      componentProps: {
        datos: this.facturasInvertidas,
        nombres_convenio:this.nombres_convenio,
        backdropDismiss: true,
      },
    });
    modal.style.cssText = `
      --height:auto;
      max-height: 100%;
      --width:80%;
      --max-width: 90%;
      --border-radius: 10px;
    `;
    return await modal.present();
  }

  Anular(){
    this.datosAnulacion.NUMERO_TRANSACCION=this.Numero_Transaccion;
    this.recaudoService.postAnularTransaccionDatafono(this.datosAnulacion).subscribe({
      next: data => {
      this.resultado = data;
      
      if(data.COD=="200"){
        alertify.success(this.resultado.RESPUESTA);
        this.mostrarID=false;
        this.IDtransaccion=false;
        this.Numero_Transaccion="";
        this.formatoNumero();
       
      }else {
       alertify.error(this.resultado.RESPUESTA);
       this.formatoNumero();
      }
    },
    error: error => {
      console.error("Respuesta:",error);
    }});
  }


  igualar(){
    const valor=String(this.datos.VALOR_MOVIMIENTO)
    this.datos.VALOR_RECIBIDO=valor;
    this.formatoNumero();
  }

  cerrarTabla(){
    this.limpia=false;
    
    this.confirmar=false;
    this.formatoNumero();
    if(this.IDtransaccion){
      this.Anular();
      this.IDtransaccion=false;
      this.Numero_Transaccion="";
    }
  }

  cerrarList(){
    this.confirmar_Lista=false;
    this.detalle.CODIGO_CONVENIO="";
    this.detalle.CODIGO_CONVENIO_DET="";
    this.detalle.CODIGO_CLIENTE="";
    this.detalle.CODIGO_REFERENCIA="";
    this.detalle.VALOR_MOVIMIENTO_DET="";
    this.detalle.FECHA_VENCIMIENTO="";
    this.ciclo="";
    this.propietario="";
    this.direccion="";
    this.detalle.BUSQUEDA_REFERENCIA="N";
    this.datos.VALOR_MOVIMIENTO=String(Number(this.datos.VALOR_MOVIMIENTO)-Number(this.resultado.VALOR_MOVIMIENTO_DET));
    this.datos.NUMERO_CUPONES_MOVIMIENTO=String(Number(this.datos.NUMERO_CUPONES_MOVIMIENTO)-1);
    this.detalle2.CODIGO_CONVENIO="";
    this.detalle2.CODIGO_CONVENIO_DET="";
    this.detalle2.CODIGO_CLIENTE="";
    this.detalle2.CODIGO_REFERENCIA="";
    this.detalle2.NOMBRE_CONVENIO="";
    this.detalle2.NOMBRE_CONVENIO_DET="";
  }

  formatoNumero() {
    let numeroFormateado = this.datos.VALOR_RECIBIDO.replace(/[^\d]/g, '');
    numeroFormateado = numeroFormateado.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    this.datos.VALOR_RECIBIDO= numeroFormateado;
  }


  redondeo(event: { detail: { checked: any; }; }){
    
    if (event.detail.checked) {
      this.redondear=true;
    } else {
      this.redondear=false;
    }
    this.calcular();
  }

  redondearValor(valor: number): number {
    const valorCambio=this.datos.VALOR_CAMBIO;
    const valorCambioMix=this.datosMix.VALOR_CAMBIO;

    let valorRedondeado = Math.round(valor / 50) * 50;
    
    if(!this.redondear){
      this.datos.VALOR_CAMBIO=String(valorRedondeado);
      this.datosMix.VALOR_CAMBIO=String(valorRedondeado);

    }
    else{
      this.datos.VALOR_CAMBIO=valorCambio;
      this.datosMix.VALOR_CAMBIO=valorCambioMix;
    }
    return valorRedondeado;
    
  }
  redondearValorMix(valor: number): number {

    const valorCambioMix=this.datosMix.VALOR_CAMBIO;

    
    let valorRedondeadoMix = Math.round(valor / 50) * 50;
    if(!this.redondear){

      this.datosMix.VALOR_CAMBIO=String(valorRedondeadoMix);
    }
    else{

      this.datosMix.VALOR_CAMBIO=valorCambioMix;
    }
    return valorRedondeadoMix;
    
  }
  
  calcular(){

    this.datos.VALOR_RECIBIDO=this.datos.VALOR_RECIBIDO.replace(/\./g, '');
    this.datosMix.VALOR_EFECTIVO=this.datosMix.VALOR_EFECTIVO.replace(/\./g, '')
    this.datosMix.VALOR_RECIBIDO=this.datosMix.VALOR_RECIBIDO.replace(/\./g, '')
    this.datosMix.VALOR_TARJETA=this.datosMix.VALOR_TARJETA.replace(/\./g, '')
    if(this.datos.FORMA_PAGO=="5" || this.datos.FORMA_PAGO=="7"){
      if(Number(this.datosMix.VALOR_EFECTIVO) > 0 || Number(this.datos.VALOR_MOVIMIENTO) > 0 || Number(this.datosMix.VALOR_RECIBIDO) > 0){
       
        this.datosMix.VALOR_TARJETA=String(Number(this.datos.VALOR_MOVIMIENTO)-Number(this.datosMix.VALOR_EFECTIVO))
        if(Number(this.datosMix.VALOR_RECIBIDO) > 0 || Number(this.datosMix.VALOR_EFECTIVO) > 0){
        this.datosMix.VALOR_CAMBIO=String(Number(this.datosMix.VALOR_RECIBIDO)-Number(this.datosMix.VALOR_EFECTIVO));
        }
        let numeroFormateado = this.datosMix.VALOR_EFECTIVO.replace(/[^\d]/g, '');
        numeroFormateado = numeroFormateado.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        this.datosMix.VALOR_EFECTIVO= numeroFormateado;
        numeroFormateado = this.datosMix.VALOR_RECIBIDO.replace(/[^\d]/g, '');
        numeroFormateado = numeroFormateado.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        this.datosMix.VALOR_RECIBIDO= numeroFormateado;
        numeroFormateado = this.datosMix.VALOR_TARJETA.replace(/[^\d]/g, '');
        numeroFormateado = numeroFormateado.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        this.datosMix.VALOR_TARJETA= numeroFormateado;
        
       
      }
    }
   
    else{
      if(Number(this.datos.VALOR_RECIBIDO) > 0 && Number(this.datos.VALOR_MOVIMIENTO) > 0){
        this.datos.VALOR_CAMBIO=String(Number(this.datos.VALOR_RECIBIDO)-Number(this.datos.VALOR_MOVIMIENTO)); 
      }
    }
    
    
    if(!this.mostrarCampos){

      const valorRedondeado = this.redondearValor(Number(this.datos.VALOR_CAMBIO));
    }else{

      const valorRedondeadoMix = this.redondearValorMix(Number(this.datosMix.VALOR_CAMBIO));
    }
    
    this.formatoNumero();
  }

  calcularDat(){

    this.datos.VALOR_RECIBIDO=this.datos.VALOR_RECIBIDO.replace(/\./g, '');
    this.datosMix.VALOR_EFECTIVO=this.datosMix.VALOR_EFECTIVO.replace(/\./g, '')
    this.datosMix.VALOR_RECIBIDO=this.datosMix.VALOR_RECIBIDO.replace(/\./g, '')
    this.datosMix.VALOR_TARJETA=this.datosMix.VALOR_TARJETA.replace(/\./g, '')
    if(this.datos.FORMA_PAGO=="5" || this.datos.FORMA_PAGO=="7"){
      ;

      if(Number(this.datosMix.VALOR_TARJETA) > 0 && Number(this.datos.VALOR_MOVIMIENTO) > 0){
        this.datosMix.VALOR_EFECTIVO=String(Number(this.datos.VALOR_MOVIMIENTO)-Number(this.datosMix.VALOR_TARJETA))
        if(Number(this.datosMix.VALOR_RECIBIDO) > 0 && Number(this.datosMix.VALOR_EFECTIVO) > 0){
        this.datosMix.VALOR_CAMBIO=String(Number(this.datosMix.VALOR_RECIBIDO)-Number(this.datosMix.VALOR_EFECTIVO));
        }
        let numeroFormateado = this.datosMix.VALOR_EFECTIVO.replace(/[^\d]/g, '');
        numeroFormateado = numeroFormateado.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        this.datosMix.VALOR_EFECTIVO= numeroFormateado;
        numeroFormateado = this.datosMix.VALOR_RECIBIDO.replace(/[^\d]/g, '');
        numeroFormateado = numeroFormateado.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        this.datosMix.VALOR_RECIBIDO= numeroFormateado;
        numeroFormateado = this.datosMix.VALOR_TARJETA.replace(/[^\d]/g, '');
        numeroFormateado = numeroFormateado.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        this.datosMix.VALOR_TARJETA= numeroFormateado;
      }
    }
   
    else{
      if(Number(this.datos.VALOR_RECIBIDO) > 0 && Number(this.datos.VALOR_MOVIMIENTO) > 0){
        this.datos.VALOR_CAMBIO=String(Number(this.datos.VALOR_RECIBIDO)-Number(this.datos.VALOR_MOVIMIENTO)); 
      }
    }
    if(!this.mostrarCampos){

      const valorRedondeado = this.redondearValor(Number(this.datos.VALOR_CAMBIO));
    }else{

      const valorRedondeadoMix = this.redondearValorMix(Number(this.datosMix.VALOR_CAMBIO));
    }

    this.formatoNumero();
  }

  verificarValor() {
    
    const valorRecibido=this.datos.VALOR_RECIBIDO.replace(/\./g, '');
    const valorMovimiento=this.datos.VALOR_MOVIMIENTO.replace(/\./g, '');
    if (Number(valorRecibido) < Number(valorMovimiento)) {
      return true;
    } else {
      return false;
    }
  }

  verificarValorMix() {
    const valorRecibido=this.datosMix.VALOR_RECIBIDO.replace(/\./g, '');
    const valorEfectivo=this.datosMix.VALOR_EFECTIVO.replace(/\./g, '');
    if (Number(valorRecibido) < Number(valorEfectivo)) {
      return true;
    } else {
      return false;
    }
  }

  fechaManual(event: any){
    this.fecha = formatDate(event.detail.value, 'dd/MM/yyyy', 'en-US');
    this.detalle.FECHA_VENCIMIENTO=this.fecha;
  }



  async consultarRecaudoBarras(){

    const CODconvenioDetConst=this.recaudoService.getCodigoConvenioDet() || '';
    if(this.mostrarSoloBarra){

      this.datosConsulta.CODIGO_CONVENIO_DET=CODconvenioDetConst;
    }
    else{
      this.datosConsulta.CODIGO_CONVENIO_DET="";
    }
    
    this.recaudoService.postConsultarRecaudo(this.datosConsulta).subscribe(async (data) => {
      this.resultado = data;
      
      const detallecodigo = this.datos.FACTURAS.find(detalle => detalle.CODIGO_REFERENCIA===data.CODIGO_REFERENCIA);
      if(data.COD=="200" && data.CODIGO_REFERENCIA!=detallecodigo?.CODIGO_REFERENCIA && data.CODIGO_CLIENTE!=detallecodigo?.CODIGO_CLIENTE){
          this.detalle.CODIGO_CONVENIO=String(data.CODIGO_CONVENIO);
          this.detalle.CODIGO_CONVENIO_DET=String(data.CODIGO_CONVENIO_DET);
          this.detalle.CODIGO_CLIENTE=data.CODIGO_CLIENTE;
          this.detalle.CODIGO_REFERENCIA=data.CODIGO_REFERENCIA;
          this.detalle.VALOR_MOVIMIENTO_DET=String(data.VALOR_MOVIMIENTO_DET);
          this.detalle.FECHA_VENCIMIENTO=data.DIA_VENCIMIENTO+"/"+data.MES_VENCIMIENTO+"/"+data.ANO_VENCIMIENTO;
          this.datos.VALOR_MOVIMIENTO=String(Number(this.datos.VALOR_MOVIMIENTO)+Number(data.VALOR_MOVIMIENTO_DET));
          this.datos.NUMERO_CUPONES_MOVIMIENTO=String(Number(this.datos.NUMERO_CUPONES_MOVIMIENTO)+1);
          this.detalle2.CODIGO_CONVENIO=String(data.CODIGO_CONVENIO);
          this.detalle2.CODIGO_CONVENIO_DET=String(data.CODIGO_CONVENIO_DET);
          this.detalle2.CODIGO_CLIENTE=data.CODIGO_CLIENTE;
          this.detalle2.CODIGO_REFERENCIA=data.CODIGO_REFERENCIA;
          this.detalle2.NOMBRE_CONVENIO=data.NOMBRE_CONVENIO;
          this.detalle2.NOMBRE_CONVENIO_DET=data.NOMBRE_CONVENIO_DET;
          this.detalle.CODIGO_BARRAS=this.datosConsulta.CODIGO_BARRAS;
          this.agregarDetalle();
       

      }
      else if(data.COD=="200" && !data.CODIGO_REFERENCIA){
        alertify.error("Error al consultar la factura, verifique la forma en la que se está consultando");
      }
      
      else if(data.COD!="200"){
        
        this.datosConsulta.CODIGO_BARRAS="";
       alertify.error(data.RESPUESTA);
      }else{
        this.datosConsulta.CODIGO_BARRAS="";
        alertify.error("La factura ya se encuentra en la lista ");
      }
      
      
    },async (error) => {
      console.error(error);
    });
    
  }

  async consultarRecaudoReferencia(){
    const loading = await this.loadingController.create({
      message: 'Consultando Factura...',
      spinner: 'crescent',
      cssClass: 'custom-loading'
    });

    await loading.present();
    const alumbradosConst=localStorage.getItem('alumbrado') || '';
    const CODconvenioConst=localStorage.getItem('CODconvenio') || '';
    const CODconvenioDetConst=this.recaudoService.getCodigoConvenioDet() || '';
    const NITConvenio=localStorage.getItem('NITConvenio') || '';
    const NombreConvenio=localStorage.getItem('NombreConvenio') || '';
    const NombreConvenioDet= localStorage.getItem('NombreConvenioDet')|| '';
    this.CODconvenio=CODconvenioConst;
    this.CODconvenioDet=CODconvenioDetConst;
    this.datosConsulta2.NIT= NITConvenio;
    this.datosConsulta2.CODIGO_CONVENIO=CODconvenioConst;
    this.datosConsulta2.CODIGO_CONVENIO_DET=CODconvenioDetConst;
    
    
    if(CODconvenioConst=="5"){
      this.datosConsulta2.REFERENCIA="0"+this.datosConsulta2.REFERENCIA;
    }
    else if(CODconvenioConst=="2"){
      if(alumbradosConst=="1" && CODconvenioDetConst!="28"){
        this.datosConsulta2.REFERENCIA="010"+this.datosConsulta2.REFERENCIA;
      }
      else if(alumbradosConst=="2" && CODconvenioDetConst!="28"){
        this.datosConsulta2.REFERENCIA="080"+this.datosConsulta2.REFERENCIA;
      }else if(CODconvenioDetConst=="28"){
        
        this.datosConsulta2.VALOR_MOVIMIENTO_DET=this.valorReferencia;
        this.datosConsulta2.REFERENCIA="060"+this.datosConsulta2.REFERENCIA;
        this.datosConsulta2.VALOR_MOVIMIENTO_DET= this.datosConsulta2.VALOR_MOVIMIENTO_DET.replace(/\./g, '')
        
      }
      
    }
    
    else if(CODconvenioConst=="3" && CODconvenioDetConst=="10"){
      this.datosConsulta2.DOCUMENTO_IDENTIDAD = "";
    }

    
    
    this.recaudoService.postConsultarRecaudo(this.datosConsulta2).subscribe(async (data) => {
      this.resultado = data;
      
      const detallecodigo = this.datos.FACTURAS.find(detalle => detalle.CODIGO_REFERENCIA===data.CODIGO_REFERENCIA);
      if(data.COD=="200" && data.CODIGO_REFERENCIA!=detallecodigo?.CODIGO_REFERENCIA && data.CODIGO_CLIENTE!=detallecodigo?.CODIGO_CLIENTE){
          this.detalle.CODIGO_CONVENIO=CODconvenioConst;
          this.detalle.CODIGO_CONVENIO_DET=CODconvenioDetConst;
          this.detalle.CODIGO_CLIENTE=data.CODIGO_CLIENTE;
          this.detalle.CODIGO_REFERENCIA=data.CODIGO_REFERENCIA;
          this.detalle.VALOR_MOVIMIENTO_DET=String(data.VALOR_MOVIMIENTO_DET);
          this.detalle.FECHA_VENCIMIENTO=data.FECHA_VENCIMIENTO;
          this.ciclo=data.CICLO;
          this.propietario=data.PROPIETARIO;
          this.direccion=data.DIRECCION;
          this.detalle.BUSQUEDA_REFERENCIA="S";
          this.datos.VALOR_MOVIMIENTO=String(Number(this.datos.VALOR_MOVIMIENTO)+Number(data.VALOR_MOVIMIENTO_DET));
          this.datos.NUMERO_CUPONES_MOVIMIENTO=String(Number(this.datos.NUMERO_CUPONES_MOVIMIENTO)+1);
          this.detalle2.CODIGO_CONVENIO=CODconvenioConst;
          this.detalle2.CODIGO_CONVENIO_DET=CODconvenioDetConst;
          this.detalle2.CODIGO_CLIENTE=data.CODIGO_CLIENTE;
          this.detalle2.CODIGO_REFERENCIA=data.CODIGO_REFERENCIA;
          this.detalle2.NOMBRE_CONVENIO=NombreConvenio;
          this.detalle2.NOMBRE_CONVENIO_DET=NombreConvenioDet;
  
          this.confirmarList();
          this.datosConsulta2.VALOR_MOVIMIENTO_DET="";
       
      }
      else if(data.COD=="200" && !data.CODIGO_REFERENCIA){
        alertify.error("Error al consultar la factura, verifique la forma en la que se está consultando");
      }
      
      else if(data.COD!="200"){
  
       alertify.error(data.RESPUESTA);
       this.datosConsulta2.VALOR_MOVIMIENTO_DET="";
      }else{
        alertify.error(data.RESPUESTA);
        this.datosConsulta2.VALOR_MOVIMIENTO_DET="";
        alertify.error("La factura ya se encuentra en la lista ");
      }
      await loading.dismiss();
    },async (error) => {
      console.error(error);
      await loading.dismiss();
    });
    this.datosConsulta2.REFERENCIA = "";
    this.detalle.CODIGO_CLIENTE="";
    this.detalle.CODIGO_REFERENCIA="";
    this.detalle.VALOR_MOVIMIENTO_DET="";
  }

  confirmarList(){
    this.confirmar_Lista=true;
    
  }
  

  limpiarCampo() {
    
    this.datosConsulta2.NIT = '';
    this.datosConsulta2.REFERENCIA = '';
  }
  

  onInputChange(event: any) {

    if ( this.mostrarBarra && event.key === 'Enter') {
      this.contadorEnter++;
      if (this.contadorEnter === 2) {
        
        if (this.inputTimer) {
          clearTimeout(this.inputTimer);
        }
    
        this.inputTimer = setTimeout(() => {
          this.consultarRecaudoBarras();
          event.target.value = '';
          this.desagrupar=true;
        }, 100);
        
        this.contadorEnter = 0;
      }
    }else{

      if (this.inputTimer) {
        clearTimeout(this.inputTimer);
      }
  
      this.inputTimer = setTimeout(() => {
        this.consultarRecaudoBarras();
        event.target.value = '';
        this.desagrupar=true;
      }, 100);
    }
   
  }

  onEnterKey2(event: any) {
    event.preventDefault();
    this.consultarRecaudoReferencia();
    this.desagrupar=true;
    this.referencia =true;
    this.visual2=false;
    
  
  }

  onEnterKey3(event: any) {
    event.preventDefault();
    const CODconvenioConst=localStorage.getItem('CODconvenio') || '';
    const CODconvenioDetConst=this.recaudoService.getCodigoConvenioDet() || '';
    const NombreConvenio=localStorage.getItem('NombreConvenio') || '';
    const NombreConvenioDet= localStorage.getItem('NombreConvenioDet')|| '';
    if(CODconvenioConst!=null){
      this.mostrarCamposManuales=true;
      if(this.mostrarDocumento){
        this.detalle.CODIGO_REFERENCIA=this.detalle.CODIGO_REFERENCIA+"-"+this.documento;
      }
    }else if(CODconvenioConst=="2" ){
      this.mostrarSoloBarra=true;
      this.mostrarCamposManuales=false;
    }
    this.detalle.MANUAL="S";
    this.detalle.CODIGO_CONVENIO=CODconvenioConst;
    this.detalle.CODIGO_CONVENIO_DET=CODconvenioDetConst;
    this.detalle.FECHA_VENCIMIENTO = new Date().toISOString();
    this.detalle2.CODIGO_CONVENIO=CODconvenioConst;
    this.detalle2.CODIGO_CONVENIO_DET=CODconvenioDetConst;
    this.detalle2.NOMBRE_CONVENIO=NombreConvenio;
    this.detalle2.NOMBRE_CONVENIO_DET=NombreConvenioDet;
    this.detalle2.CODIGO_CLIENTE = this.detalle.CODIGO_CLIENTE;
    this.detalle2.CODIGO_REFERENCIA=this.detalle.CODIGO_REFERENCIA;
    this.detalle.VALOR_MOVIMIENTO_DET=this.detalle.VALOR_MOVIMIENTO_DET.replace(/\./g, '')
    this.datos.VALOR_MOVIMIENTO=String(Number(this.datos.VALOR_MOVIMIENTO)+Number(this.detalle.VALOR_MOVIMIENTO_DET));
    this.datos.NUMERO_CUPONES_MOVIMIENTO=String(Number(this.datos.NUMERO_CUPONES_MOVIMIENTO)+1);
    this.referencia =true;
    this.visual2=false;

      
      this.agregarDetalle();
      this.setFocus3();
      this.desagrupar=true;
      
   
   
  }

  limpiarYEnviar() {

    // this.datos.VALOR_RECIBIDO=this.datos.VALOR_RECIBIDO.replace(/\./g, '');
    // this.datosMix.VALOR_EFECTIVO=this.datosMix.VALOR_EFECTIVO.replace(/\./g, '')
    // this.datosMix.VALOR_RECIBIDO=this.datosMix.VALOR_RECIBIDO.replace(/\./g, '')
    // this.datosMix.VALOR_TARJETA=this.datosMix.VALOR_TARJETA.replace(/\./g, '')
    // if(this.datos.FORMA_PAGO=="3" || this.datos.FORMA_PAGO=="4" || this.datos.FORMA_PAGO=="5" || this.datos.FORMA_PAGO=="6" || this.datos.FORMA_PAGO=="7"){

    
    //   this.recaudar();
    // }
    // else{
    //   this.confirmacion();
    // }
    
    this.datos.VALOR_RECIBIDO=this.datos.VALOR_RECIBIDO.replace(/\./g, '');
    this.datosMix.VALOR_EFECTIVO=this.datosMix.VALOR_EFECTIVO.replace(/\./g, '')
    this.datosMix.VALOR_RECIBIDO=this.datosMix.VALOR_RECIBIDO.replace(/\./g, '')
    this.datosMix.VALOR_TARJETA=this.datosMix.VALOR_TARJETA.replace(/\./g, '')
      if(this.datos.VALOR_RECIBIDO!=''){
        
        if(Number(this.datos.VALOR_RECIBIDO)>=Number(this.datos.VALOR_MOVIMIENTO)){
          if(this.datos.FORMA_PAGO=="3" || this.datos.FORMA_PAGO=="4" || this.datos.FORMA_PAGO=="5" || this.datos.FORMA_PAGO=="6" || this.datos.FORMA_PAGO=="7"){
      
         
            this.recaudar();
          }
          else{
            this.confirmacion();
          }
        }else{
          alertify.error("VALOR EFECTIVO no puede ser menor que el VALOR DEL MOVIMIENTO")
          this.formatoNumero();
        }
      }
      else if(this.datosMix.VALOR_RECIBIDO!=''){
        if(Number(this.datosMix.VALOR_RECIBIDO)>=Number(this.datosMix.VALOR_MOVIMIENTO)){
          if(this.datos.FORMA_PAGO=="3" || this.datos.FORMA_PAGO=="4" || this.datos.FORMA_PAGO=="5" || this.datos.FORMA_PAGO=="6" || this.datos.FORMA_PAGO=="7"){
      
         
            this.recaudar();
          }
          else{
            this.confirmacion();
          }
        }else{
          alertify.error("VALOR EFECTIVO no puede ser menor que el VALOR DEL MOVIMIENTO")
          this.formatoNumero();
        }
      }
      else{
        alertify.error("VALOR EFECTIVO no puede ser menor que el VALOR DEL MOVIMIENTO")
        this.formatoNumero();
      }
    


  }

  recaudar(){
    this.datos.VALOR_MOVIMIENTO=String(this.datos.VALOR_MOVIMIENTO);
    if (this.lstfacturas.lastIndexOf(',') !== -1) {
      this.lstfacturas = this.lstfacturas.slice(0, -1);
    }
    if(this.datos.FORMA_PAGO=="5" || this.datos.FORMA_PAGO=="7"){
      this.datosMix.FACTURAS=this.datos.FACTURAS;
      this.datosMix.VALOR_MOVIMIENTO=this.datos.VALOR_MOVIMIENTO;
      this.datosMix.NUMERO_CUPONES_MOVIMIENTO=this.datos.NUMERO_CUPONES_MOVIMIENTO;
      if(this.datosMix.VALOR_EFECTIVO!="" && this.datosMix.VALOR_TARJETA!=""){
        if(this.datosMix.NUMERO_DOCUMENTO==""){
          this.datosMix.NUMERO_DOCUMENTO="N/A";
        }
        if(this.Numero_Transaccion==""){
          if(this.datos.FORMA_PAGO=="7"){
            this.datos.NUMERO_TRANSACCION="0"
            this.datosMix.NUMERO_TRANSACCION="0"
            this.Numero_Transaccion="0"
            this.vistaIdTransaccion();
          }else{
            this.recaudoService.postTrasaccionDatafono(this.datosMix)
            .subscribe((respuesta) => {
              this.resultado=respuesta;
              if(this.resultado.COD=='200'){
                alertify.success(this.resultado.RESPUESTA);
                this.Numero_Transaccion=this.resultado.ID_TRANSACCION;
                this.vistaIdTransaccion();
                }
              else  {
                this.formatoNumero();
                alertify.error(this.resultado.RESPUESTA);
              }
            }, (error) => {
              this.formatoNumero();
              console.error(error);
            });
          }

        }
        
      }else{
        alertify.error("El valor recibido no puede estár en blanco");
      }
    }
    else{
      if(this.datos.VALOR_RECIBIDO!=""){
        const valorRecibido=this.datos.VALOR_RECIBIDO.replace(/\./g, '');
        this.datos.VALOR_RECIBIDO=valorRecibido;
        if(this.datos.NUMERO_DOCUMENTO==""){
          this.datos.NUMERO_DOCUMENTO="N/A";
        }
        if(this.Numero_Transaccion==""){
          if(this.datos.FORMA_PAGO=="6"){
            this.datos.FORMA_PAGO="3"
            this.datos.NUMERO_TRANSACCION="0"
            this.datosMix.NUMERO_TRANSACCION="0"
            this.Numero_Transaccion="0"
            this.vistaIdTransaccion();
          }
          else{
            this.recaudoService.postTrasaccionDatafono(this.datos)
            .subscribe((respuesta) => {
              this.resultado=respuesta;
              if(this.resultado.COD=='200'){
                alertify.success(this.resultado.RESPUESTA);
                this.Numero_Transaccion=this.resultado.ID_TRANSACCION;
                this.vistaIdTransaccion();
                }
              else  {
                this.formatoNumero();
                alertify.error(this.resultado.RESPUESTA);
              }
            }, (error) => {
              this.formatoNumero();
              console.error(error);
            });
          }
        }
      }else{
        alertify.error("El valor recibido no puede estár en blanco");
      }
    }
    
  }

  vistaIdTransaccion(){
    this.mostrarID=true;
  }
  

  async recaudarFinal(){
    const loading = await this.loadingController.create({
      spinner: 'crescent', // Puedes cambiar el tipo de spinner ('bubbles', 'dots', 'lines', etc.)
      cssClass: 'custom-spinner' // Clase opcional para personalización
    });

    await loading.present();
    this.confirmar=false;
    this.datos.VALOR_MOVIMIENTO=String(this.datos.VALOR_MOVIMIENTO);
    this.datos.NUMERO_ARQUEO=this.recaudos.NUMERO_ARQUEO;
    this.datosMix.NUMERO_ARQUEO=this.recaudos.NUMERO_ARQUEO;
    this.datos.NUMERO_TRANSACCION=this.Numero_Transaccion;
    if (this.lstfacturas.lastIndexOf(',') !== -1) {
      this.lstfacturas = this.lstfacturas.slice(0, -1);
    }

    
    if(this.datos.FORMA_PAGO=="5" || this.datos.FORMA_PAGO=="7"){
      
      this.datosMix.FACTURAS=this.datos.FACTURAS;
      this.datosMix.VALOR_MOVIMIENTO=this.datos.VALOR_MOVIMIENTO;
      this.datosMix.NUMERO_CUPONES_MOVIMIENTO=this.datos.NUMERO_CUPONES_MOVIMIENTO;
      this.datosMix.NUMERO_TRANSACCION=this.Numero_Transaccion;
      this.datosMix.FORMA_PAGO="5"
      if(this.datosMix.VALOR_EFECTIVO!="" && this.datosMix.VALOR_TARJETA!=""){
        if(this.datosMix.NUMERO_DOCUMENTO==""){
          this.datosMix.NUMERO_DOCUMENTO="N/A";
        }
        this.recaudoService.postRecaudar(this.datosMix)
        .subscribe(async (respuesta) => {
          this.resultado=respuesta;
          if(this.resultado.COD=='200'){
            alertify.success(this.resultado.RESPUESTA);
            this.movimiento=this.resultado.NUMERO_MOVIMIENTO;
            this.vistaImpresion();
            this.formatoNumero();
            this.recaudado=true;
            await loading.dismiss();
            }
          else  {
            alertify.error(this.resultado.RESPUESTA);
            await loading.dismiss();
            this.formatoNumero();
          }
        }, async (error) => {
          this.formatoNumero();
          await loading.dismiss();
          console.error(error);
        });
      }else{
        alertify.error("El valor recibido no puede estár en blanco");
        await loading.dismiss();
      }
    }
    else{
      
      if(this.datos.VALOR_RECIBIDO!=""){
        const valorRecibido=this.datos.VALOR_RECIBIDO.replace(/\./g, '');
        this.datos.VALOR_RECIBIDO=valorRecibido;
        if(this.datos.NUMERO_DOCUMENTO==""){
          this.datos.NUMERO_DOCUMENTO="N/A";
        }
        if(this.datos.FORMA_PAGO=="6"){
          this.datos.FORMA_PAGO="3"
        }
        this.recaudoService.postRecaudar(this.datos)
        .subscribe(async (respuesta) => {
          
          this.resultado=respuesta;
          if(this.resultado.COD=='200'){
            alertify.success(this.resultado.RESPUESTA);
            this.movimiento=this.resultado.NUMERO_MOVIMIENTO;
            this.vistaImpresion();
            this.formatoNumero();
            this.recaudado=true;
            await loading.dismiss();
            }
          else  {
            alertify.error(this.resultado.RESPUESTA);
            this.formatoNumero();
            await loading.dismiss();
          }
        }, async (error) => {
          this.formatoNumero();
          await loading.dismiss();
          console.error(error);
        });
      }else{
        alertify.error("El valor recibido no puede estár en blanco");
        await loading.dismiss();
      }
    }
    
    
  }

  cerrarImp(){
    const iframe = document.querySelector('iframe');
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.window.close();
    }
    this.imprimir = false;
    this.imprimirTikect();
  
  }

  vistaImpresion(){
    this.imprimir=true;
    this.imprimirTikect();
  }

  imprimirTikect(){

    if(this.lstfacturas==""){
      this.lstfacturas="0";
    }
    this.recaudoService.getImpresiónTicket(this.empresa,this.puntoPago,this.arqueo,this.movimiento,this.usuario,this.lstfacturas,this.agrupado,this.token)
    .subscribe(
      (response) => {
        const url = this.recaudoService.url+'api/Recaudo/Impresion_Ticket?EMPRESA='+this.empresa+
                '&CODIGO_PUNTO_PAGO='+this.puntoPago+
                '&NUMERO_ARQUEO='+this.arqueo+
                '&NUMERO_MOVIMIENTO='+this.movimiento+
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

  consultarArqueo(){
    const token = localStorage.getItem('token') || '';
    const puntoPago= localStorage.getItem('puntoPago')|| '';
    const usuario= localStorage.getItem('usuario')|| '';
      this.recaudoService.postConsultarArqueo(this.datos.EMPRESA, usuario, "1", puntoPago, token).subscribe({
        next: data => {
          
          this.recaudos=data;
          if(this.recaudos.COD!='200'){
            
            alertify.error(this.recaudos.RESPUESTA);
            localStorage.setItem('numeroArqueo',this.recaudos.NUMERO_ARQUEO);
            this.arqueo=this.recaudos.NUMERO_ARQUEO;
            this.datosConsulta.NUMERO_ARQUEO=this.recaudos.NUMERO_ARQUEO;
            this.datosConsulta2.NUMERO_ARQUEO=this.recaudos.NUMERO_ARQUEO;
            this.datos.NUMERO_ARQUEO=this.recaudos.NUMERO_ARQUEO;
            this.datosAnulacion.NUMERO_ARQUEO=this.recaudos.NUMERO_ARQUEO;
          }
          else{
            this.arqueo=this.recaudos.NUMERO_ARQUEO;
            this.datosConsulta.NUMERO_ARQUEO=this.recaudos.NUMERO_ARQUEO;
            this.datosConsulta2.NUMERO_ARQUEO=this.recaudos.NUMERO_ARQUEO;
            this.datos.NUMERO_ARQUEO=this.recaudos.NUMERO_ARQUEO;
            this.datosAnulacion.NUMERO_ARQUEO=this.recaudos.NUMERO_ARQUEO;
            localStorage.setItem('numeroArqueo',this.recaudos.NUMERO_ARQUEO);
          }
          this.formaPago();
        },
        error: error => {
          console.error(error);
        }
      });
  }

  Confirmacionlimpiar(){
    if(!this.recaudado){
      this.limpia=true
    }else{
      this.limpiar();
    }
  }

  limpiar(){
    this.limpia=false;
    this.detalle={
      CODIGO_CONVENIO: "0",
      CODIGO_CONVENIO_DET: "0",
      MANUAL: "N",
      BUSQUEDA_REFERENCIA :"N",
      CODIGO_CLIENTE: "",
      CODIGO_REFERENCIA:"",
      VALOR_MOVIMIENTO_DET:"",
      FECHA_VENCIMIENTO:"",
      CODIGO_BARRAS:""
    };
  
    this.detalle2={
      CODIGO_CONVENIO: "",
      NOMBRE_CONVENIO: "",
      CODIGO_CLIENTE: "",
      CODIGO_REFERENCIA:"",
      CODIGO_CONVENIO_DET: "",
      NOMBRE_CONVENIO_DET: ""
    };
    
    this.nombres_convenio= [] as Detalle2[];
    this.facturasInvertidas =[];
  
  
  
    this.datos = {
      EMPRESA: this.empresa,
      NUMERO_ARQUEO: this.arqueo,
      CODIGO_PUNTO_PAGO: this.puntoPago,
      CODIGO_CAJA:this.codigoCaja,
      USUARIO: this.usuario,
      VALOR_MOVIMIENTO:"0",
      NUMERO_CUPONES_MOVIMIENTO:"",
      VALOR_RECIBIDO:"",
      VALOR_CAMBIO: "0",
      FORMA_PAGO:"",
      NUMERO_DOCUMENTO:"N/A",
      COMENTARIO:"",
      FACTURAS: [] as Detalle[],
      NUMERO_TRANSACCION:"",
      TOKEN: this.token
    };
  
    this.datosMix = {
      EMPRESA: this.empresa,
      NUMERO_ARQUEO: this.arqueo,
      CODIGO_PUNTO_PAGO: this.puntoPago,
      CODIGO_CAJA:this.codigoCaja,
      USUARIO: this.usuario,
      VALOR_EFECTIVO:"",
      VALOR_TARJETA:"",
      VALOR_MOVIMIENTO:"0",
      NUMERO_CUPONES_MOVIMIENTO:"",
      VALOR_RECIBIDO:"",
      VALOR_CAMBIO: "0",
      FORMA_PAGO:"",
      NUMERO_DOCUMENTO:"N/A",
      COMENTARIO:"",
      FACTURAS: [] as Detalle[],
      NUMERO_TRANSACCION:"",
      TOKEN: this.token
    };
  
    this.accion=1;
    this.codigo_barras="";
  
    this.datosConsulta = {
      EMPRESA: this.empresa,
      CODIGO_PUNTO_PAGO: this.puntoPago,
      NUMERO_ARQUEO:this.arqueo,
      USUARIO: this.usuario,
      ACCION:"1",
      CODIGO_CONVENIO_DET:"",
      CODIGO_BARRAS:"",
      TOKEN: this.token
    };
    this.datosConsulta2 = {
      EMPRESA: this.empresa,
      CODIGO_PUNTO_PAGO: this.puntoPago,
      NUMERO_ARQUEO:this.arqueo,
      USUARIO: this.usuario,
      ACCION:"2",
      NIT:"",
      CODIGO_CONVENIO:"0",
      CODIGO_CONVENIO_DET:"0",
      REFERENCIA:"",
      TOKEN: this.token
    }
    this.visual1=true;
    this.visual2=false;
    this.visual3=false;
   
    this.Numero_Transaccion="";
    this.ciclo="";
    this.propietario="";
    this.direccion="";
    this.IDtransaccion=false;
    this.agrupado="S";
    this.estadoCheckbox= false;
    this.estadoCheckboxTodo= false;
    this.CheckboxFact =false;
    this.lstfacturas="";
    this.movimiento="";
    this.desagruparSeleccionado=false;
    this.desagrupar=false;
    this.seleccionarTodos=false;
    this.desFormaPago="";
    this.confirmar=false;
    this.redondear=false;
    this.mostrarCampos=false;
    this.referencia=false;
    this.fecha='';
    this.mostrarCamposDoc=false;
    this.confirmar_Lista=false;
    this.resultado=null;
    this.mostrarCamposManuales=false;
    this.mostrarSoloBarra=false;
    this.recaudado=false;
  
  
    this.iframeUrl= "";
  
    this.imprimir=false;
    this.cd.detectChanges();

    this.ngOnInit();
    const mockEvent = { detail: { checked: false } };
    this.barraManual(mockEvent);

  }


}
