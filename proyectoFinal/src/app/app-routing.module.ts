import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AdminPartidosComponent } from './pages/admin-partidos/admin-partidos.component';
import { AdminReglasComponent } from './pages/admin-reglas/admin-reglas.component';
import { AdminTeamsComponent } from './pages/admin-teams/admin-teams.component';
import { AdminTorneosComponent } from './pages/admin-torneos/admin-torneos.component';
import { AdminUsersComponent } from './pages/admin-users/admin-users.component';
import { DetallePartidoComponent } from './pages/detalle-partido/detalle-partido.component';
import { DetalleTorneoDieciseisavosComponent } from './pages/detalle-torneo-dieciseisavos/detalle-torneo-dieciseisavos.component';
import { DetalleTorneoFinalComponent } from './pages/detalle-torneo-final/detalle-torneo-final.component';
import { DetalleTorneoOctavosComponent } from './pages/detalle-torneo-octavos/detalle-torneo-octavos.component';
import { DetalleTorneoSemiComponent } from './pages/detalle-torneo-semi/detalle-torneo-semi.component';
import { DetalleTorneoComponent } from './pages/detalle-torneo/detalle-torneo.component';
import { EquiposComponent } from './pages/equipos/equipos.component';
import { FooterComponent } from './pages/footer/footer.component';
import { HeaderTopComponent } from './pages/header-top/header-top.component';
import { HeaderComponent } from './pages/header/header.component';
import { LandingComponent } from './pages/landing/landing.component';
import { MisPartidasComponent } from './pages/mis-partidas/mis-partidas.component';
import { MisTorneosComponent } from './pages/mis-torneos/mis-torneos.component';
import { NoEncontradaComponent } from './pages/no-encontrada/no-encontrada.component';
import { PerfilTeamsComponent } from './pages/perfil-teams/perfil-teams.component';
import { PerfilUserComponent } from './pages/perfil-user/perfil-user.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { TorneosComponent } from './pages/torneos/torneos.component';

const routes: Routes = [
  {path: '', component:LandingComponent},
  {path: 'main', component:AppComponent},
  {path: 'detalle-partido/:id', component:DetallePartidoComponent},
  {path: 'torneos', component:TorneosComponent},
  {path: 'header', component:HeaderComponent},
  {path: 'footer', component:FooterComponent},
  {path: 'admin-users', component:AdminUsersComponent},
  {path: 'admin-teams', component:AdminTeamsComponent},
  {path: 'mis-equipos', component:EquiposComponent},
  {path: 'admin-torneos', component: AdminTorneosComponent},
  {path: 'detalle-dieciseisavos/:id', component:DetalleTorneoDieciseisavosComponent},
  {path: 'detalle-octavos/:id', component:DetalleTorneoOctavosComponent},
  {path: 'detalle-cuartos/:id', component:DetalleTorneoComponent},
  {path: 'detalle-semifinal/:id', component:DetalleTorneoSemiComponent},
  {path: 'detalle-final/:id', component:DetalleTorneoFinalComponent},
  {path: 'admin-partidos', component:AdminPartidosComponent},
  {path: 'perfil-user', component:PerfilUserComponent},
  {path: 'perfil-teams', component:PerfilTeamsComponent},
  {path: 'perfil-equipo', component:PerfilTeamsComponent},
  {path: 'admin-reglas', component:AdminReglasComponent},
  {path: 'mis-torneos', component:MisTorneosComponent},
  {path: 'pruebas', component: HeaderTopComponent},
  {path: 'perfil', component:PerfilComponent},
  {path: 'mis-partidas', component: MisPartidasComponent},
  {path: '**', component: NoEncontradaComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
