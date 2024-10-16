import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecaudoService } from 'src/app/services/recaudo.service';

@Component({
  selector: 'app-reestablecer-movimientos-punteo',
  templateUrl: './reestablecer-movimientos-punteo.component.html',
  styleUrls: ['./reestablecer-movimientos-punteo.component.scss'],
})
export class ReestablecerMovimientosPunteoComponent  implements OnInit {
  empresa: string|null =localStorage.getItem('empresaCOD');
  arqueo: string|null = localStorage.getItem('numeroArqueo');
  usuario: string|null = localStorage.getItem('usuario');
  token: string|null =localStorage.getItem('token');

  resultado: any;
  constructor(private recaudoService: RecaudoService, private router: Router) { }

  ngOnInit() {}

  restablecer(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null && this.arqueo !== null) {
      this.recaudoService.getReestablecerMovimientosPunteo(Number(this.empresa),this.usuario,this.token,this.arqueo).subscribe(
        (data: any) => {
          
          this.resultado=data;
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
