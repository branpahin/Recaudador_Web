import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CargarArchivoOfflineComponent } from './cargar-archivo-offline.component';

describe('CargarArchivoOfflineComponent', () => {
  let component: CargarArchivoOfflineComponent;
  let fixture: ComponentFixture<CargarArchivoOfflineComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CargarArchivoOfflineComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CargarArchivoOfflineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
