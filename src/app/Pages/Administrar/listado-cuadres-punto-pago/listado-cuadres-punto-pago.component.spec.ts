import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListadoCuadresPuntoPagoComponent } from './listado-cuadres-punto-pago.component';

describe('ListadoCuadresPuntoPagoComponent', () => {
  let component: ListadoCuadresPuntoPagoComponent;
  let fixture: ComponentFixture<ListadoCuadresPuntoPagoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoCuadresPuntoPagoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListadoCuadresPuntoPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
