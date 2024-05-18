import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ConveniosManualWsComponent } from './convenios-manual-ws.component';

describe('ConveniosManualWsComponent', () => {
  let component: ConveniosManualWsComponent;
  let fixture: ComponentFixture<ConveniosManualWsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConveniosManualWsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ConveniosManualWsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
