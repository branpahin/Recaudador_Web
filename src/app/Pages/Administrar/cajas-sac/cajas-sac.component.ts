import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RecaudoService } from 'src/app/services/recaudo.service';

@Component({
  selector: 'app-cajas-sac',
  templateUrl: './cajas-sac.component.html',
  styleUrls: ['./cajas-sac.component.scss'],
})
export class CajasSacComponent  implements OnInit {

  //#region Variables
  token: string|null =localStorage.getItem('token');
  fechas="";
  currentDateTime="";
  respuesta="";
  datos:any;
  //#endregion

  constructor(private recaudoService: RecaudoService) { }

  ngOnInit() {
    const now = new Date();
    this.currentDateTime = now.toISOString();
    this.fecha(this.currentDateTime);
  }

  fecha(event:any){
    this.fechas = formatDate(event, 'dd/MM/yyyy', 'en-US');
    this.ListarCajasActivasSac()
  }

  //#region Consulta a API

  ListarCajasActivasSac(){
    if (this.token !== null) {
      this.recaudoService.getListadoCajasActivasSac(this.token,this.fechas).subscribe(
        (data: any) => {
          if(data.COD!='200'){
            this.respuesta=data.RESPUESTA;
          }else{
            this.datos=data.CAJAS_ACTIVAS;
          }
        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    }

  }
  //#endregion

}
