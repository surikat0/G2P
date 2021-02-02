export class User {
    public usuario_id:number;
    public nickname:string;
    public nombre:string;
    public apellido:string;
    public url_perfil:string;
    public nacimiento:number;
    public correo:string;
    public nacionalidad:string;
    public contrasena:any;
    public biografia:string;
    public admin: string;
    public isBanned:any;
    public puntuacion:number;

    constructor(usuario_id:number, 
        nickname:string, 
        nombre:string, 
        apellido:string, 
        url_perfil:string, 
        nacimiento:number, 
        correo:string, 
        nacionalidad:string, 
        contrasena:any, 
        biografia:string,
        admin:string,
        isBanned:any,
        puntuacion:number){
            this.usuario_id = usuario_id;
            this.nickname = nickname;
            this.nombre = nombre;
            this.apellido = apellido;
            this.url_perfil = url_perfil;
            this.nacimiento = nacimiento;
            this.correo = correo;
            this.nacionalidad = nacionalidad;
            this.contrasena = contrasena;
            this.biografia = biografia;
            this.admin = admin;
            this.isBanned = isBanned;
            this.puntuacion = puntuacion;
        }
}
