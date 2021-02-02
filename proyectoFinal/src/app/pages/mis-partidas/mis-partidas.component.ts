import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Partidos } from 'src/app/models/partidos';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/shared/auth.service';
import { PartidosService } from 'src/app/shared/partidos.service';
import { UserService } from 'src/app/shared/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mis-partidas',
  templateUrl: './mis-partidas.component.html',
  styleUrls: ['./mis-partidas.component.css'],
})
export class MisPartidasComponent implements OnInit {
  title = 'Mis Partidas - G2P';

  public partido: Partidos;
  public partidoArray: Partidos[];
  public equipos: any[];
  public g2pUserPerfil: User;
  public userlogin: boolean;
  constructor(
    private auth: AuthService,
    private serviceTitle: Title,
    public userService: UserService,
    private router: Router,
    private partidoService: PartidosService
  ) {
    this.equipos = [];
    this.partido = this.partidoService.partido;
    this.g2pUserPerfil = this.userService.usuarios
    this.userlogin = false;
    this.partidoArray = [];
  }

  isLoggedIn() {
    this.userlogin = this.auth.isLoggedIn();
  return this.userlogin    
    // console.log(this.userlogin);
    
  }

  access() {
    console.log(this.userlogin);
    if(this.isLoggedIn() === true){
      console.log("AJAJA");
      
    }else{
      console.log("XD");
      
    }
    
    if (this.isLoggedIn() === true && (this.g2pUserPerfil != null || this.g2pUserPerfil != undefined)) {
      return true;
    } else if (this.isLoggedIn() === false && (this.g2pUserPerfil === null || this.g2pUserPerfil === undefined)) {
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
  goDetalle(fases:any, id: any) {
    this.router.navigateByUrl('/detalle-'+fases+'/'+id);
    
  }
  goPartido(id:number) {
    this.router.navigateByUrl('/detalle-partido/'+id);
    
  }
  goPerfilTeam(id: any) {
    this.router.navigateByUrl('/perfil-teams?id='+id);
    
  }
  getTeamsUser() {
    this.userService
      .getTeamsById(this.userService.usuarios.usuario_id)
      .subscribe((data: any[]) => {
        for (let i = 0; i < data.length; i++) {
          let xe = data[i].equipo_id;
          console.log(xe);
          this.partidoService
            .getMisPartidos(xe)
            .subscribe((data: Partidos[]) => {
              this.partidoArray = data;
              console.log(this.partidoArray);
            });
        }
      });
  }

  ngOnInit(): void {
    this.isLoggedIn()
    this.access()  
    this.getTeamsUser();
    this.serviceTitle.setTitle(this.title);
  }
}
