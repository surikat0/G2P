export class Partidos {
    public partido_id: number;
    public torneo_id: number;
    public juego_id:number;
    public fecha:string;
    public hora:string;
    public equipo_first: number;
    public equipo_second: number;
    public resultado_first: number;
    public resultado_second: number
    public comentario:string;
    constructor(partido_id: number,
        torneo_id: number,
        juego_id:number,
    fecha:string,
    hora:string,
    equipo_first: number,
    equipo_second: number,
    resultado_first: number,
    resultado_second: number,
    comentario:string){
        this.partido_id = partido_id;
        this.torneo_id = torneo_id;
        this.juego_id = juego_id;
        this.fecha = fecha;
        this.hora = hora;
        this.equipo_first = equipo_first;
        this.equipo_second = equipo_second;
        this.resultado_first = resultado_first;
        this.resultado_second = resultado_second;
        this.comentario = comentario;
    }
}
