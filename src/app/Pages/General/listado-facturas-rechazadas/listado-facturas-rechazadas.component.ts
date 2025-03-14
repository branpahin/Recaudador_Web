import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-listado-facturas-rechazadas',
  templateUrl: './listado-facturas-rechazadas.component.html',
  styleUrls: ['./listado-facturas-rechazadas.component.scss'],
})
export class ListadoFacturasRechazadasComponent  implements OnInit {

  @Input() datos: any;
  filteredList: any[] = [];
  searchTerm: string = '';

  constructor() { }

  ngOnInit() {
    console.log("datos: ",this.datos)
    this.filteredList = this.datos;
  }

  filterList() {
    if (!this.searchTerm.trim()) {
      this.filteredList = this.datos;
    } else {
      const term = this.searchTerm.toLowerCase();
  
      this.filteredList = this.datos.filter((item: any) =>
        item.CODIGO_BARRAS.toLowerCase().includes(term) ||
        item.REFERENCIA.toLowerCase().includes(term) ||
        item.ERROR.toLowerCase().includes(term)
      );
    }
  }
  
  clearSearch() {
    this.filteredList = this.datos;
  }

}
