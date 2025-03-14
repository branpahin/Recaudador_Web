import { formatDate } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RecaudoService } from 'src/app/services/recaudo.service';


@Component({
  selector: 'app-listado-facturas-consulta',
  templateUrl: './listado-facturas-consulta.component.html',
  styleUrls: ['./listado-facturas-consulta.component.scss'],
})
export class ListadoFacturasConsultaComponent  implements OnInit {
  @Input() datos :any[]=[]
  token: string|null =localStorage.getItem('token');
 
  fechas="";
  currentDateTime="";
  respuesta="";
  filteredList: any[] = [];
  searchTerm: string = '';
  //#endregion

  constructor(private recaudoService: RecaudoService,
    private modalController: ModalController,
  ) { }

  ngOnInit() {
    this.ListarFacturas()
  }

  //#region Consulta a API

  ListarFacturas(){
    if (this.token !== null) {
      this.recaudoService.postListarFac(this.datos).subscribe(
        (data: any) => {
          if(data.COD!='200'){
            this.respuesta=data.RESPUESTA;
          }else{
            this.datos=data.MOVIMIENTOS_DET;
            this.filteredList = this.datos;
          }
        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    }

  }

  async seleccionar(data:any) {
		await this.modalController.dismiss({ datos: data })
	}

  //#endregion


  filterList() {
    if (!this.searchTerm.trim()) {
      this.filteredList = this.datos;
    } else {
      
      this.filteredList = this.datos.filter(item =>
        item.TIPO_PAGO.toLowerCase().includes(this.searchTerm.toLowerCase())
        || item.CONVENIO.toLowerCase().includes(this.searchTerm.toLowerCase())
        || item.CODIGO_CLIENTE.toLowerCase().includes(this.searchTerm.toLowerCase())
        || item.CODIGO_REFERENCIA.toLowerCase().includes(this.searchTerm.toLowerCase())
        || item.VALOR_MOVIMIENTO_DET.toLowerCase().includes(this.searchTerm.toLowerCase())
        || item.MIGRADO.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    
    }
  }

  clearSearch() {
    this.filteredList = this.datos;
  }

  

}
