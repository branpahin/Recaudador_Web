import { Component, OnInit } from '@angular/core';
import { RecaudoService } from 'src/app/services/recaudo.service';

@Component({
  selector: 'app-puntos-pago',
  templateUrl: './puntos-pago.component.html',
  styleUrls: ['./puntos-pago.component.scss'],
})
export class PuntosPagoComponent  implements OnInit {

  listadoPuntosPago: any[] = [];
  empresa: number = 0;

  constructor(private _listarPuntosPago: RecaudoService) { }

  ngOnInit(): void{
    this.empresa = this.empresa;
    
  }


  obtenerPuntosPago() {

    this._listarPuntosPago.getListPuntosPago(this.empresa).subscribe({
      next: data => {
        this.listadoPuntosPago = data.PUNTOS_PAGO;
      },
      error: error => {
        console.log(error);
      }
    });
  }
}