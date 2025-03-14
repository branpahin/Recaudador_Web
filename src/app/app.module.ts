import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AlertController, IonicModule, IonicRouteStrategy } from '@ionic/angular';
import {HttpClientModule} from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { EmpresasComponent } from './Pages/Autenticacion/Empresas/empresas/empresas.component';
import { PuntosPagoComponent } from './Pages/Autenticacion/Puntos_Pago/puntos-pago/puntos-pago.component';
import { LoginComponent } from './Pages/Autenticacion/Autenticar/login/login.component';
import { InicioArqueoComponent } from './Pages/Home/inicio-arqueo/inicio-arqueo.component';
import { CrearArqueoComponent } from './Pages/Home/crear-arqueo/crear-arqueo.component';
import { ConsultarArqueoComponent } from './Pages/Home/consultar-arqueo/consultar-arqueo.component';
import { EstadoArqueoComponent } from './Pages/Home/estado-arqueo/estado-arqueo.component';
import { InformacionPuntoPagoComponent } from './Pages/General/informacion-punto-pago/informacion-punto-pago.component';
import { EntregaArqueoComponent } from './Pages/Home/entrega-arqueo/entrega-arqueo.component';
import { CierreArqueoComponent } from './Pages/Home/cierre-arqueo/cierre-arqueo.component';
import { CajasPuntoPagoComponent } from './Pages/General/cajas-punto-pago/cajas-punto-pago.component';
import { ConveniosReferenciaWSComponent } from './Pages/General/convenios-referencia-ws/convenios-referencia-ws.component';
import { RecaudarComponent } from './Pages/Home/Recaudador/recaudar/recaudar.component';
import { ConsultaRecaudoComponent } from './Pages/Home/Recaudador/consulta-recaudo/consulta-recaudo.component';
import { ListarMovimientosPunteoComponent } from './Pages/Home/Reportes_Cajero/listar-movimientos-punteo/listar-movimientos-punteo.component';
import { ReestablecerMovimientosPunteoComponent } from './Pages/Home/Reportes_Cajero/reestablecer-movimientos-punteo/reestablecer-movimientos-punteo.component';
import { ModificarMovimientosPunteoComponent } from './Pages/Home/Reportes_Cajero/modificar-movimientos-punteo/modificar-movimientos-punteo.component';
import { FormatoMonetarioDirective } from './directivas/formato-monetario.directive';
import { FilterByColumnPipe } from './Pages/Home/consultar-arqueo/filter-by-column.pipe';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { InformacionUsuarioComponent } from './Pages/Autenticacion/informacion-usuario/informacion-usuario.component';
import { AgGridModule } from 'ag-grid-angular';
import { ConveniosManualWsComponent } from './Pages/General/convenios-manual-ws/convenios-manual-ws.component';
import { AsignarCajaComponent } from './Pages/Administrar/asignar-caja/asignar-caja.component';
import { ListarCajasComponent } from './Pages/Administrar/listar-cajas/listar-cajas.component';
import { ConsultaArqueosPuntoPagoComponent } from './Pages/Administrar/consulta-arqueos-punto-pago/consulta-arqueos-punto-pago.component';
import { ListadoCuadresPuntoPagoComponent } from './Pages/Administrar/listado-cuadres-punto-pago/listado-cuadres-punto-pago.component';
import { ListadoEntrgasPuntoPagoComponent } from './Pages/Administrar/listado-entrgas-punto-pago/listado-entrgas-punto-pago.component';
import { ListadoPuntosPagoComponent } from './Pages/Administrar/listado-puntos-pago/listado-puntos-pago.component';
import { ListadoUsuariosComponent } from './Pages/Administrar/listado-usuarios/listado-usuarios.component';
import { AdministrarCajasComponent } from './Pages/Administrar/administrar-cajas/administrar-cajas.component';
import { AsobancariaComponent } from './Pages/Home/Reportes_Admin/asobancaria/asobancaria.component';
import { TrasladoFechasComponent } from './Pages/Administrar/traslado-fechas/traslado-fechas.component';
import { CrearMensajeComponent } from './Pages/Administrar/crear-mensaje/crear-mensaje.component';
import { ConveniosComponent } from './Pages/Administrar/convenios/convenios.component';
import { FactutasConvenioComponent } from './Pages/Administrar/factutas-convenio/factutas-convenio.component';
import { AnulacionPagosComponent } from './Pages/Administrar/anulacion-pagos/anulacion-pagos.component';
import { SincronizadorComponent } from './Pages/Administrar/sincronizador/sincronizador.component';
import { ReporteadorComponent } from './Pages/Administrar/reporteador/reporteador.component';
import { CierreCajaComponent } from './Pages/Administrar/cierre-caja/cierre-caja.component';
import { ParametrizacionBarrasComponent } from './Pages/Desarrollador/parametrizacion-barras/parametrizacion-barras.component';
import { ParametrizacionParametrosComponent } from './Pages/Desarrollador/parametrizacion-parametros/parametrizacion-parametros.component';
import { AsignacionReportesComponent } from './Pages/Desarrollador/asignacion-reportes/asignacion-reportes.component';
import { CargarArchivoOfflineComponent } from './Pages/Administrar/cargar-archivo-offline/cargar-archivo-offline.component';
import { CajasSacComponent } from './Pages/Administrar/cajas-sac/cajas-sac.component';
import { CambiarClaveComponent } from './Pages/General/cambiar-clave/cambiar-clave.component';
import { ReabrirArqueoComponent } from './Pages/Administrar/reabrir-arqueo/reabrir-arqueo.component';
import { ListadoFacturasComponent } from './Pages/General/listado-facturas/listado-facturas.component';
import { ListadoFacturasRechazadasComponent } from './Pages/General/listado-facturas-rechazadas/listado-facturas-rechazadas.component';
import { ListadoFacturasConsultaComponent } from './Pages/General/listado-facturas-consulta/listado-facturas-consulta.component';





const routes: Routes = [
  //{ path: 'home', component: HomePage },
  //{ path: 'profile', component: ProfilePage },
  //{ path: 'settings', component: SettingsPage },
  { path: 'crear-arqueo', component: CrearArqueoComponent }, // Asegúrate de agregar la ruta para 'crear-arqueo'
  { path: 'menu', component: InicioArqueoComponent }
  // Agrega otras rutas aquí
];

@NgModule({
  declarations: [AppComponent, 
                EmpresasComponent, 
                PuntosPagoComponent,
                LoginComponent,
                InicioArqueoComponent, 
                CrearArqueoComponent,
                ConsultarArqueoComponent, 
                EstadoArqueoComponent,
                InformacionPuntoPagoComponent,
                EntregaArqueoComponent,
                CierreArqueoComponent,
                CajasPuntoPagoComponent,
                InformacionUsuarioComponent,
                ConveniosReferenciaWSComponent,
                RecaudarComponent,
                ConsultaRecaudoComponent,
                ListarMovimientosPunteoComponent,
                ReestablecerMovimientosPunteoComponent,
                ModificarMovimientosPunteoComponent,
                FormatoMonetarioDirective,
                FilterByColumnPipe,
                ConveniosManualWsComponent,
                AsignarCajaComponent,
                ListarCajasComponent,
                ConsultaArqueosPuntoPagoComponent,
                ListadoCuadresPuntoPagoComponent,
                ListadoEntrgasPuntoPagoComponent,
                ListadoPuntosPagoComponent,
                ListadoUsuariosComponent,
                AdministrarCajasComponent,
                AsobancariaComponent,
                TrasladoFechasComponent,
                CrearMensajeComponent,
                ConveniosComponent,
                FactutasConvenioComponent,
                AnulacionPagosComponent,
                SincronizadorComponent,
                ReporteadorComponent,
                CierreCajaComponent,
                ParametrizacionBarrasComponent,
                ParametrizacionParametrosComponent,
                AsignacionReportesComponent,
                CargarArchivoOfflineComponent,
                CajasSacComponent,
                CambiarClaveComponent,
                ReabrirArqueoComponent,
                ListadoFacturasComponent,
                ListadoFacturasRechazadasComponent,
                ListadoFacturasConsultaComponent
              ],

  imports: [BrowserModule, AgGridModule,
            IonicModule.forRoot(), 
            AppRoutingModule, 
            HttpClientModule,
            FormsModule,
            RouterModule.forRoot(routes),
            IonicModule
          ],
  exports: [RouterModule],

  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy, },AlertController, { provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}

