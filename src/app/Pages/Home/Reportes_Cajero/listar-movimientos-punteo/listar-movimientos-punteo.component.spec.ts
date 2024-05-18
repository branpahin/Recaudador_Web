import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListarMovimientosPunteoComponent } from './listar-movimientos-punteo.component';

describe('ListarMovimientosPunteoComponent', () => {
  let component: ListarMovimientosPunteoComponent;
  let fixture: ComponentFixture<ListarMovimientosPunteoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarMovimientosPunteoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListarMovimientosPunteoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
