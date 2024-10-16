import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecaudoService } from 'src/app/services/recaudo.service';

@Component({
  selector: 'app-informacion-punto-pago',
  templateUrl: './informacion-punto-pago.component.html',
  styleUrls: ['./informacion-punto-pago.component.scss'],
})
export class InformacionPuntoPagoComponent  implements OnInit {

  empresa: string|null = localStorage.getItem('empresaCOD');
  codigo_punto_pago: string|null= localStorage.getItem('puntoPago');
  usuario: string|null = localStorage.getItem('usuario');
  token: string|null = localStorage.getItem('token');
  

  
  resultado: any [] = [];

  constructor(private recaudoService: RecaudoService, private router: Router) { }

  ngOnInit() {
    this.informacionPuntoPago();
  }
  
  informacionPuntoPago(){
    if (this.empresa !== null && this.codigo_punto_pago!== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.getInformacionPuntoPago(Number(this.empresa),Number(this.codigo_punto_pago),this.usuario,this.token).subscribe(
        (data: any) => {
          
          this.resultado = [data];
        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    }

  }

}
