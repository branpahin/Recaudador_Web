import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appFormatoMonetario]'
})
export class FormatoMonetarioDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event'])
  onInput(event: any): void {
    let inputVal = event.target.value;

    // Elimina cualquier carácter que no sea un número
    inputVal = inputVal.replace(/[^0-9]/g, '');

    // Formatea el valor con puntos cada 3 dígitos
    inputVal = inputVal.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // Actualiza el valor en el campo de entrada
    this.el.nativeElement.value = inputVal;
  }
}