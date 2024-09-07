import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RecaudoService } from 'src/app/services/recaudo.service';

@Component({
  selector: 'app-cajas-sac',
  templateUrl: './cajas-sac.component.html',
  styleUrls: ['./cajas-sac.component.scss'],
})
export class CajasSacComponent  implements OnInit {
  token: string|null =localStorage.getItem('token');
  fechas="";
  currentDateTime="";
  respuesta="";
  datos:any;
  constructor(private recaudoService: RecaudoService) { }

  ngOnInit() {
    const now = new Date();
    
    this.currentDateTime = now.toISOString();
    
    console.log("now: ",this.currentDateTime)
    this.fecha(this.currentDateTime);
  }

  fecha(event:any){
    this.fechas = formatDate(event, 'dd/MM/yyyy', 'en-US');
    this.ListarCajasActivasSac()
  }

  ListarCajasActivasSac(){
    if (this.token !== null) {
      this.recaudoService.getListadoCajasActivasSac(this.token,this.fechas).subscribe(
        (data: any) => {
          console.log('Respuesta del servicio:', data);
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


}
