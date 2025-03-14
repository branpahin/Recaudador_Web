import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecaudoService } from 'src/app/services/recaudo.service';
import * as alertify from 'alertifyjs';

@Component({
  selector: 'app-cambiar-clave',
  templateUrl: './cambiar-clave.component.html',
  styleUrls: ['./cambiar-clave.component.scss'],
})
export class CambiarClaveComponent  implements OnInit {
  
  //#region Variables
  usuario: string|null = localStorage.getItem('usuario');
  token: string|null = localStorage.getItem('token');
  empresa: string|null = localStorage.getItem('empresaCOD');
  contraseña:string | undefined;

  datos={
    EMPRESA: this.empresa,
    USUARIO: this.usuario,
    DOCUMENTO:"",
    TIPO_DOCUMENTO:"",
    NOMBRE:"",
    DIRECCION: "",
    TELEFONO:"",
    PASSWORD:"",
    TOKEN:this.token
  }

  claveAnterior="";
  clave="";
  confirmacionClave="";
  resultado: any;
  documento: any[]=[];
  modificar:boolean=false;
  modificarInfo:boolean=false;
  //#endregion

  constructor( private recaudoService: RecaudoService, private router: Router ) { }

  ngOnInit() {
    this.informacionUsuario();
  }
  
  //#region Consulta a API
  informacionUsuario(){
    if (this.usuario !== null && this.token !== null && this.empresa !== null) {
      this.recaudoService.getInformacionUsuario(this.empresa, this.usuario, this.token).subscribe(
        (data: any) => {
          
          this.resultado = data;
          this.datos.DOCUMENTO=data.NUMERO_DOCUMENTO;
          this.datos.EMPRESA=data.EMPRESA;
          this.datos.NOMBRE=data.NOMBRE;
          this.datos.DIRECCION=data.DIRECCION;
          this.datos.TELEFONO=data.TELEFONO;
          this.datos.TIPO_DOCUMENTO=data.TIPO_DOCUMENTO;
          this.contraseña=this.recaudoService.getContraseña();
          this.datos.PASSWORD=this.contraseña || '';

        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    }

  }

  //#endregion

  //#region Modificaciones y envio
  modificarClave(){
    const claveRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_])[a-zA-Z\d\W_]+$/;
      if(this.clave==this.confirmacionClave){
        if(claveRegex.test(this.clave)){
          this.datos.PASSWORD=this.clave;
          this.modificarUsuario();
          this.modificar=false;
          localStorage.setItem('contraseña', this.datos.PASSWORD);
        }else{
          alertify.error("La clave debe tener letras, numeros y simbolos");
        }
        
      }else{
        alertify.error("Clave de confirmacion no es correcta");
      }
  }

  modificarUsuario(){
    this.recaudoService.postModificarInformacion(this.datos).subscribe(
    (data:any) => {
      
      alertify.success(data.RESPUESTA);
      this.clave="";
      this.claveAnterior="";
      this.confirmacionClave="";
      location.reload();

    },(error) => {
      alertify.error(error);
      console.error('Error al llamar al servicio:', error);
    })
  }

  //#endregion

}
