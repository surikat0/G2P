import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Equipo } from 'src/app/models/equipo';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/shared/auth.service';
import { UserService } from 'src/app/shared/user.service';
import Swal from 'sweetalert2';
declare var $: any 

@Component({
  selector: 'app-equipos',
  templateUrl: './equipos.component.html',
  styleUrls: ['./equipos.component.css'],
})
export class EquiposComponent implements OnInit {
  @ViewChild('addTeam') addTeam;

  title = 'Equipos - G2P';
  public userlogin: boolean;
  public jugadores1;
  public myIndex:number;
  public g2pUserPerfil: User;
  public equipos:any[];
  public juegos: any[];
  public photoTeam:string;
  constructor(
    private serviceTitle: Title,
    private auth: AuthService,
    public userService: UserService,
    private router: Router
  ) {
    this.userlogin = false;
    this.g2pUserPerfil = this.userService.usuarios
    this.equipos = [];
    this.myIndex = 0;
    this.photoTeam = 'assets/images/logo.png';
  }

  

  getJuegos() {
    this.userService.getJuegos().subscribe((data: []) => {
      this.juegos = data;
    });
  }

  getColor(estado) { 
    if(this.userService.usuarios.usuario_id === estado){
        return '#ff09d6'
    }
   
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

  goPerfil(id: string) {
    this.router.navigateByUrl('/perfil-equipo?id=' + id);
  }

  getTeamsUser() {
    this.userService
      .getTeamsById(this.userService.usuarios.usuario_id)
      .subscribe((data: []) => {
        this.equipos = data;
        console.log(this.equipos);
        
      });
  }


  getData(i: number) {
    this.myIndex = i;
  }

  newEquipo(nombre:string, juego:any, biografia:string){
    if(juego === "0"){
      Swal.fire({
        title: '<strong style="text-transform:uppercase">Ha ocurrido un error</strong>',
        position: 'center',
        icon: 'error',
        html: `Por favor selecciona un juego`,
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      });
    } else {
      this.userService.postEquipo(new Equipo(null, nombre, this.photoTeam, juego, this.userService.usuarios.usuario_id, null, null, null, null, biografia)).subscribe((data:any)=>{
        const dataq = Number(data.insertId)
        let equipoUsuario = {usuario_id: this.userService.usuarios.usuario_id, equipo_id: dataq}
        this.userService.postEquipoUsuario(equipoUsuario).subscribe((data)=>{
          console.log(data);
          this.getTeamsUser();
          Swal.fire({
            title: '<strong style="text-transform:uppercase">¡GENIAL!</strong>',
            position: 'center',
            icon: 'success',
            html: `Felicidades, acabas de crear tu propio equipo!`,
            showConfirmButton: false,
            timer: 2500,
            timerProgressBar: true,
          });
          this.addTeam.nativeElement.click();
        })
      })
    }
  } 

  isLoggedIn() {
    this.userlogin = this.auth.isLoggedIn();
  return this.userlogin    
    // console.log(this.userlogin);
    
  }

  ngOnInit(): void {
    this.isLoggedIn()
    this.access()    
    this.getTeamsUser();
    this.getJuegos()
    this.serviceTitle.setTitle(this.title);
  }
}
