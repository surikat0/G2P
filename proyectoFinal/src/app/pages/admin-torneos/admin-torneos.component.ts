import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Partidos } from 'src/app/models/partidos';
import { Reglas } from 'src/app/models/reglas';
import { Torneo } from 'src/app/models/torneo';
import { AuthService } from 'src/app/shared/auth.service';
import { G2pService } from 'src/app/shared/g2p.service';
import { UserService } from 'src/app/shared/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-torneos',
  templateUrl: './admin-torneos.component.html',
  styleUrls: ['./admin-torneos.component.css'],
})
export class AdminTorneosComponent implements OnInit {
  @ViewChild('editeTorneo') editeTorneo;
  @ViewChild('deleteTorneo') deleteTorneo;
  @ViewChild('addTorneo') addTorneo;
  @ViewChild('seeParti') seeParti;

  public indexDelete: number;
  public indexEdit: number;
  title = 'ADM - Torneos';
  public userlogin: boolean;
  public adminlogin: boolean;
  public adminTorneos: any[];
  public msge1: string;
  public msge2: string;
  public msg2e1: string;
  public juegos: any[];
  public rulesall: Reglas[];
  public torneos: any[];
  public fases: string[];
  public msg2e2: string;
  public estado: string[];
  public saveEquipo1: number;
  public participantes: any[];
  public saveEquipo2: number;
  constructor(
    private serviceTitle: Title,
    private auth: AuthService,
    private router: Router,
    private G2PService: G2pService,
    private adminService: UserService
  ) {
    this.adminTorneos = this.adminService.adminTorneos;
    this.juegos = this.adminService.adminJuegos;
    this.rulesall = this.G2PService.reglas;
    this.fases = ['semifinal', 'cuartos', 'octavos', 'dieciseisavos'];
    this.estado = ['ACTIVO', 'PENDIENTE', 'FINALIZADO'];
    this.userlogin = false;
    this.adminlogin = false;
    this.indexDelete = 0;
    this.indexEdit = 0;
    this.msge1 = '';
    this.msge2 = '';
    this.msg2e1 = '';
    this.msg2e2 = '';
    this.saveEquipo1 = 0;
    this.saveEquipo2 = 0;
  }

  

  isLoggedIn() {
    this.userlogin = this.auth.isLoggedIn();
    return this.userlogin;
  }

  noAdmin() {
    if (this.isLoggedIn() && this.adminService.usuarios.admin === 'admin') {
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

  getPartidos() {
    this.adminService.getPartidos().subscribe((data: []) => {
      this.adminService.adminTorneos = data;
      this.adminTorneos = this.adminService.adminTorneos;
      localStorage.setItem(
        'admintorneos',
        JSON.stringify(this.adminService.adminTorneos)
      );
    });
  }

  editTorn(
    idremplace: any,
    torneo_id: number,
    nombre: string,
    fecha: string,
    fases: string,
    reglas_id: any,
    game_id: any,
    hora: string,
    puntos: any,
    estado: string
  ) {
    this.adminService.torneo = new Torneo(
      torneo_id,
      nombre,
      fecha,
      fases,
      Number(reglas_id),
      Number(game_id),
      hora,
      Number(puntos),
      estado
    );

    this.adminService.editTorneos(this.adminService.torneo).subscribe((data) => {
      this.getTorneos();
    });
  }

  deletePar(id: any, id2: any) {
    let xi = JSON.parse(localStorage.getItem('admintorneos'));
    let found = xi.find(function (element) {
      return element.torneo_id === id;
    });
    if (found.estado === 'ACTIVO' || found.estado === 'PENDIENTE') {
      this.deleteTorneo.nativeElement.click();
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: `No puedes eliminar este partido, esta en un torneo en estado ${found.estado}`,
        showConfirmButton: false,
        timer: 2500,
      });
    }
    if (found.estado === null || found.estado === 'FINALIZADO') {
      this.adminService.deleteTorneo(parseInt(id)).subscribe((data) => {
        this.deleteTorneo.nativeElement.click();
        this.adminTorneos.splice(id2, 1);
        localStorage.setItem('admintorneos', JSON.stringify(this.adminTorneos));
        // this.rulesall =
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Partido eliminado correctamente!',
          showConfirmButton: false,
          timer: 2500,
        });
      });
    }
  }

  addTour(
    nombre: string,
    fecha: string,
    fases: string,
    reglas_id: number,
    game_id: number,
    hora: string,
    puntos: number
  ) {
    let estado =  "PENDIENTE"
    if (
      nombre === '' ||
      fecha === '' ||
      fases === '0' ||
      reglas_id === 0 ||
      game_id === 0 ||
      hora === ''
    ) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Por favor completa los campos',
        showConfirmButton: false,
        timer: 2500,
      });
    } else {
      this.adminService.torneo = new Torneo(
        null,
        nombre,
        fecha,
        fases,
        Number(reglas_id),
        Number(game_id),
        hora,
        Number(puntos),
        estado
      );

      this.adminService
        .addTorneo(this.adminService.torneo)
        .subscribe((data: any) => {
          this.getTorneos();
          this.addTorneo.nativeElement.click();
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Torneo creada correctamente!',
            showConfirmButton: false,
            timer: 2500,
          });
        });
    }
  }

  getJuegos() {
    this.adminService.getJuegos().subscribe((data: []) => {
      this.adminService.adminJuegos = data;
      this.juegos = this.adminService.adminJuegos;
      localStorage.setItem(
        'adminjuegos',
        JSON.stringify(this.adminService.adminJuegos)
      );
    });
  }

  getRules() {
    this.G2PService.getAllReglas().subscribe((data: Reglas[]) => {
      this.G2PService.reglas = data;
      localStorage.setItem(
        'adminrules',
        JSON.stringify(this.G2PService.reglas)
      );
      this.rulesall = this.G2PService.reglas;
    });
  }

  getTorneos() {
    this.adminService.getTorneosAll().subscribe((data: []) => {

      this.adminService.adminTorneos = data;
      this.adminTorneos = this.adminService.adminTorneos;
      localStorage.setItem(
        'admintorneos',
        JSON.stringify(this.adminService.adminTorneos)
      );
    });
  }

  verificare1(nickname: string) {
    if (nickname === '') {
      this.msge1 = 'Ningun equipo ingresado';
    } else {
      this.adminService.getTeamByName(nickname).subscribe((data: any) => {
        if (data.length == 0) {
          this.msge1 = 'Este equipo no existe';
          this.msg2e1 = '';
        } else {
          this.msge1 = '';
          this.msg2e1 = 'Equipo añadido correctamente';
          this.saveEquipo1 = data[0].equipo_id;
        }
      });
    }
  }
  verificare2(nickname: string) {
    if (nickname === '') {
      this.msge2 = 'Ningun equipo ingresado';
    } else {
      this.adminService.getTeamByName(nickname).subscribe((data: any) => {
        if (data.length == 0) {
          this.msge2 = 'Este equipo no existe';
          this.msg2e2 = '';
        } else {
          this.msge2 = '';
          this.msg2e2 = 'Equipo añadido correctamente';
          this.saveEquipo2 = data[0].equipo_id;
        }
      });
    }
  }

  getEquiposTorneos(id: number) {
    this.adminService.getEquiposTorneos(id).subscribe((data: any[]) => {
      this.participantes = data;
    });
  }

  public getDelete(i: number) {
    this.indexDelete = i;
  }

  public getEdit(i: number) {
    this.indexEdit = i;
  }


  goDetalle(fases:any, id: any) {
    // console.log(fases);
    // console.log("/detalle-"+fases+"/"+id);
    
    this.router.navigateByUrl('/detalle-'+fases+'/'+id);
    
  }

  
  ngOnInit(): void {
    this.getTorneos();
    this.getJuegos();
    this.getRules();
    this.noAdmin();
    this.adminService.adminTorneos = JSON.parse(
      localStorage.getItem('admintorneos')
    );
    this.adminTorneos = this.adminService.adminTorneos;
    this.adminService.adminJuegos = JSON.parse(
      localStorage.getItem('adminjuegos')
    );
    this.juegos = this.adminService.adminJuegos;
    this.G2PService.reglas = JSON.parse(localStorage.getItem('adminrules'));
    this.rulesall = this.G2PService.reglas;

    this.serviceTitle.setTitle(this.title);
  }
}
