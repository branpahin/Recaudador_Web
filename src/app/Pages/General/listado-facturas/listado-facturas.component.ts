import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-listado-facturas',
  templateUrl: './listado-facturas.component.html',
  styleUrls: ['./listado-facturas.component.scss'],
})
export class ListadoFacturasComponent  implements OnInit {
  @Input() datos: any;
  @Input() nombres_convenio: any;
  filteredList: any[] = [];
  searchTerm: string = '';

  constructor() { }

  ngOnInit() {
    console.log("datos: ", this.datos);
    console.log("datos nombres: ", this.nombres_convenio);
  
    // Combina datos con nombres_convenio para la búsqueda
    this.datos = this.datos.map((item: any) => {
      const convenio = this.nombres_convenio.find(
        (nc: any) =>
          nc.CODIGO_CONVENIO === item.CODIGO_CONVENIO &&
          nc.CODIGO_CONVENIO_DET === item.CODIGO_CONVENIO_DET &&
          nc.CODIGO_CLIENTE === item.CODIGO_CLIENTE &&
          nc.CODIGO_REFERENCIA === item.CODIGO_REFERENCIA
      );
  
      return {
        ...item,
        NOMBRE_CONVENIO: convenio ? convenio.NOMBRE_CONVENIO : '',
        NOMBRE_CONVENIO_DET: convenio ? convenio.NOMBRE_CONVENIO_DET : '',
      };
    });
  
    // Inicialmente muestra todos los datos
    this.filteredList = this.datos;
  }
  
  filterList() {
    if (!this.searchTerm.trim()) {
      this.filteredList = this.datos;
    } else {
      const term = this.searchTerm.toLowerCase();
  
      this.filteredList = this.datos.filter((item: any) =>
        item.NOMBRE_CONVENIO.toLowerCase().includes(term) ||
        item.NOMBRE_CONVENIO_DET.toLowerCase().includes(term) ||
        item.CODIGO_CLIENTE.toLowerCase().includes(term) ||
        item.CODIGO_REFERENCIA.toLowerCase().includes(term) ||
        item.VALOR_MOVIMIENTO_DET.toLowerCase().includes(term)
      );
    }
  }
  
  clearSearch() {
    this.filteredList = this.datos;
  }

}
