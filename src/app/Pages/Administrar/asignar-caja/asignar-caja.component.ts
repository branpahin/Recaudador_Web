import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecaudoService } from 'src/app/services/recaudo.service';
import * as alertify from 'alertifyjs';




interface Detalle {
  CODIGO_PUNTO_PAGO: string;
  CODIGO_CAJA: string;
  USUARIO_ASIGNADO: string; 
};

interface PuntoPago {
  COD: string;
  CODIGO_PUNTO_PAGO: string;
  NOMBRE_PUNTO_PAGO: string;
  CAJAS_SIN_ASIGNAR: { CODIGO_CAJA: string; NOMBRE_CAJA: string }[];
  CAJAS_ASIGNADAS: any[]; 
}

interface Detalle2{
  USUARIO:string;
  NOMBRE_USUARIO:string;
  CODIGO_CAJA: string;
}

@Component({
  selector: 'app-asignar-caja',
  templateUrl: './asignar-caja.component.html',
  styleUrls: ['./asignar-caja.component.scss'],
})



export class AsignarCajaComponent  implements OnInit {
  empresa: string|null = localStorage.getItem('empresaCOD');
  usuario: string|null = localStorage.getItem('usuario');
  token: string|null = localStorage.getItem('token');

  puntoPago_0: any []=[] ;
  puntoPago_0_asignada: any []=[] ;
  puntoPago_1: any []=[];
  puntoPago_2: any []=[];
  listadoPuntos: any []=[];
  listadoUsuarios:any []=[];
  usuarios:any[]=[];

  detalle={
    CODIGO_PUNTO_PAGO:"",
    CODIGO_CAJA:"",
    USUARIO_ASIGNADO:""
  };
  detalle2={
    USUARIO:"",
    NOMBRE_USUARIO:"",
    CODIGO_CAJA:"",
  }

  modificar={
    EMPRESA:this.empresa,
    USUARIO:this.usuario,
    CAJAS_ASIGNADAS:[] as Detalle[],
    TOKEN:this.token
  };
  empresa_Asignada:any;
  usuario_Asigmnado= [] as Detalle2[];
  cajasSinAsignar: { CODIGO_CAJA: string; NOMBRE_CAJA: string }[] = [];
  cajasAsignadas: { CODIGO_CAJA: string; NOMBRE_CAJA: string; USUARIO:string}[] = [];
  resultado:any;
  empresas:any;
  otraVariable="";
  puntosPago: any[] = [];
  guardar:boolean=false;
  selectedCodigoCaja="";
  seleccionadas: { [codigoCaja: string]: boolean } = {};

  constructor(private recaudoService: RecaudoService) { }

  ngOnInit() {
    
    this.ListarCajas();
    this.ListarUsuarios();
    this.ListarPuntosPago();
    this.ListarUsuariosGeneral();
  }


//Agregar usuarios a la asignación
  agregarDetalle(event: any, codigoCaja:string) {
    this.otraVariable = event.detail.value;
    this.detalle2.USUARIO = this.otraVariable;
    const detallecodigo = this.usuarios.find(detalle => detalle.USUARIO === this.otraVariable);
    this.detalle2.NOMBRE_USUARIO = detallecodigo.NOMBRE_USUARIO;
    this.detalle2.CODIGO_CAJA = codigoCaja;
    this.detalle.CODIGO_CAJA = codigoCaja;

    for(const datos of this.modificar.CAJAS_ASIGNADAS){
      if(datos.CODIGO_CAJA==codigoCaja){
        const codigo = datos.CODIGO_CAJA;
        this.modificar.CAJAS_ASIGNADAS = this.modificar.CAJAS_ASIGNADAS .filter(detalle => detalle.CODIGO_CAJA !== codigo);
      }
    }

    const nuevoDetalle: Detalle = { ...this.detalle };
    this.modificar.CAJAS_ASIGNADAS.push(nuevoDetalle);
    const nuevoDetalle2: Detalle2 = { ...this.detalle2 };
    this.usuario_Asigmnado.push(nuevoDetalle2);
  
    this.detalle. USUARIO_ASIGNADO="";
  }

  campoRepetido(campo: string): boolean {
    return this.modificar.CAJAS_ASIGNADAS.some(item => item.USUARIO_ASIGNADO === campo);
  }


  ListarPuntosPago(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.getListarPuntosPago(Number(this.empresa),this.usuario,this.token).subscribe(
        (data: any) => {
          this.listadoPuntos= data.PUNTOS_PAGO;
        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    }

  }

  obtenerNombreUsuarioAsignado(codigoCaja: string): string {
    const usuarioAsignado = this.usuario_Asigmnado.find(usuario => usuario.CODIGO_CAJA === codigoCaja);
    return usuarioAsignado ? usuarioAsignado.NOMBRE_USUARIO : '';
  }

  ListarCajas(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.getListarCajas(Number(this.empresa),this.usuario,this.token).subscribe(
        (data: any) => {

          this.empresas=data;
          if(this.guardar){
            this.actualizarCajasSinAsignar();
            this.guardar=false;
          }
        
          this.puntosPago = this.obtenerCodigosPuntoPago();
        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    }

  }

  actualizarCajasSinAsignar() {
    if (this.empresa_Asignada) {
      this.detalle.CODIGO_PUNTO_PAGO=this.empresa_Asignada;
      const puntoSeleccionado = Object.values(this.empresas).find(punto => (punto as PuntoPago).CODIGO_PUNTO_PAGO === this.empresa_Asignada);
      this.cajasSinAsignar = puntoSeleccionado ? (puntoSeleccionado as PuntoPago).CAJAS_SIN_ASIGNAR || [] : [];
      this.cajasAsignadas = puntoSeleccionado ? (puntoSeleccionado as PuntoPago).CAJAS_ASIGNADAS || [] : [];
      this.ListarUsuarios();
    } else {
      this.cajasSinAsignar = [];
    }
  }

  obtenerCodigosPuntoPago(): any[] {
    const puntosPagoKeys = Object.keys(this.empresas);
    const puntosPago = puntosPagoKeys.filter(key => key.startsWith('PUNTO_PAGO'));
    

    return puntosPago.map(punto => ({
      value: this.empresas[punto].CODIGO_PUNTO_PAGO,
      label: this.empresas[punto].NOMBRE_PUNTO_PAGO,
    }));
  }

  ListarUsuarios(){
    
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.getListarUsuarios(Number(this.empresa),this.empresa_Asignada,this.usuario,this.token).subscribe(
        (data: any) => {
          this.usuarios = data.CAJEROS_SIN_ASIGNAR;

        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    }

  }

  ListarUsuariosGeneral(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.getListadoUsuarios(Number(this.empresa),this.usuario,this.token).subscribe(
        (data: any) => {
          this.listadoUsuarios= data.USUARIOS_ACTIVOS;

        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    }

  }


  

  ModificarCaja(){
    
    this.recaudoService.postModificarCajas(this.modificar)
        .subscribe((respuesta) => {
          this.guardar=true;
          this.resultado=respuesta;
          alertify.success(this.resultado.RESPUESTA);
          this.ngOnInit();
    },(error) =>{
      console.error(error);
    });
  }

  Reestablecer(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null){
      this.recaudoService.postReestablecerCajas(this.empresa,this.usuario,this.empresa_Asignada,this.token)
        .subscribe((respuesta) => {
          this.guardar=true;
          this.resultado=respuesta;
          alertify.success(this.resultado.RESPUESTA);
          this.actualizar();
          
    },(error) =>{
      console.error(error);
    });
    }
    
  }

  Eliminar(codigoCaja:string) {
    if (this.empresa !== null && this.usuario !== null && this.token !== null){
      this.recaudoService.postEliminarAsignacionCajas(this.empresa,this.usuario,this.empresa_Asignada,codigoCaja,this.token)
        .subscribe((respuesta) => {
          this.guardar=true;
          this.resultado=respuesta;
          alertify.success(this.resultado.RESPUESTA);
          this.actualizar();
          
    },(error) =>{
      console.error(error);
    });
    }
  }


  actualizar(){

    this.modificar={
      EMPRESA:this.empresa,
      USUARIO:this.usuario,
      CAJAS_ASIGNADAS:[] as Detalle[],
      TOKEN:this.token
    };

    this.usuarios=[];
    this.detalle.USUARIO_ASIGNADO="";
    this.detalle2={
      USUARIO:"",
      NOMBRE_USUARIO:"",
      CODIGO_CAJA:"",
    }
    this.cajasSinAsignar = [];
    this.cajasAsignadas = [];
    this.usuario_Asigmnado=[];
      

    this.ngOnInit();
  }
}
