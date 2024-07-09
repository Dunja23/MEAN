import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PacijentComponent } from './pacijent/pacijent.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { LekarComponent } from './lekar/lekar.component';
import { RegisterComponent } from './register/register.component';
import { PocetnaComponent } from './pocetna/pocetna.component';
import { ProfilComponent } from './profil/profil.component';
import { KartonComponent } from './karton/karton.component';
import { MenadzerComponent } from './menadzer/menadzer.component';
import { MloginComponent } from './mlogin/mlogin.component'

@NgModule({
  declarations: [
    AppComponent,
    PacijentComponent,
    LoginComponent,
    LekarComponent,
    RegisterComponent,
    PocetnaComponent,
    ProfilComponent,
    KartonComponent,
    MenadzerComponent,
    MloginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
