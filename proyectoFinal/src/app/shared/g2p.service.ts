import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Reglas } from '../models/reglas';
import { User } from '../models/user';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class G2pService {

  private url = "http://localhost:8000/"
  private urlIMG = "http://localhost:3000/"
  public regla: Reglas;
  public reglas: Reglas[]
  public rules: any = []
  constructor(private http: HttpClient) { }

  public uploadImg(fd: FormData){
    return this.http.post(this.urlIMG + "upload", fd)
  }

  getReglasByID(id: number) {
    return this.http.get(this.url + "reglas/" + id)
  }

  getAllReglas() {
    return this.http.get(this.url + "reglas/")
  }

  putReglas(putregla: Reglas) {
    return this.http.put(this.url + "reglas/", putregla);
  }

  postReglas(addregla: any) {
    return this.http.post(this.url + "reglas/", addregla)

  }

  deleteReglas(id: number) {
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        reglas_id: id
      },
    }
    return this.http.delete(this.url + "reglas/", options)
  }
}
