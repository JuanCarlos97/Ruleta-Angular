export class EstrategiaModel {
    id: string;
    nombre: string;
    color: string;
    cantidadInicial: number;
    primeraApuesta: number;
    Condicion: string;
    limiteCondicion: number;
    modulo: number[];
    x0: number[];
    nDeseados: number[];

    media: number;
    desviacion: number;
    limiteInferior: number;
    LimiteSuperior: number;
    intervaloConfiaza1: number;
    intervaloConfianza2: number;
    conclusion: string;

    constructor() {
        this.limiteCondicion = 0;
        this.modulo = [0, 0, 0, 0, 0];
        this.x0 = [0, 0, 0, 0, 0];
        this.nDeseados = [1500, 1500, 1500, 1500, 1500];

        this.media = 0;
        this.desviacion = 0;
        this.limiteInferior = 0;
        this.LimiteSuperior = 0;
        this.intervaloConfiaza1 = 0;
        this.intervaloConfianza2 = 0;
        this.conclusion = '';
    }
}
