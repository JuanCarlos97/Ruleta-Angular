import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { EstrategiasComponent } from './components/estrategias/estrategias.component';
import { EstrategiaComponent } from './components/estrategia/estrategia.component';
import { LinealComponent } from './components/lineal/lineal.component';
import { NolinealComponent } from './components/nolineal/nolineal.component';
import { EstrategiaDatosComponent } from './components/estrategia-datos/estrategia-datos.component';

const APP_ROUTES: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'estrategias', component: EstrategiasComponent },
  { path: 'estrategia/:id', component: EstrategiaComponent },
  { path: 'estrategia-datos/:id', component: EstrategiaDatosComponent },
  { path: 'congruencial', component: LinealComponent },
  { path: 'nolineal', component: NolinealComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'home' }
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES, {
  initialNavigation: 'enabled'
});
