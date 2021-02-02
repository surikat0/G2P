import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';
import { EncrDecrServiceService } from 'src/app/shared/encr-decr-service.service';
import { UserService } from 'src/app/shared/user.service';
import Swal from 'sweetalert2';
import { json, RxwebValidators } from '@rxweb/reactive-form-validators';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { G2pService } from 'src/app/shared/g2p.service';
import { HttpClient } from '@angular/common/http';
import * as Chart from 'chart.js';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { Location } from '@angular/common';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
})
export class PerfilComponent implements OnInit {
  title = 'Perfil - G2P';
  public saveUrl: string;
  public g2pPerfil: User;
  public jugadores: any;
  public pieChartData: ChartDataSets[] = [
    {
      borderColor: '#fff',
      data: [20, 10, 9, 1],
      // backgroundColor: ['#ff09d6', '#dc3545', '#171c3e', '#0b0f2c'],
      // borderWidth: 0.5,
      label: 'Poppins',
    },
  ];

  public pieChartLabels: Label[] = [
    'JUGADAS',
    'GANADAS',
    'PERDIDAS',
    'EMPATADAS',
  ];
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
      backgroundColor: ['#0b0f2c', '#ff09d6', '#5f0505', '#171c3e'],
      borderColor: '#fff',
      borderWidth: 1,
    },
  ];

  public pieChartLegend = true;
  public pieChartType = 'pie';
  public pieChartPlugins = [];

  constructor(
    private http: HttpClient,
    public userService: UserService,
    private formBuilder: FormBuilder,
    public EncrDecr: EncrDecrServiceService,
    private G2PService: G2pService,
    private router: Router,
    private serviceTitle: Title,
    private auth: AuthService,
    private route: ActivatedRoute,
    private link: Location
  ) {
    this.saveUrl = this.route.snapshot.queryParams.nickname;
    this.g2pPerfil = this.userService.otherPerfil;
    this.jugadores = [];

  }

  comprobate() {
    if (this.saveUrl === undefined) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Algo ha fallado.',
        showConfirmButton: false,
        timer: 1500,
      });
      this.router.navigateByUrl('/torneos');
    }
  }

  getUser() {
    this.userService.getOtroPerfil(this.saveUrl).subscribe((data: User) => {
      this.userService.otherPerfil = data[0];
      this.g2pPerfil = this.userService.otherPerfil;
      if(this.g2pPerfil === undefined){
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Lo sentimos, este perfil no existe',
          showConfirmButton: false,
          timer: 1500,
        });
        this.router.navigateByUrl('/torneos');
      }
      
      if(this.g2pPerfil.nickname === this.userService.usuarios.nickname){
        this.router.navigateByUrl('/perfil-user');
        
      }
      console.log(this.g2pPerfil);
      
    });
  }

  goPerfil(id: string) {
    this.router.navigateByUrl('/perfil-equipo?id=' + id);
  }

  shuffeData() {
    

    
    this.pieChartData = [
      {
        data: [20, 5, 6, 2],
        // backgroundColor: ['#ff09d6', '#dc3545', '#171c3e', '#0b0f2c'],
        borderColor: '#ffffff',
        // borderWidth: 0.5,
        label: 'Poppins',
      },
    ];
  }

  getTeamsById() {

    this.userService.getOtroPerfil(this.saveUrl).subscribe((data: User) => {
      const saveUser = JSON.stringify(data[0]);
      const saveUserJSON = JSON.parse(saveUser)
    this.userService.getTeamsById(saveUserJSON.usuario_id).subscribe((data: []) => {
      const dataPlayerJSON = JSON.stringify(data);
      const dataPlayer = JSON.parse(dataPlayerJSON);
      this.jugadores = dataPlayer;
    });
    });
  }

  goBack() {
    // window.history.back();
    this.link.back();

    console.log('goBack()...');
  }

  goForward() {
    this.link.forward();
  }

  ngOnInit(): void {
    this.comprobate();
    this.getUser();
    this.getTeamsById();
    this.shuffeData();
    this.serviceTitle.setTitle(this.title);
    this.g2pPerfil = this.userService.otherPerfil;
    console.log(this.userService.otherPerfil);
    console.log(this.g2pPerfil);
    
    
  }
}
