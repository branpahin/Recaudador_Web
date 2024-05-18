import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByColumn',
})
export class FilterByColumnPipe implements PipeTransform {
  transform(items: any[], ...args: any[]): any {
    if (!items || !args || args.length === 0) {
        return items; // Si no hay elementos o no hay criterios de filtrado, devolver la matriz sin cambios
      }
  
      // Desestructurar los criterios de filtrado
      const [
        filtroNumeroMovimiento, campoNumeroMovimiento, 
        filtroFecha, campoFecha, 
        filtroTipoPago, campoTipoPago, 
        filtrovalorRecibido, campovalorRecibido, 
        filtrovalorMovimiento, campovalorMovimiento,
        filtroValorCambio, campoValorCambio,
        filtroNumeroCupones, campoNumeroCupones] = args;
  
      // Aplicar filtros según criterios proporcionados
      return items.filter((recaudo) => {
        const cumpleCriterioNumeroMovimiento = !filtroNumeroMovimiento || recaudo[campoNumeroMovimiento].includes(filtroNumeroMovimiento);
        const cumpleCriterioFecha = !filtroFecha || recaudo[campoFecha] === filtroFecha; // Puedes ajustar la lógica según tu necesidad
        const cumpleCriterioTipoPago = !filtroTipoPago || recaudo[campoTipoPago] === filtroTipoPago; // Puedes ajustar la lógica según tu necesidad
        const cumpleCriteriovalorRecibido = !filtrovalorRecibido || recaudo[campovalorRecibido] === filtrovalorRecibido;
        const cumpleCriteriovalorMovimiento = !filtrovalorMovimiento || recaudo[campovalorMovimiento] === filtrovalorMovimiento;
        const cumpleCriterioValorCambio = !filtroValorCambio || recaudo[campoValorCambio] === filtroValorCambio;
        const cumpleCriterioNumeroCupones = !filtroNumeroCupones || recaudo[campoNumeroCupones] === filtroNumeroCupones;
        // Agrega más criterios según sea necesario
  
        // Devuelve true solo si todos los criterios se cumplen
        return cumpleCriterioNumeroMovimiento && 
        cumpleCriterioFecha && 
        cumpleCriterioTipoPago && 
        cumpleCriteriovalorRecibido && 
        cumpleCriteriovalorMovimiento && 
        cumpleCriterioValorCambio && 
        cumpleCriterioNumeroCupones;
      });
  }
}