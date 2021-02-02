export class Equipo {

    constructor(public equipo_id: number,
                public nombre: string,
                public logo: string,
                public juego_id: number,
                public capitan: number,
                public ganadas: number,
                public perdidas: number,
                public empatadas: number,
                public jugadas: number,
                public biografia: string) {}
}


