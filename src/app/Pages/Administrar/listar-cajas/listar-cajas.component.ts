import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecaudoService } from 'src/app/services/recaudo.service';

@Component({
  selector: 'app-listar-cajas',
  templateUrl: './listar-cajas.component.html',
  styleUrls: ['./listar-cajas.component.scss'],
})
export class ListarCajasComponent  implements OnInit {
  empresa: string|null = localStorage.getItem('empresaCOD');
  usuario: string|null = localStorage.getItem('usuario');
  token: string|null = localStorage.getItem('token');

  puntoPago_0: any []=[] ;
  puntoPago_1: any []=[];
  puntoPago_2: any []=[];

  constructor(private recaudoService: RecaudoService, private router: Router) { }

  ngOnInit() {}

  ListarCajas(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.getListarCajas(Number(this.empresa),this.usuario,this.token).subscribe(
        (data: any) => {
          this.puntoPago_0 = data.PUNTO_PAGO_0;
          this.puntoPago_1 = data.PUNTO_PAGO_1;
          this.puntoPago_2 = data.PUNTO_PAGO_2;
        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    }

  }

}
