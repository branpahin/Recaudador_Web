import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { RecaudoService } from 'src/app/services/recaudo.service';

@Component({
  selector: 'app-convenios-referencia-ws',
  templateUrl: './convenios-referencia-ws.component.html',
  styleUrls: ['./convenios-referencia-ws.component.scss'],
})
export class ConveniosReferenciaWSComponent  implements OnInit {
  empresa: string|null = localStorage.getItem('empresaCOD');
  usuario: string|null = localStorage.getItem('usuario');
  token: string|null = localStorage.getItem('token')
  datos = {
    CODIGO_CONVENIO: "",
    NOMRE_CONVENIO: "",
    NIT_CONVENIO: "",
    CONVENIOS_DETALLE:[
      {
        CODIGO_CONVENIO_DET: "",
        NOMRE_CONVENIO_DET: "",
        IDENTIFICADOR_BARRA: "",
        TIPOS: [
            {
                TIPO: ""
            }
        ]
      }
    ]

  }

  

  accion = 0; 
  resultado: any[] = [];
  selectedConvenio: any;
  selectedConvenioDet: any;
  alumbrado:boolean=false;
  alumbrado2:boolean=false;
  alumbrados="1";


  constructor(private recaudoService: RecaudoService, private router: Router, private popoverController: PopoverController) { }

  ngOnInit() {
    this.selectedConvenio="0";
    this.selectedConvenioDet="0";
    this.alumbrado2=false;
    this.conveniosReferenciaWS();
  }
  
  conveniosReferenciaWS(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.getConveniosReferenciaWS(Number(this.empresa),this.usuario,this.token).subscribe(
        (data: any) => {
          this.resultado=data.CONVENIOS_REFERENCIA;
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

    const detalleNIT= this.resultado.find(detalle => detalle.CODIGO_CONVENIO===this.selectedConvenio);
    localStorage.setItem('CODconvenio',this.selectedConvenio);
    localStorage.setItem('NITConvenio',detalleNIT.NIT_CONVENIO);
    
    const detalleEspecifico = this.resultado;

    
      for (let i=0; i<=detalleEspecifico.length-1; i++)
      {     
        if(detalleEspecifico[i].CODIGO_CONVENIO==this.selectedConvenio)
        {
          localStorage.setItem('NombreConvenio',detalleEspecifico[i].NOMRE_CONVENIO);
          
        }    
      }
                                            
    if(this.selectedConvenio==2){
      this.alumbrados="1";
      this.alumbrado=true;
      localStorage.setItem('alumbrado',this.alumbrados);
    }
    else{
      this.alumbrado=false;
      this.alumbrados="1";
    }
  }
  seleccionadoDet(event:any){

    

    this.selectedConvenioDet=event.detail.value;
    this.recaudoService.setCodigoConvenioDet(this.selectedConvenioDet)
    if(this.selectedConvenioDet=="28"){
      this.recaudoService.enviarConConvenioDet(true);
    }else{
      console.log("entro")
      this.recaudoService.enviarConConvenioDet(false);
    }
    const detalleEspecifico = this.resultado;
    
          
                for (let i=0; i<=detalleEspecifico.length-1; i++)
                {         
                  const detalleEspecifico2 = detalleEspecifico[i].CONVENIOS_DETALLE;
                  for (let i=0; i<=detalleEspecifico2.length-1; i++){
                    if(detalleEspecifico2[i].CODIGO_CONVENIO_DET==this.selectedConvenioDet){
                      localStorage.setItem('NombreConvenioDet',detalleEspecifico2[i].NOMRE_CONVENIO_DET);
                      
                    }    
                  }
                                       
                }       
  }
  Alumbrado(event: { detail: { checked: any; }; }){
    if (event.detail.checked) {
      this.alumbrados="2";
      
    } else {
      this.alumbrados="1";
      
    }
    localStorage.setItem('alumbrado',this.alumbrados);
  }
  
}
