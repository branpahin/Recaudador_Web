import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecaudoService } from 'src/app/services/recaudo.service';
import * as alertify from 'alertifyjs';




interface Detalle {
  CODIGO_MONEDA: string;
  CANTIDAD: string;
  VALOR_UNITARIO: string;
  VALOR: string;
  TIPO: string;
}
@Component({
  selector: 'app-entrega-arqueo',
  templateUrl: './entrega-arqueo.component.html',
  styleUrls: ['./entrega-arqueo.component.scss'],
})

export class EntregaArqueoComponent  implements OnInit {

  empresa: string|null =localStorage.getItem('empresaCOD');
  arqueo: string|null = localStorage.getItem('numeroArqueo');
  usuario: string|null = localStorage.getItem('usuario');
  codigoCaja: string|null = localStorage.getItem('condigoCaja');
  puntoPago: string|null =localStorage.getItem('puntoPago');
  token: string|null =localStorage.getItem('token');

 
  valorfajo = 0;
  cantidad:string|undefined;

  detalle={
    CODIGO_MONEDA: "",
    CANTIDAD: "",
    VALOR_UNITARIO: "",
    VALOR: "",
    TIPO:""
  };

  detalleDatafono={
    CODIGO_MONEDA: "",
    CANTIDAD: "",
    VALOR_UNITARIO: "",
    VALOR: "",
    TIPO:""
  };


  datos = {
    ACCION: "",
    EMPRESA: this.empresa,
    NUMERO_ARQUEO: this.arqueo,
    USUARIO: this.usuario,
    CODIGO_CAJA: this.codigoCaja,
    CODIGO_PUNTO_PAGO: this.puntoPago,
    VALOR_TOTAL: "",
    COMENTARIO: "",
    ENTREGAS_DET: [] as Detalle[],
    TOKEN: this.token
  };

  datos2 = {
    ACCION: "3",
    EMPRESA: this.empresa,
    NUMERO_ARQUEO: this.arqueo,
    USUARIO: this.usuario,
    CODIGO_CAJA: this.codigoCaja,
    CODIGO_PUNTO_PAGO: this.puntoPago,
    VALOR_TOTAL: "",
    PRESTAMOS_EEP:"",
    VALOR_CHEQUES:"",
    DATAFONO_EEP:"",
    DATAFONO_AGUAS:"",
    DATAFONO_MUNICIPIO:"",
    CORRESPONSAL_1:"",
    CORRESPONSAL_2:"",
    COMENTARIO: "",
    ENTREGAS_DET: [] as Detalle[],
    TOKEN: this.token
  };
  resultado: any;
  otraVariable: string = ''; 
  otraVariable2: string = ''; 
  mostrartabla:boolean=false;
  enviar:boolean=true;
  suma_facturas: number = 0 ;
  totalDetalles=0
  totalDetallesFal=0;
 
  monedas: any[] = [];
  datafono: any[] = [];

  constructor(private recaudoService: RecaudoService, private router: Router) { }

  @HostListener('window:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent) {
  if (event.key === 'Enter') {
      this.limpiarYEnviar();
    }
  }

  ngOnInit() {
   
  }
  

  agregarDetalle() {
    this.mostrartabla=true

    
    const nuevoDetalle: Detalle = { ...this.detalle };

    nuevoDetalle.VALOR_UNITARIO = String(this.valorfajo);
    this.datos.ENTREGAS_DET.push(nuevoDetalle);
    console.log("datos: ",this.datos.ENTREGAS_DET)

    this.detalle = {
      CODIGO_MONEDA: "",
      CANTIDAD: "",
      VALOR_UNITARIO: "",
      VALOR: "",
      TIPO: ""
    };
    this.tipoEntrega({ detail: { value: this.detalle.CODIGO_MONEDA } });

  }

  eliminarFila(detalle:{ CODIGO_MONEDA: any; TIPO: string; CANTIDAD:string; VALOR_UNITARIO:string; VALOR:string}){
    const codigoMoneda = detalle.CODIGO_MONEDA;
    this.datos.ENTREGAS_DET = this.datos.ENTREGAS_DET.filter(detalle => detalle.CODIGO_MONEDA !== codigoMoneda);
    console.log("valorrr:",detalle.VALOR)
    this.totalDetallesFal=this.totalDetallesFal+Number(detalle.VALOR);
    
  }

  campoRepetido(campo: string): boolean {
    let deshabilitar;
    if(this.datos.ACCION=='1'){
      deshabilitar= this.datos.ENTREGAS_DET.some(item => item.CODIGO_MONEDA === campo);
    }else{
      let contador: { [key: string]: number } = {};
      deshabilitar=false;
      for(let moneda of this.datos.ENTREGAS_DET){
        if (contador[moneda.CODIGO_MONEDA]) {
          contador[moneda.CODIGO_MONEDA]++;
          if(contador[moneda.CODIGO_MONEDA] === 2){
            deshabilitar=  this.datos.ENTREGAS_DET.some(item => item.CODIGO_MONEDA === campo);
          }else{
            deshabilitar=false;
          }
        } else {
          contador[moneda.CODIGO_MONEDA] = 1;
        }
      }
    }
   return deshabilitar
  }

  calcular(){
    if(this.detalle.TIPO=="FAJO")
    {
      this.datos.ENTREGAS_DET.forEach(detalle => {
        detalle.VALOR = String((this.valorfajo * 100) * Number(this.cantidad)); 
      });
    }
    else if(this.detalle.TIPO=="REMANENTE"){
      this.datos.ENTREGAS_DET.forEach(detalle => {
        detalle.VALOR = String((this.valorfajo) * Number(this.cantidad)); 
      });
    }


  }
  tipoEntregaDatafono() {

    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      
      this.recaudoService.getTipoEntregas(Number(this.empresa), Number(this.datos.ACCION), this.usuario, this.token).subscribe(
        (data: any) => {
          this.datafono = data.MONEDAS;
          this.tipoEntrega({ detail: { value: this.detalle.CODIGO_MONEDA } });
        
        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    } else {
      console.error('El valor del tipo de empresa no existe');
    }
  }

  tipoEntrega(event: any) {
    
    
    this.otraVariable = event.detail.value;
    
  
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.getTipoEntregas(Number(this.empresa), Number(this.datos.ACCION), this.usuario, this.token).subscribe(
        (data: any) => {
          this.monedas = data.MONEDAS;
  
          const detalleEspecifico = this.datos.ENTREGAS_DET.find(detalle => detalle.CODIGO_MONEDA === this.otraVariable && detalle.TIPO==="");
          const detalleEspecifico2 = this.datos.ENTREGAS_DET.find(detalle => detalle.CODIGO_MONEDA === this.otraVariable && detalle.TIPO!="");
          if (detalleEspecifico) {
  
            if (data.MONEDAS && data.MONEDAS.length > 0) {
              const monedaSeleccionada = data.MONEDAS.find((moneda: any) => moneda.CODIGO === this.otraVariable);
  
              if (monedaSeleccionada) {
                detalleEspecifico.VALOR_UNITARIO = String(monedaSeleccionada.VALOR_UNITARIO);
                if(Number(detalleEspecifico.CODIGO_MONEDA)<=5 || detalleEspecifico.TIPO=="REMANENTE"){
                  detalleEspecifico.VALOR=String(Number(detalleEspecifico.VALOR_UNITARIO)*Number(detalleEspecifico.CANTIDAD))
                  this.totalDetalles+=Number(detalleEspecifico.VALOR);
                  this.totalDetallesFal=Number(this.datos.VALOR_TOTAL.replace(/\./g, ''))-this.totalDetalles;
                }else{
                  detalleEspecifico.VALOR=String((Number(detalleEspecifico.VALOR_UNITARIO)*100)*Number(detalleEspecifico.CANTIDAD))
                  this.totalDetalles+=Number(detalleEspecifico.VALOR);
                  this.totalDetallesFal=Number(this.datos.VALOR_TOTAL.replace(/\./g, ''))-this.totalDetalles;
                }
                
              } else {
                console.error(`No se encontró la moneda con el código ${this.otraVariable}`);
              }
            } else {
              console.error('No se encontraron monedas en la respuesta.');
            }
          } 
          else if (detalleEspecifico2) {
  
            if (data.MONEDAS && data.MONEDAS.length > 0) {
              const monedaSeleccionada = data.MONEDAS.find((moneda: any) => moneda.CODIGO === this.otraVariable);
  
              if (monedaSeleccionada) {
                detalleEspecifico2.VALOR_UNITARIO = String(monedaSeleccionada.VALOR_UNITARIO);
                if(Number(detalleEspecifico2.CODIGO_MONEDA)<=5 || detalleEspecifico2.TIPO=="REMANENTE"){
                  detalleEspecifico2.VALOR=String(Number(detalleEspecifico2.VALOR_UNITARIO)*Number(detalleEspecifico2.CANTIDAD))
                  this.totalDetalles+=Number(detalleEspecifico2.VALOR);
                  this.totalDetallesFal=Number(this.datos.VALOR_TOTAL.replace(/\./g, ''))-this.totalDetalles;
                }else{
                  detalleEspecifico2.VALOR=String((Number(detalleEspecifico2.VALOR_UNITARIO)*100)*Number(detalleEspecifico2.CANTIDAD))
                  this.totalDetalles+=Number(detalleEspecifico2.VALOR);
                  this.totalDetallesFal=Number(this.datos.VALOR_TOTAL.replace(/\./g, ''))-this.totalDetalles;
                }
                
              } else {
                console.error(`No se encontró la moneda con el código ${this.otraVariable}`);
              }
            } else {
              console.error('No se encontraron monedas en la respuesta.');
            }
          } 
          else {
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




  infoMonedas(event: any)
  {
    this.suma_facturas=0;
    this.otraVariable2=event.detail.value; 
    const detalleEspecifico = this.datos.ENTREGAS_DET;


      for (let i=0; i<=detalleEspecifico.length-1; i++)
      {         

        if(Number(detalleEspecifico[i].CODIGO_MONEDA)<=5 || detalleEspecifico[i].TIPO=="REMANENTE"){
          detalleEspecifico[i].VALOR=String(Number(detalleEspecifico[i].VALOR_UNITARIO)*Number(detalleEspecifico[i].CANTIDAD));
          this.suma_facturas = this.suma_facturas+Number(detalleEspecifico[i].VALOR);    
          this.totalDetallesFal=Number(this.datos.VALOR_TOTAL.replace(/\./g, ''))-this.suma_facturas;

        }else{
          detalleEspecifico[i].VALOR=String((Number(detalleEspecifico[i].VALOR_UNITARIO)*100)*Number(detalleEspecifico[i].CANTIDAD));
          this.suma_facturas = this.suma_facturas+Number(detalleEspecifico[i].VALOR);     
          this.totalDetallesFal=Number(this.datos.VALOR_TOTAL.replace(/\./g, ''))-this.suma_facturas;

        }                         
      }     
           
    }





  formatoNumero() {
    
    let numeroFormateado = this.datos.VALOR_TOTAL.replace(/[^\d]/g, '');
    numeroFormateado = numeroFormateado.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    this.datos.VALOR_TOTAL= numeroFormateado;
   

    
  }

  formatNumberInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    let inputValue = inputElement.value.trim();
  
    const isNegative = inputValue.startsWith('-');
    if (isNegative) {
      inputValue = inputValue.substring(1);
    }
  
    inputValue = inputValue.replace(/\D/g, '');
  
    inputValue = inputValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
    if (isNegative) {
      inputValue = '-' + inputValue;
    }
  
    this.datos2.PRESTAMOS_EEP = inputValue;
  
  }


  
  limpiarYEnviar() {
    this.enviar=false;
    this.datos.VALOR_TOTAL=this.datos.VALOR_TOTAL.replace(/\./g, '');
    this.datos2.DATAFONO_AGUAS=this.datos2.DATAFONO_AGUAS.replace(/\./g, '');
    this.datos2.DATAFONO_EEP=this.datos2.DATAFONO_EEP.replace(/\./g, '');
    this.datos2.DATAFONO_MUNICIPIO=this.datos2.DATAFONO_MUNICIPIO.replace(/\./g, '');
    this.datos2.PRESTAMOS_EEP=this.datos2.PRESTAMOS_EEP.replace(/\./g, '');
    this.datos2.VALOR_CHEQUES=this.datos2.VALOR_CHEQUES.replace(/\./g, '');
    
    
    console.log("Cheque2: ",this.datos2.VALOR_CHEQUES)
    
    console.log("Enviado2: ",this.datos2)
    this.entregaArqueo();
  }


  entregaArqueo(){
    
    if(this.datos.ACCION=="3"){
      this.datos2.VALOR_TOTAL=this.datos.VALOR_TOTAL;
      this.datos2.ENTREGAS_DET=this.datos.ENTREGAS_DET;
      
      this.recaudoService.postEntregaArqueo(this.datos2)
      .subscribe((respuesta) => {
       
        this.resultado=respuesta;
        console.log(respuesta);
        if(this.resultado.COD=='200'){
          alertify.success(this.resultado.RESPUESTA);
          this.mostrartabla=false;
          this.datos2 = {
            ACCION: "",
            EMPRESA: this.empresa,
            NUMERO_ARQUEO: this.arqueo,
            USUARIO: this.usuario,
            CODIGO_CAJA: this.codigoCaja,
            CODIGO_PUNTO_PAGO: this.puntoPago,
            VALOR_TOTAL: "",
            PRESTAMOS_EEP:"",
            VALOR_CHEQUES:"",
            DATAFONO_EEP:"",
            DATAFONO_AGUAS:"",
            DATAFONO_MUNICIPIO:"",
            CORRESPONSAL_1:"",
            CORRESPONSAL_2:"",
            COMENTARIO: "",
            ENTREGAS_DET: [] as Detalle[],
            TOKEN: this.token
          };
          this.datos = {
            ACCION: "",
            EMPRESA: this.empresa,
            NUMERO_ARQUEO: this.arqueo,
            USUARIO: this.usuario,
            CODIGO_CAJA: this.codigoCaja,
            CODIGO_PUNTO_PAGO: this.puntoPago,
            VALOR_TOTAL: "",
            COMENTARIO: "",
            ENTREGAS_DET: [] as Detalle[],
            TOKEN: this.token
          };
          this.enviar=true;
          this.mostrartabla=false;
        }
        else  {
          console.log(this.datos2);
          this.formatoNumero();
          alertify.error(this.resultado.RESPUESTA);
          this.enviar=true;
        }
      }, (error) => {
        this.formatoNumero();
        console.error(error);
        this.enviar=true;
      });
    }else{
      this.recaudoService.postEntregaArqueo(this.datos)
      .subscribe((respuesta) => {
        console.log("Enviado: ",this.datos);
        this.resultado=respuesta;
        console.log(respuesta);
        if(this.resultado.COD=='200'){
          alertify.success(this.resultado.RESPUESTA);
          this.mostrartabla=false;
          this.datos = {
            ACCION: "",
            EMPRESA: this.empresa,
            NUMERO_ARQUEO: this.arqueo,
            USUARIO: this.usuario,
            CODIGO_CAJA: this.codigoCaja,
            CODIGO_PUNTO_PAGO: this.puntoPago,
            VALOR_TOTAL: "",
            COMENTARIO: "",
            ENTREGAS_DET: [] as Detalle[],
            TOKEN: this.token
          };
          this.datos2 = {
            ACCION: "",
            EMPRESA: this.empresa,
            NUMERO_ARQUEO: this.arqueo,
            USUARIO: this.usuario,
            CODIGO_CAJA: this.codigoCaja,
            CODIGO_PUNTO_PAGO: this.puntoPago,
            VALOR_TOTAL: "",
            PRESTAMOS_EEP:"",
            VALOR_CHEQUES:"",
            DATAFONO_EEP:"",
            DATAFONO_AGUAS:"",
            DATAFONO_MUNICIPIO:"",
            CORRESPONSAL_1:"",
            CORRESPONSAL_2:"",
            COMENTARIO: "",
            ENTREGAS_DET: [] as Detalle[],
            TOKEN: this.token
          };
          this.enviar=true;
          this.mostrartabla=false;
          }
        else  {
          this.formatoNumero();
          console.log(this.datos);
          alertify.error(this.resultado.RESPUESTA);
          this.enviar=true;
        }
      }, (error) => {
        this.formatoNumero();
        console.error(error);
        this.enviar=true;
      });
    }
    
  }

}
