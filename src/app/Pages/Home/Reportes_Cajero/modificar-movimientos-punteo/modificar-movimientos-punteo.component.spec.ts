import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModificarMovimientosPunteoComponent } from './modificar-movimientos-punteo.component';

describe('ModificarMovimientosPunteoComponent', () => {
  let component: ModificarMovimientosPunteoComponent;
  let fixture: ComponentFixture<ModificarMovimientosPunteoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModificarMovimientosPunteoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModificarMovimientosPunteoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
