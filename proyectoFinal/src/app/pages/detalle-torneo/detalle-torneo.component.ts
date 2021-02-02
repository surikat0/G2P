import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { PartidosService } from 'src/app/shared/partidos.service';
import { PosicionService } from 'src/app/shared/posicion.service';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';

@Component({
  selector: 'app-detalle-torneo',
  templateUrl: './detalle-torneo.component.html',
  styleUrls: ['./detalle-torneo.component.css']
})
export class DetalleTorneoComponent implements OnInit {
  
  
  title = 'Detalle Torneo Cuartos - G2P'
  imglogo = 'assets/images/logo.png'
  public isMobileLayout = false;
  public partidosList: any
  private torneoId: string
  public showorno:boolean

  constructor(
    private route: ActivatedRoute,
    private router:Router,
    private partidosService: PartidosService,
    private link: Location,
    private serviceTitle: Title
  ) {
    this.torneoId = this.route.snapshot.params.id
    this.showorno = true;

  }

  goBack() {
    // window.history.back();
    this.link.back();
  }

  goPerfil(id: any) {
    this.router.navigateByUrl('/perfil-equipo?id=' + id);
    console.log(id);
    
  }
  goDetalle(id: any) {
    this.router.navigateByUrl('/detalle-partido/' + id);
    console.log(id);
    
  }

  ngOnInit(): void {
    window.onresize = () => this.isMobileLayout = window.innerWidth <= 1200;
    this.serviceTitle.setTitle(this.title)
    this.getEquiposByTorneo()
  }

  private getEquiposByTorneo() {
    this.partidosService.getPartidosByTorneoID(Number(this.torneoId))
      .subscribe((res: any) => {
        res.cuartoList = [...res.cuartoList, ...this.fillPartidos(res.cuartoList, 4)]
        res.semiList = [...res.semiList, ...this.fillPartidos(res.semiList, 2)]
        res.finalList = [...res.finalList, ...this.fillPartidos(res.finalList, 1)]

        this.partidosList = res
      }, err => {
        this.showError()
      })
  }

  private fillPartidos(list: any[], size: number) {
    const listTemp = []

    if (list && list.length < size) {
      for (let i = 0; i < size - list.length; i++) {
        listTemp.push({
          nombre_first: 'Equipo',
          nombre_second: 'Equipo',
          resultado_first: '0',
          resultado_second: '0  ',
          logo_first: this.imglogo,
          logo_second: this.imglogo,
        })
      }
      this.showorno = false;

    } else {
      this.showorno = true
    }

    return listTemp
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
