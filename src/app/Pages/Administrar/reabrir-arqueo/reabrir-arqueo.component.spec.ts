import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReabrirArqueoComponent } from './reabrir-arqueo.component';

describe('ReabrirArqueoComponent', () => {
  let component: ReabrirArqueoComponent;
  let fixture: ComponentFixture<ReabrirArqueoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReabrirArqueoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReabrirArqueoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
