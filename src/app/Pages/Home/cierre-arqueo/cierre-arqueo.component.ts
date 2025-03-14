import { Component, HostListener, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { RecaudoService } from 'src/app/services/recaudo.service';
import * as alertify from 'alertifyjs';





interface Detalle {
  CODIGO_MONEDA: string;
  CANTIDAD: string;
  VALOR_UNITARIO: string;
  VALOR: string;
}



@Component({
  selector: 'app-cierre-arqueo',
  templateUrl: './cierre-arqueo.component.html',
  styleUrls: ['./cierre-arqueo.component.scss'],
})


export class CierreArqueoComponent  implements OnInit {

  //#region Variables
  empresa: string|null =localStorage.getItem('empresaCOD') || '';
  arqueo: string|null = localStorage.getItem('numeroArqueo') || '';
  usuario: string|null = localStorage.getItem('usuario') || '';
  codigoCaja: string|null = localStorage.getItem('condigoCaja');
  puntoPago: string|null =localStorage.getItem('puntoPago');
  token: string|null =localStorage.getItem('token');

  cantidad:string|undefined;

  detalle={
    CODIGO_MONEDA:"",
    CANTIDAD:"",
    VALOR_UNITARIO:"",
    VALOR:""
  }
  datos ={
    EMPRESA: this.empresa,
    NUMERO_ARQUEO: this.arqueo,
    USUARIO: this.usuario,
    CODIGO_CAJA: this.codigoCaja,
    CODIGO_PUNTO_PAGO: this.puntoPago,
    NUMERO_CUPONES_REPORTADOS:"",
    VALOR_RECAUDADO_REPORTADO:"",
    BASE: 
    {                                
        VALOR_TOTAL:"",
        COMENTARIO:"",        
        BASE_DET:[] as Detalle[] 
    },
    TOKEN:this.token
  }
  datosCiere={
    EMPRESA:this.empresa,    
    NUMERO_ARQUEO: this.arqueo,
    CODIGO_PUNTO_PAGO: this.puntoPago,
    USUARIO: this.usuario,
    TOKEN: this.token
  }


  recaudos:any;
  resultado: any;
  monedas: any[] = [];
  valorfajo=0;
  mostrarbase:boolean=false;
  valorbaseAnterior=0;
  otraVariable: string = ''; 
  otraVariable2: string = ''; 
  suma_facturas: number = 0 ;
  enviar:boolean=true;

  //#endregion

  constructor(private recaudoService: RecaudoService, private router: Router) { }

  @HostListener('window:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    this.cierreArqueo();
    }
  }
  
  ngOnInit() {
    this.consultarArqueo();
    
  }

  //#region Manejo de monedas
  agregarDetalle() {
    this.mostrarbase=true;
    this.valorbaseAnterior=Number(this.detalle.VALOR);
    const nuevoDetalle: Detalle = { ...this.detalle };

    nuevoDetalle.VALOR_UNITARIO = String(this.valorfajo);

    this.datos.BASE.BASE_DET.push(nuevoDetalle);

    this.detalle = {
      CODIGO_MONEDA: "",
      CANTIDAD: "",
      VALOR_UNITARIO: "",
      VALOR: "",
    };

    this.tipoEntrega({ detail: { value: this.detalle.CODIGO_MONEDA } });
    this.calcularBase();
  }


  eliminarFila(detalle:{ CODIGO_MONEDA: any; CANTIDAD: string; VALOR_UNITARIO:string; VALOR:string}){
    const codigoMoneda = detalle.CODIGO_MONEDA;
    this.datos.BASE.BASE_DET = this.datos.BASE.BASE_DET.filter(detalle => detalle.CODIGO_MONEDA !== codigoMoneda);
    this.infoMonedas(event);
  }

  campoRepetido(campo: string): boolean {
    return this.datos.BASE.BASE_DET.some(item => item.CODIGO_MONEDA === campo);
  }



  formatoNumero() {
    
    let numeroFormateado = this.datos.VALOR_RECAUDADO_REPORTADO.replace(/[^\d]/g, '');
    numeroFormateado = numeroFormateado.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    this.datos.VALOR_RECAUDADO_REPORTADO= numeroFormateado;

    
  }

  //#endregion


  //#region Consultas a API
  tipoEntrega(event: any) {
    this.otraVariable = event.detail.value;
  
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.getTipoEntregas(Number(this.empresa), 3, this.usuario, this.token).subscribe(
        (data: any) => {
          
          this.monedas = data.MONEDAS;
  
          const detalleEspecifico = this.datos.BASE.BASE_DET.find(detalle => detalle.CODIGO_MONEDA === this.otraVariable);
  
          if (detalleEspecifico) {
  
            if (data.MONEDAS && data.MONEDAS.length > 0) {
              const monedaSeleccionada = data.MONEDAS.find((moneda: any) => moneda.CODIGO === this.otraVariable);
  
              if (monedaSeleccionada) {
                detalleEspecifico.VALOR_UNITARIO = String(monedaSeleccionada.VALOR_UNITARIO);
              } else {
                console.error(`No se encontró la moneda con el código ${this.otraVariable}`);
              }
            } else {
              console.error('No se encontraron monedas en la respuesta.');
            }
          } else {
            console.error(`No se encontró el detalle con el código ${this.otraVariable}`);
          }
        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    } else {
      console.error('El valor del tipo de empresa no existe');
    }
  }

  consultarArqueo(){
    const token = localStorage.getItem('token') || '';
    const puntoPago= localStorage.getItem('puntoPago')|| '';
    const usuario= localStorage.getItem('usuario')|| '';
    if (this.empresa) {
      this.recaudoService.postConsultarArqueo(this.empresa, usuario, "1", puntoPago, token).subscribe({
        next: data => {
          
          this.recaudos=data;
          if(this.recaudos.COD!='200'){
            alertify.error(this.recaudos.RESPUESTA);
            this.arqueo="0";
            
          }
          else{
            this.valorCierreArqueo();
            localStorage.setItem('numeroArqueo',this.recaudos.NUMERO_ARQUEO);
            this.arqueo = localStorage.getItem('numeroArqueo');
            localStorage.setItem('numeroMovimiento',this.recaudos.RECAUDOS.NUMERO_MOVIMIENTO);
          }
        },
        error: error => {
          console.error(error);
        }
      });
    }
  }

  valorCierreArqueo(){

    if (this.empresa) {
      this.recaudoService.postValorCierre(this.datosCiere).subscribe({
        next: data => {

          if(data.COD=='200'){
            this.datos.VALOR_RECAUDADO_REPORTADO=data.VALOR_TOTAL_ENTREGAS;
            
          }
          else{
            alertify.error(data.RESPUESTA);
          }
        },
        error: error => {
          console.error(error);
        }
      });
    }
  }

  //#endregion
  

  //#region Manejo de Infomación monedas y calculo
  infoMonedas(event: any)
  {
    this.suma_facturas=0;
    this.otraVariable2=event.detail.value; 
    const detalleEspecifico = this.datos.BASE.BASE_DET;

    
          for (let i=0; i<=detalleEspecifico.length-1; i++)
          {         

              detalleEspecifico[i].VALOR=String(Number(detalleEspecifico[i].VALOR_UNITARIO)*Number(detalleEspecifico[i].CANTIDAD));
              this.suma_facturas += Number(detalleEspecifico[i].VALOR);    
                         
          }     
          
          this.datos.BASE.VALOR_TOTAL= String(this.suma_facturas); 
    }
        
      
    

  calcularBase(){

    this.detalle.VALOR=this.detalle.VALOR.replace(/\./g, '');

    if(Number(this.detalle.VALOR) > 0 ){
      const valortotal=Number(this.detalle.VALOR) + this.valorbaseAnterior;
      this.datos.BASE.VALOR_TOTAL=String(valortotal);
    }
  }
  
  //#endregion


  //#region Limpieza de campos y envio
  limpiarYEnviar() {
    this.enviar=false;
    this.datos.VALOR_RECAUDADO_REPORTADO=this.datos.VALOR_RECAUDADO_REPORTADO.replace(/\./g, '');
    this.datos.VALOR_RECAUDADO_REPORTADO=this.datos.VALOR_RECAUDADO_REPORTADO.replace(/\,/g, '');
    this.datos.BASE.VALOR_TOTAL=this.datos.BASE.VALOR_TOTAL.replace(/\./g, '');
    // this.datos.CORRESPONSAL_1=this.datos.CORRESPONSAL_1.replace(/\./g, '');
    // this.datos.CORRESPONSAL_2=this.datos.CORRESPONSAL_2.replace(/\./g, '');
  
    this.cierreArqueo();
  }

  cierreArqueo(){
    this.datos.NUMERO_ARQUEO=this.recaudos.NUMERO_ARQUEO;
    this.recaudoService.postCierreArqueo(this.datos)
    .subscribe((respuesta) =>{
      this.resultado = respuesta;
      
      if(this.resultado.COD=='200'){
        alertify.success(this.resultado.RESPUESTA);
        localStorage.removeItem('numeroArqueo');

        this.detalle={
          CODIGO_MONEDA:"",
          CANTIDAD:"",
          VALOR_UNITARIO:"",
          VALOR:""
        }
        this.datos ={
          EMPRESA: this.empresa,
          NUMERO_ARQUEO: this.arqueo,
          USUARIO: this.usuario,
          CODIGO_CAJA: this.codigoCaja,
          CODIGO_PUNTO_PAGO: this.puntoPago,
          NUMERO_CUPONES_REPORTADOS:"",
          VALOR_RECAUDADO_REPORTADO:"",
          BASE: 
          {                                
              VALOR_TOTAL:"",
              COMENTARIO:"",        
              BASE_DET:[] as Detalle[] 
          },
          TOKEN:this.token
        }
        this.mostrarbase=false;
        this.enviar=true;
        }
      else  {
        this.formatoNumero()
        alertify.error(this.resultado.RESPUESTA);
        this.enviar=true;
      }
    },(error) => {
      this.formatoNumero();
      this.enviar=true;
      console.error(error);
    }
    
    )
  }
  //#endregion

}
