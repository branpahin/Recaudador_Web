import { Component, OnInit } from '@angular/core';
import { RecaudoService } from 'src/app/services/recaudo.service';
import * as alertify from 'alertifyjs';
import { interval, takeUntil, takeWhile } from 'rxjs';

@Component({
  selector: 'app-sincronizador',
  templateUrl: './sincronizador.component.html',
  styleUrls: ['./sincronizador.component.scss'],
})
export class SincronizadorComponent  implements OnInit {
  empresa: string|null = localStorage.getItem('empresaCOD');
  usuario: string|null = localStorage.getItem('usuario');
  token: string|null = localStorage.getItem('token');

  archivoSeleccionado: string | undefined;

  listadoConveniosSincro:any[]=[];
  lstConvenios="";
  estadoSincro="";
  conveniosSincronizando="";
  resultado:any;
  pagosAgrupados:any[]=[];
  respuesta1:any;
  arrayFormaPago:string[]=[];
  codigosSincronizados:string[]=[];;

  valorSincronizacion: boolean = false;

  datosModificarEstado={
    EMPRESA:this.empresa,    
    CODIGOS_CONVENIOS:"",
    ESTADO:"",
    USUARIO:this.usuario,
    TOKEN: this.token
  }

  datos={
    EMPRESA:this.empresa,    
    CODIGOS_CONVENIOS:"",
    USUARIO:this.usuario,
    TOKEN: this.token
  }


  constructor(private recaudoService: RecaudoService) { 
    this.recaudoService.sincronizacionCambio.subscribe((valor: boolean) => {
      this.valorSincronizacion = valor;
    });
  }

  ngOnInit() {
    this.ListarEstadoSincro();
    this.ListarConveniosSincro();
    this.PagosAgrupadosSincro();
      interval(3000)
      .pipe(
        takeWhile(() => !this.valorSincronizacion),
        
      )
      .subscribe(() => {
        this.PagosAgrupadosSincro();
        this.ListarEstadoSincro();
      });

    
  }

  ListarConveniosSincro(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.getLisadoConveniosSincronizador(Number(this.empresa),this.usuario,this.token).subscribe(
        (data: any) => {
          console.log('Respuesta del servicio:', data);
          this.listadoConveniosSincro= data.CONVENIOS_SINCRONIZADOR;
        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    }

  }

  ListarEstadoSincro(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.getEstadoSincronizador(Number(this.empresa),this.usuario,this.token).subscribe(
        (data: any) => {
          this.estadoSincro= data.ESTADO;
          if(this.estadoSincro=='ACTIVO'){
            this.conveniosSincronizando=data.CODIGOS_CONVENIOS;
          }else{
            this.conveniosSincronizando="";
          }

        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    }

  }
  

  updateSelectedClientes(event: { detail: { checked: any; }; }, pagos: { CODIGO_CONVENIO: any; }) {
    const codigo = pagos.CODIGO_CONVENIO;
    if(codigo!=""){
      if (event.detail.checked) {
        if (!this.lstConvenios.includes(codigo)) {
          this.lstConvenios += codigo + ",";
          
        }
      } else {
        this.lstConvenios = this.lstConvenios.replace(new RegExp(codigo + ",", 'g'), "");
        
      }
    }
  }

  ConvenioSincronizado(codigo: string): boolean {
    const codigosSincronizados = this.conveniosSincronizando.split(',');
    if(this.conveniosSincronizando!=null && this.conveniosSincronizando!=""){
      this.lstConvenios=this.conveniosSincronizando;
    }
    return codigosSincronizados.includes(codigo);


  }


  ModificarEstadoSincro(estado:string){

    if (this.lstConvenios.endsWith(',')) {
      this.lstConvenios = this.lstConvenios.slice(0, -1);
    }
    this.datosModificarEstado.CODIGOS_CONVENIOS=this.lstConvenios;
    this.datosModificarEstado.ESTADO=estado;
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.postModificarEstadoSincronizador(this.datosModificarEstado).subscribe(
        (data: any) => {
          console.log('Respuesta del servicio:', data);
          this.resultado= data;
          if(this.resultado.COD=="200"){
            alertify.success(this.resultado.RESPUESTA);
            this.lstConvenios="";
            this.conveniosSincronizando="";
            this.datosModificarEstado={
              EMPRESA:this.empresa,    
              CODIGOS_CONVENIOS:"",
              ESTADO:"",
              USUARIO:this.usuario,
              TOKEN: this.token
            };
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
      this.datosModificarEstado={
        EMPRESA:this.empresa,    
        CODIGOS_CONVENIOS:"",
        ESTADO:"",
        USUARIO:this.usuario,
        TOKEN: this.token
      };
      
    }
  }


  PagosAgrupadosSincro(){
    const convenios = this.listadoConveniosSincro;

    this.datos.CODIGOS_CONVENIOS = convenios.map(convenio => convenio.CODIGO_CONVENIO).join(',');

    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.postPagosAgrupadosSincro(this.datos).subscribe(
        (data: any) => {
          this.resultado= data;
          if(this.resultado.COD=="200"){

            this.pagosAgrupados=data.LISTADO_PAGOS_AGRUPADOS;
          }
          else {
            this.respuesta1=data.RESPUESTA;
            this.pagosAgrupados=[];
          }
          
        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
          alertify.error(error);
        }
      );
      this.datosModificarEstado={
        EMPRESA:this.empresa,    
        CODIGOS_CONVENIOS:"",
        ESTADO:"",
        USUARIO:this.usuario,
        TOKEN: this.token
      };
    }
  }

}
