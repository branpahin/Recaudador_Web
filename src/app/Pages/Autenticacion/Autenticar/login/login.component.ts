import { Component, OnInit } from '@angular/core';
import { RecaudoService } from 'src/app/services/recaudo.service';
import { Usuario, Error_Login, Obtener_Rol } from 'src/models/usuario.model';
import { Router } from '@angular/router';
import * as alertify from 'alertifyjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})

export class LoginComponent  implements OnInit {

  mostrarLoginUser: boolean = false;
  errorMessage: string = '';
  listEmpresas: any[] = [];
  listadoPuntosPago:any[] = [];
  empresa: number = 0;

  usuario: Usuario = {
    COD:'',
    USUARIO: '',
    EMPRESA: '',
    DOCUMENTO: '',
    TIPO_DOCUMENTO: '',
    NOMBRE: '',
    DIRECCION: '',
    TELEFONO: '',
    ESTADO: '',
    FECHA_CREACION: new Date(),
    PASSWORD: '',
    IDENTIFICADOR_ROL: '',
    ROL: '',
    CAJA_ASIGNADA:'',
    TOKEN:'',
  };

  obtener_rol:Obtener_Rol ={
    COD: '',
    USUARIO: '',
    EMPRESA: '',
    ESTADO: '',
    IDENTIFICADOR_ROL: '',
    ROL: ''
  };

  errorLogin: Error_Login = {
    COD:'',
    RESPUESTA:''
  };
  CODIGO_PUNTO_PAGO='';

  resultado!: Usuario;
  inforol!: Obtener_Rol;
  modulos: any [] = [];
  constructor(private recaudoService: RecaudoService, private router: Router) {}

  ngOnInit() {

    const miImagen = document.getElementById('miImagen') as HTMLImageElement;
    
    localStorage.removeItem('usuario');
    localStorage.removeItem('empresa');
    localStorage.removeItem('empresaCOD');
    localStorage.removeItem('rol');
    localStorage.removeItem('token');
    localStorage.removeItem('nombrePuntoPago');
    localStorage.removeItem('numeroArqueo');
    localStorage.removeItem('condigoCaja');
    
    this.mostrarLoginUser=true;
    this.obtenerEmpresas();
    if (miImagen) {
        window.location.reload();
      
    }
  
    
  }
  
  obtenerEmpresas(){

    this.recaudoService.getListEmpresas().subscribe(
      (data: any) => {
        this.listEmpresas = data.EMPRESAS; 
        
      },
      (error) => {
        console.error('Error al obtener empresas:', error);
      }
    );
   
  }

  guardarSeleccion() {
    if (this.usuario.EMPRESA) {
      localStorage.setItem('empresaCOD', this.usuario.EMPRESA);
      console.log("empresa guardada: ",this.usuario.EMPRESA)
      this.obtenerPuntosPago();
    }
  }
 
 
  obtenerPuntosPago() {
    var empresa: string|null =localStorage.getItem('empresaCOD');

    this.recaudoService.getListPuntosPago(Number(empresa)).subscribe({
      next: data => {
        this.listadoPuntosPago = data.PUNTOS_PAGO;
        localStorage.setItem('CODpuntoPago',this.CODIGO_PUNTO_PAGO);
      },
      error: error => {
        console.log(error);
      }
    });
  }


  autenticarUsuario() {
    
      this.recaudoService.postAutenticarUsuario(this.usuario.USUARIO, this.usuario.PASSWORD, this.usuario.EMPRESA, this.CODIGO_PUNTO_PAGO).subscribe((data) => {
        this.resultado = data;
        
        if(this.resultado && this.resultado.COD =='200'){
          this.mostrarLoginUser = false;
        }else{
          this.mostrarLoginUser = true;
        }
        const puntoPagoSeleccionado = this.listadoPuntosPago.find((p: { CODIGO: string | null; }) => p.CODIGO === this.CODIGO_PUNTO_PAGO);
        if (puntoPagoSeleccionado) {
          const nombrePuntoPago = puntoPagoSeleccionado.NOMBRE;
          localStorage.setItem('nombrePuntoPago', nombrePuntoPago);
        } else {
          console.error('No se encontró un punto de pago con el código:', this.CODIGO_PUNTO_PAGO);
        }

        localStorage.setItem('usuario', this.resultado.USUARIO);
        localStorage.setItem('condigoCaja', this.resultado.CAJA_ASIGNADA);
        localStorage.setItem('empresaCOD', this.usuario.EMPRESA);
        localStorage.setItem('empresa', this.resultado.EMPRESA);
        localStorage.setItem('puntoPago', this.CODIGO_PUNTO_PAGO);
        localStorage.setItem('token', this.resultado.TOKEN);
        localStorage.setItem('contraseña', this.usuario.PASSWORD);
        if(this.resultado.COD=='200'){
          this.obtenerRol();
          
        
        }
        else  {
          this.errorLogin=data;
          this.mostrarAlerta();}
        
        
      }, (error) => {
        console.error(error);
      }
      );
  }
  obtenerRol(){
    const usuario = localStorage.getItem('usuario') || '';
    const empresa = localStorage.getItem('empresaCOD') || '';
    const token = localStorage.getItem('token') || '';

    this.recaudoService.getObtenerRol(usuario, empresa, token).subscribe((data) => {
      this.resultado = data;
      localStorage.setItem('rol', this.resultado.IDENTIFICADOR_ROL);
      
      console.log("Info Rol: "+this.resultado.ROL);
      this.router.navigate(['/inicio-arqueo'])
    }, );

  }


  mostrarAlerta() {
    alertify.error(this.errorLogin.RESPUESTA);
  }


}

