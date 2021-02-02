import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Torneo } from '../models/torneo';

@Injectable({
  providedIn: 'root'
})
export class TorneoService {

  private url = "http://localhost:8000/";
  private urlIMG = "http://localhost:3000/";
  public torneo: Torneo;
  public torneoArray: Torneo[];

  constructor(private http: HttpClient) { }

  /* Nuevo: obtener torneos */
  getTorneos() {
    return this.http.get(this.url + "torneos")
  }

  getTorneosByUser(userId) {
    return this.http.get(this.url + "torneo?id=" + userId)
  }

  getTorneoByID(id:any) {
    return this.http.get(this.url + "mis-torneos/?id=" + id)
  }

  getTorneoSearch(id: any, estado: any) {
    if (id != 'all' && estado === 'all') {
      return this.http.get(this.url + 'gethome?game=' + id);
    }
    if (id === 'all' && estado != 'all') {
      return this.http.get(this.url + 'gethome?estado=' + estado);
    }
    if (id && estado) {
      return this.http.get(
        this.url + 'gethome?game=' + id + '&estado=' + estado
      );
    }
  }

}
