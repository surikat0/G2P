export class Videojuego {
    public videojuegoId: number;
    public nombre:string;
    public foto:string;
    constructor(videojuegoId:number,
        nombre:string,
        foto:string){
            this.videojuegoId=videojuegoId
            this.nombre=nombre
            this.foto=foto
    }
}