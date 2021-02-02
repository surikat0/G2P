import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TorneosComponent } from './pages/torneos/torneos.component';
import { DetalleTorneoComponent } from './pages/detalle-torneo/detalle-torneo.component';
import { FooterComponent } from './pages/footer/footer.component';
import { HeaderComponent } from './pages/header/header.component';
import { AdminUsersComponent } from './pages/admin-users/admin-users.component';
import { LandingComponent } from './pages/landing/landing.component';
import { AdminTeamsComponent } from './pages/admin-teams/admin-teams.component';
import { EquiposComponent } from './pages/equipos/equipos.component';
import { AdminTorneosComponent } from './pages/admin-torneos/admin-torneos.component';
import { DetallePartidoComponent } from './pages/detalle-partido/detalle-partido.component';
import { AdminPartidosComponent } from './pages/admin-partidos/admin-partidos.component';
import { PerfilUserComponent } from './pages/perfil-user/perfil-user.component';
import { PerfilTeamsComponent } from './pages/perfil-teams/perfil-teams.component';
import { AdminReglasComponent } from './pages/admin-reglas/admin-reglas.component';
import { MisTorneosComponent } from './pages/mis-torneos/mis-torneos.component';
import { DetalleTorneoSemiComponent } from './pages/detalle-torneo-semi/detalle-torneo-semi.component';
import { DetalleTorneoFinalComponent } from './pages/detalle-torneo-final/detalle-torneo-final.component';
import { DetalleTorneoOctavosComponent } from './pages/detalle-torneo-octavos/detalle-torneo-octavos.component';
import { DetalleTorneoDieciseisavosComponent } from './pages/detalle-torneo-dieciseisavos/detalle-torneo-dieciseisavos.component';
import * as bootstrap from 'bootstrap';
import * as $ from 'jquery';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoEncontradaComponent } from './pages/no-encontrada/no-encontrada.component';
import { UniqueNicknameValidatorDirective } from './shared/unique-nickname.validator.directive';
import { UniqueEmailValidatorDirective } from './shared/email-nickname.validator.directive';
import { HeaderTopComponent } from './pages/header-top/header-top.component';
import { ChartsModule } from 'ng2-charts';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { MisPartidasComponent } from './pages/mis-partidas/mis-partidas.component';

@NgModule({
  declarations: [
    AppComponent,
    TorneosComponent,
    DetalleTorneoComponent,    
    DetalleTorneoSemiComponent,
    DetalleTorneoFinalComponent,
    DetalleTorneoOctavosComponent,
    DetalleTorneoDieciseisavosComponent,
    FooterComponent,
    HeaderComponent,
    AdminUsersComponent,
    UniqueNicknameValidatorDirective,
    UniqueEmailValidatorDirective,
    LandingComponent,
    HeaderTopComponent,
    AdminTeamsComponent,
    EquiposComponent,
    AdminTorneosComponent,
    DetallePartidoComponent,
    AdminPartidosComponent,
    PerfilUserComponent,
    PerfilTeamsComponent,
    AdminReglasComponent,
    MisTorneosComponent,
    NoEncontradaComponent,
    PerfilComponent,
    MisPartidasComponent
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule
  ],
  providers: [
    Title
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
