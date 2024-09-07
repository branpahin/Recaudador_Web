import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecaudoService } from 'src/app/services/recaudo.service';

@Component({
  selector: 'app-convenios-manual-ws',
  templateUrl: './convenios-manual-ws.component.html',
  styleUrls: ['./convenios-manual-ws.component.scss'],
})
export class ConveniosManualWsComponent  implements OnInit {

  empresa: string|null = localStorage.getItem('empresaCOD');
  usuario: string|null = localStorage.getItem('usuario');
  token: string|null = localStorage.getItem('token')

  accion = 0; 
  resultado: any[] = [];
  selectedConvenio: any;
  selectedConvenioDet: any;
  mostrarsoloDet:boolean=false;
  alumbrado:boolean=false;
  alumbrado2:boolean=false;
  alumbrados="1";

  constructor(private recaudoService: RecaudoService, private router: Router) { }

  ngOnInit() {
    this.conveniosManualWS();
  }
  
  conveniosManualWS(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.getConveniosManualWS(Number(this.empresa),this.usuario,this.token).subscribe(
        (data: any) => {
          this.resultado=data.CONVENIOS_MANUALES;
        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    } else {
    
      console.error('El valor del tipo de empresa no existe');
    }

  }

  seleccionado(event:any){

    this.selectedConvenio=event.detail.value;
    let contador=0;
    for(let convenio of this.resultado){
      if(this.selectedConvenio === convenio.CODIGO_CONVENIO){
        for(let convenioDet of convenio.CODIGOS_CONVENIO_DET){
          contador=contador+1
          console.log("ConvenioDet: ",contador)
          
          localStorage.setItem('NombreConvenioDet',convenioDet.NOMBRE_CONVENIO_DET);
          console.log("ConvenioDet: ",convenioDet)
          if(contador>1){
            this.mostrarsoloDet=true;
          }else{
            this.selectedConvenioDet=convenioDet.CODIGO_CONVENIO_DET
            this.recaudoService.setCodigoConvenioDet(this.selectedConvenioDet)
            this.mostrarsoloDet=false;
          }
        }
      }
      
    }
    
    localStorage.setItem('CODconvenio',this.selectedConvenio);

    if (this.selectedConvenio == 2) {

      this.recaudoService.enviarEstadoAlumbrado(true,false);
    }else if(this.selectedConvenio != 2 && this.selectedConvenio != null){
      this.recaudoService.enviarEstadoAlumbrado(true,true);
    }
    
    const detalleEspecifico = this.resultado;
    
      for (let i=0; i<=detalleEspecifico.length-1; i++)
      {         
        
        if(detalleEspecifico[i].CODIGO_CONVENIO==this.selectedConvenio)
        {
          localStorage.setItem('NombreConvenio',detalleEspecifico[i].NOMRE_CONVENIO);
          //localStorage.setItem('NombreConvenioDet',detalleEspecifico[i].NOMRE_CONVENIO_DET);
          console.log("convenioDet: ",detalleEspecifico[i].NOMRE_CONVENIO_DET)
        }    
      }
                                            
    if(this.selectedConvenio==2){
      this.alumbrados="1";
      this.alumbrado=true;
      localStorage.setItem('alumbrado',this.alumbrados);
    }
  }

  seleccionado2(event:any){

    this.selectedConvenioDet=event.detail.value;
    //localStorage.setItem('CODconvenioDet',this.selectedConvenioDet);
    this.recaudoService.setCodigoConvenioDet(this.selectedConvenioDet)
  }

}


