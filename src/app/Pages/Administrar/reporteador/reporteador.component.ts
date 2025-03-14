import { Component,OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { RecaudoService } from 'src/app/services/recaudo.service';
import * as XLSX from 'xlsx';
import * as alertify from 'alertifyjs';
import { formatDate } from '@angular/common';
import * as ExcelJS from 'exceljs';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { BorderStyle } from 'exceljs';
import { Cell } from 'exceljs';
import { LoadingController } from '@ionic/angular';


interface CampoReporte {
  [key: string]: string;
}

interface ParametroReporte {
  EMPRESA: string;
  NOMBRE_EMPRESA: string;
  ID_REPORTE: string;
  REPORTE: string;
  PARAMETRO: string;
  TIPO: string;
  NOMBRE_TIPO: string;
  VALOR_DEFECTO: string;
  HTML_TYPE: string; 
}

@Component({
  selector: 'app-reporteador',
  templateUrl: './reporteador.component.html',
  styleUrls: ['./reporteador.component.scss'],
})


export class ReporteadorComponent  implements OnInit {

  //#region Variables
  empresa: string|null = localStorage.getItem('empresaCOD');
  usuario: string|null = localStorage.getItem('usuario');
  token: string|null = localStorage.getItem('token');
  rol : string|null = localStorage.getItem('rol');

  listadoReportesActivos:any[]=[];
  listadoReportesInactivos:any[]=[];
  listEmpresas: any[] = [];
  listadoPuntosPago: any[] = [];
  listadoConvenios:any []=[];
  listadoFacturasConvenio:any []=[];
  listadoSubPuntos:any[]=[];
  listadoUsuarios:any[]=[];
  reporteSeleccionado="";
  nombreReporteSeleccionado="";
  parametros:boolean=false;
  seleccionarTodos: boolean = false;
  reporteLink = "";
  respuesta:any;
  tituloArchivo="";
  filteredList: any[] = [];
  filteredList2: any[] = [];
  filteredUsuarios: any[] = [];
  searchTerm: string = '';
  searchTerm2: string = '';
  searchTerm3: string = '';
  IterarPeticion:boolean=false;

  convenio=0;
  puntoPago=0;

  parametross: { [key: string]: any } = {};
  parametrosKeys: string[] = [];
  puntosPagoSeleccionados: { codigo: string; nombre: string; }[] = [];
  deshabiltarCampo: { [key: string]: boolean } = {};

  datosModificar={
    EMPRESA: this.empresa,
    ID_REPORTE: "",
    ESTADO:"",
    USUARIO:this.usuario,
    TOKEN:this.token
  }
  tipoParametro: any[]=[];
  checkboxEstado: { [key: string]: boolean } = {};

  //#endregion

  constructor(private recaudoService: RecaudoService, 
    private router: Router, 
    private http: HttpClient,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.tituloArchivo="";
    this.ListarReportes();
    this.obtenerEmpresas();
    this.obtenerPuntosPago();
    this.ListarConvenios();
    this.inicializarCheckboxEstado();
    this.ListarSubPuntos();
    this.ListarUsuariosGeneral();
    this.seleccionarTodos=false;
  }

  //#region Creación de reporte dinamico
  generarReporte(todosLosCampos: CampoReporte[], nombreReporte: string, imagen: string): Promise<void> {
    return new Promise((resolve, reject) => {
        try {
            this.exportExcel(todosLosCampos, nombreReporte, imagen);
            // Simula un pequeño retraso si necesitas garantizar la generación completa del archivo
            setTimeout(() => {
                resolve(); // Marca la promesa como resuelta
            }, 1000); // Ajusta el tiempo si es necesario
        } catch (error) {
            reject(error); // Marca la promesa como rechazada en caso de error
        }
    });
}
  
  async exportExcel(data: any[], fileName: string, imageSrc: string): Promise<void> {
    
    fileName = fileName.replace(/_/g, ' ')+this.tituloArchivo;
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Datos', {
      views: [{ showGridLines: false }]
    });

    const columna = this.respuesta.REPORTES[0].COLUMNA_EXCEL;
    let colNumber = columna.charCodeAt(0) - 65;


    let filaBase = Number(this.respuesta.REPORTES[0].FILA_EXCEL);
    
    let maxColIndex = colNumber;
    const usuariosIDs: { usuario: string, id: string }[] = [];

    this.respuesta.REPORTES.forEach((reporte: { CAMPOS_REPORTE: CampoReporte[], NUMERO_CONSULTA: string }) => {
      

      if (this.parametross['ID_REPORTE']!="23" && reporte.NUMERO_CONSULTA == "4") {
        reporte.CAMPOS_REPORTE.forEach((camposReporte: CampoReporte) => {
          const usuarioID = {
              usuario: camposReporte['USUARIO'],
              id: camposReporte['ID']
          };
          usuariosIDs.push(usuarioID);
          
        });
      }

      else if(this.parametross['ID_REPORTE']=="23" && reporte.NUMERO_CONSULTA == "1"){
        reporte.CAMPOS_REPORTE.forEach((camposReporte: CampoReporte) => {
          const usuarioID = {
              usuario: camposReporte['USUARIO'],
              id: camposReporte['ID']
          };
          
          usuariosIDs.push(usuarioID);
        });
      }
    
      const modifiedColumnHeaders: string[] = [];

      const allColumnHeaders: string[] = [];
      reporte.CAMPOS_REPORTE.forEach((campo: CampoReporte) => {
        const columnHeaders = Object.keys(campo).map(header => {
            const match = header.match(/(N_CUPONES|VALOR)_(\d+)/);
            const match2 = header.match(/(N_CUPONES|VALOR_E)_(\d+)/);
            const match3 = header.match(/(N_CUPONES|VALOR_T)_(\d+)/);
            if (match) {
                const field = match[1]; 
                const userID = match[2]; 
                const usuarioEncontrado = usuariosIDs.find(usuario => usuario.id === userID);
                if (usuarioEncontrado) {
                  
                    if (field === 'VALOR') {
                        return header;
                    } 
                    if(field=== 'N_CUPONES'){
                      return usuarioEncontrado.usuario;
                    }
                    else {
                        return header.replace(/_/g, ' ');
                    }
                } else {
                    return ''; 
                }
            }
            else if (match2) {
              const field = match2[1]; 
              const userID = match2[2]; 
              const usuarioEncontrado = usuariosIDs.find(usuario => usuario.id === userID);
              if (usuarioEncontrado) {
                
                  if (field === 'VALOR') {
                      return header;
                  } 
                  if(field=== 'N_CUPONES'){
                    return usuarioEncontrado.usuario;
                  }
                  else {
                      return header.replace(/_/g, ' ');
                  }
              } else {
                  return ''; 
              }
            }
            else if (match3) {
              const field = match3[1]; 
              const userID = match3[2]; 
              const usuarioEncontrado = usuariosIDs.find(usuario => usuario.id === userID);
              if (usuarioEncontrado) {
                
                  if (field === 'VALOR') {
                      return header;
                  } 
                  if(field=== 'N_CUPONES'){
                    return usuarioEncontrado.usuario;
                  }
                  else {
                      return header.replace(/_/g, ' ');
                  }
              } else {
                  return ''; 
              }
            } else {
                return header.replace(/_/g, ' ');
            }
        });
        allColumnHeaders.push(...columnHeaders.filter(header => header !== ''));
    });

      const uniqueColumnHeaders = Array.from(new Set(allColumnHeaders));
      modifiedColumnHeaders.push(...uniqueColumnHeaders);

      worksheet.getRow(filaBase).values = modifiedColumnHeaders;
   
      
      const titleRow = worksheet.getRow(filaBase);
      
  
      titleRow.eachCell((cell) => {
        if (this.parametross['ID_REPORTE']=="6" && reporte.NUMERO_CONSULTA === "6") {
          if (cell.value && typeof cell.value === 'string' && (/N_CUPONES/.test(cell.value) || /VALOR/.test(cell.value))) {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFA9A9A9' }
            };
          }else {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFFA500' }
            };
          }
        }
        else {
          cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFFFA500' }
          };
        }
        cell.border = {
            top: { style: 'thick' as BorderStyle },
            left: { style: 'thick' as BorderStyle },
            bottom: { style: 'thick' as BorderStyle },
            right: { style: 'thick' as BorderStyle }
        };
        cell.font = {
            bold: true
        };
      });

      filaBase++;
      
      let sumaValores: { [key: string]: number } = {};
      let sumaN: { [key: string]: number } = {};
      const columnasPorTitulo: { [titulo: string]: number } = {};
      const columnasTitulosValor: number[] = []; 
      const columnasTitulosN: number[] = []; 
      reporte.CAMPOS_REPORTE.forEach((campo: CampoReporte) => {
        let colIndex = colNumber;
        Object.keys(campo).forEach((key) => {
          
            if (colIndex > maxColIndex) {
                maxColIndex = colIndex;
            }
            if (/VALOR/.test(key) && reporte.NUMERO_CONSULTA!="5" && reporte.NUMERO_CONSULTA!="6" && this.parametross['ID_REPORTE']!="23" && reporte.NUMERO_CONSULTA!="2") {
              const value = parseFloat(campo[key]);
              const titulo = key.replace(/_/g, ' ');
              
              sumaValores[titulo] = (sumaValores[titulo] || 0) + value;
              columnasTitulosValor.push(colIndex);
            }
            if (/N_/.test(key) && reporte.NUMERO_CONSULTA!="5" && reporte.NUMERO_CONSULTA!="6" && reporte.NUMERO_CONSULTA!="2") {
              const value = parseFloat(campo[key]);
              const titulo = key.replace(/_/g, ' ');
              
              sumaN[titulo] = (sumaN[titulo] || 0) + value;
              columnasTitulosN.push(colIndex);
            }

            if (/VALOR/.test(key) && this.parametross['ID_REPORTE']=="7" && reporte.NUMERO_CONSULTA =="2") {
              const value = parseFloat(campo[key]);
              const titulo = key.replace(/_/g, ' ');
              
              sumaValores[titulo] = (sumaValores[titulo] || 0) + value;
              columnasTitulosValor.push(colIndex);
            }
            if (/N_/.test(key) && this.parametross['ID_REPORTE']=="7" && reporte.NUMERO_CONSULTA =="2") {
              const value = parseFloat(campo[key]);
              const titulo = key.replace(/_/g, ' ');
              
              sumaN[titulo] = (sumaN[titulo] || 0) + value;
              columnasTitulosN.push(colIndex);
            }

            if (/VALOR/.test(key) && this.parametross['ID_REPORTE']=="11" && reporte.NUMERO_CONSULTA =="2") {
              const value = parseFloat(campo[key]);
              const titulo = key.replace(/_/g, ' ');
              
              sumaValores[titulo] = (sumaValores[titulo] || 0) + value;
              columnasTitulosValor.push(colIndex);
            }
            if (/N_/.test(key) && this.parametross['ID_REPORTE']=="11" && reporte.NUMERO_CONSULTA =="2") {
              const value = parseFloat(campo[key]);
              const titulo = key.replace(/_/g, ' ');
              
              sumaN[titulo] = (sumaN[titulo] || 0) + value;
              columnasTitulosN.push(colIndex);
            }

            if(reporte.NUMERO_CONSULTA=="5" || this.parametross['ID_REPORTE']=="23" && reporte.NUMERO_CONSULTA=="2"){
              const value = campo[key];
              
              if (key.startsWith('N_CUPONES_') || key.startsWith('VALOR_')) {
                
                  if(!/VALOR_TOTAL/.test(key)){

                    const lastUnderscoreIndex = key.lastIndexOf('_');
                    const userId = key.substring(lastUnderscoreIndex + 1); 
                    const usuarioEncontrado = usuariosIDs.some(usuario => usuario.id === userId);  

                    if (!usuarioEncontrado) {
                      return; 
                    }
                    
                  }
                  
                  if (/VALOR/.test(key)) {
                    
                    if(campo[key]==""){
                      campo[key]="0";
                    }
                    const value = parseFloat(campo[key]);
                    const titulo = key.replace(/_/g, ' ');
                    
                    sumaValores[titulo] = (sumaValores[titulo] || 0) + value;
                    columnasTitulosValor.push(colIndex);
                    const cell = worksheet.getCell(`${getColumnLetter(colIndex)}${filaBase}`);
                    cell.value = value;
                    cell.numFmt = '"$"#,##0'; 
                    cell.alignment = { horizontal: 'left' };
                    if(/VALOR_TOTAL/.test(key)){
                      console.log("valor total")
                  
                      applyStyles2(cell);
                    }
                  }
                  else if (/N_/.test(key)) {
                    const value = parseFloat(campo[key]);
                    const titulo = key.replace(/_/g, ' ');
                    
                    sumaN[titulo] = (sumaN[titulo] || 0) + value;
                    columnasTitulosN.push(colIndex);
                    worksheet.getCell(`${getColumnLetter(colIndex)}${filaBase}`).value = value; 
                  }
                  else{

                    worksheet.getCell(`${getColumnLetter(colIndex)}${filaBase}`).value = value; 
                  }
              }else{
                worksheet.getCell(`${getColumnLetter(colIndex)}${filaBase}`).value = value; 
              }
              colIndex++;
            }

            else if(reporte.NUMERO_CONSULTA=="6" && this.parametross['ID_REPORTE']!="23"){
              const value = campo[key];
              if (key.startsWith('N_CUPONES_') || key.startsWith('VALOR_E_') || key.startsWith('VALOR_T_')) {
                  const lastUnderscoreIndex = key.lastIndexOf('_');
                  const userId = key.substring(lastUnderscoreIndex + 1); 
                  const usuarioEncontrado = usuariosIDs.some(usuario => usuario.id === userId);  
                  if (!usuarioEncontrado) {
                      return; 
                  }
                  if (/VALOR_E/.test(key)) {
                    if(campo[key]==""){
                      campo[key]="0"
                    }
                    const value = parseFloat(campo[key]);
                    const titulo = key.replace(/_/g, ' ');
                    
                    sumaValores[titulo] = (sumaValores[titulo] || 0) + value;
                    columnasTitulosValor.push(colIndex);
                    const cell = worksheet.getCell(`${getColumnLetter(colIndex)}${filaBase}`);
                    cell.value = value;
                    cell.numFmt = '"$"#,##0'; 
                    cell.alignment = { horizontal: 'left' }; 
                  }

                  else if (/VALOR_T/.test(key)) {
                    if(campo[key]==""){
                      campo[key]="0"
                    }
                    const value = parseFloat(campo[key]);
                    const titulo = key.replace(/_/g, ' ');
                    
                    sumaValores[titulo] = (sumaValores[titulo] || 0) + value;
                    columnasTitulosValor.push(colIndex);
                    const cell = worksheet.getCell(`${getColumnLetter(colIndex)}${filaBase}`);
                    cell.value = value;
                    cell.numFmt = '"$"#,##0'; 
                    cell.alignment = { horizontal: 'left' }; 
                  }
                  
                  else if (/N_/.test(key)) {
                    const value = parseFloat(campo[key]);
                    const titulo = key.replace(/_/g, ' ');
                    
                    sumaN[titulo] = (sumaN[titulo] || 0) + value;
                    columnasTitulosN.push(colIndex);
                    worksheet.getCell(`${getColumnLetter(colIndex)}${filaBase}`).value = value; 
                  }
                  else{

                    worksheet.getCell(`${getColumnLetter(colIndex)}${filaBase}`).value = value; 
                  }
              }else{
                worksheet.getCell(`${getColumnLetter(colIndex)}${filaBase}`).value = value; 
              }
              colIndex++;
            }

            else {
              
              if (/VALOR/.test(key)) {
                if(campo[key]==""){
                  campo[key]="0"
                }
                const value = parseFloat(campo[key]);
                const cell = worksheet.getCell(`${getColumnLetter(colIndex)}${filaBase}`);
                cell.value = value;
                cell.numFmt = '"$"#,##0'; 
                cell.alignment = { horizontal: 'left' }; 
                if(/VALOR_TOTAL/.test(key)){
                  
                  applyStyles2(cell);
                }
              }
              else if (/N_/.test(key)) {
                const value = parseFloat(campo[key]);
                const cell = worksheet.getCell(`${getColumnLetter(colIndex)}${filaBase}`);
                cell.value = value;
                cell.numFmt = '0'; 
                cell.alignment = { horizontal: 'right' }; 

              }else{
                const value = campo[key];
                worksheet.getCell(`${getColumnLetter(colIndex)}${filaBase}`).value = value;
                
              }
                
                colIndex++;
            }
            
        });
        
        filaBase++;

      });
      Object.keys(sumaValores).forEach((titulo, index) => {
        const columna = obtenerColumnaPorTitulo(titulo, columnasTitulosValor[index], columnasPorTitulo);
        const valor = sumaValores[titulo];
        
        const cell = worksheet.getCell(`${getColumnLetter(columna)}${filaBase}`);
        cell.value = valor;
        cell.numFmt = '"$"#,##0'; 
        cell.alignment = { horizontal: 'left' }; 
        const firstCustomTitleCell = worksheet.getCell(`${getColumnLetter(columna)}${filaBase}`);
        applyStyles(firstCustomTitleCell);
      });
      Object.keys(sumaN).forEach((titulo, index) => {
        const columna = obtenerColumnaPorTitulo(titulo, columnasTitulosN[index], columnasPorTitulo);
        const valor = sumaN[titulo];
        

        worksheet.getCell(`${getColumnLetter(columna)}${filaBase}`).value = valor;
        const firstCustomTitleCell = worksheet.getCell(`${getColumnLetter(columna)}${filaBase}`);
        applyStyles(firstCustomTitleCell);
      });

      function getColumnLetter(colIndex: number): string {
        const ACode = 'A'.charCodeAt(0);
        const firstLetter = String.fromCharCode(ACode + Math.floor(colIndex / 26) - 1);
        const secondLetter = String.fromCharCode(ACode + colIndex % 26);
        return firstLetter + secondLetter;
      }
     


      function obtenerColumnaPorTitulo(titulo: string, colIndex: number, columnasPorTitulo: { [titulo: string]: number }): number {
        if (!columnasPorTitulo[titulo]) {
          
          columnasPorTitulo[titulo] = colIndex;
        }
        return columnasPorTitulo[titulo];
      }
      
          filaBase += 2;
 
    });
    function applyStyles(cell: Cell) {
      cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFCB6D' }
      };
      cell.border = {
        top: { style: 'thin' as BorderStyle },
        left: { style: 'thin' as BorderStyle },
        bottom: { style: 'thin' as BorderStyle },
        right: { style: 'thin' as BorderStyle }
      };
      cell.font = {
          bold: true
      };
      
    }

    function applyStyles2(cell: Cell) {
      cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'BFBFBF' }
      };
      cell.border = {
        top: { style: 'thin' as BorderStyle },
        left: { style: 'thin' as BorderStyle },
        bottom: { style: 'thin' as BorderStyle },
        right: { style: 'thin' as BorderStyle }
      };
      cell.font = {
          bold: true
      };
      
    }
   
    function applyStylesToCellData(cell: Cell) {
      cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '92D050' }
      };
      cell.border = {
        top: { style: 'thin' as BorderStyle },
        left: { style: 'thin' as BorderStyle },
        bottom: { style: 'thin' as BorderStyle },
        right: { style: 'thin' as BorderStyle }
      };
      cell.font = {
          bold: true
      };
      
    }
    
    

    if(this.parametross['ID_REPORTE']=="6"){
      const customTitles = ['BILLETES', '$ 100.000', '$ 50.000', '$ 20.000', '$ 10.000', '$ 5.000', '$ 2.000', '$ 1.000', 'SUBTOTAL'];

      worksheet.getRow(filaBase+1).getCell(1).value = customTitles[0];

      const firstCustomTitleCell = worksheet.getCell(`${getExcelColumn(1)}${filaBase+1}`);
      applyStylesToCell(firstCustomTitleCell);

      for (let i = 1; i < customTitles.length; i++) {
        const columnIndex = 1 + i;
        worksheet.getRow(filaBase+1).getCell(columnIndex).value = customTitles[i];

        const customTitleCell = worksheet.getCell(`${getExcelColumn(columnIndex)}${filaBase+1}`);
        applyStylesToCell(customTitleCell);
      }

      function applyStylesToCell(cell: Cell) {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '92D050' }
        };
        cell.border = {
          top: { style: 'thick' as BorderStyle },
          left: { style: 'thick' as BorderStyle },
          bottom: { style: 'thick' as BorderStyle },
          right: { style: 'thick' as BorderStyle }
        };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.font = {
            bold: true
        };
      }
      
      function applyBorderToCell(cell: Cell) {
        cell.border = {
          top: { style: 'thin' as BorderStyle },
          left: { style: 'thin' as BorderStyle },
          bottom: { style: 'thin' as BorderStyle },
          right: { style: 'thin' as BorderStyle }
        };
        cell.font = {
            bold: true
        };
      }

      function getExcelColumn(columnIndex: number): string {
          const ACode = 'A'.charCodeAt(0);
          return String.fromCharCode(ACode + columnIndex - 1);
      }

      worksheet.mergeCells(`A${filaBase}:I${filaBase}`);
      const transportadoraCell = worksheet.getCell(`D${filaBase}`);
      transportadoraCell.value = 'TRANSPORTADORA';
      applyStylesToCell(transportadoraCell);

      const fajosCell = worksheet.getCell(`A${filaBase + 2}`);
      fajosCell.value = 'FAJOS';
      applyStylesToCellData(fajosCell)

      const picosCell = worksheet.getCell(`A${filaBase + 3}`);
      picosCell.value = 'PICOS';
      applyStylesToCellData(picosCell)


      const customTitles1 = ['MONEDAS', '$ 1.000', '$ 500', '$ 200', '$ 100', '$ 50','SUBTOTAL'];

      worksheet.getRow(filaBase+4).getCell(1).value = customTitles1[0];

      const firstCustomTitleCell1 = worksheet.getCell(`${getExcelColumn(1)}${filaBase+4}`);
      applyStylesToCell(firstCustomTitleCell1);

      for (let i = 1; i < customTitles1.length; i++) {
        const columnIndex = 1 + i;
        worksheet.getRow(filaBase+4).getCell(columnIndex).value = customTitles1[i];

        const customTitleCell = worksheet.getCell(`${getExcelColumn(columnIndex)}${filaBase+4}`);
        applyStylesToCell(customTitleCell);
      }

      const picos1Cell = worksheet.getCell(`A${filaBase + 5}`);
      picos1Cell.value = 'PICOS';
      applyStylesToCellData(picos1Cell)

      function addBordersToEmptyCellsBelowTitles(startColumn: string, endColumn: string, startRow: number, endRow: number) {
        for (let row = startRow; row <= endRow; row++) {
          for (let col = letterToNumber(startColumn); col <= letterToNumber(endColumn); col++) {
            const cell = worksheet.getCell(numberToLetter(col) + row);
            if (!cell.value) {
                applyBorderToCell(cell);
            }
          }
        }
      }
    
      function letterToNumber(letter: string): number {
        return letter.toUpperCase().charCodeAt(0) - 64;
      }
      
      function numberToLetter(number: number): string {
        return String.fromCharCode(number + 64);
      }
      
      addBordersToEmptyCellsBelowTitles('A', 'I', filaBase + 2, filaBase + 3);
      addBordersToEmptyCellsBelowTitles('A', 'G', filaBase + 5, filaBase + 5);

      worksheet.views = [
        { state: 'frozen', xSplit: 4, showGridLines: false }
      ];

    }

    const colNumerFin = maxColIndex;

    const lastRowIndex = filaBase - 1;
    const lastRow = worksheet.getRow(lastRowIndex);

     
    const startRowIndex = 1;
    const endRowIndex = 4;
    const startColumnIndex = 1;
    const totalColumns = colNumerFin+1;

    for (let rowIndex = startRowIndex; rowIndex <= endRowIndex; rowIndex++) {
      for (let colIndex = startColumnIndex; colIndex <= totalColumns; colIndex++) {
        const cell = worksheet.getCell(rowIndex, colIndex);
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFCB6D' }
        };
        
      }
    }
    
    for (let colIndex = startColumnIndex; colIndex <= totalColumns; colIndex++) {
      let maxWidth = 0;
      for (let rowIndex = startRowIndex; rowIndex <= filaBase ; rowIndex++) {
          
        const cell = worksheet.getCell(rowIndex, colIndex);
        const cellWidth = cell.value ? String(cell.value).length * 1.3 : 0;
        
        if (cellWidth > maxWidth) {
            maxWidth = cellWidth;
        }
      }
      worksheet.getColumn(colIndex).width = maxWidth;
    }

    if (lastRow) {
      for (let i = lastRowIndex; i > 1; i--) {
        const currentRow = worksheet.getRow(i);
        if (currentRow) {
          currentRow.eachCell((cell) => {
            cell.border = {
              top: { style: 'thin' as BorderStyle },
              left: { style: 'thin' as BorderStyle },
              bottom: { style: 'thin' as BorderStyle },
              right: { style: 'thin' as BorderStyle }
            };
    
          });
            
        }
      }
    }

    const row = worksheet.getRow(2);
    const row2 = worksheet.getRow(3);

    let startCell;
    let endCell2;

    
      startCell = row.getCell(Math.ceil (startRowIndex));
      endCell2 = row2.getCell(Math.ceil(colNumerFin));
   
   

    worksheet.mergeCells(startCell.address + ':' + endCell2.address);

    const mergedCell = startCell;
    mergedCell.value = fileName;
    mergedCell.font = { bold: true, size: 14 };
    mergedCell.alignment = { horizontal: 'center', vertical: 'middle' };
    


    this.http.get('assets/logo/logo_energia.png', { responseType: 'blob' }).subscribe(blob => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64Data = reader.result as string;

        const imageId = workbook.addImage({
          base64: base64Data,
          extension: 'png',
        });
        if(colNumerFin<=6){
          worksheet.addImage(imageId, {
            tl: { col: 0, row: 0 },
            ext: { width: 90, height: 50 }
          });
        }else{
          worksheet.addImage(imageId, {
            tl: { col: 0, row: 0 },
            ext: { width: 200, height: 77 }
          });
        }
        

        workbook.xlsx.writeBuffer().then((buffer) => {
          const excelBlob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          saveAs(excelBlob, `${fileName}.xlsx`);
        });
      };
    });
  }

  //#endregion

  //#region Consultas a API y formato de fechas
  
  MostrarMas(respuesta: any) {
    respuesta.selected = !respuesta.selected;
  }

  fecha(event: any){
    this.parametross["FECHA"] = formatDate(event.detail.value, 'dd-MM-yyyy', 'en-US');
  }

  fechaIni(event: any) {
    this.parametross["FECHA_INI"] = formatDate(event.detail.value, 'dd-MM-yyyy', 'en-US');
  }

  fechaFin(event: any) {
    this.parametross["FECHA_FIN"] = formatDate(event.detail.value, 'dd-MM-yyyy', 'en-US');
  }
 
  

  ListarReportes(){
    
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.getReportesReporteador(Number(this.empresa),this.usuario,this.token,).subscribe(
        (data: any) => {
            this.listadoReportesActivos= data.REPORTES_ACTIVOS;
            this.listadoReportesInactivos= data.REPORTES_INACTIVOS;
            this.filteredList = this.listadoReportesActivos;
            this.filteredList2 = this.listadoReportesInactivos;
        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    }
  }

  ListarSubPuntos(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.getListadoSubPuntos(Number(this.empresa),this.usuario,this.token).subscribe(
        (data: any) => {
          this.listadoSubPuntos= data.LISTADO_SUB_PUNTOS_PAGO;
        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    }

  }
  

  Parametros(respuesta1:any){
    this.reporteSeleccionado=respuesta1.ID_REPORTE;
    this.nombreReporteSeleccionado=respuesta1.REPORTE;
    
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.getParametrosReporte(Number(this.empresa),Number(respuesta1.ID_REPORTE),this.usuario,this.token,).subscribe(
        (data: any) => {
          
          this.parametros=true;

          data.PARAMETROS_REPORTE.forEach((parametro: ParametroReporte) => {

            const nombreParametro = parametro.PARAMETRO.replace("&", "");
            this.parametross[nombreParametro] = parametro.VALOR_DEFECTO || '';

            if (parametro.VALOR_DEFECTO !== '') {
              this.deshabiltarCampo[nombreParametro] = true;
            }else{
              this.deshabiltarCampo[nombreParametro] = false;
            }

            this.tipoParametro=data.PARAMETROS_REPORTE;
        
          });
          
          this.parametrosKeys = Object.keys(this.parametross);
        
          
        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    }
  }

  guardarConvenio(event: any) {
    this.convenio = Number(event.detail.value);
    this.ListarFacturasConvenio();
  }

  guardarPuntopago(event: any) {
    this.puntoPago = Number(event.detail.value);
  }

  ListarFacturasConvenio(){
    
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.getListadoFacturas(Number(this.empresa),this.convenio,this.usuario,this.token,).subscribe(
        (data: any) => {
          
          
            this.listadoFacturasConvenio= data.LISTADO_FACTURAS_ACTIVAS;

        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    }
  }


  getTipoParametro(nombreParametro: string): string {
    const parametro = this.tipoParametro.find(param => param.PARAMETRO.replace("&", "") === nombreParametro);
    if (parametro) {
      switch (parametro.NOMBRE_TIPO) {
        case "NUMBER":
          return "number";
        case "DATETIME":
          return "datetime";
        default:
          return "text";
      }
    }
    return "text";
  }

  cerrarParam(){
    this.parametros=false;
    this.parametross={};
    this.parametrosKeys=[];
    this.puntosPagoSeleccionados = [];
    this.convenio=0;
    this.puntoPago=0;
    this.ngOnInit();
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

  ListarConvenios(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.getListarConvenios(Number(this.empresa),this.usuario,this.token).subscribe(
        (data: any) => {
          
          this.listadoConvenios= data.CONVENIOS_ACTIVOS;

        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    }

  }

  
  obtenerPuntosPago() {
    var empresa: string|null =localStorage.getItem('empresaCOD');

    this.recaudoService.getListPuntosPago(Number(empresa)).subscribe({
      next: data => {
        this.listadoPuntosPago = data.PUNTOS_PAGO;
        
      },
      error: error => {
        console.error(error);
      }
    });
  }

  ListarUsuariosGeneral(){
    if (this.empresa !== null && this.usuario !== null && this.token !== null) {
      this.recaudoService.getListadoUsuarios(Number(this.empresa),this.usuario,this.token).subscribe(
        (data: any) => {
          
          this.listadoUsuarios= data.USUARIOS_ACTIVOS;
          this.filteredUsuarios= this.listadoUsuarios

        },
        (error) => {
          console.error('Error al llamar al servicio:', error);
        }
      );
    }

  }

  //#endregion

  //#region Modificar estado de Reporte
  Eliminar(respuesta1:any){
    this.datosModificar={
      EMPRESA: this.empresa,
      ID_REPORTE: respuesta1.ID_REPORTE,
      ESTADO:"I",
      USUARIO:this.usuario,
      TOKEN:this.token
    }

    this.recaudoService.postModificarEstadoReporte(this.datosModificar).subscribe({
      next: data => {
        this.respuesta = data;
        if(this.respuesta.COD=='200'){
          alertify.success(this.respuesta.RESPUESTA);
          this.datosModificar={
            EMPRESA: this.empresa,
            ID_REPORTE: "",
            ESTADO:"",
            USUARIO:this.usuario,
            TOKEN:this.token
          }
          this.ListarReportes();
          }
        else  {
          alertify.error(this.respuesta.RESPUESTA);
        }

      },
      error: error => {
        console.error("Respuesta:",error);
      }
    });
  }

  Activar(respuesta1:any){
    this.datosModificar={
      EMPRESA: this.empresa,
      ID_REPORTE: respuesta1.ID_REPORTE,
      ESTADO:"A",
      USUARIO:this.usuario,
      TOKEN:this.token
    }

    this.recaudoService.postModificarEstadoReporte(this.datosModificar).subscribe({
      next: data => {
        this.respuesta = data;
        if(this.respuesta.COD=='200'){
          alertify.success(this.respuesta.RESPUESTA);
          this.datosModificar={
            EMPRESA: this.empresa,
            ID_REPORTE: "",
            ESTADO:"",
            USUARIO:this.usuario,
            TOKEN:this.token
          }
          this.ListarReportes();
          }
        else  {
          alertify.error(this.respuesta.RESPUESTA);
        }

      },
      error: error => {
        console.error("Respuesta:",error);
      }
    });
  }

  //#endregion

  //#region Selecciones mutiples
  isFieldSpecific(key: string): boolean {
    return key === 'EMPRESA' || key === 'CODIGO_PUNTO_PAGO' || key === 'FECHA_INI' || key === 'FECHA_FIN' || key === 'FECHA' || key === 'CODIGO_CONVENIO' || key === 'USUARIO';
  }

  isDisabled(key: string): boolean {
    
    return this.parametross[key]?.VALOR_DEFECTO !== undefined || this.parametross[key]?.VALOR_DEFECTO !== '';
  }

  toggleSeleccionTodos(isChecked: boolean) {
    if(this.reporteSeleccionado=="9" ||this.reporteSeleccionado=="39" ||this.reporteSeleccionado=="31"){
      if (isChecked) {
        for (const convenio of this.listadoConvenios) {
          this.checkboxEstado[convenio.CODIGO_CONVENIO] = true;
        }
        this.puntosPagoSeleccionados = this.listadoConvenios.map(convenio => ({ codigo: convenio.CODIGO_CONVENIO, nombre: convenio.NOMBRE_CONVENIO }));
      } else {
        for (const convenio of this.listadoConvenios) {
          this.checkboxEstado[convenio.CODIGO_CONVENIO] = false;
        }
        this.puntosPagoSeleccionados = [];
      }

    }else if(this.reporteSeleccionado=="14"){
      if (isChecked) {
        for (const conveniodet of this.listadoFacturasConvenio) {
          this.checkboxEstado[conveniodet.CODIGO_CONVENIO_DET] = true;
        }
        this.puntosPagoSeleccionados = this.listadoFacturasConvenio.map(conveniodet => ({ codigo: conveniodet.CODIGO_CONVENIO_DET, nombre: conveniodet.NOMBRE_CONVENIO_DET }));
      } else {
        for (const conveniodet of this.listadoFacturasConvenio) {
          this.checkboxEstado[conveniodet.CODIGO_CONVENIO_DET] = false;
        }
        this.puntosPagoSeleccionados = [];
      }
    }

    else if(this.reporteSeleccionado=="23"){
      if (isChecked) {
        for (const Subpunto of this.listadoSubPuntos) {
          this.checkboxEstado[Subpunto.VALOR] = true;
        }
        this.puntosPagoSeleccionados = this.listadoSubPuntos.map(Subpunto => ({ codigo: Subpunto.VALOR, nombre: Subpunto.VALOR }));
      } else {
        for (const Subpunto of this.listadoSubPuntos) {
          this.checkboxEstado[Subpunto.VALOR] = false;
        }
        this.puntosPagoSeleccionados = [];
      }
    }
    // else if(this.reporteSeleccionado=="16" || this.reporteSeleccionado=="28" || this.reporteSeleccionado=="29" || this.reporteSeleccionado=="30" || this.reporteSeleccionado=='38'){
    //   if (isChecked) {
    //     for (const usuario of this.listadoUsuarios) {
    //       this.checkboxEstado[usuario.USUARIO] = true;
    //     }
    //     this.puntosPagoSeleccionados = this.listadoUsuarios.map(usuario => ({ codigo: usuario.USUARIO, nombre: usuario.NOMBRE }));
    //   } else {
    //     for (const usuario of this.listadoUsuarios) {
    //       this.checkboxEstado[usuario.USUARIO] = false;
    //     }
    //     this.puntosPagoSeleccionados = [];
    //   }
    // }
    
    else{
      for(let key of this.parametrosKeys){
        switch (key){
          case 'USUARIO':
            if (isChecked) {
              for (const usuario of this.filteredUsuarios) {
                this.checkboxEstado[usuario.USUARIO] = true;
              }
              this.puntosPagoSeleccionados = this.filteredUsuarios.map(usuario => ({ codigo: usuario.USUARIO, nombre: usuario.NOMBRE }));
            } else {
              for (const usuario of this.filteredUsuarios) {
                this.checkboxEstado[usuario.USUARIO] = false;
              }
              this.puntosPagoSeleccionados = [];
            }
            break;
          default:
            if (isChecked) {
              for (const puntopago of this.listadoPuntosPago) {
                this.checkboxEstado[puntopago.CODIGO] = true;
              }
              this.puntosPagoSeleccionados = this.listadoPuntosPago.map(puntopago => ({ codigo: puntopago.CODIGO, nombre: puntopago.NOMBRE }));
            } else {
              for (const puntopago of this.listadoPuntosPago) {
                this.checkboxEstado[puntopago.CODIGO] = false;
              }
              this.puntosPagoSeleccionados = [];
            }
            break;
        }
      }

    }
    
  }


  togglePuntoPago(codigo: string, nombre: string, isChecked: boolean) {
    if (isChecked) {
      this.puntosPagoSeleccionados.push({ codigo: codigo, nombre: nombre });
    } else {
      const index = this.puntosPagoSeleccionados.findIndex(punto => punto.codigo === codigo);
      if (index !== -1) {
        this.puntosPagoSeleccionados.splice(index, 1);
      }
    }
  }

  inicializarCheckboxEstado() {
    for (const puntopago of this.listadoPuntosPago) {
      this.checkboxEstado[puntopago.CODIGO] = false;
    }
    for (const convenio of this.listadoConvenios) {
      this.checkboxEstado[convenio.CODIGO_CONVENIO] = false;
    }
    for (const convenio of this.listadoFacturasConvenio) {
      this.checkboxEstado[convenio.CODIGO_CONVENIO_DET] = false;
    }
    for (const Subpunto of this.listadoSubPuntos) {
      this.checkboxEstado[Subpunto.VALOR] = false;
    }
    for (const usuario of this.filteredUsuarios) {
      this.checkboxEstado[usuario.USUARIO] = false;
    }
  }



  //#endregion

  //#region Generar reportes

  async GenerarReporte(){
    const loading = await this.loadingController.create({
      message: 'Generando Reporte...',
      spinner: 'crescent',
      cssClass: 'custom-loading'
    });

    await loading.present();
    this.parametross['ID_REPORTE'] = this.reporteSeleccionado;
    this.parametross['TOKEN'] = this.token;
    this.parametross['USUARIO'] = this.usuario;
    let fecha = "";
    for(let key of this.parametrosKeys){
      switch (key){
        case "FECHA_INI":
          if(this.parametross["FECHA_INI"]==""){
            this.parametross["FECHA_INI"]= new Date().toISOString();
            this.parametross["FECHA_INI"]= formatDate(this.parametross["FECHA_INI"],'dd-MM-yyyy', 'en-US');
            fecha=this.parametross["FECHA_INI"]+" a "+this.parametross["FECHA_FIN"];
          }else{
            fecha=this.parametross["FECHA_INI"]+" a "+this.parametross["FECHA_FIN"];
          }
        break;
        case "FECHA_FIN":
          if(this.parametross["FECHA_FIN"]==""){
            this.parametross["FECHA_FIN"]= new Date().toISOString();
            this.parametross["FECHA_FIN"]= formatDate(this.parametross["FECHA_FIN"],'dd-MM-yyyy', 'en-US');
            fecha=this.parametross["FECHA_INI"]+" a "+this.parametross["FECHA_FIN"];
          }else{
            fecha=this.parametross["FECHA_INI"]+" a "+this.parametross["FECHA_FIN"];
          }
        break;
        case "FECHA":
          if(this.parametross["FECHA"]==""){
            this.parametross["FECHA"]= new Date().toISOString();
            this.parametross["FECHA"]= formatDate(this.parametross["FECHA"],'dd-MM-yyyy', 'en-US');
            fecha=this.parametross["FECHA"];
          }else{
            fecha=this.parametross["FECHA"];
          }
        break;
        default:
        break;
      }
    }
    if(this.reporteSeleccionado=='1'){
      this.puntosPagoSeleccionados.forEach(puntoPago => {
        const parametrosParaPuntoPago = { ...this.parametross, CODIGO_PUNTO_PAGO: puntoPago.codigo };
        
        this.recaudoService.postGenerarReporteExcel(parametrosParaPuntoPago).subscribe({
          next: async data => {
            
            this.respuesta = data;
    
            if(this.respuesta.COD=='200' && this.respuesta.REPORTES!=""){
              this.tituloArchivo=" - "+puntoPago.nombre+" ( "+fecha+" )";
              const nombreReporte = this.respuesta.REPORTES[0].NOMBRE_REPORTE;
              const imagen="../../assets/logo/logo_energia.png";
              let todosLosCampos: CampoReporte[] = [];
    
              this.respuesta.REPORTES.forEach((reporte: { CAMPOS_REPORTE: CampoReporte[] }) => {
                reporte.CAMPOS_REPORTE.forEach((campo: CampoReporte) => {
                    todosLosCampos.push(campo);
                });
              });
    
              try {
                await this.generarReporte(todosLosCampos, nombreReporte, imagen);
                await loading.dismiss(); 
                alertify.success("REPORTE GENERADO");
              } catch (error) {
                  console.error("Error al generar el reporte:", error);
                  await loading.dismiss();
                  alertify.error("ERROR EN REPORTE GENERADO");
              }
             
            }else if((this.respuesta.REPORTES=="")){
              alertify.error("NO HAY INFORMACIÓN PARA REPORTAR");
            }
            else  {
              alertify.error(this.respuesta.RESPUESTA);
            }
            if (puntoPago === this.puntosPagoSeleccionados[this.puntosPagoSeleccionados.length - 1]) {
              this.puntosPagoSeleccionados = [];
              this.ngOnInit();
            }
            await loading.dismiss();
          },
          error: async error => {
            console.error("Respuesta:",error);
            await loading.dismiss();
          }
          
        });
      });
    }
    else if(this.reporteSeleccionado=='27'){
      this.recaudoService.postGenerarReporteExcel(this.parametross).subscribe({
        next: async data => {
          
          this.respuesta = data;
  
          if(this.respuesta.COD=='200' && this.respuesta.RUTA!=""){
   
            try {
              //window.open('file://172.25.2.2/reportes2/Reporte_Datos_Originales.xls', '_blank');
              this.reporteLink=this.respuesta.RUTA;
              await loading.dismiss();
              alertify.success("REPORTE GENERADO");
            } catch (error) {
                console.error("Error al generar el reporte:", error);
                await loading.dismiss();
                alertify.error("ERROR EN REPORTE GENERADO");
            }
            
          }else if((this.respuesta.REPORTES=="")){
            alertify.error("NO HAY INFORMACIÓN PARA REPORTAR");
            await loading.dismiss();
          }
          else  {
            alertify.error(this.respuesta.RESPUESTA);
            await loading.dismiss();
          }
          this.convenio=0;
          this.puntoPago=0;
        
        },
        error: async error => {
          console.error("Respuesta:",error);
          await loading.dismiss();
        }
        
      });
    }
    else if(this.reporteSeleccionado=='9' || this.reporteSeleccionado=='39'||this.reporteSeleccionado=="31"){
      this.puntosPagoSeleccionados.forEach(convenio => {
        const parametrosParaPuntoPago = { ...this.parametross, CODIGO_CONVENIO: convenio.codigo };
        this.recaudoService.postGenerarReporteExcel(parametrosParaPuntoPago).subscribe({
          next: async data => {
            
            this.respuesta = data;
    
            if(this.respuesta.COD=='200' && this.respuesta.REPORTES!=""){
              this.tituloArchivo=" - "+convenio.nombre+" ( "+fecha+" )";
              const nombreReporte = this.respuesta.REPORTES[0].NOMBRE_REPORTE;
              const imagen="../../assets/logo/logo_energia.png";
              let todosLosCampos: CampoReporte[] = [];
    
              this.respuesta.REPORTES.forEach((reporte: { CAMPOS_REPORTE: CampoReporte[] }) => {
                reporte.CAMPOS_REPORTE.forEach((campo: CampoReporte) => {
                    todosLosCampos.push(campo);
                });
              });
    
              try {
                await this.generarReporte(todosLosCampos, nombreReporte, imagen);
                await loading.dismiss(); 
                alertify.success("REPORTE GENERADO");
              } catch (error) {
                  console.error("Error al generar el reporte:", error);
                  await loading.dismiss();
                  alertify.error("ERROR EN REPORTE GENERADO");
              }
             
            }else if((this.respuesta.REPORTES=="")){
              alertify.error("NO HAY INFORMACIÓN PARA REPORTAR");
            }
            else  {
              alertify.error(this.respuesta.RESPUESTA);
            }
            if (convenio === this.puntosPagoSeleccionados[this.puntosPagoSeleccionados.length - 1]) {
              this.puntosPagoSeleccionados = [];
              this.ngOnInit();
            }
            await loading.dismiss();
          },
          error: async error => {
            console.error("Respuesta:",error);
            await loading.dismiss();
          }
          
        });
      });
    }
    else if(this.reporteSeleccionado=='14'){
      this.puntosPagoSeleccionados.forEach(conveniodet => {
        const parametrosParaPuntoPago = { ...this.parametross, CODIGO_FACTURA: conveniodet.codigo };
        
        this.recaudoService.postGenerarReporteExcel(parametrosParaPuntoPago).subscribe({
          next: async data => {
            
            this.respuesta = data;
    
            if(this.respuesta.COD=='200' && this.respuesta.REPORTES!=""){
              this.tituloArchivo=" - "+conveniodet.nombre+" ( "+fecha+" )";
              const nombreReporte = this.respuesta.REPORTES[0].NOMBRE_REPORTE;
              const imagen="../../assets/logo/logo_energia.png";
              let todosLosCampos: CampoReporte[] = [];
    
              this.respuesta.REPORTES.forEach((reporte: { CAMPOS_REPORTE: CampoReporte[] }) => {
                reporte.CAMPOS_REPORTE.forEach((campo: CampoReporte) => {
                    todosLosCampos.push(campo);
                });
              });
    
              try {
                await this.generarReporte(todosLosCampos, nombreReporte, imagen);
                await loading.dismiss(); 
                alertify.success("REPORTE GENERADO");
              } catch (error) {
                  console.error("Error al generar el reporte:", error);
                  await loading.dismiss();
                  alertify.error("ERROR EN REPORTE GENERADO");
              }
             
            }else if((this.respuesta.REPORTES=="")){
              alertify.error("NO HAY INFORMACIÓN PARA REPORTAR");
            }
            else  {
              alertify.error(this.respuesta.RESPUESTA);
            }
            if (conveniodet === this.puntosPagoSeleccionados[this.puntosPagoSeleccionados.length - 1]) {
              this.puntosPagoSeleccionados = [];
              this.ngOnInit();
            }
            await loading.dismiss();
          },
          error: async error => {
            console.error("Respuesta:",error);
            await loading.dismiss();
          }
          
        });
      });
    }
    else if(this.reporteSeleccionado=='23'){
      this.puntosPagoSeleccionados.forEach(Subpunto => {
        const parametrosParaPuntoPago = { ...this.parametross, SUB_PUNTO_PAGO: Subpunto.codigo };
        
        this.recaudoService.postGenerarReporteExcel(parametrosParaPuntoPago).subscribe({
          next: async data => {
            
            this.respuesta = data;
    
            if(this.respuesta.COD=='200' && this.respuesta.REPORTES!=""){
              this.tituloArchivo=" - "+Subpunto.nombre+" ( "+fecha+" )";
              const nombreReporte = this.respuesta.REPORTES[0].NOMBRE_REPORTE;
              const imagen="../../assets/logo/logo_energia.png";
              let todosLosCampos: CampoReporte[] = [];
    
              this.respuesta.REPORTES.forEach((reporte: { CAMPOS_REPORTE: CampoReporte[] }) => {
                reporte.CAMPOS_REPORTE.forEach((campo: CampoReporte) => {
                    todosLosCampos.push(campo);
                });
              });
    
              try {
                await this.generarReporte(todosLosCampos, nombreReporte, imagen);
                await loading.dismiss(); 
                alertify.success("REPORTE GENERADO");
              } catch (error) {
                  console.error("Error al generar el reporte:", error);
                  await loading.dismiss();
                  alertify.error("ERROR EN REPORTE GENERADO");
              }
             
            }else if((this.respuesta.REPORTES=="")){
              alertify.error("NO HAY INFORMACIÓN PARA REPORTAR");
            }
            else  {
              alertify.error(this.respuesta.RESPUESTA);
            }
            if (Subpunto === this.puntosPagoSeleccionados[this.puntosPagoSeleccionados.length - 1]) {
              this.puntosPagoSeleccionados = [];
              this.ngOnInit();
            }
            await loading.dismiss();
          },
          error: async error => {
            console.error("Respuesta:",error);
            await loading.dismiss();
          }
          
        });
      });
    }
    
    else{
      for(let key of this.parametrosKeys){
        switch (key){
          case 'USUARIO':
            if(this.rol!='R_CAJERO_ENC' && this.rol!='R_ADMINISTRADOR'){
              this.IterarPeticion=true;
              this.recaudoService.postGenerarReporteExcel(this.parametross).subscribe({
                next: async data => {
                  console.log("Entro aqui")
                  let subTitulo=""
                  
                  if(this.convenio>0){
                    if(this.reporteSeleccionado=="25" || this.reporteSeleccionado=="39" ||this.reporteSeleccionado=="31"){
                      const parametro = this.listadoConvenios.find(param => param.CODIGO_CONVENIO=== String(this.convenio));
                      subTitulo=parametro.NOMBRE_CONVENIO;
                      
                    }else{
                      const parametro = this.listadoFacturasConvenio.find(param => param.CODIGO_CONVENIO_DET=== String(this.convenio));
                  
                      subTitulo=parametro.NOMBRE_CONVENIO_DET;
                    }
                  }
                  else if(this.puntoPago>0){
                    const parametro2 = this.listadoPuntosPago.find(param => param.CODIGO === String(this.puntoPago));
                    subTitulo=parametro2.NOMBRE;
                  }
                  
                  this.respuesta = data;
          
                  if(this.respuesta.COD=='200' && this.respuesta.REPORTES!=""){
                    this.tituloArchivo=" - "+subTitulo+" - "+this.usuario+" ( "+fecha+" )";
                    const nombreReporte = this.respuesta.REPORTES[0].NOMBRE_REPORTE;
                    const imagen="../../assets/logo/logo_energia.png";
                    let todosLosCampos: CampoReporte[] = [];
          
                    this.respuesta.REPORTES.forEach((reporte: { CAMPOS_REPORTE: CampoReporte[] }) => {
                      reporte.CAMPOS_REPORTE.forEach((campo: CampoReporte) => {
                          todosLosCampos.push(campo);
                      });
                    });
          
                    try {
                      await this.generarReporte(todosLosCampos, nombreReporte, imagen);
                      await loading.dismiss(); 
                      alertify.success("REPORTE GENERADO");
                    } catch (error) {
                        console.error("Error al generar el reporte:", error);
                        await loading.dismiss();
                        alertify.error("ERROR EN REPORTE GENERADO");
                    }
                   
                  }else if((this.respuesta.REPORTES=="")){
                    alertify.error("NO HAY INFORMACIÓN PARA REPORTAR");
                  }
                  else  {
                    alertify.error(this.respuesta.RESPUESTA);
                  }
                  this.convenio=0;
                  this.puntoPago=0;
                  await loading.dismiss();
                
                },
                error: async error => {
                  console.error("Respuesta:",error);
                  await loading.dismiss();
                }
                
              });
            }else{
              this.IterarPeticion=true;
              this.puntosPagoSeleccionados.forEach(usuario => {
                const parametrosParaPuntoPago = { ...this.parametross, USUARIO: usuario.codigo };
                
                this.recaudoService.postGenerarReporteExcel(parametrosParaPuntoPago).subscribe({
                  next: async data => {
                    
                    this.respuesta = data;
            
                    if(this.respuesta.COD=='200' && this.respuesta.REPORTES!=""){
                      this.tituloArchivo=" - "+usuario.nombre+" ( "+fecha+" )";
                      const nombreReporte = this.respuesta.REPORTES[0].NOMBRE_REPORTE;
                      const imagen="../../assets/logo/logo_energia.png";
                      let todosLosCampos: CampoReporte[] = [];
            
                      this.respuesta.REPORTES.forEach((reporte: { CAMPOS_REPORTE: CampoReporte[] }) => {
                        reporte.CAMPOS_REPORTE.forEach((campo: CampoReporte) => {
                            todosLosCampos.push(campo);
                        });
                      });

                      try {
                        await this.generarReporte(todosLosCampos, nombreReporte, imagen);
                        await loading.dismiss(); 
                        alertify.success("REPORTE GENERADO");
                      } catch (error) {
                          console.error("Error al generar el reporte:", error);
                          await loading.dismiss();
                          alertify.error("ERROR EN REPORTE GENERADO");
                      }
                     
                    }else if((this.respuesta.REPORTES=="")){
                      alertify.error("NO HAY INFORMACIÓN PARA REPORTAR");
                    }
                    else  {
                      alertify.error(this.respuesta.RESPUESTA);
                    }
                    if (usuario === this.puntosPagoSeleccionados[this.puntosPagoSeleccionados.length - 1]) {
                      this.puntosPagoSeleccionados = [];
                      this.ngOnInit();
                    }
                    await loading.dismiss();
                  },
                  error: async error => {
                    console.error("Respuesta:",error);
                    await loading.dismiss();
                  }
                  
                });
              });
            }
            break;
          default:
            this.IterarPeticion=false;
            break;
        }
      }
      if(this.IterarPeticion!=true){
        this.recaudoService.postGenerarReporteExcel(this.parametross).subscribe({
          next: async data => {
            let subTitulo=""
            
            if(this.convenio>0){
              
              if(this.reporteSeleccionado=="25" || this.reporteSeleccionado=="32" || this.reporteSeleccionado=="31" || this.reporteSeleccionado=="39"){
                const parametro = this.listadoConvenios.find(param => param.CODIGO_CONVENIO=== String(this.convenio));
                subTitulo=parametro.NOMBRE_CONVENIO;
                
              }else{
                const parametro = this.listadoFacturasConvenio.find(param => param.CODIGO_CONVENIO_DET=== String(this.convenio));
            
                subTitulo=parametro.NOMBRE_CONVENIO_DET;
                
              }
            }
            else if(this.puntoPago>0){
              const parametro2 = this.listadoPuntosPago.find(param => param.CODIGO === String(this.puntoPago));
              subTitulo=parametro2.NOMBRE;
            }
            
            this.respuesta = data;
    
            if(this.respuesta.COD=='200' && this.respuesta.REPORTES!=""){
              this.tituloArchivo=" - "+subTitulo+" ( "+fecha+" )";
              const nombreReporte = this.respuesta.REPORTES[0].NOMBRE_REPORTE;
              const imagen="../../assets/logo/logo_energia.png";
              let todosLosCampos: CampoReporte[] = [];
              
              console.log("Enviado: ",this.parametross)
    
              this.respuesta.REPORTES.forEach((reporte: { CAMPOS_REPORTE: CampoReporte[] }) => {
                reporte.CAMPOS_REPORTE.forEach((campo: CampoReporte) => {
                    todosLosCampos.push(campo);
                });
              });
    
              try {
                await this.generarReporte(todosLosCampos, nombreReporte, imagen);
                await loading.dismiss();
                alertify.success("REPORTE GENERADO");
              } catch (error) {
                  console.error("Error al generar el reporte:", error);
                  await loading.dismiss();
                  alertify.error("ERROR EN REPORTE GENERADO");
              }
              
            }else if((this.respuesta.REPORTES=="")){
              alertify.error("NO HAY INFORMACIÓN PARA REPORTAR");
              await loading.dismiss();
            }
            else  {
              alertify.error(this.respuesta.RESPUESTA);
              await loading.dismiss();
            }
            this.convenio=0;
            this.puntoPago=0;
          
          },
          error: async error => {
            console.error("Respuesta:",error);
            await loading.dismiss();
          }
          
        });
      }
  
    }
  }

  //#endregion

  //#region Filtrado

  filterList() {
    if (!this.searchTerm.trim()) {
      this.filteredList = this.listadoReportesActivos;
    } else {
      this.filteredList = this.listadoReportesActivos.filter(item =>
        item.ID_REPORTE.toLowerCase().includes(this.searchTerm.toLowerCase())
        || item.REPORTE.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  clearSearch() {
    this.filteredList = this.listadoReportesActivos;
  }

  filterList2() {
    if (!this.searchTerm2.trim()) {
      this.filteredList2 = this.listadoReportesInactivos;
    } else {
      this.filteredList2 = this.listadoReportesInactivos.filter(item =>
        item.ID_REPORTE.toLowerCase().includes(this.searchTerm2.toLowerCase())
        || item.REPORTE.toLowerCase().includes(this.searchTerm2.toLowerCase())
      );
    }
  }

  clearSearch2() {
    this.filteredList2 = this.listadoReportesInactivos;
  }

  filterList3() {
    if (!this.searchTerm3.trim()) {
      this.filteredUsuarios = this.listadoUsuarios;
    } else {
      this.filteredUsuarios = this.listadoUsuarios.filter(item =>
        item.USUARIO.toLowerCase().includes(this.searchTerm3.toLowerCase())
        || item.NOMBRE.toLowerCase().includes(this.searchTerm3.toLowerCase())
      );
    }
  }

  clearSearch3() {
    this.filteredUsuarios = this.listadoUsuarios;
  }

  //#endregion
  
}
