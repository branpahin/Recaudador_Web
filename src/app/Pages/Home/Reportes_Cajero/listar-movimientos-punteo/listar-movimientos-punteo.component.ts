import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecaudoService } from 'src/app/services/recaudo.service';
import { ChangeDetectorRef } from '@angular/core';
import * as alertify from 'alertifyjs';

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
  resultado: any[] = [];
  resultado2: any[] = [];

  
  constructor(private recaudoService: RecaudoService, private router: Router, private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.listarMovimientos();
    this.visual=false;
  }

  

  listarMovimientos(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null && this.arqueo !== null) {
      this.recaudoService.getListarMovimientosPunteo(Number(this.empresa),this.usuario,this.token,this.arqueo).subscribe(
        (data: any) => {
          console.log(data);
          this.resultado=data.FACTURAS_PENDIENTES;
          this.resultado2=data.FACTURAS_VALIDADAS;
        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    } else {
    
      console.error('El valor del tipo de empresa no existe');
    }

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
    this.visual=true;
  }

  modificarMovimientoPunteoBarras(){
    
    this.recaudoService.postModificarMovimiento(this.datosConsulta).subscribe((data) => {
      this.modificar = data;
    if(data.COD=="200"){
        
      console.log(data);
      this.listarMovimientos();
      this.limpiarCampo();
    }
    else if(data.COD!="200")
    { 
      alertify.error(data.RESPUESTA);
      console.log("respuesta: ",data.RESPUESTA);
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
        
        console.log(data);
        this.listarMovimientos();
        this.limpiarCampo();
      }
      else
      { 
        alertify.error(data.RESPUESTA);
        console.log("respuesta: ",data.RESPUESTA);
        this.limpiarCampo();
      }
    }, );

  }

  restablecer(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null && this.arqueo !== null) {
      this.recaudoService.getReestablecerMovimientosPunteo(Number(this.empresa),this.usuario,this.token,this.arqueo).subscribe(
        (data: any) => {
          console.log(data);
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
