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

  listadoRoles:any[]=[];

  rolesDesmarcados: string[] = [];

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
    this.ListarRoles();
    this.ListarReportes();
    this.datos={
      EMPRESA:this.empresa,
      ID_REPORTE: "",
      NOMBRE_REPORTE:"",
      USUARIO:this.usuario,
      TOKEN: this.token
    }

    this.listadoRolesSelec="";
    this.listadoRolesSelec2="";
  
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

  clearSearch() {
    this.filteredList = this.listadoReportesAsignados;
  }

  ListarRoles(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.getListadoRoles(Number(this.empresa),this.usuario,this.token).subscribe(
        (data: any) => {
          console.log('Respuesta del servicio:', data);
          this.listadoRoles= data.LISTADO_ROLES;
        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
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
    const codigoConvenioDet = codigo.ROLE;
    const conveniosBloqueados = this.listadoRolesSelec.split(', ').filter(det => det !== '');
    
    if (event.detail.checked) {
      if (!conveniosBloqueados.includes(codigoConvenioDet)) {
        this.listadoRolesSelec += ', '+ codigoConvenioDet;
        console.log("lista: ",this.listadoRolesSelec)
        this.rolesDesmarcados = this.rolesDesmarcados.filter(det => det !== codigoConvenioDet);
      }
    } else {
      this.listadoRolesSelec = conveniosBloqueados.filter(det => det !== codigoConvenioDet).join(', ');
      console.log("listaaaa: ",this.listadoRolesSelec)
      if (!this.rolesDesmarcados.includes(codigoConvenioDet)) {
        this.rolesDesmarcados.push(codigoConvenioDet);
      }
    }
  }

  isConvenioSelected(codigoConvenioDet: string): boolean {
    const conveniosBloqueados = this.listadoRolesSelec.split(', ').filter(det => det !== '');
    return conveniosBloqueados.includes(codigoConvenioDet);
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
    console.log("roles:",respuesta1)
    this.MostrarSeleccionador();
  }

  MostrarSeleccionador(){
    this.seleccionar=!this.seleccionar
    console.log("seleccionador: ",this.listadoRolesSelec)
    if(this.seleccionar==false){
      if(this.listadoRolesSelec2){
        const rolesString = this.listadoRolesSelec2;
        console.log("rolesString: ",rolesString +" listadoRolesSelec: ",this.listadoRolesSelec)
        if (this.listadoRolesSelec.length < rolesString.length) {
          this.EliminarAsignacion();
        }else if(this.listadoRolesSelec.length > rolesString.length){
          this.datos.ROLES=this.listadoRolesSelec;
          console.log("mayor<")
          this.ModificarAsignacion();
        }
        else {
          console.log("no hay nada para modificar");
        }
      }else{
        if(this.listadoRolesSelec.length > 0){
          this.datos.ROLES=this.listadoRolesSelec;
          console.log("editar nuevo")
          this.ModificarAsignacion();
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
            this.ngOnInit();
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
    const conveniosBloqueados = this.rolesDesmarcados;
      conveniosBloqueados.forEach(rol => {
        const parametrosParaAsignacion = { ...this.datos, ROLE: rol};
          if (this.empresa !== null && this.usuario !== null && this.token !== null) {
            this.recaudoService.postEliminarAsignacionReporte(parametrosParaAsignacion).subscribe(
              (data: any) => {
                console.log('Respuesta del servicio:', data);
                this.respuesta= data;
                if(this.respuesta.COD=="200"){
                  alertify.success(this.respuesta.RESPUESTA);
                  this.ngOnInit();
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
        
      })
  }
}
