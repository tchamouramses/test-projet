import { Model } from "./Model"

export interface Data {
    nom_medecin?: string,
    tarif?: number,
    nom_hopital?: string,
    contenue?: string,
    model_id?: Model,
    model?: Model,
    template?: string,
    id?: number,
}