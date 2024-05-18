import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ConsultaArqueosPuntoPagoComponent } from './consulta-arqueos-punto-pago.component';

describe('ConsultaArqueosPuntoPagoComponent', () => {
  let component: ConsultaArqueosPuntoPagoComponent;
  let fixture: ComponentFixture<ConsultaArqueosPuntoPagoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultaArqueosPuntoPagoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ConsultaArqueosPuntoPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
