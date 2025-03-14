import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecaudoService } from 'src/app/services/recaudo.service';
import * as alertify from 'alertifyjs';
import { formatDate } from '@angular/common';
import { DatetimeChangeEventDetail } from '@ionic/angular';

interface Datos{
  EMPRESA: string;
  CODIGO_PUNTO_PAGO?: string; 
  NOMBRE: string;
  USUARIO: string | null;
  DIRECCION: string;
  HORARIO: string;
  CONVENIO_DET_BLOQUEADO: string;
  ESTADO: string;
  TIPO: string;
  FORMA_PAGO: string;
  HORA_MAXIMA_RECAUDO: string;
  ENCARGADO: string;
  TOKEN: string | null;
  
}

interface DatosSupPunto{
  EMPRESA: any;
  NOMBRE_SUB_PUNTO_PAGO: string;
  DESCRIPCION?:string;
  USUARIO:any;
  TOKEN:any;
}

@Component({
  selector: 'app-listado-puntos-pago',
  templateUrl: './listado-puntos-pago.component.html',
  styleUrls: ['./listado-puntos-pago.component.scss'],
})
export class ListadoPuntosPagoComponent  implements OnInit {

  //#region Variables

  empresa: string|null = localStorage.getItem('empresaCOD');
  usuario: string|null = localStorage.getItem('usuario');
  token: string|null = localStorage.getItem('token');


  customPickerOptions: any;

  listadoPuntos: any []=[];
  listadoSubPuntosPago:any []=[];
  listadoEstadoPuntos: any []=[];
  listadoTipoPuntosPago: any []=[];
  UsuariosEncargado:any[]=[];
  resultado:any;
  listEmpresas: any[] = [];
  pago: any[] = [];
  arrayFormaPago: string[] = [];
  listadoConveniosActivos: any [] = [];
  listadoConvenios: any [] = [];
  seleccionConvenios: { [convenioId: string]: string[] } = {};
  convenioSelec="";
  puntoPago="1";
  horaMax="";
  inicio="";
  fin="";
  horaInicio="";
  horaFin="";
  lstFormaPago="";
  filteredList: any[] = [];
  searchTerm: string = '';
  accion:string="2";

  datos: Datos={
    EMPRESA:"",
    NOMBRE:"",
    USUARIO:this.usuario,
    DIRECCION:"",
    HORARIO:"",
    CONVENIO_DET_BLOQUEADO:"",
    ESTADO:"",
    TIPO:"",
    FORMA_PAGO:"",
    HORA_MAXIMA_RECAUDO:"",
    ENCARGADO:"",
    TOKEN:this.token
  };

  datosSubPuntos:DatosSupPunto={
    EMPRESA: this.empresa,
    NOMBRE_SUB_PUNTO_PAGO: "",
    DESCRIPCION:"",
    USUARIO:this.usuario,
    TOKEN:this.token
  }

  crear:boolean=false;
  crearSubpunto:boolean=false;
  editar:boolean=false;
  subPunto:boolean=false;
  modificaFormaPago:boolean=false;
  modificarHoraMax:boolean=false;
  modificarHoraIni:boolean=false;
  modificarHoraFin:boolean=false;

  //#endregion

  constructor(private recaudoService: RecaudoService, private router: Router) { }

  ngOnInit() {
    this.crear=false;
    this.crearSubpunto=false;
    this.editar=false;
    this.subPunto=false;
    this.modificaFormaPago=false;
    this.modificarHoraMax=false;
    this.modificarHoraIni=false;
    this.modificarHoraFin=false;
    this.ListarPuntosPago();
    this.ListarConvenios();
    this.horaInicio="";
    this.horaFin="";
    this.horaMax="";
  }

  ionViewWillEnter() {
    this.ListarPuntosPago();
    this.filterList();
  }

  //#region Filtrado y formatos

  filterList() {
    if (!this.searchTerm.trim()) {
      this.filteredList = this.listadoPuntos;
    } else {
      this.filteredList = this.listadoPuntos.filter(item =>
        item.NOMBRE_EMPRESA.toLowerCase().includes(this.searchTerm.toLowerCase())
        || item.NOMBRE.toLowerCase().includes(this.searchTerm.toLowerCase())
        || item.NOMBRE_ESTADO.toLowerCase().includes(this.searchTerm.toLowerCase())
        || item.ENCARGADO.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  clearSearch() {
    this.filteredList = this.listadoPuntos;
  }

  Hora(event: CustomEvent<DatetimeChangeEventDetail>): Date {
    const hora: string = (event.detail.value as string) || '';

    const fechaActual = new Date();

    const [horaStr, minutosStr] = hora.split(':');
    const horaNum = parseInt(horaStr, 10);
    const minutosNum = parseInt(minutosStr, 10);

    fechaActual.setHours(horaNum);
    fechaActual.setMinutes(minutosNum);

    if(this.editar){
      this.modificarHoraMax=true;
   
      this.horaMax = formatDate(fechaActual, 'HH:mm', 'en-US');
    }else{
      this.modificarHoraMax=false;
   
      this.horaMax = formatDate(hora, 'HH:mm', 'en-US');
    }

    return fechaActual;

  }
  HoraIni(event: CustomEvent<DatetimeChangeEventDetail>): Date {

    const hora: string = (event.detail.value as string) || '';

    const fechaActual = new Date();

    const [horaStr, minutosStr] = hora.split(':');
    const horaNum = parseInt(horaStr, 10);
    const minutosNum = parseInt(minutosStr, 10);

    fechaActual.setHours(horaNum);
    fechaActual.setMinutes(minutosNum);

    if(this.editar){
      this.modificarHoraIni=true;
   
      this.horaInicio = formatDate(fechaActual, 'hh:mm a', 'en-US');
    }else{
      this.modificarHoraIni=false;
   
      this.horaInicio = formatDate(hora, 'hh:mm a', 'en-US');
    }
   

    return fechaActual;

  }

  HoraFin(event: CustomEvent<DatetimeChangeEventDetail>): Date {
    const hora: string = (event.detail.value as string) || '';

    const fechaActual = new Date();

    const [horaStr, minutosStr] = hora.split(':');
    const horaNum = parseInt(horaStr, 10);
    const minutosNum = parseInt(minutosStr, 10);

    fechaActual.setHours(horaNum);
    fechaActual.setMinutes(minutosNum);

    if(this.editar){
      this.modificarHoraFin=true;
   
      this.horaFin = formatDate(fechaActual, 'hh:mm a', 'en-US');
    }else{
      this.modificarHoraFin=false;
   
      this.horaFin = formatDate(hora, 'hh:mm a', 'en-US');
    }
    console.log("datos fecha: ",this.datos)

    return fechaActual;
 
  }

  //#endregion

  //#region Consulta a API

  Crear(){

    this.editar=false;
    this.convenioSelec="";
    this.listadoPuntos=[];
    this.listadoEstadoPuntos=[];
    this.listadoTipoPuntosPago=[];
    this.UsuariosEncargado=[];
    this.listEmpresas= [];
    this.pago= [];
    this.arrayFormaPago= [];
    this.puntoPago="1";
    this.horaMax="";
    this.inicio="";
    this.fin="";
    this.horaInicio="";
    this.horaFin="";
    this.lstFormaPago="";

    this.datos ={
      EMPRESA:"",
      NOMBRE:"",
      USUARIO:this.usuario,
      DIRECCION:"",
      HORARIO:"",
      CONVENIO_DET_BLOQUEADO:"",
      ESTADO:"",
      TIPO:"",
      FORMA_PAGO:"",
      HORA_MAXIMA_RECAUDO:"",
      ENCARGADO:"",
      TOKEN:this.token
    };

    this.datosSubPuntos={
      EMPRESA: this.empresa,
      NOMBRE_SUB_PUNTO_PAGO: "",
      DESCRIPCION:"",
      USUARIO:this.usuario,
      TOKEN:this.token
    }

    if(!this.subPunto){
      this.crear=true;
      this.ListarPuntosPago();
      this.formaPago();
      this.ListarTipoPuntoPago();
      this.ListarUsuariosEncargado();
      this.ListarEstadosPuntosPago();
      this.obtenerEmpresas();
    }else{
      this.crear=false;
      this.crearSubpunto=true;
    }

  
  }

  cerrarTabla(){
    this.crear=false;
    this.ListarPuntosPago();
  }

  Punto(){
    this.subPunto=!this.subPunto;
    this.ListarSubPuntosPago();
  }

  ListarPuntosPago(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.getListarPuntosPagoAdmin(Number(this.empresa),this.usuario,this.token).subscribe(
        (data: any) => {
          this.listadoPuntos= data.PUNTOS_PAGO;
          this.filteredList = this.listadoPuntos;
        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    }

  }

  ListarSubPuntosPago(){
    
    this.crearSubpunto=false;
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.getListadoSubPuntosPago(Number(this.empresa),this.usuario,this.token).subscribe(
        (data: any) => {
          this.listadoSubPuntosPago= data.SUB_PUNTOS_PAGO;
        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    }

  }

  formaPago(){
    if (this.empresa !== null && this.puntoPago !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.getFormaPago(Number(this.empresa),Number(this.puntoPago), this.accion, this.usuario, this.token).subscribe(
        (data: any) => {
          this.pago = data.FORMAS_PAGO;
        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    }

  }

  ListarTipoPuntoPago(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.getListarTipoPuntoPago(Number(this.empresa),this.usuario,this.token).subscribe(
        (data: any) => {
          this.listadoTipoPuntosPago= data.TIPOS_PUNTO_PAGO;
        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    }

  }

  ListarUsuariosEncargado(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {

      this.recaudoService.getListarUsuariosEncargado(Number(this.empresa),this.usuario,this.token).subscribe(
        (data: any) => {
          this.UsuariosEncargado= data.USUARIOS_ENCARGADOS;
        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    }

  }

  ListarEstadosPuntosPago(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.getListarEstadosPuntoPago(Number(this.empresa),this.usuario,this.token).subscribe(
        (data: any) => {
          this.listadoEstadoPuntos= data.ESTADOS_PUNTO_PAGO;
        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    }

  }

  ListarConvenios(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.getListarConvenios(Number(this.empresa),this.usuario,this.token).subscribe(
        (data: any) => {
          this.listadoConveniosActivos= data.CONVENIOS_ACTIVOS;
          this.ListarFacturasConvenio();

        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    }

  }

  ListarFacturasConvenio(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.getListarFacturasConvenio(Number(this.empresa),this.usuario,this.token).subscribe(
        (data: any) => {
            this.listadoConvenios= data.LISTADO_FACTURAS_ACTIVAS;

        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    }

  }

  obtenerEmpresas(){

    this.recaudoService.getListEmpresas().subscribe(
      (data: any) => {
        this.listEmpresas = data.EMPRESAS; 
        
      },
      (error) => {
        console.error('Error al obtener empresas:', error);
      }
    );
   
  }

  //#endregion

  //#region Envio a API

  updateSelectedClientes(event: { detail: { checked: any; }; }, pagos: { CODIGO: any; }) {
    this.modificaFormaPago=true;
    const codigo = pagos.CODIGO;
    if(this.editar!=true){
      if (event.detail.checked) {
        if (!this.lstFormaPago.includes(codigo)) {
          this.lstFormaPago += codigo + ";";
        }
      } else {
        this.lstFormaPago = this.lstFormaPago.replace(new RegExp(codigo + ";", 'g'), "");
      }
    }else{
      const isChecked = this.arrayFormaPago.includes(codigo.toString());

      if (event.detail.checked) {
        if (!isChecked) {
          this.arrayFormaPago.push(codigo.toString());
        }
      } else {
        const index = this.arrayFormaPago.indexOf(codigo.toString());
        if (index !== -1) {
          this.arrayFormaPago.splice(index, 1);
        }
      }

      this.lstFormaPago = this.arrayFormaPago.join(';');
    }
  }

  updateSelectedConvenio(event: any, convenioDet: any) {
    const codigoConvenioDet = convenioDet.CODIGO_CONVENIO_DET;
    const conveniosBloqueados = this.datos.CONVENIO_DET_BLOQUEADO.split(';').filter(det => det !== '');

    if (event.detail.checked) {
      if (!conveniosBloqueados.includes(codigoConvenioDet)) {
        this.datos.CONVENIO_DET_BLOQUEADO += codigoConvenioDet + ';';
      }
    } else {
      this.datos.CONVENIO_DET_BLOQUEADO = conveniosBloqueados.filter(det => det !== codigoConvenioDet).join(';') + ';';
    }
  }
  
  isConvenioSelected(codigoConvenioDet: string): boolean {
    return this.datos.CONVENIO_DET_BLOQUEADO.includes(codigoConvenioDet);
  }

  CrearPuntoPago(){
    this.datos.HORA_MAXIMA_RECAUDO=this.horaMax;
    this.datos.FORMA_PAGO=this.lstFormaPago;
    this.datos.HORARIO=this.inicio+" - "+this.fin+" "+this.horaInicio+" a "+this.horaFin;
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.postCrearPuntoPago(this.datos).subscribe(
        (data: any) => {
          this.resultado= data;
          if(this.resultado.COD=="200"){
            alertify.success(this.resultado.RESPUESTA);
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
      this.datos={
        EMPRESA:"",
        NOMBRE:"",
        USUARIO:this.usuario,
        DIRECCION:"",
        HORARIO:"",
        CONVENIO_DET_BLOQUEADO:"",
        ESTADO:"",
        TIPO:"",
        FORMA_PAGO:"",
        HORA_MAXIMA_RECAUDO:"",
        ENCARGADO:"",
        TOKEN:this.token
      };
    }
  }

  Editar(respuesta1: {

    EMPRESA:any,
    NOMBRE:any,
    CODIGO_PUNTO_PAGO:any;
    DIRECCION:any,
    HORARIO:any,
    CONVENIO_DET_BLOQUEADO:any,
    ESTADO:any,
    TIPO:any,
    FORMAS_PAGO:any,
    HORA_MAXIMA_RECAUDO:any,
    ENCARGADO:any, }){
      
      this.arrayFormaPago=[];
      this.datos={
        EMPRESA:respuesta1.EMPRESA,
        CODIGO_PUNTO_PAGO: respuesta1.CODIGO_PUNTO_PAGO,
        NOMBRE:respuesta1.NOMBRE,
        USUARIO:this.usuario,
        DIRECCION:respuesta1.DIRECCION,
        HORARIO:respuesta1.HORARIO,
        CONVENIO_DET_BLOQUEADO:respuesta1.CONVENIO_DET_BLOQUEADO,
        ESTADO:respuesta1.ESTADO,
        TIPO:respuesta1.TIPO,
        FORMA_PAGO:respuesta1.FORMAS_PAGO,
        HORA_MAXIMA_RECAUDO:respuesta1.HORA_MAXIMA_RECAUDO,
        ENCARGADO:respuesta1.ENCARGADO,
        TOKEN:this.token
      };
      
     


      this.crear=true;
      this.editar=true;
      const horario = this.datos.HORARIO;
    const regex = /([a-zA-Záéíóúüñ]+) - ([a-zA-Záéíóúüñ]+) (\d{2}:\d{2} [apm.AMP]+) a (\d{1,2}:\d{2} [apm.AMP]+)/;
    const matches = horario.match(regex);

    if (matches) {
      const inicio = matches[1];
      const fin = matches[2];
      const horaIni = matches[3];
      const horaFin = matches[4];
      this.inicio=inicio;
      this.fin=fin; 
      const partesHora = horaIni.split(":");
      const horas = parseInt(partesHora[0], 10);
      const minutos = parseInt(partesHora[1], 10);
      const esPM = horaIni.toLowerCase().includes("pm");
      let horas24 = horas;
      if (esPM && horas < 12) {
        horas24 += 12;
      } else if (!esPM && horas === 12) {
        horas24 = 0;
      }
      const hora24Formato = `${horas24.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
      this.horaInicio = hora24Formato;
      


      const partesHora1 = horaFin.split(":");
      const horas1 = parseInt(partesHora1[0], 10);
      const minutos1 = parseInt(partesHora1[1], 10);
      const esPM1 = horaFin.toLowerCase().includes("pm");
      let horas241 = horas1;
      if (esPM1 && horas1 < 12) {
        horas241 += 12;
      } else if (!esPM1 && horas1 === 12) {
        horas241 = 0;
      }
      const hora24Formato1 = `${horas241.toString().padStart(2, '0')}:${minutos1.toString().padStart(2, '0')}`;
      this.horaFin=hora24Formato1;
      
     



      this.datos.HORARIO=this.inicio+" - "+this.fin+" "+this.horaInicio+" a "+this.horaFin;
    } else {
    }
    let cadenaFormaPago: string = this.datos.FORMA_PAGO || '';
      
    let numerosSeparados: string[] = cadenaFormaPago.split(';');
    
    numerosSeparados.forEach((numero: string) => {
      if (numero.trim() !== '') {
        this.arrayFormaPago.push(numero.trim());
      }
    });
    console.log("datos: ",this.datos)
      this.ListarPuntosPago();
      this.formaPago();
      this.ListarTipoPuntoPago();
      this.ListarUsuariosEncargado();
      this.ListarEstadosPuntosPago();
      this.obtenerEmpresas();
  }

  
  crearSubPunto(){
    this.recaudoService.postCrearSubPuntoPago(this.datosSubPuntos).subscribe({
      next: data => {
        this.resultado = data;
        if(this.resultado.COD=='200'){
          alertify.success(this.resultado.RESPUESTA);
          this.datosSubPuntos={
            EMPRESA: this.empresa,
            NOMBRE_SUB_PUNTO_PAGO: "",
            DESCRIPCION:"",
            USUARIO:this.usuario,
            TOKEN:this.token
          }
          this.ListarSubPuntosPago();
          }
        else  {
          alertify.error(this.resultado.RESPUESTA);
        }

      },
      error: error => {
        console.error("Respuesta:",error);
      }
    });
    
  }

  Eliminar(respuesta1:any){
    this.datosSubPuntos={
      EMPRESA: this.empresa,
      NOMBRE_SUB_PUNTO_PAGO: respuesta1.VALOR,
      USUARIO:this.usuario,
      TOKEN:this.token
    }

    this.recaudoService.postEliminarSubPuntoPago(this.datosSubPuntos).subscribe({
      next: data => {
        this.resultado = data;
        if(this.resultado.COD=='200'){
          alertify.success(this.resultado.RESPUESTA);
          this.datosSubPuntos={
            EMPRESA: this.empresa,
            NOMBRE_SUB_PUNTO_PAGO: "",
            DESCRIPCION:"",
            USUARIO:this.usuario,
            TOKEN:this.token
          }
          this.ListarSubPuntosPago();
          }
        else  {
          alertify.error(this.resultado.RESPUESTA);
        }

      },
      error: error => {
        console.error("Respuesta:",error);
      }
    });
  }


  MostrarMas(respuesta: any) {
    respuesta.selected = !respuesta.selected;
  }

  ModificarPuntoPago(){

    if(this.lstFormaPago!=this.datos.FORMA_PAGO){
      this.lstFormaPago=this.lstFormaPago+";";
    }

    if(this.modificarHoraMax){
      this.datos.HORA_MAXIMA_RECAUDO=this.horaMax;
    }

    if(this.modificaFormaPago){
      this.datos.FORMA_PAGO=this.lstFormaPago;
    }
    console.log("modigicar: ", this.datos)
    if(!this.modificarHoraIni){
      const hora: string = (this.horaInicio) || '';

      const fechaActual = new Date();
  
      const [horaStr, minutosStr] = hora.split(':');
      const horaNum = parseInt(horaStr, 10);
      const minutosNum = parseInt(minutosStr, 10);
  
      fechaActual.setHours(horaNum);
      fechaActual.setMinutes(minutosNum);
  
      this.horaInicio = formatDate(fechaActual, 'hh:mm a', 'en-US');
    }

    if(!this.modificarHoraFin){
      const hora1: string = (this.horaFin) || '';

      const fechaActual1 = new Date();
  
      const [horaStr1, minutosStr1] = hora1.split(':');
      const horaNum1 = parseInt(horaStr1, 10);
      const minutosNum1 = parseInt(minutosStr1, 10);
  
      fechaActual1.setHours(horaNum1);
      fechaActual1.setMinutes(minutosNum1);
      this.horaFin = formatDate(fechaActual1, 'hh:mm a', 'en-US');
    }

    this.datos.HORARIO=this.inicio+" - "+this.fin+" "+this.horaInicio+" a "+this.horaFin;
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      
      this.recaudoService.postModificarPuntoPago(this.datos).subscribe(
        (data: any) => {
          this.resultado= data;
          if(this.resultado.COD=="200"){
            alertify.success(this.resultado.RESPUESTA);
            this.editar=false;
            this.crear=false;
            this.datos={
              EMPRESA:"",
              NOMBRE:"",
              USUARIO:this.usuario,
              DIRECCION:"",
              HORARIO:"",
              CONVENIO_DET_BLOQUEADO:"",
              ESTADO:"",
              TIPO:"",
              FORMA_PAGO:"",
              HORA_MAXIMA_RECAUDO:"",
              ENCARGADO:"",
              TOKEN:this.token
            };
            this.convenioSelec="";
            this.ngOnInit();
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
