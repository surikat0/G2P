import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { UserService } from 'src/app/shared/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-teams',
  templateUrl: './admin-teams.component.html',
  styleUrls: ['./admin-teams.component.css'],
})
export class AdminTeamsComponent implements OnInit {
  @ViewChild('editeTeams') editeTeams;
  @ViewChild('deleteTeams') deleteTeams;

  title = 'ADM - EQUIPOS';
  public indexDelete: number;
  public indexEdit: number;
  public adminTeams: any[];
  public userlogin: boolean;
  public adminlogin: boolean;
  public listajuegos: string[];

    constructor(private router: Router, private auth: AuthService, public userService: UserService, private serviceTitle: Title) {
    this.adminTeams = this.userService.adminTeams;
    this.indexDelete = 0;
    this.listajuegos = ['LOL', 'FIFA'];
    this.indexEdit = 0;
    this.userlogin = false;
    this.adminlogin = false;
  }

  isLoggedIn() {
    this.userlogin = this.auth.isLoggedIn();
    return this.userlogin;
  }

  noAdmin() {
    if (this.isLoggedIn() && this.userService.usuarios.admin === 'admin') {
      return true;
    } else {
      Swal.fire({
        position: 'center',
        icon: 'error', 
        title: 'No tienes permiso para entrar aqui',
        showConfirmButton: false,
        timer: 2000,
      });
      this.router.navigateByUrl('/');
      return false;
    }
  }

  getAllTeams() {
    this.userService.getTeams().subscribe((data: []) => {
      this.userService.adminTeams = data;
      this.adminTeams = this.userService.adminTeams;
      localStorage.setItem('adminteams', JSON.stringify(this.adminTeams));
      console.log(this.adminTeams);
    });
  }

  editTeam(
    idremplace: any,
    equipo_id: number,
    nombre: string,
    juego_id: any,
    ganadas: any,
    perdidas: any,
    jugadas: any
  ) {
    let xi = JSON.parse(localStorage.getItem('adminteams'));

    let found = xi.find(function (element) {
      return element.equipo_id === equipo_id;
    });
    if (nombre === '') {
      nombre = found.nombre;
    } else {
      found.nombre = nombre;
    }
    if (juego_id === '') {
      juego_id = parseInt(found.juego_id);
    } else {
      found.juego_id = parseInt(juego_id);
    }
    if (ganadas === '') {
      ganadas = parseInt(found.ganadas);
    } else {
      found.ganadas = parseInt(ganadas);
    }
    if (perdidas === '') {
      perdidas = parseInt(found.perdidas);
    } else {
      found.perdidas = parseInt(perdidas);
    }
    if (jugadas === '') {
      jugadas = parseInt(found.jugadas);
    } else {
      found.jugadas = parseInt(jugadas);
    }
    this.userService.editTeam(found).subscribe((data) => {
      this.userService.getTeams().subscribe((data: []) => {
        this.userService.adminTeams = data;
        this.adminTeams = this.userService.adminTeams;
        localStorage.setItem('adminteams', JSON.stringify(this.adminTeams));
        let xi2 = JSON.parse(localStorage.getItem('adminteams'));
        let found2 = xi2.find(function (element) {
          return element.equipo_id === equipo_id;
        });
        this.adminTeams.splice(idremplace, 1, found2);
        localStorage.setItem('adminteams', JSON.stringify(this.adminTeams));
      });
      this.editeTeams.nativeElement.click();
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Equipo modificado correctamente!',
        showConfirmButton: false,
        timer: 2500,
      });
    });
  }

  deleteTeam(id: any, id2: any) {
    let xi = JSON.parse(localStorage.getItem('adminteams'));

    let found = xi.find(function (element) {
      return element.equipo_id === id;
    });
    console.log(found.estado);

    if (found.estado === 'ACTIVO' || found.estado === 'PENDIENTE') {
      this.deleteTeams.nativeElement.click();
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: `No puedes eliminar este equipo, esta en un torneo en estado ${found.estado}`,
        showConfirmButton: false,
        timer: 2500,
      });
    } 
    if (found.estado === null || found.estado === 'FINALIZADO') {
      this.userService.deleteTeam(parseInt(id)).subscribe((data) => {
        this.deleteTeams.nativeElement.click();
        this.adminTeams.splice(id2, 1);
        localStorage.setItem('adminrules', JSON.stringify(this.adminTeams));
        // this.rulesall =
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Equipo eliminado correctamente!',
          showConfirmButton: false,
          timer: 2500,
        });
      });
    }
  }

  goPerfil(id: string) {
    this.router.navigateByUrl(
      '/perfil-equipo?id=' + id
    );
  }

  public getDelete(i: number) {
    this.indexDelete = i;
  }

  public getEdit(i: number) {
    this.indexEdit = i;
  }

  ngOnInit(): void {
    this.serviceTitle.setTitle(this.title);
    this.getAllTeams();
    this.noAdmin();
    this.userService.adminTeams = JSON.parse(
      localStorage.getItem('adminteams')
    );
    this.adminTeams = this.userService.adminTeams;
  }
}
