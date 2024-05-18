import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListadoEntrgasPuntoPagoComponent } from './listado-entrgas-punto-pago.component';

describe('ListadoEntrgasPuntoPagoComponent', () => {
  let component: ListadoEntrgasPuntoPagoComponent;
  let fixture: ComponentFixture<ListadoEntrgasPuntoPagoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoEntrgasPuntoPagoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListadoEntrgasPuntoPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
