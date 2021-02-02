// Nuevo: model para el equipo_torneo
export class EquipoTorneo {
    public torneo_id: number;
    public equipo_id: number;
  
    constructor(torneo_id: number, equipo_id: number) {
      this.torneo_id = torneo_id;
      this.equipo_id = equipo_id;
    }
  }
  