import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Equipo } from 'src/app/models/equipo';
import { EquipoService } from 'src/app/shared/equipo.service';
import { UserService } from 'src/app/shared/user.service';
import { Location } from '@angular/common';
import * as Chart from 'chart.js';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import Swal from 'sweetalert2';
import { G2pService } from 'src/app/shared/g2p.service';

@Component({
  selector: 'app-perfil-teams',
  templateUrl: './perfil-teams.component.html',
  styleUrls: ['./perfil-teams.component.css'],
})
export class PerfilTeamsComponent implements OnInit {
  @ViewChild('closeEdit') closeEdit;
  @ViewChild('closeDelete') closeDelete;
  imgSrc = 'assets/images/logo.png';
  title = 'Equipo - G2P';
  public equipo: Equipo;
  public equipos: Equipo[];
  public saveUrl: string;
  public showEdit: boolean;
  public jugadores: any;
  public msg: string;
  public msg2: string;
  public filename: string;
  public FormData: FormData;
  public selectedFile: File; //para cargar la foto
  uploadedFiles: Array<File>;
  public pieChartData: ChartDataSets[] = [
    {
      borderColor: '#fff',
      data: [20, 10, 9, 1],
      // backgroundColor: ['#ff09d6', '#dc3545', '#171c3e', '#0b0f2c'],
      // borderWidth: 0.5,
      label: 'Poppins',
    },
  ];

  public pieChartLabels: Label[] = ['JUGADAS', 'GANADAS', 'PERDIDAS'];
  public pieChartOptions: ChartOptions = {
    plugins: {
      datalabels: {
        color: '#fff',
      },
    },
    responsive: true,
    legend: {
      position: 'bottom',
      fullWidth: false,
      labels: {
        boxWidth: 15,
        fontColor: '#fff',
        fontFamily: 'Poppins',
        fontStyle: 'normal',
        fontSize: 10,
        padding: 25,
        usePointStyle: true,
      },
    },
    title: {
      display: false,
      text: '',
    },
    animation: {
      animateScale: true,
      animateRotate: true,
    },
  };

  public pieChartColors: Color[] = [
    {
      backgroundColor: ['#0b0f2c', '#ff09d6', '#5f0505'],
      borderColor: '#fff',
      borderWidth: 1,
    },
  ];

  public pieChartLegend = true;
  public pieChartType = 'pie';
  public pieChartPlugins = [];
  constructor(
    private serviceTitle: Title,
    public userService: UserService,
    private equipoService: EquipoService,
    private route: ActivatedRoute,
    private G2PService: G2pService,
    private router: Router,
    private link: Location
  ) {
    this.saveUrl = this.route.snapshot.queryParams.id;
    this.equipo = this.equipoService.equipoOnly;
    this.showEdit = false;
    this.jugadores = [];
    this.msg = '';
    this.msg2 = '';
    this.selectedFile = null;
  }

  fileChange(element) {
    this.selectedFile = <File>element.target.files;
    this.msg2 = this.selectedFile[0].name;
  }


  isBanned() {
    this.userService.isBanned();
  }

  getPlayerById() {

    this.equipoService.getPlayersByID(this.saveUrl).subscribe((data: []) => {
      const dataPlayerJSON = JSON.stringify(data);
      const dataPlayer = JSON.parse(dataPlayerJSON);
      this.jugadores = dataPlayer;
      //  for(let i = 0; i < dataPlayer.length; i++){
      //   console.log(dataPlayer[i].nickname);
      //   this.jugadores.push(dataPlayer[i].nickname)

      //  }
    });
  }

  goPerfil(id: string) {
    this.router.navigateByUrl('/perfil?nickname=' + id);
  }

  comprobate() {
    console.log(this.saveUrl);

    if (this.saveUrl === "undefined") {
      
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Este perfil no existe',
        showConfirmButton: false,
        timer: 1500,
      });
      this.router.navigateByUrl('/torneos');
    }
  }

  getEquipoById() {
    this.equipoService
      .getEquipoByID(this.saveUrl)
      .subscribe((data: Equipo[]) => {
        this.equipoService.equipoOnly = data[0];
        this.equipo = this.equipoService.equipoOnly;

        localStorage.setItem(
          'perfilEquipo',
          JSON.stringify(this.equipoService.equipoOnly)
        );
        if (this.equipo === undefined) {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Lo sentimos, este equipo no existe',
            showConfirmButton: false,
            timer: 1500,
          });
          this.router.navigateByUrl('/torneos');
        }

        if (this.equipo.capitan === this.userService.usuarios.usuario_id) {
          this.showEdit = true;
        } else {
          this.showEdit = false;
        }
      });
  }

  borrarEquipo(id: number) {
    const team =  JSON.parse(
      localStorage.getItem('perfilEquipo'));
    if (team.estado === 'ACTIVO' || team.estado === 'PENDIENTE') {
      this.closeDelete.nativeElement.click();
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: `No puedes eliminar este equipo, esta en un torneo en estado ${team.estado}`,
        showConfirmButton: false,
        timer: 2500,
      });
    } 
    if (team.estado === null || team.estado === 'FINALIZADO') {
      this.equipoService.borrarEquipo(id).subscribe((data) => {
        this.closeDelete.nativeElement.click();
        this.closeEdit.nativeElement.click();
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Equipo eliminado correctamente!',
          showConfirmButton: false,
          timer: 2500,
        });
        this.router.navigateByUrl('/torneos');
      });
    }
  }

  editarEquipo(equipo_id: number, nombre: string, biografia: string) {
    let userImageUrl;
    let oldImage;
    let localImg;
    if (nombre == '') {
      nombre = this.equipo.nombre;
    } else {
      this.equipo.nombre = nombre;
      localStorage.setItem('nombre', nombre);
    }
    if (this.selectedFile === null) {
      userImageUrl = this.equipo.logo;
    } else {
      oldImage = this.equipo.logo;
      oldImage = oldImage.replace(this.equipo.logo, '');
      let now = new Date();
      let secret = now.getTime();
      userImageUrl = nombre + equipo_id + secret + '.jpg';
      localImg = 'assets/images/' + userImageUrl;
      this.equipo.logo = localImg;
      localStorage.setItem('url_perfil', localImg);
      let formData = new FormData();
      const nombreFoto = userImageUrl;
      formData.append('uploads', this.selectedFile[0], nombreFoto);
      this.G2PService.uploadImg(formData).subscribe((response) => {
        console.log('response received is ', response);
      });
    }
    if (biografia == '') {
      biografia = this.equipo.biografia;
    } else {
      this.equipo.biografia = biografia;
      localStorage.setItem('biografia', biografia);
    }

    this.equipoService.updateEquipo(this.equipo).subscribe((data: Equipo) => {
      localStorage.setItem(
        'perfilEquipo',
        JSON.stringify(this.equipoService.equipoOnly)
      );
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Datos modificados correctamente!',
        showConfirmButton: false,
        timer: 2500,
      });
      
      this.closeEdit.nativeElement.click();
    });
  }

  shuffeData() {
    this.pieChartData = [
      {
        data: [20, 5, 6],
        // backgroundColor: ['#ff09d6', '#dc3545', '#171c3e', '#0b0f2c'],
        borderColor: '#ffffff',
        // borderWidth: 0.5,
        label: 'Poppins',
      },
    ];
  }

  goBack() {
    // window.history.back();
    this.link.back();

  }

  goForward() {
    this.link.forward();
  }

  ngOnInit(): void {
    this.serviceTitle.setTitle(this.title);
    this.isBanned();
    this.getPlayerById();
    this.getEquipoById();
    this.comprobate();
    this.shuffeData();
    this.equipoService.equipoOnly = JSON.parse(
      localStorage.getItem('perfilEquipo')
    );
    this.equipo = this.equipoService.equipoOnly;
    
  }
}
