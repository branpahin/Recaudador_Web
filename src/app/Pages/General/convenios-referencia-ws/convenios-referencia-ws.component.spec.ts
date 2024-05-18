import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ConveniosReferenciaWSComponent } from './convenios-referencia-ws.component';

describe('ConveniosReferenciaWSComponent', () => {
  let component: ConveniosReferenciaWSComponent;
  let fixture: ComponentFixture<ConveniosReferenciaWSComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConveniosReferenciaWSComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ConveniosReferenciaWSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
