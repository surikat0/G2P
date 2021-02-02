import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import Swal from "sweetalert2"
import {ActivatedRoute, Router} from "@angular/router"
import {PartidosService} from "../../shared/partidos.service"
import { Location } from '@angular/common';

@Component({
  selector: 'app-detalle-torneo-dieciseisavos',
  templateUrl: './detalle-torneo-dieciseisavos.component.html',
  styleUrls: ['./detalle-torneo-dieciseisavos.component.css']
})
export class DetalleTorneoDieciseisavosComponent implements OnInit {

  title = 'Detalle Torneo Dieciseisavos - G2P'
  imglogo = 'assets/images/logo.png'
  public partidosList: any
  private torneoId: string

  constructor(
    private route: ActivatedRoute,
    private link: Location,
    private router: Router,
    private partidosService: PartidosService,
    private serviceTitle:Title
  ) {
    this.torneoId = this.route.snapshot.params.id
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

  public isMobileLayout = false;
  ngOnInit(): void {
    window.onresize = () => this.isMobileLayout = window.innerWidth <= 1200;
    this.serviceTitle.setTitle(this.title)
    this.getEquiposByTorneo()
  }

  private getEquiposByTorneo() {
    this.partidosService.getPartidosByTorneoID(Number(this.torneoId))
      .subscribe((res: any) => {
        res.dieciseisList = [...res.dieciseisList, ...this.fillPartidos(res.dieciseisList, 16)]
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
          resultado_first: '',
          resultado_second: '',
        })
      }
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
