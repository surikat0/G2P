export class Posicion {
    public id: number;
    public torneo_id: number;
    public equipo_id: number;
    public posicion: number
    constructor(id: number, torneo_id: number, equipo_id: number, posicion: number)
    {
        this.id = id;
        this.torneo_id = torneo_id;
        this.equipo_id = equipo_id;
        this.posicion = posicion
    }
}
