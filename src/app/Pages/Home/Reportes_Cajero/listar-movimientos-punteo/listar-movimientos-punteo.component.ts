import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecaudoService } from 'src/app/services/recaudo.service';
import { ChangeDetectorRef } from '@angular/core';
import * as alertify from 'alertifyjs';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-listar-movimientos-punteo',
  templateUrl: './listar-movimientos-punteo.component.html',
  styleUrls: ['./listar-movimientos-punteo.component.scss'],
})
export class ListarMovimientosPunteoComponent  implements OnInit {

  empresa: string|null =localStorage.getItem('empresaCOD');
  arqueo: string|null = localStorage.getItem('numeroArqueo');
  usuario: string|null = localStorage.getItem('usuario');
  codigoCaja: string|null = localStorage.getItem('condigoCaja');
  puntoPago: string|null =localStorage.getItem('puntoPago');
  token: string|null =localStorage.getItem('token');


  datosConsulta = {
    EMPRESA: this.empresa,
    ACCION:"1",
    USUARIO: this.usuario,
    NUMERO_ARQUEO:this.arqueo,
    CODIGO_BARRAS:"",
    CODIGO_CLIENTE:"",
    TOKEN: this.token
  };

  datosConsulta2 = {
    EMPRESA: this.empresa,
    ACCION:"2",
    USUARIO: this.usuario,
    NUMERO_ARQUEO:this.arqueo,
    CODIGO_BARRAS:"",
    CODIGO_CLIENTE:"",
    TOKEN: this.token
  };
  modificar: any;
  restablece: any;
  visual:boolean=false;
  listadoConvenios:any []=[];
  resultado: any[] = [];
  resultado2: any[] = [];
  searchTerm: string = '';
  filteredList: any[] = [];
  conveniosSeleccionados: any[] = [];

  
  constructor(private recaudoService: RecaudoService, private router: Router, private cdRef: ChangeDetectorRef, private modalController: ModalController) { }

  ngOnInit() {
    this.listarMovimientos();
    this.filterLista();
    this.visual=false;
  }

  listarMovimientos(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null && this.arqueo !== null) {
      this.recaudoService.getListarMovimientosPunteo(Number(this.empresa),this.usuario,this.token,this.arqueo).subscribe(
        (data: any) => {
          
          if(data.COD=="200"){
            this.resultado=data.FACTURAS_PENDIENTES;
            this.resultado2=data.FACTURAS_VALIDADAS;
  
            const codigosConvenio = new Set();
            this.listadoConvenios = this.resultado.filter((factura: any) => {
              if (!codigosConvenio.has(factura.CODIGO_CONVENIO)) {
                codigosConvenio.add(factura.CODIGO_CONVENIO);
                return true;
              }
              return false;
            }).map((factura: any) => {
              return {
                CODIGO_CONVENIO: factura.CODIGO_CONVENIO,
                NOMBRE_CONVENIO: factura.NOMBRE_CONVENIO
              };
            });
  
            
            this.conveniosSeleccionados = this.listadoConvenios.map((factura: any) => factura.CODIGO_CONVENIO);
            this.filteredList = this.resultado;
          }else{
            alertify.warning("No hay facturas por puntear")
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

  updateSelectedConvenios() {
    // Opcionalmente, podrías realizar acciones adicionales aquí si es necesario
    
  }
  
  // Filtra los datos de resultado en función de los convenios seleccionados
  getFilteredResultados() {
    if (this.conveniosSeleccionados.length === 0) {
      return this.resultado;
    }
  
    return this.resultado.filter((factura: any) =>
      this.conveniosSeleccionados.includes(factura.CODIGO_CONVENIO)
    );
  }

  limpiarCampo() {
    this.datosConsulta.CODIGO_BARRAS = '';
    this.datosConsulta2.CODIGO_CLIENTE = '';
  }


  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      // Lógica que deseas ejecutar al presionar Enter en esta página
      this.onEnterKey(event);
    }
  }
  
  onEnterKey(event: any) {
    event.preventDefault(); // Evita la acción predeterminada del formulario (recarga de la página)
    if(this.datosConsulta.CODIGO_BARRAS==""){
      this.modificarMovimientoPunteoReferencia();
    }else{
      this.modificarMovimientoPunteoBarras();
    }
    
  }

  // onEnterKey2(event: any) {
  //   event.preventDefault(); // Evita la acción predeterminada del formulario (recarga de la página)
  //   this.modificarMovimientoPunteoReferencia();
    
  // }

  buscarReferencia() {
    this.visual=!this.visual;
  }

  ListarConvenios(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.getListarConvenios(Number(this.empresa),this.usuario,this.token).subscribe(
        (data: any) => {
          
          this.listadoConvenios= data.CONVENIOS_ACTIVOS;

        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    }

  }
  

  toggleConvenio(codigoConvenio: string, event: any) {
    if (event.detail.checked) {
      this.conveniosSeleccionados.push(codigoConvenio);
    } else {
      this.conveniosSeleccionados = this.conveniosSeleccionados.filter(codigo => codigo !== codigoConvenio);
    }
    this.filterLista();
  }
  
  filterLista() {
    this.filteredList = this.resultado.filter(item =>
      this.conveniosSeleccionados.includes(item.CODIGO_CONVENIO)
    );
  }

  modificarMovimientoPunteoBarras(){
    
    this.recaudoService.postModificarMovimiento(this.datosConsulta).subscribe((data) => {
      this.modificar = data;
    if(data.COD=="200"){
        
      
      this.listarMovimientos();
      this.limpiarCampo();
    }
    else if(data.COD!="200")
    { 
      alertify.error(data.RESPUESTA);
      
      this.limpiarCampo();
    }

      //this.router.navigate(['/listar-movimientos-punteo']);
    }, );

  }

  MostrarMas(respuesta: any) {
    respuesta.selected = !respuesta.selected;
  }
  

  modificarMovimientoPunteoReferencia(){
    
    this.recaudoService.postModificarMovimiento(this.datosConsulta2).subscribe((data) => {
      this.modificar = data;
      if(data.COD=="200"){
        
        
        this.listarMovimientos();
        this.limpiarCampo();
      }
      else
      { 
        alertify.error(data.RESPUESTA);
        
        this.limpiarCampo();
      }
    }, );

  }

  restablecer(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null && this.arqueo !== null) {
      this.recaudoService.getReestablecerMovimientosPunteo(Number(this.empresa),this.usuario,this.token,this.arqueo).subscribe(
        (data: any) => {
          
          this.restablece=data;
          this.listarMovimientos();
          //this.router.navigate(['/listar-movimientos-punteo']);
        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    } 
    else {
    
      console.error('El valor del tipo de empresa no existe');
    }

  }
  

}
