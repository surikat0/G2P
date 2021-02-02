export class Reglas {
    public reglas_id: any;
    public modo: string;
    public juego_id: any;
    public descripcion: any;

    constructor(reglas_id: number,
        modo: string,
        juego_id: number,
        descripcion: any) {
        this.reglas_id = reglas_id;
        this.modo = modo;
        this.juego_id = juego_id;
        this.descripcion = descripcion
    }

}
