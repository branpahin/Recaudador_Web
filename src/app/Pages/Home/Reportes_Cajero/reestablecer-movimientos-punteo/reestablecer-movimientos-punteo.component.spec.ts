import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReestablecerMovimientosPunteoComponent } from './reestablecer-movimientos-punteo.component';

describe('ReestablecerMovimientosPunteoComponent', () => {
  let component: ReestablecerMovimientosPunteoComponent;
  let fixture: ComponentFixture<ReestablecerMovimientosPunteoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReestablecerMovimientosPunteoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReestablecerMovimientosPunteoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
