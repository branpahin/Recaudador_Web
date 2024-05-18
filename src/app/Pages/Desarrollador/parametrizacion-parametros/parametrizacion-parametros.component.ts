import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecaudoService } from 'src/app/services/recaudo.service';
import * as alertify from 'alertifyjs';

interface Datos{
  EMPRESA:any;
  PARAMETRO_CONSULTA?:string;
  TABLA_CONSULTA?:string;
  USUARIO:any;
  TOKEN:any;
}

@Component({
  selector: 'app-parametrizacion-parametros',
  templateUrl: './parametrizacion-parametros.component.html',
  styleUrls: ['./parametrizacion-parametros.component.scss'],
})
export class ParametrizacionParametrosComponent  implements OnInit {

  empresa=localStorage.getItem('empresaCOD') || '';
  usuario= localStorage.getItem('usuario')|| '';
  token=localStorage.getItem('token')|| '';

  seleccion="";
  campoSelec="";
  ingormacion:any[]=[];
  informacionConsulta:any[]=[];
  resultado:any;

  datos:Datos={
    EMPRESA:this.empresa,
    USUARIO:this.usuario,
    TOKEN:this.token
  }

  filteredList: any[] = [];
  searchTerm: string = '';
  crear:boolean=false;
  editar:boolean=false;
  mostrarMas:boolean=false;
  mostrarModificar:boolean=false;

  constructor(private recaudoService: RecaudoService, private router: Router) { }

  ngOnInit() {}

  ionViewWillEnter() {
    this.ConsultarInfo();
    this.filterList();
  }

  filterList() {
    if (!this.searchTerm.trim()) {
      this.filteredList = this.informacionConsulta;
    } else {
      this.filteredList = this.informacionConsulta.filter(item =>
        item.PARAMETRO.toLowerCase().includes(this.searchTerm.toLowerCase())
        || item.VALOR.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  ListarParametros(){
    this.informacionConsulta=[];
    this.filteredList=[];
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      if(this.seleccion=="PARAMETROS"){
        this.recaudoService.getListadoConsultarParametros(Number(this.empresa),this.usuario,this.token).subscribe(
          (data: any) => { 
            if(data.COD=="200"){
              this.ingormacion=data.CAMPOS_CONSULTA_PARAMETROS
            }else{
              console.error('Error al llamar al servicio:', data.RESPUESTA);
              alertify.error(this.resultado.RESPUESTA);
            }
          },
          (error) => {
            console.error('Error al llamar al servicio:', error);
          }
        );
      }
      else if(this.seleccion=="TABLAS"){
        this.recaudoService.getListadoConsultarTablas(Number(this.empresa),this.usuario,this.token).subscribe(
          (data: any) => {
            if(data.COD=="200"){
              this.ingormacion=data.CAMPOS_CONSULTA_TABLAS
            }else{
              console.error('Error al llamar al servicio:', data.RESPUESTA);
              alertify.error(this.resultado.RESPUESTA);
            }
          },
          (error) => {
            console.error('Error al llamar al servicio:', error);
            alertify.error(error);
          }
        );
      }
    }
  }

  ConsultarInfo(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      if(this.seleccion=="PARAMETROS"){
        this.datos={
          EMPRESA:this.empresa,
          PARAMETRO_CONSULTA:this.campoSelec,
          USUARIO:this.usuario,
          TOKEN:this.token
        }
        this.recaudoService.postConsultarInfoParametros(this.datos).subscribe(
          (data: any) => {
            console.log('Respuesta del servicio:', data);
            this.resultado= data;
            if(this.resultado.COD=="200"){
              this.informacionConsulta=data.INFORMACION_PARAMETROS;
              this.filterList();
            }
            else {
              alertify.error(this.resultado.RESPUESTA);
            }      
          },
          (error) => {
            console.error('Error al llamar al servicio:', error);
            alertify.error(error);
          }
        );  
      }
      else if(this.seleccion=="TABLAS"){
        this.datos={
          EMPRESA:this.empresa,
          TABLA_CONSULTA:this.campoSelec,
          USUARIO:this.usuario,
          TOKEN:this.token
        }
        this.recaudoService.postConsultarInfoTablas(this.datos).subscribe(
          (data: any) => {
            console.log('Respuesta del servicio:', data);
            this.resultado= data;
            if(this.resultado.COD=="200"){
              this.informacionConsulta=data.INFORMACION_TABLAS;
              this.filterList();
            }
            else {
              alertify.error(this.resultado.RESPUESTA);
            }      
          },
          (error) => {
            console.error('Error al llamar al servicio:', error);
            alertify.error(error);
          }
        );  
      }
      
    }
  }



}
