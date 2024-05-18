import { Component, OnInit } from '@angular/core';
import { RecaudoService } from 'src/app/services/recaudo.service';
import * as alertify from 'alertifyjs';


interface Detalle{
  EMPRESA:any;
  ID_REPORTE: string;
  NOMBRE_REPORTE:string;
  ROLES?: string;
  ROLE?: string;
  USUARIO:any;
  TOKEN: any;
}

@Component({
  selector: 'app-asignacion-reportes',
  templateUrl: './asignacion-reportes.component.html',
  styleUrls: ['./asignacion-reportes.component.scss'],
})
export class AsignacionReportesComponent  implements OnInit {
  
  empresa=localStorage.getItem('empresaCOD') || '';
  usuario= localStorage.getItem('usuario')|| '';
  token=localStorage.getItem('token')|| '';

  datos:Detalle={
    EMPRESA:this.empresa,
    ID_REPORTE: "",
    NOMBRE_REPORTE:"",
    USUARIO:this.usuario,
    TOKEN: this.token
  }

  listadoRoles:any[]=[
    {ROL:"R_ADMINISTRADOR"},
    {ROL:"R_CAJERO"},
    {ROL:"R_CONSULTA"},
    {ROL:"R_CAJERO_ENC"},
    {ROL:"R_CAJERO_EXT"}
  ]

  seleccionar:boolean=false;

  filteredList: any[] = [];
  searchTerm: string = '';
  listadoRolesSelec="";
  listadoRolesSelec2="";

  listadoReportesAsignados:any[]=[];
  respuesta:any;
  checkboxEstado: { [key: string]: boolean } = {};
  role: { roles: string; }[] = [];

  constructor(private recaudoService: RecaudoService) { }

  ngOnInit() {
    this.ListarReportes();
  }

  ionViewWillEnter() {
    this.ListarReportes();
    this.filterList();
  }

  filterList() {
    if (!this.searchTerm.trim()) {
      this.filteredList = this.listadoReportesAsignados;
    } else {
      this.filteredList = this.listadoReportesAsignados.filter(item =>
        item.REPORTE.toLowerCase().includes(this.searchTerm.toLowerCase())
        || item.ROLES_ASIGNADOS.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  ListarReportes(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.getListadoReportesAsignados(Number(this.empresa),this.usuario,this.token).subscribe(
        (data: any) => {
          console.log('Respuesta del servicio:', data);
          this.listadoReportesAsignados= data.LISTADO_REPORTES;
          this.filterList();
        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    }
  }

  togglePuntoPago(codigo: any, event: any) {

    const codigoConvenioDet = codigo.ROL;
    const conveniosBloqueados = this.listadoRolesSelec.split(', ').filter(det => det !== '');

    if (event.detail.checked) {
      if (!conveniosBloqueados.includes(codigoConvenioDet)) {
        this.listadoRolesSelec += ', '+ codigoConvenioDet;
        console.log("lista: ",this.listadoRolesSelec)
      }
    } else {
      this.listadoRolesSelec = conveniosBloqueados.filter(det => det !== codigoConvenioDet).join(', ');
      console.log("listaaaa: ",this.listadoRolesSelec)
    }
  }

  isConvenioSelected(codigoConvenioDet: string): boolean {
    return this.listadoRolesSelec.includes(codigoConvenioDet);
  }

  

  Editar(respuesta1: any){
    this.datos={
      EMPRESA:this.empresa,
      ID_REPORTE: respuesta1.ID_REPORTE,
      NOMBRE_REPORTE: respuesta1.REPORTE,
      USUARIO:this.usuario,
      TOKEN: this.token
    }
    this.listadoRolesSelec=respuesta1.ROLES_ASIGNADOS
    this.listadoRolesSelec2=respuesta1.ROLES_ASIGNADOS
    this.MostrarSeleccionador();
  }

  MostrarSeleccionador(){
    this.seleccionar=!this.seleccionar
    if(this.seleccionar==false){
      if(this.listadoRolesSelec2){
        const rolesString = this.listadoRolesSelec2;
        console.log("rolesString: ",rolesString +" listadoRolesSelec: ",this.listadoRolesSelec)
        if (this.listadoRolesSelec.length < rolesString.length) {
          this.datos.ROLE=this.listadoRolesSelec;
          console.log("menor")
          this.EliminarAsignacion();
        }else if(this.listadoRolesSelec.length > rolesString.length){
          this.datos.ROLES=this.listadoRolesSelec;
          console.log("mayor<")
          this.ModificarAsignacion();
        }
        else {
          console.log("no hay nada para modificar");
        }
      }
    }
  }

  ModificarAsignacion(){
    console.log("datos:",this.datos)
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.postCrearAsignacionReporte(this.datos).subscribe(
        (data: any) => {
          console.log('Respuesta del servicio:', data);
          this.respuesta= data;
          if(this.respuesta.COD=="200"){
            alertify.success(this.respuesta.RESPUESTA);
          }
          else {
            alertify.error(this.respuesta.RESPUESTA);
          }      
        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
          alertify.error(error);
        }
      );  
    }
  }

  EliminarAsignacion(){
    console.log("datos:",this.datos)
    
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.postEliminarAsignacionReporte(this.datos).subscribe(
        (data: any) => {
          console.log('Respuesta del servicio:', data);
          this.respuesta= data;
          if(this.respuesta.COD=="200"){
            alertify.success(this.respuesta.RESPUESTA);
          }
          else {
            alertify.error(this.respuesta.RESPUESTA);
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
