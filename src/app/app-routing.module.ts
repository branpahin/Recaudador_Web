import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CrearArqueoComponent } from './Pages/Home/crear-arqueo/crear-arqueo.component';
import { InicioArqueoComponent } from './Pages/Home/inicio-arqueo/inicio-arqueo.component';
import { LoginComponent } from './Pages/Autenticacion/Autenticar/login/login.component';
import { ConsultarArqueoComponent } from './Pages/Home/consultar-arqueo/consultar-arqueo.component';
import { EntregaArqueoComponent } from './Pages/Home/entrega-arqueo/entrega-arqueo.component';
import { IonicModule } from '@ionic/angular';
import { ListarMovimientosPunteoComponent } from './Pages/Home/Reportes_Cajero/listar-movimientos-punteo/listar-movimientos-punteo.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
 
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  { path: 'login', component: LoginComponent },
  { path: 'inicio-arqueo', component: InicioArqueoComponent},
  { path: 'crear-arqueo', component: CrearArqueoComponent },
  { path: 'consultar-arqueo', component: ConsultarArqueoComponent },
  { path: 'entrega-arqueo', component: EntregaArqueoComponent },
  { path: 'listar-movimientos-punteo', component: ListarMovimientosPunteoComponent}

];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules } ),
    IonicModule,
    
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [RouterModule]
})
export class AppRoutingModule {}
