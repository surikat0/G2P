import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { environment } from '../../environments/environment';
import { Posicion } from '../models/posicion';


@Injectable({
  providedIn: 'root'
})
export class PosicionService {

  private url = "http://localhost:8000/"
  private urlIMG = "http://localhost:3000/"
  public posicion: Posicion;
  public posiciones: Posicion[]
  public games: any = []
  public saveData: []
  constructor(private http: HttpClient) { }

  public uploadImg(fd: FormData){
    return this.http.post(this.urlIMG + "upload", fd)
  }

  getPosicion(id: number) {
    return this.http.get(this.url + "colocacion?id=" + id)
  }


  putPosicion(putPosicion: Posicion) {
    return this.http.put(this.url + "colocacion/", putPosicion);
  }

  postPosicion(addPosicion: any) {
    return this.http.post(this.url + "colocacion/", addPosicion)

  }

  deletePosicion(id: number) {
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        id: id
      },
    }
    return this.http.delete(this.url + "colocacion/", options)
  }
}