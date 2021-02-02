import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { tap, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import Swal from 'sweetalert2';
import { Torneo } from '../models/torneo';
import { Partidos } from '../models/partidos';
import { Equipo } from '../models/equipo';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private url = 'http://localhost:8000/usuarios';
  private url2 = 'http://localhost:8000';
  public User: User;
  public usuarios: User;
  public partido: Partidos;
  public partidos: Partidos[];
  public torneo: Torneo;
  public torneos: Torneo[];
  public usersBan: User[];
  public userBan: User;
  public collection: User[];
  public allusers: User[];
  public receptor: User;
  public usersRank: User[];
  public teamRank: [];
  public userTopOne: User;
  public teamTopOne: any;
  public otherPerfil: User;
  public adminTeams: [];
  public adminPartidos: [];
  public adminJuegos: [];
  public adminTorneos: [];
  constructor(
    private http: HttpClient,
    private router: Router,
    private auth: AuthService
  ) {}

  rankTop10() {
    return this.http.post(this.url + '/top10/', null);
  }

  rankTop5Team() {
    return this.http.post(this.url2 + '/equipos/top5', null);
  }

  getOneTopTeam() {
    return this.http.post(this.url2 + '/equipos/top1', null);
  }

  postEquipo(newEquipo: Equipo) {
    return this.http.post(this.url2 + '/equipos', newEquipo);
  }
  postEquipoUsuario(newEquipo: any) {
    return this.http.post(this.url2 + '/equipo-usuario', newEquipo);
  }

  yourtop() {
    return this.http.post(this.url + '/getyourtop/', null);
  }

  topOne() {
    return this.http.post(this.url + '/top1/', null);
  }

  getOtroPerfil(usernick: any) {
    return this.http.get(this.url2 + '/user' + '?nickname=' + usernick);
  }



  isBanned() {
    this.getUserAll().subscribe((data: User[]) => {
      this.usersBan = data;
      localStorage.setItem('allusersban', JSON.stringify(this.usersBan));
      this.usersBan = JSON.parse(localStorage.getItem('allusers'));
      let peta = JSON.parse(localStorage.getItem('allusers'));
      this.usersBan = this.usersBan;
      if (this.auth.isLoggedIn() === true) {
        let usuario_id = this.usuarios.usuario_id;
        this.getUserByID(usuario_id).subscribe((data) => {
          this.User = data[0];
          let convert = JSON.stringify(this.User);
          let search = JSON.parse(convert);
          if (search.isBanned === 1) {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Lo sentimos, estas baneado',
              showConfirmButton: false,
              timer: 2000,
            });
            localStorage.clear();
            this.router.navigateByUrl('/');
          } else {
            console.log('No estas baneado');
          }
        });
      } else {
        console.log('No estas logeado!');
      }
    });
  }

  putisBanned(newBan: any) {
    return this.http.put(this.url + '/ban', newBan);
  }

  getJuegos() {
    return this.http.get(this.url2 + '/juegosall');
  }
  getTorneos() {
    return this.http.get(this.url2 + '/torneosall');
  }

  getUsers() {
    return this.http.get<any>(this.url).pipe(
      map((usuarios) => {
        const newUsuarios = [];
        for (let usuario of usuarios) {
          const email = usuario.email;
          const nickname = usuario.nickname;
          newUsuarios.push({ correo: email, nickname: nickname });
        }

        return newUsuarios;
      }),
      tap((usuarios) => console.log(usuarios))
    );
  }

  getUserByEmail(email: string) {
    return this.http.get<any>(this.url + '/correo/' + email);
  }
  getUserByNickname(nickname: string) {
    return this.http.get<any>(this.url + '/nickname/' + nickname);
  }

  getUserByID(id: number) {
    return this.http.get(this.url + '/' + id);
  }

  getTeamsById(id: number) {
    return this.http.get(this.url2 + '/list-teams/' + id);
  }

  yourTeamRank(id: number) {
    return this.http.get(this.url2 + '/yourTeamRank/' + id);
  }

  login(usuario: User) {
    return this.http.post(this.url + '/login', usuario);
  }

  getUserAll() {
    return this.http.get(this.url);
  }

  getUserAllAdmin() {
    return this.http.get(this.url2 + '/admin-usuarios');
  }

  postUser(newUser: User) {
    return this.http.post(this.url, newUser);
  }

  putUser(editUser: User) {
    return this.http.put(this.url, editUser);
  }

  deleteUser(id: number) {
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        usuario_id: id,
      },
    };
    return this.http.delete(this.url, options);
  }

  // FUNCIONALIDADES ADMINISTRADOR
  getTeams() {
    return this.http.get(this.url2 + '/admin-equipos');
  }
  getTorneosAll() {
    return this.http.get(this.url2 + '/admin-torneos-all');
  }
  getEquiposTorneos(id: number) {
    return this.http.get(this.url2 + '/admin-equipos-torneos/' + id);
  }

  getTeamByName(name: string) {
    return this.http.get(this.url2 + '/admin-equipo/' + name);
  }

  editTeam(newTeam: any) {
    return this.http.put(this.url2 + '/admin-equipos', newTeam);
  }
  editTorneos(newTorneo: Torneo) {
    return this.http.put(this.url2 + '/admin-torneos-all', newTorneo);
  }

  deleteTeam(id: number) {
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        equipo_id: id,
      },
    };
    return this.http.delete(this.url2 + '/admin-equipos', options);
  }

  getPartidos() {
    return this.http.get(this.url2 + '/admin-partidos');
  }

  editPartidos(newPartido: any) {
    return this.http.put(this.url2 + '/admin-partidos', newPartido);
  }

  addPartido(partido: Partidos) {
    return this.http.post(this.url2 + '/admin-partidos', partido);
  }

  addTorneo(newtorneo: Torneo) {
    return this.http.post(this.url2 + '/admin-torneos-all', newtorneo);
  }

  deletePartido(id: number) {
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        partido_id: id,
      },
    };
    return this.http.delete(this.url2 + '/admin-partidos', options);
  }

  deleteTorneo(id: number) {
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        torneo_id: id,
      },
    };
    return this.http.delete(this.url2 + '/admin-torneos-all', options);
  }

  // FIN FUNCIONALIDADES ADMINISTRADOR

  // HOME

  getHome() {
    return this.http.get(this.url2 + '/home');
  }
}
