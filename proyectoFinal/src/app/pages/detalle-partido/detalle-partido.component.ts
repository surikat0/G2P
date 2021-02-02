import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {PartidosService} from "../../shared/partidos.service"
import {ActivatedRoute, Router} from "@angular/router"
import Swal from "sweetalert2"
import {Partidos} from "../../models/partidos"
import { UserService } from 'src/app/shared/user.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-detalle-partido',
  templateUrl: './detalle-partido.component.html',
  styleUrls: ['./detalle-partido.component.css']
})
export class DetallePartidoComponent implements OnInit {
  imageSrc = 'assets/images/logo.png'
  title = 'Detalle Partido - G2P'
  public partido: any
  private partidoId: any
  public ver:boolean
  constructor(
    private partidoService: PartidosService,
    private router: Router,
    private link: Location,
    private userService:UserService,
    private route: ActivatedRoute,
    private serviceTitle:Title
  ) {
    this.partidoId = this.route.snapshot.params.id
    this.ver = false;
  }

  ngOnInit(): void {
    this.serviceTitle.setTitle(this.title)
    this.getPartido()
    this.comprobate()
    console.log(this.partido);
    
  }
  goBack() {
    // window.history.back();
    this.link.back();
  }

  goPerfilTeam(id: number) {
    this.router.navigateByUrl(
      '/perfil-equipo?id=' + id
    );
  }



  comprobate() {
    console.log(this.partidoId);

    if (this.partidoId === "undefined") {
      
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Este partido no existe',
        showConfirmButton: false,
        timer: 1500,
      });
      return this.link.back();
    }
  }
  

  private getPartido() {
    this.partidoService.getPartidosByID(this.partidoId).subscribe((res: any) => {
      this.partido = res[0]
      console.log(this.partido);

      if(this.partido.capitan_first === this.userService.usuarios.usuario_id || this.partido.capitan_second === this.userService.usuarios.usuario_id ){
        this.ver = true;
        return this.ver
        
      }else{
        this.ver = false;
        return this.ver;
        
      }
      
    }, err => {
      this.showError()
    })
  }

  guardarPartido() {
    if (this.partido.resultado_first === this.partido.resultado_second) {
      this.showError('Los resultados no pueden ser igual')
      return
    }
    this.partidoService.putPartidosResultados(this.partido)
      .subscribe(() => {
        this.getPartido()
        this.showSuccess()
      }, err => {
        this.showError()
      })
  }

  private showSuccess() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Resultados modificados correctamente',
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
