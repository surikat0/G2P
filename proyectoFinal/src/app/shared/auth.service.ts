import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedin: boolean = false;
  isAdminin:boolean = false
  isUserin:boolean = false
  constructor(private router:Router) { }
  
  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.isLoggedin = false;
    this.isAdminin = false;
    this.isUserin = false;
    this.router.navigateByUrl('/');
    localStorage.clear();
  }

  isLoggedIn() {
    if (localStorage.getItem("usuario") === null) {
      this.isLoggedin = false;
      return this.isLoggedin;
    }
    else {
      return true;
    }
  }

}
