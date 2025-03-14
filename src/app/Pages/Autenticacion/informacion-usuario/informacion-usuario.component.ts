import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecaudoService } from 'src/app/services/recaudo.service';
import * as alertify from 'alertifyjs';

@Component({
  selector: 'app-informacion-usuario',
  templateUrl: './informacion-usuario.component.html',
  styleUrls: ['./informacion-usuario.component.scss'],
})
export class InformacionUsuarioComponent  implements OnInit {

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

  constructor(private recaudoService: RecaudoService, private router: Router) { }

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

  consultarDocumento(){
    if (this.usuario !== null && this.token !== null && this.empresa !== null) {
      this.recaudoService.getTiposDocumento(Number(this.empresa), this.usuario, this.token).subscribe((data:any)=>{
        this.documento=data.TIPOS_DOCUMENTO;
      })
    }
  }
  
  //#endregion

  //#region Modificar y enviar
  Modificar(){
    this.modificarInfo=true;
    this.consultarDocumento();
  }

  cambiarClave(){
    this.modificar=true;
  }

  modificarClave(){
    const claveRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_])[a-zA-Z\d\W_]+$/;
    if(this.claveAnterior==this.datos.PASSWORD){
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
    }else{
      alertify.error("La clave actual no es correcta");
    }
    
  }

  modificarUsuario(){
    this.recaudoService.postModificarInformacion(this.datos).subscribe(
    (data:any) => {
      
      alertify.success(data.RESPUESTA);
      this.clave="";
      this.claveAnterior="";
      this.confirmacionClave="";

    },(error) => {
      alertify.error(error);
      console.error('Error al llamar al servicio:', error);
    })
  }

  //#endregion

}
