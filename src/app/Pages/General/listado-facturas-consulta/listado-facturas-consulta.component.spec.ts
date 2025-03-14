import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListadoFacturasConsultaComponent } from './listado-facturas-consulta.component';

describe('ListadoFacturasConsultaComponent', () => {
  let component: ListadoFacturasConsultaComponent;
  let fixture: ComponentFixture<ListadoFacturasConsultaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoFacturasConsultaComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListadoFacturasConsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
