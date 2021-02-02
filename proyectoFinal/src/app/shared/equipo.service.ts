import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Equipo } from '../models/equipo';

@Injectable({
  providedIn: 'root',
})
export class EquipoService {
  private url = 'http://localhost:8000/';
  private urlIMG = 'http://localhost:3000/';
  public equipoOnly: Equipo;
  public equiposArray: Equipo[];

  constructor(private http: HttpClient) {}

  getEquipoByID(id: any) {
    return this.http.get(this.url + 'equipo/?id=' + id);
  }

  getPlayersByID(id: any) {
    return this.http.get(this.url + 'jugadores/' + id);
  }

  /* Nuevo: consulta para obtener equipos por un usuario */
  getEquiposByUser(userId: string) {
    return this.http.get(`${this.url}equipos-usuario/?userId=${userId}`);
  }

  /* Nuevo: agregar equipo */
  postEquipo(add: Equipo) {
    return this.http.post(this.url + 'equipos', add);
  }

  borrarEquipo(id: number) {
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        equipo_id: id,
      },
    };
    return this.http.delete(this.url + 'equipos', options);
  }
  
  updateEquipo(edit: Equipo) {
    return this.http.put(this.url + 'equipos', edit);
  }
}
