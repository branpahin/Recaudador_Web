import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecaudoService } from 'src/app/services/recaudo.service';
import * as alertify from 'alertifyjs';

interface convenioDet {

  EMPRESA: string;
  NOMBRE_EMPRESA: string;
  CODIGO_CONVENIO: string;
  NOMBRE_CONVENIO: string;
  NIT: string;
  CONVENIO_DET: any[];
}
interface ConvenioDet1 {
  CODIGO_CONVENIO_DET: string;
  NOMBRE_CONVENIO_DET: string;
}

interface Detalle{
  CODIGO_CONVENIO: string;
  CODIGO_CONVENIO_DET: string;          
  TIPO_ASOBANCARIA: string;
  CORREO_ASOBANCARIA: string;
  EXCEL: string;
}
interface Detalle2{
  CODIGO_CONVENIO: string;
  CODIGO_CONVENIO_DET: string;         
  NOMBRE:string;
  NOMBRE_DET:string;
  ASOBANCARIA:string;
}


@Component({
  selector: 'app-asobancaria',
  templateUrl: './asobancaria.component.html',
  styleUrls: ['./asobancaria.component.scss'],
})
export class AsobancariaComponent  implements OnInit {

  empresa: string|null =localStorage.getItem('empresaCOD');
  arqueo: string|null = localStorage.getItem('numeroArqueo');
  usuario: string|null = localStorage.getItem('usuario');
  codigoCaja: string|null = localStorage.getItem('condigoCaja');
  puntoPago: string|null =localStorage.getItem('puntoPago');
  token: string|null =localStorage.getItem('token');

  listadoAsobancaria:any;
  listadoConveniosDet:any[]=[];

  listadoConvenios={
    CODIGO_CONVENIO: "",
    CODIGO_CONVENIO_DET: "",            
    TIPO_ASOBANCARIA: "",
    CORREO_ASOBANCARIA: "",
    EXCEL:""
  };

  nombre_convenios= [] as Detalle2[];

  listadoConveniosNom={
    CODIGO_CONVENIO: "",
    CODIGO_CONVENIO_DET: "",     
    NOMBRE:"",
    NOMBRE_DET:"",
    ASOBANCARIA:""
  };




  asobancaria={
    EMPRESA:this.empresa,
    FECHA_ASOBANCARIA:"",
    LISTADO_CONVENIOS: [] as Detalle[],
    USUARIO:this.usuario,
    TOKEN:this.token
  };

  asobancariaGenerado=this.asobancaria;

  generado:boolean=false;
  respuesta:any;
  generadosConvenio:any[]=[];
  //seleccion:boolean=false;
  seleccionarTodos:boolean=false;

  convenios:any[]=[];

  constructor(private recaudoService: RecaudoService, private router: Router) { }

  ngOnInit() {
    this.listarAsobancaria();
  }

  listarAsobancaria() {

    if (this.empresa !== null && this.usuario !== null && this.token !== null && this.puntoPago!==null) {
      
      this.recaudoService.getListarAsobancaria(Number(this.empresa), this.puntoPago, this.usuario, this.token).subscribe(
        (data: any) => {
          console.log(data);
          this.listadoAsobancaria = data;
          this.convenios=this.obtenerConvenio();

        
        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    } else {
      console.error('El valor del tipo de empresa no existe');
    }
  }

  obtenerConvenio(): any[] {

    const convenioKeys = Object.keys(this.listadoAsobancaria);
  const convenios = convenioKeys
    .filter(key => key.startsWith('CONVENIO'))
    .map(convenioKey => {
      const convenio = this.listadoAsobancaria[convenioKey];
      const convenioDet = convenio.CONVENIO_DET || [];

      return {
        value: convenio.CODIGO_CONVENIO,
        label: convenio.NOMBRE_CONVENIO,
        convenioDet: convenioDet.map((det: ConvenioDet1) => ({
          value: det.CODIGO_CONVENIO_DET,
          label: det.NOMBRE_CONVENIO_DET
        }))
      };
    });

  return convenios;
  }

  seleccionarTodo(event:{ detail: { checked: any; }; } ){
    if (event.detail.checked) {
      this.seleccionarTodos = event.detail.checked;

      for (const detalle of this.convenios) {
        for(const detalleFin of detalle.convenioDet){
          this.obtenerDetalleConvenio({ detail: { checked: this.seleccionarTodos } }, detalle,detalleFin);
        }
      }
    }else {
      this.listadoConveniosDet = [];
      this.asobancaria.LISTADO_CONVENIOS = [];
      this.seleccionarTodos = event.detail.checked;
 
    }
  }


  obtenerDetalleConvenio(event: { detail: { checked: any; }; }, convenio: { value: any; label:any;}, convenioDet: { value: any; label:any;}) {
    
    const convenioSelect=convenio.value;
    if (event.detail.checked) {
      this.listadoConvenios.CODIGO_CONVENIO=convenioSelect;
      this.convenios.forEach(c => c.isSelected = (c === convenio));
    } else {
      this.listadoConvenios.CODIGO_CONVENIO="";
    }
    if (this.listadoConvenios.CODIGO_CONVENIO) {
  
      const convenioSeleccionado = Object.values(this.listadoAsobancaria).find(punto => (punto as convenioDet).CODIGO_CONVENIO === this.listadoConvenios.CODIGO_CONVENIO);
      this.listadoConveniosDet = convenioSeleccionado ? (convenioSeleccionado as convenioDet).CONVENIO_DET || [] : [];

      this.listadoConveniosNom={
        CODIGO_CONVENIO:convenio.value,
        CODIGO_CONVENIO_DET: convenioDet.value,     
        NOMBRE:convenio.label,
        NOMBRE_DET:convenioDet.label,
        ASOBANCARIA:"",
      };
      
      const nuevoDetalle: Detalle = { ...this.listadoConvenios };

      
      this.asobancaria.LISTADO_CONVENIOS.push(nuevoDetalle);
      this.guardarConvenioDet(convenioDet, nuevoDetalle);
     
    
      this.listadoConvenios = {
        CODIGO_CONVENIO: "",
        CODIGO_CONVENIO_DET: "",            
        TIPO_ASOBANCARIA: "",
        CORREO_ASOBANCARIA: "",
        EXCEL:""
      };
    } else {
      this.listadoConveniosDet = [];
      const codigoCliente = convenioDet.value;
      this.asobancaria.LISTADO_CONVENIOS = this.asobancaria.LISTADO_CONVENIOS.filter(detalle => detalle.CODIGO_CONVENIO_DET!== codigoCliente);
    }
    
  }



  guardarConvenioDet(convenioDet: { value: any; label:any;} ,detalle: Detalle){
    const convenioSelect=convenioDet.value;
      const nuevoDetalle: Detalle = { ...this.listadoConvenios, CODIGO_CONVENIO_DET: convenioSelect };

    if (this.asobancaria.LISTADO_CONVENIOS.length > 0) {
      const ultimoDetalle = this.asobancaria.LISTADO_CONVENIOS[this.asobancaria.LISTADO_CONVENIOS.length - 1];
      ultimoDetalle.CODIGO_CONVENIO_DET = convenioSelect;
    }

    const detalleConvenio = this.listadoConveniosDet.find(det => det.CODIGO_CONVENIO_DET === convenioSelect);

    if (detalleConvenio) {
        detalle.TIPO_ASOBANCARIA = detalleConvenio.TIPO_ASOBANCARIA;
        this.listadoConveniosNom.ASOBANCARIA=detalleConvenio.NOMBRE_ASOBANCARIA;
        detalle.CORREO_ASOBANCARIA = detalleConvenio.CORREO_ASOBANCARIA;
        detalle.EXCEL = detalleConvenio.EXCEL;
        const nuevoDetalle2: Detalle2 = { ...this.listadoConveniosNom };
        this.nombre_convenios.push(nuevoDetalle2);
    }    
  } 

  fecha(event:any){
    this.asobancaria.FECHA_ASOBANCARIA = formatDate(event.detail.value, 'dd/MM/yyyy', 'en-US');
  }

  generarAsobancaria(){
    this.recaudoService.postGenerarAsobancaria(this.asobancaria).subscribe({
      next: data => {
        console.log("enviado: ",this.asobancaria)
        console.log(data);
        console.log("Convenios generados: ",this.nombre_convenios)
        this.respuesta = data;
        if(this.respuesta.COD=='200'){
          alertify.success(this.respuesta.RESPUESTA);
          this.generado=true;

          this.asobancariaGenerado=this.asobancaria;

          this.generadosConvenio=this.asobancaria.LISTADO_CONVENIOS;
          //this.seleccion=false;
          }
        else  {
          alertify.error(this.respuesta.RESPUESTA);

        }
      
        
  
      },
      error: error => {
        console.log("Respuesta:",error);
      }
    });
    
  }

   
  
}

