import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Torneo } from '../models/torneo';
import {EquipoTorneo} from "../models/equipo-torneo"

@Injectable({
  providedIn: 'root'
})
export class EquiposTorneoService {

  private url = "http://localhost:8000/";
  private urlIMG = "http://localhost:3000/";

  constructor(private http: HttpClient) { }

  /* Nuevo obtener equipos y torneo */
  getTorneos() {
    return this.http.get(this.url + "equipos-torneos")
  }

  postEquipoTorneo(data: EquipoTorneo) {
    return this.http.post(this.url + "equipos-torneos", data)
  }

}
