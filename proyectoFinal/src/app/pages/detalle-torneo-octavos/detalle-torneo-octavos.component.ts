import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from "@angular/router"
import Swal from "sweetalert2"
import {PartidosService} from "../../shared/partidos.service"
import { Location } from '@angular/common';

@Component({
  selector: 'app-detalle-torneo-octavos',
  templateUrl: './detalle-torneo-octavos.component.html',
  styleUrls: ['./detalle-torneo-octavos.component.css']
})
export class DetalleTorneoOctavosComponent implements OnInit {

  title = 'Detalle Torneo Octavos - G2P'
  imglogo = 'assets/images/logo.png'
  public isMobileLayout = false;
  public partidosList: any
  private torneoId: string
  public showorno:boolean

  constructor(
    private link: Location,
    private route: ActivatedRoute,
    private router: Router,
    private partidosService: PartidosService,
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
        res.octavoList = [...res.octavoList, ...this.fillPartidos(res.octavoList, 8)]
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

    }else {
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

  openDetail(partido_id: any) {
    if (partido_id && partido_id !== '') {
      this.router.navigateByUrl(`/detalle-partido/${partido_id}`)
    }
  }
}
