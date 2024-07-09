import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PacijentComponent } from './pacijent/pacijent.component';
import { RegisterComponent } from './register/register.component';
import { PocetnaComponent } from './pocetna/pocetna.component';
import { ProfilComponent } from './profil/profil.component';
import { LekarComponent } from './lekar/lekar.component';
import { KartonComponent } from './karton/karton.component';
import { MenadzerComponent } from './menadzer/menadzer.component';
import { MloginComponent } from './mlogin/mlogin.component';

const routes: Routes = [
  {path: '', component : PocetnaComponent},
  {path: 'login', component : LoginComponent},
  {path: 'pacijent', component: PacijentComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'profil', component: ProfilComponent},
  {path: 'lekar', component: LekarComponent},
  {path: 'karton', component: KartonComponent},
  {path: 'mlogin', component: MloginComponent},
  {path: 'menadzer', component: MenadzerComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
