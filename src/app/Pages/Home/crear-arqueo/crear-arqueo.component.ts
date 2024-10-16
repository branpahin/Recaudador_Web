import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecaudoService } from 'src/app/services/recaudo.service';
import { Crear_Arqueo} from 'src/models/usuario.model';
import * as alertify from 'alertifyjs';

@Component({
  selector: 'app-crear-arqueo',
  templateUrl: './crear-arqueo.component.html',
  styleUrls: ['./crear-arqueo.component.scss'],
})
export class CrearArqueoComponent  implements OnInit {

  empresa: string|null =localStorage.getItem('empresaCOD');
  nombreEmpresa: string|null=localStorage.getItem('empresa');
  usuario: string|null =localStorage.getItem('usuario');
  puntoPago: string|null =localStorage.getItem('puntoPago');
  nombrePuntoPago: string|null =localStorage.getItem('nombrePuntoPago');
  token: string|null = localStorage.getItem('token');
  caja: string|null=localStorage.getItem('condigoCaja');



  crear_arqueo:Crear_Arqueo ={
    EMPRESA: "",
    CODIGO_CAJA: "",
    CODIGO_PUNTO_PAGO: '',
    USUARIO: '',
    USUARIO_VALIDA:'RECAUDADOR'
  };

  resultado: any;
  resultadoCaja: any [] = [];


  constructor(private recaudoService: RecaudoService, private router: Router) { }

  @HostListener('window:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    this.crearArqueo();
    }
  }

  ngOnInit() {}
  
  crearArqueo(){
    if (this.empresa !== null && this.usuario!== null && this.token!== null && this.puntoPago!==null && this.caja!==null) {
      if(this.caja=="No tiene caja asignada"){
        alertify.error("No se puede crear arqueo, No tiene caja asignada");
      }else{
        this.recaudoService.postCrearArqueo(this.empresa, this.caja, this.puntoPago, this.usuario, this.token).subscribe({
          next: data => {
            this.resultado = data;
  
            if(this.resultado.COD=='200'){
              alertify
              .success(this.resultado.RESPUESTA, () => {
              })
              .setting({
                closeOnClick: true,
              });
              localStorage.setItem('numeroArqueo',this.resultado.NUMERO_ARQUEO);
              }
            else  {
              alertify.error(this.resultado.RESPUESTA, () => {
              })
              .setting({
                closeOnClick: true,
              });;
            }
            
  
          },
          error: error => {
            console.error(error);
          }
        });
      }
      
    }
  }

  CajasPuntoDePago(){
    if (this.empresa !== null && this.puntoPago!== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.getCajasPuntoPago(Number(this.empresa),Number(this.puntoPago), this.usuario,this.token).subscribe(
        (data: any) => {
          
          this.resultadoCaja = data.CAJAS;
        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    }

  }

}

