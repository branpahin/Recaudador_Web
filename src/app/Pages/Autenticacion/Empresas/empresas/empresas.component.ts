import { Component, OnInit } from '@angular/core';
import { RecaudoService } from 'src/app/services/recaudo.service';

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.scss'],
})
export class EmpresasComponent  implements OnInit {

  listEmpresas: any[] = [];
  constructor(private _listarEmpresas: RecaudoService) { }

  ngOnInit(): void{

    this.obtenerEmpresas();
  }
  
  obtenerEmpresas(){
    this._listarEmpresas.getListEmpresas().subscribe(
      (data: any) => {
        this.listEmpresas = data.EMPRESAS; 
      },
      (error) => {
        console.error('Error al obtener empresas:', error);
      }
    );
    this._listarEmpresas.setListEmpresas(this.listEmpresas);
  }
}
