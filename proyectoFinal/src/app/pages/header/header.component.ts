import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';
import { EncrDecrServiceService } from 'src/app/shared/encr-decr-service.service';
import { UserService } from 'src/app/shared/user.service';
import Swal from 'sweetalert2';
import { validarQueSeanIguales } from './header.validator';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { HttpClient } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { uniqueNicknameValidator } from 'src/app/shared/unique-nickname.validator.directive';
import { uniqueEmailValidator } from 'src/app/shared/email-nickname.validator.directive';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  @ViewChild('closeRegister') closeRegister;
  @ViewChild('closeLogin') closeLogin;
  private url = 'http://localhost:8000/usuarios';
  public nationalities: string[];
  public g2pUser: User;
  public User: User;
  public typeUser: string;
  public typeAdmin: string;
  public myForm: FormGroup;
  public myFormLogin: FormGroup;
  public imageSrc: string;
  public show: boolean;
  public admin: boolean;
  public user: boolean;
  public notcomplete: boolean;
  public biografia: string;
  public userlogin: boolean;
  public adminlogin: boolean;
  public userinlogin: boolean;
  public errors: string;
  public useralls: User[];

  constructor(
    public userService: UserService,
    private formBuilder: FormBuilder,
    public EncrDecr: EncrDecrServiceService,
    private router: Router,
    private auth: AuthService,
    private http: HttpClient
  ) {
    this.nationalities = [
      'Panama',
      'Colombia',
      'Costa Rica',
      'Honduras',
      'Brazil',
      'Argentina',
      'Bolivia',
      'Cuba',
      'El Salvador',
      'Ecuador',
      'Guatemala',
      'Jamaica',
      'Mexico',
      'Nicaragua',
      'Paraguay',
      'Peru',
      'Puerto Rico',
      'Espana',
      'Estados Unidos',
      'Uruguay',
      'Venezuela',
      'Portugal',
      'China',
      'Republica Dominicana',
    ];
    this.g2pUser = this.userService.usuarios;
    this.User = new User(
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    );
    this.useralls = this.userService.allusers;

    this.typeUser = 'user';
    this.typeAdmin = 'admin';
    this.buildForm();
    this.imageSrc = 'assets/images/logo.png';
    this.show = false;
    this.admin = false;
    this.user = true;
    this.notcomplete = false;
    this.biografia = 'melachupas';
    this.userlogin = false;
    this.adminlogin = false;
    this.userinlogin = false;
    this.g2pUser = this.userService.usuarios;
  }

  checarSiSonIguales(): boolean {
    return (
      this.myForm.hasError('noSonIguales') &&
      this.myForm.get('contrasena').dirty &&
      this.myForm.get('repetir_contrasena').dirty
    );
  }

  private buildForm() {
    const minPassLength = 8;
    const maxPassLength = 20;
    const minWordsLength = 4;
    const maxWordsLength = 30;

    this.myForm = this.formBuilder.group(
      {
        nickname: [
          '',
          Validators.minLength(minWordsLength),
          uniqueNicknameValidator(this.userService),
        ],
        nombre: ['', Validators.maxLength(maxWordsLength)],
        apellido: ['', Validators.maxLength(maxWordsLength)],
        nacimiento: ['', Validators.required],
        correo: [
          '',
          [Validators.email],
          uniqueEmailValidator(this.userService),
        ],
        contrasena: [
          '',
          [
            Validators.minLength(minPassLength),
            Validators.maxLength(maxPassLength),
          ],
        ],
        repetir_contrasena: [
          '',
          RxwebValidators.compare({ fieldName: 'contrasena' }),
        ],
      },
      {
        validators: this.checkPasswords,
      }
    );
  }

  get username() {
    return this.myForm.get('nickname');
  }

  getUsersAll() {
    this.userService.getUserAll().subscribe((data: User[]) => {
      this.userService.allusers = data;
      localStorage.setItem(
        'allusers',
        JSON.stringify(this.userService.allusers)
      );
      this.userService.allusers = JSON.parse(localStorage.getItem('allusers'));
      let peta = JSON.parse(localStorage.getItem('allusers'));
      this.useralls = this.userService.allusers;
      if (this.isLoggedIn() === true) {
        let usuario_id = this.g2pUser.usuario_id;
        this.userService.getUserByID(usuario_id).subscribe((data) => {
          this.User = data[0];
          let convert = JSON.stringify(this.User);
          let search = JSON.parse(convert);
          if (search.isBanned === 1) {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Lo sentimos, estas baneado',
              showConfirmButton: false,
              timer: 2000,
            });
            localStorage.clear();
            this.router.navigateByUrl('/');
          }
        });
      }
    });
  }

  checkPasswords(group: FormGroup) {
    // here we have the 'passwords' group
    let pass = group.controls.contrasena.value;
    let confirmPass = group.controls.repetir_contrasena.value;
    return pass === confirmPass ? null : { notSame: true };
  }

  // Metodo que llama al servicio para crear el registro
  registerUsuario(
    nickname: string,
    nombre: string,
    apellido: string,
    nacimiento: number,
    correo: string,
    nacionalidad: string,
    contrasena: { toString: () => string }
  ) {
    let encrypted = this.EncrDecr.set('123456$#@$^@1ERF', contrasena);
    if (
      !nickname ||
      !nombre ||
      !apellido ||
      !nacimiento ||
      !correo ||
      !nacionalidad ||
      !encrypted ||
      !contrasena
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Debes completar todos los campos',
      });
    } else if (
      this.myForm.value.contrasena != this.myForm.value.repetir_contrasena ||
      this.myForm.value.repetir_contrasena === ''
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Debes confirmar tu contraseña',
      });
    } else {
      this.userService
        .postUser(
          new User(
            null,
            nickname,
            nombre,
            apellido,
            this.imageSrc,
            nacimiento,
            correo,
            nacionalidad,
            encrypted,
            this.biografia,
            this.typeUser,
            null,
            null
          )
        )
        .subscribe((data: User) => {
          this.closeRegister.nativeElement.click();
          Swal.fire({
            icon: 'success',
            title: 'Registro completado!',
            text: 'Ahora inicia sesion y disfruta de G2P',
          });
        });
    }
  }

  goPerfil() {
    this.router.navigateByUrl(
      '/perfil-user'
    );
  }

  loginUsuario(nickname_login: string, contrasena_login: string) {
    let encrypted = this.EncrDecr.set('123456$#@$^@1ERF', contrasena_login);
    this.userService
      .login(
        new User(
          null,
          nickname_login,
          null,
          null,
          null,
          null,
          null,
          null,
          encrypted,
          null,
          this.typeUser,
          null,
          null
        )
      )
      .subscribe((data: User[]) => {
        if (!nickname_login || !contrasena_login) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Debes ingresar tu G2P ID y tu contraseña',
          });
        }
        else if (data.length == 0) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Usuario o contraseña erróneo',
          });
        } else {
          this.userService.usuarios = data[0];
          this.show = true;
          this.closeLogin.nativeElement.click();
          window.location.reload();
          localStorage.setItem('usuariologged', 'true');
          localStorage.setItem(
            'usuario',
            JSON.stringify(this.userService.usuarios)
          );
        }
      });
  }

  logout() {
    this.auth.logout();
  }

  isLoggedIn() {
    this.userlogin = this.auth.isLoggedIn();
    return this.userlogin;
  }

  isAdminIn() {
    if (this.isLoggedIn() && this.g2pUser.admin === 'admin') {
      this.adminlogin = true;
    } else if (this.g2pUser === null) {
      this.adminlogin = false;
      return this.adminlogin;
    } else {
      return false;
    }
  }

  // isBanned() {
  //   if (
  //     this.isLoggedIn() &&
  //     JSON.parse(localStorage.getItem('usuario')).isBanned === 1
  //   ) {
  //     Swal.fire({
  //       position: 'center',
  //       icon: 'error',
  //       title: 'Lo sentimos, estas baneado',
  //       showConfirmButton: false,
  //       timer: 2000,
  //     });
  //     localStorage.clear();
  //     this.router.navigateByUrl('/');
  //   } else {
  //     console.log('hola');
  //   }
  // }

  isUserIn() {
    if (this.isLoggedIn() && this.g2pUser.admin === 'user') {
      this.userinlogin = true;
      return this.userinlogin;
    } else if (this.g2pUser === null) {
      this.userinlogin = false;
      return this.userinlogin;
    } else {
      return false;
    }
  }
  ngOnInit(): void {
    this.getUsersAll();
    this.userService.usuarios = JSON.parse(localStorage.getItem('usuario'));
    this.g2pUser = this.userService.usuarios;
    this.isUserIn();
    this.isLoggedIn();
    this.isAdminIn();
  }
}
