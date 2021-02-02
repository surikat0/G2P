import { Reglas } from "./reglas";

export class Torneo {
    public torneo_id:number;
    public nombre:string;
    public fecha:string;
    public fases:string;
    public reglas_id:number;
    public game_id:number;
    public hora:string;
    public puntos:number;
    public estado:string

    constructor (torneo_id:number, nombre:string, fecha:string, fases:string, reglas_id:number, game_id:number, hora:string, puntos:number, estado:string) {
        this.torneo_id = torneo_id;
        this.nombre = nombre;
        this.fecha = fecha;
        this.fases = fases;
        this.reglas_id = reglas_id;
        this.game_id = game_id;
        this.hora = hora;
        this.puntos = puntos;
        this.estado = estado;
    }
}

