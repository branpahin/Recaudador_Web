import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecaudoService } from 'src/app/services/recaudo.service';

@Component({
  selector: 'app-modificar-movimientos-punteo',
  templateUrl: './modificar-movimientos-punteo.component.html',
  styleUrls: ['./modificar-movimientos-punteo.component.scss'],
})
export class ModificarMovimientosPunteoComponent  implements OnInit {
  empresa: string|null =localStorage.getItem('empresaCOD');
  arqueo: string|null = localStorage.getItem('numeroArqueo');
  usuario: string|null = localStorage.getItem('usuario');
  codigoCaja: string|null = localStorage.getItem('condigoCaja');
  puntoPago: string|null =localStorage.getItem('puntoPago');
  token: string|null =localStorage.getItem('token');


  datosConsulta = {
    EMPRESA: this.empresa,
    ACCION:1,
    USUARIO: this.usuario,
    NUMERO_ARQUEO:this.arqueo,
    CODIGO_BARRAS:"",
    CODIGO_CLIENTE:"",
    TOKEN: this.token
  };

  datosConsulta2 = {
    EMPRESA: this.empresa,
    ACCION:2,
    USUARIO: this.usuario,
    NUMERO_ARQUEO:this.arqueo,
    CODIGO_BARRAS:"",
    CODIGO_CLIENTE:"",
    TOKEN: this.token
  };
  resultado: any;

  constructor(private recaudoService: RecaudoService, private router: Router) { }

  ngOnInit() {}

  limpiarCampo() {
    this.datosConsulta.CODIGO_BARRAS = '';
    this.datosConsulta2.CODIGO_CLIENTE = '';
  }
  onEnterKey(event: any) {
    event.preventDefault(); // Evita la acción predeterminada del formulario (recarga de la página)
    this.modificarMovimientoPunteoBarras();
    this.limpiarCampo();
  }

  onEnterKey2(event: any) {
    event.preventDefault(); // Evita la acción predeterminada del formulario (recarga de la página)
    this.modificarMovimientoPunteoReferencia();
    this.limpiarCampo();
  }

  modificarMovimientoPunteoBarras(){
    
    this.recaudoService.postModificarMovimiento(this.datosConsulta).subscribe((data) => {
      this.resultado = data;
      console.log(data);
    }, );

  }

  modificarMovimientoPunteoReferencia(){
    
    this.recaudoService.postModificarMovimiento(this.datosConsulta2).subscribe((data) => {
      this.resultado = data;
      console.log(data);
    }, );

  }

}
