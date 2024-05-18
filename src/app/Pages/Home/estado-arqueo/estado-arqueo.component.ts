import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecaudoService } from 'src/app/services/recaudo.service';
import { Estado_Arqueo } from 'src/models/usuario.model';

@Component({
  selector: 'app-estado-arqueo',
  templateUrl: './estado-arqueo.component.html',
  styleUrls: ['./estado-arqueo.component.scss'],
})
export class EstadoArqueoComponent  implements OnInit {

  estado_arqueo:Estado_Arqueo ={
    EMPRESA:"",    
    NUMERO_ARQUEO: "",
    CODIGO_PUNTO_PAGO:""
  }
  resultado : any;

  constructor(private recaudoService: RecaudoService, private router: Router) { }

  ngOnInit() {}

  estadoArqueo(){
    const token = localStorage.getItem('token') || '';
    const usuario = localStorage.getItem('usuario') || '';
    this.recaudoService.postEstadoArqueo(this.estado_arqueo.EMPRESA, this.estado_arqueo.NUMERO_ARQUEO, this.estado_arqueo.CODIGO_PUNTO_PAGO, usuario, token).subscribe({
      next:data=>{
        console.log(data);
        this.resultado=data;
      },
      error: error => {
        console.log(error);
      }
    });
  }

}
