import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Partidos } from 'src/app/models/partidos';
import { Torneo } from 'src/app/models/torneo';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/shared/auth.service';
import { PartidosService } from 'src/app/shared/partidos.service';
import { TorneoService } from 'src/app/shared/torneo.service';
import { UserService } from 'src/app/shared/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mis-torneos',
  templateUrl: './mis-torneos.component.html',
  styleUrls: ['./mis-torneos.component.css'],
})
export class MisTorneosComponent implements OnInit {
  title = 'Mis Torneos - G2P';

  public torneo: Torneo;
  public torneoArray: any[];
  public equipos: any[];
  public g2pUserPerfil: User;
  public userlogin: boolean;
  constructor(
    private auth: AuthService,
    private serviceTitle: Title,
    public userService: UserService,
    private router: Router,
    private torneoService: TorneoService
  ) {
    this.equipos = [];
    this.torneo = this.torneoService.torneo;
    this.g2pUserPerfil = this.userService.usuarios;
    this.userlogin = false;
    this.torneoArray = [];
  }

  isLoggedIn() {
    this.userlogin = this.auth.isLoggedIn();
    return this.userlogin;
    // console.log(this.userlogin);
  }

  access() {
    console.log(this.userlogin);
    if (this.isLoggedIn() === true) {
      console.log('AJAJA');
    } else {
      console.log('XD');
    }

    if (
      this.isLoggedIn() === true &&
      (this.g2pUserPerfil != null || this.g2pUserPerfil != undefined)
    ) {
      return true;
    } else if (
      this.isLoggedIn() === false &&
      (this.g2pUserPerfil === null || this.g2pUserPerfil === undefined)
    ) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'No tienes permiso para entrar aqui',
        showConfirmButton: false,
        timer: 2000,
      });
      this.router.navigateByUrl('/');
    } else {
      return true;
    }
  }

  getColor(estado) {
    switch (estado) {
      case 'ACTIVO':
        return '#28a745';
      case 'PENDIENTE':
        return '#ff8401';
      case 'FINALIZADO':
        return '#dc3545';
    }
  }
  goDetalle(fases: any, id: any) {
    this.router.navigateByUrl('/detalle-' + fases + '/' + id);
  }
  goPartido() {
    this.router.navigateByUrl('/');
  }
  goPerfilTeam(id: any) {
    this.router.navigateByUrl('/perfil-teams?id=' + id);
  }
  getTeamsUser() {
    this.torneoArray = []
    this.userService
      .getTeamsById(this.userService.usuarios.usuario_id)
      .subscribe((data: any[]) => {
        for (let i = 0; i < data.length; i++) {
          let xe = data[i].equipo_id;
          console.log(xe);
          this.torneoService.getTorneoByID(xe).subscribe((data: []) => {
            data.forEach(item => {
              this.torneoArray.push(item);
            })
          });
        }
      });
  }

  getTorneos() {
    this.torneoService.getTorneosByUser(this.userService.usuarios.usuario_id)
      .subscribe((data: []) => {
        this.torneoArray = data;
      });
  }

  ngOnInit(): void {
    this.isLoggedIn();
    this.access();
    /*this.getTeamsUser();*/
    this.getTorneos()
    this.serviceTitle.setTitle(this.title);
  }
}
