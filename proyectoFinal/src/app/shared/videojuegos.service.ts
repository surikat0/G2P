import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Videojuego } from '../models/videojuego';
import { User } from '../models/user';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class VideoJuegosService {

  private url = "http://localhost:8000/"
  private urlIMG = "http://localhost:3000/"
  public videojuego: Videojuego;
  public videojuegos: Videojuego[]
  public games: any = []
  constructor(private http: HttpClient) { }

  public uploadImg(fd: FormData){
    return this.http.post(this.urlIMG + "upload", fd)
  }

  getJuegoByID(id: number) {
    return this.http.get(this.url + "juegos/" + id)
  }

  getAllJuegos() {
    return this.http.get(this.url + "juegos/")
  }

  putJuego(putJuego: Videojuego) {
    return this.http.put(this.url + "juegos/", putJuego);
  }

  postJuego(addjuego: any) {
    return this.http.post(this.url + "juegos/", addjuego)

  }

  deleteJuego(id: number) {
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        juego_id: id
      },
    }
    return this.http.delete(this.url + "juegos/", options)
  }
}

