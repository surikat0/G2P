import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Equipo } from 'src/app/models/equipo';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/shared/auth.service';
import { UserService } from 'src/app/shared/user.service';
import { Torneo } from "../../models/torneo"
import { EquipoService } from "../../shared/equipo.service"
import Swal from "sweetalert2"
import { EquiposTorneoService } from "../../shared/equipos-torneo.service"
import { EquipoTorneo } from "../../models/equipo-torneo"
import { TorneoService } from "../../shared/torneo.service"
declare var $: any

@Component({
  selector: 'app-torneos',
  templateUrl: './torneos.component.html',
  styleUrls: ['./torneos.component.css'],
})
export class TorneosComponent implements OnInit {
  @ViewChild('modalApuntate') modalApuntate;
  @ViewChild('registrateButton') registrateButton;
  imageAshe = 'assets/asheHeader.jpg';
  imageJhin = 'assets/lolHeader.jpg';
  fifa1vs1 = 'assets/FIFA-21-Header.jpg';
  fifa11vs11 = 'assets/fifa.jpg';
  trofeo = 'assets/trofeo.png';
  lolLogo = 'assets/lolLogo.png';
  fifaLogo = 'assets/fifaLogo.png';
  imgSrc = 'assets/images/logo.png';
  public dataTop10: User[];
  public dataTeamTop5: [];
  public yourRankTop: User;
  public yourRankTopTeam: Equipo;
  public topOne: User;
  public teamTopOne: any;
  public yourNumberTop: number;
  public yourNumberTopTeam: number;
  public jugadores: any;
  public estado: string[];
  user: boolean;
  team: boolean;
  title = 'Torneos - G2P';
  public userlogin: boolean;
  public torneosList: any[] = []
  public misEquipoStartList: Equipo[] = []
  public misEquipoList: Equipo[] = []
  private torneoId: number
  public equipoId: any = ''
  private userInfo = JSON.parse(localStorage.getItem('usuario'))
  private equiposTorneoList: EquipoTorneo[] = []
  private isUpdateSelectEquipo: boolean = false
  anio: number = new Date().getFullYear();
  public juegos: any[];
  public myIndex: number;
  public innerHTML: string;
  private fase: string

  constructor(
    private router: Router,
    public userService: UserService,
    private serviceTitle: Title,
    private auth: AuthService,
    private equiposTorneoService: EquiposTorneoService,
    private torneoService: TorneoService,
    private route: ActivatedRoute,
    private equipoService: EquipoService
  ) {
    this.team = false;
    this.estado = ['ACTIVO', 'PENDIENTE', 'FINALIZADO'];
    this.dataTop10 = this.userService.usersRank;
    this.dataTeamTop5 = this.userService.teamRank;
    this.topOne = this.userService.userTopOne
    this.teamTopOne = this.userService.teamTopOne;
    this.myIndex = 0;
    this.jugadores = []
    this.innerHTML = '';
    this.user = true;
    this.userlogin = false
  }

  goPerfil(nickname: string) {
    this.router.navigateByUrl(
      '/perfil?nickname=' + nickname
    );
  }

  goPerfilTeam(id: number) {
    this.router.navigateByUrl(
      '/perfil-equipo?id=' + id
    );
  }

  goTorneoDetalle(fase: string, id: number) {

    this.router.navigateByUrl(
      '/detalle-' + fase + '/' + id
    );

  }

  getJuegos() {
    this.userService.getJuegos().subscribe((data: []) => {
      this.userService.adminJuegos = data;
      this.juegos = this.userService.adminJuegos;
    });
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

  search(id: any, estado: any) {
    const saveGame = this.route.snapshot.queryParams.game;
    const saveEstado = this.route.snapshot.queryParams.estado;


    if (id === "all" && estado === "all") {
      this.torneoService.getTorneos().subscribe((data: []) => {
        this.torneosList = data;
      });
    }
    if (id === 'all' && estado != "all") {
      this.torneoService.getTorneoSearch(id, estado).subscribe((data: []) => {
        this.torneosList = data;
      });

    }
    if (id && estado === '0') {
      this.torneoService.getTorneoSearch(id, estado).subscribe((data: []) => {
        this.torneosList = data;
      });
    }

    if (id && estado) {
      this.torneoService.getTorneoSearch(id, estado).subscribe((data: []) => {
        this.torneosList = data;
      });
    }


  }

  rankTop10() {
    this.userService.rankTop10().subscribe((data: User[]) => {
      this.userService.usersRank = data;
      this.dataTop10 = this.userService.usersRank;
      localStorage.setItem('ranktop10', JSON.stringify(this.dataTop10));
    });
  }

  rankTop5Team() {
    this.userService.rankTop5Team().subscribe((data: []) => {
      this.userService.teamRank = data;
      this.dataTeamTop5 = this.userService.teamRank;
      localStorage.setItem('ranktop5team', JSON.stringify(this.dataTeamTop5))
    })
  }

  findYourTop() {
    this.userService.yourtop().subscribe((data: User[]) => {
      const saveTop = data;
      const saveName = this.userService.usuarios.nickname
      let found = saveTop.find(function (element) {
        return element.nickname === saveName;
      });
      const isLargeNumber = (element) => element.nickname === saveName;
      this.yourRankTop = found
      const saveYourTop = saveTop.findIndex(isLargeNumber) + 1
      this.yourNumberTop = saveYourTop
    })
  }

  findTopOne() {
    this.userService.topOne().subscribe((data: User) => {
      this.userService.userTopOne = data[0];
      this.topOne = this.userService.userTopOne;
    })
    this.userService.getOneTopTeam().subscribe((data) => {
      this.userService.teamTopOne = data[0];
      this.teamTopOne = this.userService.teamTopOne;
    })

  }

  isLoggedIn() {
    this.userlogin = this.auth.isLoggedIn();
    return this.userlogin;
  }

  changeEquipo() {

    if (this.user === true) {
      this.user = false;
      this.team = true;
    } else {
      this.user = true;
      this.team = false;
    }

  }

  onItemChange(value) {
    this.team = value
  }

  getTeamsById() {

    this.userService.yourTeamRank(this.userService.usuarios.usuario_id).subscribe((data) => {
      const dataPlayerJSON = JSON.stringify(data[0]);
      const dataPlayer = JSON.parse(dataPlayerJSON);
      this.jugadores = dataPlayer;
      const newTeam = JSON.parse(localStorage.getItem('ranktop5team'))
      const saveID = this.userService.usuarios.usuario_id
      let found = newTeam.find(function (element) {
        return element.capitan_id === saveID;
      });
      const isLargeNumber = (element) => element.capitan_id === saveID;
      this.yourRankTopTeam = found
      const saveYourTop = newTeam.findIndex(isLargeNumber) + 1
      this.yourNumberTopTeam = saveYourTop
    });
  }

  ngOnInit(): void {
    this.getTorneos();
    this.getJuegos();
    this.rankTop10();
    this.rankTop5Team();
    this.findTopOne();
    this.findYourTop();
    this.getTeamsById();
    this.isLoggedIn();
    this.userService.usersRank = JSON.parse(localStorage.getItem('ranktop10'));
    this.dataTop10 = this.userService.usersRank;
    this.userService.teamRank = JSON.parse(localStorage.getItem('ranktop5team'))
    this.dataTeamTop5 = this.userService.teamRank;
    this.topOne = this.userService.userTopOne
    this.serviceTitle.setTitle(this.title);
  }

  private getTorneos() {
    this.torneoService.getTorneos().subscribe((res: any) => {
      this.torneosList = res
      this.getEquiposTorneo();
    }, err => {
      this.showError()
    })
    $('#cerrarApuntate').click(function () {
      $('#modalApuntate').modal('hide')

    })
    $('#cerrarApuntate1').click(function () {
      $('#modalApuntate').modal('hide')

    })

  }

  private getEquiposTorneo() {
    this.equiposTorneoService.getTorneos()
      .subscribe((res: any) => {
        this.equiposTorneoList = res
        this.getEquipo()
      }, err => {
        this.showError()
      })
  }

  private getEquipo() {
    this.equipoService.getEquiposByUser(this.userInfo.usuario_id)
      .subscribe((res: any) => {
        this.misEquipoStartList = res
        if (this.isUpdateSelectEquipo) {
          this.isUpdateSelectEquipo = false
          this.setTorneoInfo(this.torneoId, this.fase)
        }
      }, err => {
        this.showError()
      })
  }

  setEquipoTorneo() {
    if (this.equipoId === '') {
      this.showError()
      return
    } else {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'but-ok',
          cancelButton: 'but-cancel'
        },
        buttonsStyling: false
      })

      swalWithBootstrapButtons.fire({
        title: '¡Se necesita confirmación!',
        text: "Confirmar que se ha leído las reglas y desea participar",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'CONFIRMAR',
        cancelButtonText: 'CANCELAR',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          const data = {
            torneo_id: this.torneoId,
            fase: this.fase,
            equipo_id: this.equipoId
          }
          this.equiposTorneoService.postEquipoTorneo(data)
            .subscribe(() => {
              this.isUpdateSelectEquipo = true
              this.getTorneos()
              this.equipoId = ''
              this.showSuccess()
            }, err => {
              this.showError(err.error.message)
            })
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Cancelado',
            'Por favor no olvides en leer las reglas, y participa',
            'error'
          )
        }
      })
    }



  }

  getData(i: number) {
    this.myIndex = i;
    this.innerHTML = this.torneosList[i].descripcion_regla;
  }

  setTorneoInfo(torneo_id: number, fase: string) {
    if (this.userlogin === false) {
      Swal.fire({
        title: '<strong>¿Que sucede?</strong>',
        icon: 'info',
        html:
          'Por favor ' +
          '<a id="registratep"><u>registrate</u></a> ' +
          'o <a id="entrap"><u>inicia sesion</u></a> ',
        showCloseButton: false,
        showCancelButton: false,
        focusConfirm: false,
        confirmButtonText:
          '<i class="fa fa-thumbs-up"></i> OK, esta bien!',
        confirmButtonAriaLabel: 'LISTO!',

      })

      $('#registratep').click(function () {
        $('#registerModal').modal('show')
        $('.swal2-container').hide()
      })
      $('#entrap').click(function () {
        $('#loginModal').modal('show')
        $('.swal2-container').hide()
      })

    } else {

      this.torneoId = torneo_id
      this.fase = fase
      const torneosEquipos = this.equiposTorneoList.filter(item => item.torneo_id === torneo_id)
      this.misEquipoList = this.misEquipoStartList.filter(equipo => {
        let noExists = true
        for (const torneosEquipo of torneosEquipos) {
          if (torneosEquipo.equipo_id === equipo.equipo_id) {
            noExists = false
            break
          }
        }
        return noExists
      })
      $('#modalApuntate').modal('show')

    }
  }

  private showSuccess() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Equipo añadido correctamente.',
      showConfirmButton: false,
      timer: 1500,
    });
  }

  private showError(title: string = 'Ha ocurrido un error') {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title,
      showConfirmButton: false,
      timer: 1500,
    });
  }
}
