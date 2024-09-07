export interface Usuario {
    COD: string;
    USUARIO: string;
    EMPRESA: string;
    DOCUMENTO: string;
    TIPO_DOCUMENTO: string;
    NOMBRE: string;
    DIRECCION: string;
    TELEFONO: string;
    ESTADO: string;
    FECHA_CREACION: Date;
    PASSWORD: string;
    IDENTIFICADOR_ROL: string;
    ROL: string;
    CAJA_ASIGNADA: string;
    TOKEN: string;
  }

  export interface Error_Login {
    COD: string;
    RESPUESTA:string;
  }

  export interface Obtener_Rol {
    COD: string;
    USUARIO:string;
    EMPRESA:string;
    ESTADO:string;
    IDENTIFICADOR_ROL:string;
    ROL:string;
  }


  export interface Crear_Arqueo{
    EMPRESA: string;
    CODIGO_CAJA: string;
    CODIGO_PUNTO_PAGO: string;
    USUARIO: string;
    USUARIO_VALIDA:string;
  }

  export interface Crear_Arqueo_Respuesta{
    COD: string;
    RESPUESTA: number;
    NUMERO_ARQUEO: number;
  }

  export interface Consultar_Arqueo{
    EMPRESA: number;
    USUARIO: string;
    ACCION: string;
    CODIGO_PUNTO_PAGO: number;
  }

  export interface Consultar_Arqueo_Param{
    EMPRESA: number;
    USUARIO: string;
    ACCION: string;
    NUMERO_ARQUEO: string;
    NUMERO_MOVIMIENTO: string;
    VALOR_MOVIMIENTO_DET: string;
    FECHA_MOVIMIENTO: string;
    CODIGO_CLIENTE:string;
    CODIGO_REFERENCIA:string;
  }

  export interface Estado_Arqueo{
    EMPRESA: string;
    NUMERO_ARQUEO: string;
    CODIGO_PUNTO_PAGO: string;
  }

  export interface Entrega_Parcial{
    ACCION: number,
    EMPRESA: string,
    NUMERO_ARQUEO: string,
    USUARIO: string,
    CODIGO_CAJA: string,
    CODIGO_PUNTO_PAGO: string,
    VALOR_TOTAL: string,
    COMENTARIO: string,
    USUARIO_VALIDA: string,
    ENTREGAS_DET: [
        {            
            CODIGO_MONEDA: string,
            CANTIDAD: string,
            VALOR_UNITARIO: string,
            VALOR: string,
            TIPO:string
        },
        {
            CODIGO_MONEDA: string,
            CANTIDAD: string,
            VALOR_UNITARIO: string,
            VALOR: string,
            TIPO: string
        }
    ]
  }

  export interface DetalleCierre {
    PUNTO_PAGO: string;
    CONVENIO: string;
    ID_CAJA:string;
    IDENTIFICADOR: string;
    FECHA:string;
  }

  