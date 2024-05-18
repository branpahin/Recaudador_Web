import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecaudoService } from 'src/app/services/recaudo.service';

@Component({
  selector: 'app-consulta-recaudo',
  templateUrl: './consulta-recaudo.component.html',
  styleUrls: ['./consulta-recaudo.component.scss'],
})
export class ConsultaRecaudoComponent  implements OnInit {
  
  empresa: string|null =localStorage.getItem('empresaCOD');
  arqueo: string|null = localStorage.getItem('numeroArqueo');
  usuario: string|null = localStorage.getItem('usuario');
  codigoCaja: string|null = localStorage.getItem('condigoCaja');
  puntoPago: string|null =localStorage.getItem('puntoPago');
  token: string|null =localStorage.getItem('token');

  accion=1;
  codigo_barras="";

  datos = {
    EMPRESA: this.empresa,
    CODIGO_PUNTO_PAGO: this.puntoPago,
    NUMERO_ARQUEO:this.arqueo,
    USUARIO: this.usuario,
    ACCION:"1",
    CODIGO_BARRAS:"",
    TOKEN: this.token
  };

  datos2 = {
    EMPRESA: this.empresa,
    CODIGO_PUNTO_PAGO: this.puntoPago,
    NUMERO_ARQUEO:this.arqueo,
    USUARIO: this.usuario,
    ACCION:"2",
    NIT:"",
    REFERENCIA:"",
    TOKEN: this.token
  }

  constructor(private recaudoService: RecaudoService, private router: Router) { }

  ngOnInit() {}

  resultado:any;

  consultarRecaudoBarras(){
    

    this.recaudoService.postConsultarRecaudo(this.datos).subscribe((data) => {
      this.resultado = data;
      console.log(data);
    }, );

  }

  consultarRecaudoReferencia(){
    

    this.recaudoService.postConsultarRecaudo(this.datos2).subscribe((data) => {
      this.resultado = data;
      console.log(data);
    }, );

  }

}
