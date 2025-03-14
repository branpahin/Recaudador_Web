import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListadoFacturasRechazadasComponent } from './listado-facturas-rechazadas.component';

describe('ListadoFacturasRechazadasComponent', () => {
  let component: ListadoFacturasRechazadasComponent;
  let fixture: ComponentFixture<ListadoFacturasRechazadasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoFacturasRechazadasComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListadoFacturasRechazadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
