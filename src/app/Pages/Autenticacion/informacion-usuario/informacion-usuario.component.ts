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

  usuario: string|null = localStorage.getItem('usuario');
  token: string|null = localStorage.getItem('token');
  empresa: string|null = localStorage.getItem('empresaCOD');
  contraseña=localStorage.getItem('contraseña') || "";

  datos={
    EMPRESA: this.empresa,
    USUARIO: this.usuario,
    DOCUMENTO:"",
    TIPO_DOCUMENTO:"",
    NOMBRE:"",
    DIRECCION: "",
    TELEFONO:"",
    PASSWORD:this.contraseña,
    TOKEN:this.token
  }

  claveAnterior="";
  clave="";
  confirmacionClave="";
  resultado: any;
  documento: any[]=[];
  modificar:boolean=false;
  modificarInfo:boolean=false;

  constructor(private recaudoService: RecaudoService, private router: Router) { }

  ngOnInit() {
    this.informacionUsuario();
  }
  
  informacionUsuario(){
    if (this.usuario !== null && this.token !== null && this.empresa !== null) {
      this.recaudoService.getInformacionUsuario(this.empresa, this.usuario, this.token).subscribe(
        (data: any) => {
          console.log('Respuesta del servicio:', data);
          this.resultado = data;
          this.datos.DOCUMENTO=data.NUMERO_DOCUMENTO;
          this.datos.EMPRESA=data.EMPRESA;
          this.datos.NOMBRE=data.NOMBRE;
          this.datos.DIRECCION=data.DIRECCION;
          this.datos.TELEFONO=data.TELEFONO;
          this.datos.TIPO_DOCUMENTO=data.TIPO_DOCUMENTO;

        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    }

  }

  Modificar(){
    this.modificarInfo=true;
    this.consultarDocumento();
  }

  cambiarClave(){
    this.modificar=true;
  }

  modificarClave(){
    if(this.claveAnterior==this.datos.PASSWORD){
      if(this.clave==this.confirmacionClave){
        this.datos.PASSWORD=this.clave;
        this.modificarUsuario();
        this.modificar=false;
        localStorage.setItem('contraseña', this.datos.PASSWORD);
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
      console.log('Respuesta del servicio:', data);
      alertify.success(data.RESPUESTA);

    },(error) => {
      alertify.error(error);
      console.error('Error al llamar al servicio:', error);
    })
  }

  consultarDocumento(){
    if (this.usuario !== null && this.token !== null && this.empresa !== null) {
      this.recaudoService.getTiposDocumento(Number(this.empresa), this.usuario, this.token).subscribe((data:any)=>{
        this.documento=data.TIPOS_DOCUMENTO;
      })
    }
  }
}
