import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecaudoService } from 'src/app/services/recaudo.service';
import * as alertify from 'alertifyjs';
import { LoadingController } from '@ionic/angular';

interface convenioDet {

  EMPRESA: string;
  NOMBRE_EMPRESA: string;
  CODIGO_CONVENIO: string;
  NOMBRE_CONVENIO: string;
  NIT: string;
  CONVENIO_DET: any[];
}
interface ConvenioDet1 {
  CODIGO_CONVENIO_DET: string;
  NOMBRE_CONVENIO_DET: string;
}

interface Detalle{
  ASOBANCARIA: string;
  CODIGO_CONVENIO: string;
  CODIGO_CONVENIO_DET: string;          
  TIPO_ASOBANCARIA: string;
  CORREO_ASOBANCARIA: string;
  EXCEL: string;
  TIPO_PAGO: string;
  PAGOS_ASOBANCARIA:string;
}
interface Detalle2{
  CODIGO_CONVENIO: string;
  CODIGO_CONVENIO_DET: string;         
  NOMBRE:string;
  NOMBRE_DET:string;
  ASOBANCARIA:string;
  TIPO_PAGO: string;
}


@Component({
  selector: 'app-asobancaria',
  templateUrl: './asobancaria.component.html',
  styleUrls: ['./asobancaria.component.scss'],
})
export class AsobancariaComponent  implements OnInit {

  //#region Variables
  empresa: string|null =localStorage.getItem('empresaCOD');
  arqueo: string|null = localStorage.getItem('numeroArqueo');
  usuario: string|null = localStorage.getItem('usuario');
  codigoCaja: string|null = localStorage.getItem('condigoCaja');
  puntoPago: string|null =localStorage.getItem('puntoPago');
  token: string|null =localStorage.getItem('token');

  listadoAsobancaria:any;
  listadoConveniosDet:any[]=[];
  listadoPuntosPago: any[] = [];
  generadosConvenio:any[]=[];
  
  puntosSeleccionados: string[] = [];
  puntos:string=""
  convenios:any[]=[];
  nombre_convenios= [] as Detalle2[];
  checkboxEstado: { [key: string]: boolean } = {};

  listadoConvenios={
    ASOBANCARIA:"",
    CODIGO_CONVENIO: "",
    CODIGO_CONVENIO_DET: "",            
    TIPO_ASOBANCARIA: "",
    CORREO_ASOBANCARIA: "",
    EXCEL:"",
    TIPO_PAGO:"",
    PAGOS_ASOBANCARIA:""
  };

  listadoConveniosNom={
    CODIGO_CONVENIO: "",
    CODIGO_CONVENIO_DET: "",     
    NOMBRE:"",
    NOMBRE_DET:"",
    ASOBANCARIA:"",
    TIPO_PAGO: ""
  };

  asobancaria={
    EMPRESA:this.empresa,
    FECHA_ASOBANCARIA:"",
    LISTADO_CONVENIOS: [] as Detalle[],
    USUARIO:this.usuario,
    PUNTOS_PAGO:this.puntos,
    TOKEN:this.token
  };

  asobancariaGenerado=this.asobancaria;
  generado:boolean=false;
  respuesta:any;
  //seleccion:boolean=false;
  seleccionarTodos:boolean=false;
  //#endregion

  constructor(private recaudoService: RecaudoService, private router: Router,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.listarAsobancaria();
    this.obtenerPuntosPago();
  }

  ngAfterViewInit() {
    const tablaLista = document.getElementById('tablaLista');

    if (tablaLista) {
      tablaLista.addEventListener('scroll', () => {
        if (tablaLista.scrollHeight > tablaLista.clientHeight) {
          tablaLista.style.width = 'calc(100% + 5px)'; // Ajusta el ancho para acomodar la barra de desplazamiento
        } else {
          tablaLista.style.width = '100%'; // Restaura el ancho original si no hay desplazamiento
        }
      });
    }
  }

  //#region Consultas iniciales

imprimirSeleccion() {
  console.log('Seleccionados:', this.puntosSeleccionados);
  // Si quieres imprimir los nombres también:
  const seleccionNombres = this.listadoPuntosPago
    .filter(p => this.puntosSeleccionados.includes(p.CODIGO))
    .map(p => p.NOMBRE);

  console.log('Nombres seleccionados:', seleccionNombres);
}
  listarAsobancaria() {

    if (this.empresa !== null && this.usuario !== null && this.token !== null && this.puntoPago!==null) {
      
      this.recaudoService.getListarAsobancaria(Number(this.empresa), this.puntoPago, this.usuario, this.token).subscribe(
        (data: any) => {
          
          this.listadoAsobancaria = data;
          this.convenios=this.obtenerConvenio();

        
        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    } else {
      console.error('El valor del tipo de empresa no existe');
    }
  }

  obtenerPuntosPago() {
    var empresa: string|null =localStorage.getItem('empresaCOD');

    this.recaudoService.getListPuntosPago(Number(empresa)).subscribe({
      next: data => {
        this.listadoPuntosPago = data.PUNTOS_PAGO;
        this.puntosSeleccionados = this.listadoPuntosPago.map(p => p.CODIGO); 
      },
      error: error => {
        console.error(error);
      }
    });
  }

  obtenerConvenio(): any[] {

    const convenioKeys = Object.keys(this.listadoAsobancaria);
  const convenios = convenioKeys
    .filter(key => key.startsWith('CONVENIO'))
    .map(convenioKey => {
      const convenio = this.listadoAsobancaria[convenioKey];
      const convenioDet = convenio.CONVENIO_DET || [];

      return {
        value: convenio.CODIGO_CONVENIO,
        label: convenio.NOMBRE_CONVENIO,
        convenioDet: convenioDet.map((det: ConvenioDet1) => ({
          value: det.CODIGO_CONVENIO_DET,
          label: det.NOMBRE_CONVENIO_DET
        }))
      };
    });

  return convenios;
  }
  //#endregion

  //#region Seleccion de convenios y parametros
  seleccionarTodo(event:{ detail: { checked: any; }; } ){
    if (event.detail.checked) {
      this.seleccionarTodos = event.detail.checked;
      
      for (const detalle of this.convenios) {
        for(const detalleFin of detalle.convenioDet){
          
          if(detalle.value!='1'){

            this.obtenerDetalleConvenio({ detail: { checked: this.seleccionarTodos } }, detalle,detalleFin,'');
          }
        }
      }
    }else {
      this.listadoConveniosDet = [];
      this.asobancaria.LISTADO_CONVENIOS = [];
      this.listadoConveniosNom=
          {CODIGO_CONVENIO: "",
          CODIGO_CONVENIO_DET: "",     
          NOMBRE:"",
          NOMBRE_DET:"",
          ASOBANCARIA:"",
          TIPO_PAGO: ""};
      this.nombre_convenios=[];
      this.seleccionarTodos = event.detail.checked;
 
    }
  }


  obtenerDetalleConvenio(event: { detail: { checked: any; }; }, convenio: { value: any; label:any;}, convenioDet: { value: any; label:any;}, forma_pago:string) {
    
    
    const convenioSelect=convenio.value;
    if (event.detail.checked) {
      this.listadoConvenios.CODIGO_CONVENIO=convenioSelect;
      this.listadoConvenios.TIPO_PAGO=forma_pago;
      this.convenios.forEach(c => c.isSelected = (c === convenio));
    } else {
      this.listadoConvenios.CODIGO_CONVENIO="";
      //this.asobancaria.LISTADO_CONVENIOS = [];
      this.listadoConveniosNom=
          {CODIGO_CONVENIO: "",
          CODIGO_CONVENIO_DET: "",     
          NOMBRE:"",
          NOMBRE_DET:"",
          ASOBANCARIA:"",
          TIPO_PAGO: ""};
      
      const codigoCliente = convenioDet.value;
      this.nombre_convenios = this.nombre_convenios.filter(detalle => detalle.CODIGO_CONVENIO_DET!== codigoCliente);
      
      
    }
    if (this.listadoConvenios.CODIGO_CONVENIO) {
  
      const convenioSeleccionado = Object.values(this.listadoAsobancaria).find(punto => (punto as convenioDet).CODIGO_CONVENIO === this.listadoConvenios.CODIGO_CONVENIO);
      this.listadoConveniosDet = convenioSeleccionado ? (convenioSeleccionado as convenioDet).CONVENIO_DET || [] : [];

      this.listadoConveniosNom={
        CODIGO_CONVENIO:convenio.value,
        CODIGO_CONVENIO_DET: convenioDet.value,     
        NOMBRE:convenio.label,
        NOMBRE_DET:convenioDet.label,
        ASOBANCARIA:"",
        TIPO_PAGO: forma_pago,
        
      };
      
      const nuevoDetalle: Detalle = { ...this.listadoConvenios };

      
      this.asobancaria.LISTADO_CONVENIOS.push(nuevoDetalle);
      this.guardarConvenioDet(convenioDet, nuevoDetalle);
     
    
      this.listadoConvenios = {
        ASOBANCARIA:"",
        CODIGO_CONVENIO: "",
        CODIGO_CONVENIO_DET: "",            
        TIPO_ASOBANCARIA: "",
        CORREO_ASOBANCARIA: "",
        EXCEL:"",
        TIPO_PAGO:"",
        PAGOS_ASOBANCARIA:"",
      };
    } else {
      this.listadoConveniosDet = [];
      const codigoCliente = convenioDet.value;
      this.asobancaria.LISTADO_CONVENIOS = this.asobancaria.LISTADO_CONVENIOS.filter(detalle => detalle.CODIGO_CONVENIO_DET!== codigoCliente);
    }
    
  }



  guardarConvenioDet(convenioDet: { value: any; label:any;} ,detalle: Detalle){
    const convenioSelect=convenioDet.value;
      const nuevoDetalle: Detalle = { ...this.listadoConvenios, CODIGO_CONVENIO_DET: convenioSelect };

    if (this.asobancaria.LISTADO_CONVENIOS.length > 0) {
      const ultimoDetalle = this.asobancaria.LISTADO_CONVENIOS[this.asobancaria.LISTADO_CONVENIOS.length - 1];
      ultimoDetalle.CODIGO_CONVENIO_DET = convenioSelect;
    }

    const detalleConvenio = this.listadoConveniosDet.find(det => det.CODIGO_CONVENIO_DET === convenioSelect);
    const detalleConvenioForma = this.listadoConveniosDet.find(det => det.FORMA_PAGO === convenioSelect);
    if (detalleConvenio) {
        detalle.TIPO_ASOBANCARIA = detalleConvenio.TIPO_ASOBANCARIA;
        this.listadoConveniosNom.ASOBANCARIA=detalleConvenio.NOMBRE_ASOBANCARIA;
        detalle.CORREO_ASOBANCARIA = detalleConvenio.CORREO_ASOBANCARIA;
        detalle.EXCEL = detalleConvenio.EXCEL;
        detalle.ASOBANCARIA = detalleConvenio.ASOBANCARIA;
        detalle.PAGOS_ASOBANCARIA =detalleConvenio.PAGOS_ASOBANCARIA
        const nuevoDetalle2: Detalle2 = { ...this.listadoConveniosNom };
        this.nombre_convenios.push(nuevoDetalle2);
    }    
  } 

  fecha(event:any){
    this.asobancaria.FECHA_ASOBANCARIA = formatDate(event.detail.value, 'dd/MM/yyyy', 'en-US');
  }
  //#endregion

  //#region Generación de asobancaria
  async generarAsobancaria(){
    const loading = await this.loadingController.create({
      message: 'Generando Asobancaria...',
      spinner: 'crescent',
      cssClass: 'custom-loading'
    });

    await loading.present();
    
    this.asobancaria.PUNTOS_PAGO = this.puntosSeleccionados.join(',');
    this.recaudoService.postGenerarAsobancaria(this.asobancaria).subscribe({
      next: async data => {
        
        
        this.respuesta = data;
        if(this.respuesta.COD=='200'){
          alertify.success(this.respuesta.RESPUESTA);
          this.generado=true;

          this.asobancariaGenerado=this.asobancaria;

          this.generadosConvenio=this.asobancaria.LISTADO_CONVENIOS;
          //this.seleccion=false;
          }
        else  {
          alertify.error(this.respuesta.RESPUESTA);

        }
        await loading.dismiss();
        
  
      },
      error: async error => {
        console.error("Respuesta:",error);
        await loading.dismiss();
      }
    });
    
  }
  //#endregion
  
}

