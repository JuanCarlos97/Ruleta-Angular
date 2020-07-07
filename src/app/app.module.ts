import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts';


import {FormsModule} from '@angular/forms';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { LinealComponent } from './components/lineal/lineal.component';
import { NolinealComponent } from './components/nolineal/nolineal.component';
import { HomeComponent } from './components/home/home.component';
import { EstrategiasComponent } from './components/estrategias/estrategias.component';
import { EstrategiaComponent } from './components/estrategia/estrategia.component';
import { CardEstrategiaComponent } from './components/card-estrategia/card-estrategia.component';
import { HttpClientModule } from '@angular/common/http';
import { APP_ROUTING } from './app.routes';
import { LoadingComponent } from './components/shared/loading/loading.component';
import { EstrategiaDatosComponent } from './components/estrategia-datos/estrategia-datos.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LinealComponent,
    NolinealComponent,
    HomeComponent,
    EstrategiasComponent,
    EstrategiaComponent,
    CardEstrategiaComponent,
    LoadingComponent,
    EstrategiaDatosComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    APP_ROUTING,
    HttpClientModule,
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
