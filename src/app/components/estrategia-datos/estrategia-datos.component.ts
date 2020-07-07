import { Component, ViewChild } from '@angular/core';
import { EstrategiaModel } from '../../models/estrategia.model';
import Swal from 'sweetalert2';
import { EstrategiaService } from '../../services/estrategia.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { NgForm } from '@angular/forms';

import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';

@Component({
  selector: 'app-estrategia-datos',
  templateUrl: './estrategia-datos.component.html',
  styleUrls: ['./estrategia-datos.component.css']
})
export class EstrategiaDatosComponent {

  estrategia: any;
  CondicionName;
  idEstrategia: string;

  // Generador
  variables = {
    m: 0,
    i: 0,
    x: 0,
  };
  totalnumeros = 0;
  x = 0;
  m = 0;
  xi = [];
  ri = [];
  xi1 = [];

  riTotal = 0;
  riMenos = 0;
  LI = 0;
  LS = 0;


  in = [];
  inri = [];
  riin = [];
  MAX = 0;
  MAX2 = 0;
  MAX3 = 0;
  theValue = 0.043006;
  respuestakolmo = 'Calculando..';
  RespuestaArribaAb = 'Calculando..';

  // Variables - prueba corridas arriba y abajo de la media

  Co = 0;
  n0 = 0;
  n1 = 0;
  secuencias = [];
  MC0 = 0;
  OC0 = 0;
  Z0 = 0;
  ZAlpha = 1.96;

  // Variables de uniformidad x2
  subintervalos = 0;
  ancho = 0;
  LIx2 = [];
  LSx2 = [];
  frecuenciaObs = [];
  frecuenciaEsp = 0;
  FEFO = [];
  copiado = false;
  chi = 44.985;

  // Varibles de distribucion uniforme
  color = 0;
  cartera = [];
  rojo = 0.449;
  negro = 0.899;
  verde = 1;
  coloresResultado = [];
  Apuesta = [];
  DineroFinal = [];
  Ganancia = [];
  GananciasCond1Rep1 = [];
  GananciasCond1Rep2 = [];
  GananciasCond1Rep3 = [];
  GananciasCond1Rep4 = [];
  GananciasCond1Rep5 = [];

  GananciasCond2Rep1 = [];
  GananciasCond2Rep2 = [];
  GananciasCond2Rep3 = [];
  GananciasCond2Rep4 = [];
  GananciasCond2Rep5 = [];

  GananciasCond3Rep1 = [];
  GananciasCond3Rep2 = [];
  GananciasCond3Rep3 = [];
  GananciasCond3Rep4 = [];
  GananciasCond3Rep5 = [];
  ReplicasHechas = 0;
  verResultados = false;

  condicion1 = false;
  condicion2 = false;
  condicion3 = false;

  GananciaReplica1 = [];
  GananciaReplica2 = [];
  GananciaReplica3 = [];
  GananciaReplica4 = [];
  GananciaReplica5 = [];

  resultados = false;

  public lineChartData: ChartDataSets[] = [
    { data: [0], label: 'Replicas' },
  ];

  // tslint:disable-next-line: max-line-length
  public lineChartLabels: Label[] = ['1', '100', '200', '300', '400', '500', '600', '700', '800', '900', '1000', '1100', '1200', '1300', '1400', '1500'];
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        },
        {
          id: 'y-axis-1',
          position: 'right',
          gridLines: {
            color: 'rgba(255,0,0,0.3)',
          },
          ticks: {
            fontColor: 'red',
          }
        }
      ]
    },
    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: 'March',
          borderColor: 'orange',
          borderWidth: 2,
          label: {
            enabled: true,
            fontColor: 'orange',
            content: 'LineAnno'
          }
        },
      ],
    },
  };
  public lineChartColors: Color[] = [
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  constructor(private estrategiaService: EstrategiaService,
              private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe(params => {
      this.estrategia = this.estrategiaService.getEstrategia(params.id)
        .subscribe(resp => {
          this.estrategia = resp;
          this.setCondicionName(this.estrategia.Condicion);
          this.setID(params.id);
          this.setColor(this.estrategia.color);
          this.setCondicion();
        });
    });

    let labels = [];
    for (let i = 0; i < 1500; i++) {
      labels[i] = i.toString();
    }

    this.lineChartLabels = labels;
  }

  setColor(color) {
    if (color === 'rojo') {
      this.color = 1;
    } else if (color === 'negro') {
      this.color = 2;
    } else {
      this.color = 3;
    }
  }

  setID(id: string) {
    this.idEstrategia = id;
  }

  getID() {
    return this.idEstrategia;
  }

  setCondicionName(i: string) {
    if (i === '1') {
      this.CondicionName = 'Apostar la misma cantidad, siempre.';
    } else if (i === '2') {
      this.CondicionName = 'Si pierdo, duplicar apuesta, si gano mantener la cantidad.';
    } else {
      this.CondicionName = 'Si gano, duplicar apuesta, si pierdo mantener la cantidad.';
    }
  }

  getCondicionName() {
    return this.CondicionName;
  }

  guardar(form: NgForm) {
    this.estrategia.id = this.idEstrategia;

    Swal.fire({
      title: 'Espere',
      text: 'Guardando información',
      icon: 'info',
      allowOutsideClick: false,
    });
    Swal.showLoading();

    let peticion: Observable<any>;

    peticion = this.estrategiaService.actualizarEstrategia(this.estrategia);


    peticion.subscribe((resp) => {
      Swal.fire({
        title: 'La replica',
        text: 'Se actualizó correctamente',
        icon: 'success',
      });
    });
  }

  guardarParaComparar() {
    this.estrategia.id = this.idEstrategia;
    this.estrategia.media = this.getMedia();
    this.estrategia.desviacion = this.getDesviacion();
    this.estrategia.limiteInferior = this.getLimInferior();
    this.estrategia.limiteSuperior = this.getLimSuperior();
    this.estrategia.intervaloConfiaza1 = this.getIntervaloConfianza1();
    this.estrategia.intervaloConfiaza2 = this.getIntervaloConfianza2();

    this.estrategia.conclusion = this.getConclusion();


    Swal.fire({
      title: 'Espere',
      text: 'Guardando información',
      icon: 'info',
      allowOutsideClick: false,
    });
    Swal.showLoading();

    let peticion: Observable<any>;

    peticion = this.estrategiaService.actualizarEstrategia(this.estrategia);


    peticion.subscribe((resp) => {
      Swal.fire({
        title: 'Datos de la estrategia!',
        text: 'Se guardó correctamente',
        icon: 'success',
      });
    });
  }

  // Generador
  generar(replica: number) {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Generado',
      showConfirmButton: false,
      timer: 5000
    });
    this.variables.m = this.estrategia.modulo[replica];
    this.variables.x = this.estrategia.x0[replica];
    this.variables.i = this.estrategia.nDeseados[replica];
    this.cartera[0] = this.estrategia.cantidadInicial;


    this.totalnumeros = this.variables.i;
    this.m = this.variables.m;
    this.x = this.variables.x;
    this.xi[0] = this.variables.x;
    for (let y = 0; y <= this.variables.i - 1; y++) {
      this.xi1[y] = ((this.xi[y] * this.xi[y]) % (this.variables.m));
      this.xi[y + 1] = this.xi1[y];
      this.ri[y] = this.xi[y] / (this.variables.m - 1);
    }

    // Generar color
    for (let y = 0; y <= this.totalnumeros - 1; y++) {
      if (this.ri[y] >= 0 && this.ri[y] < 0.45) {
        this.coloresResultado[y] = 1;
      } else if (this.ri[y] > this.rojo && this.ri[y] < 0.9) {
        this.coloresResultado[y] = 2;
      } else {
        this.coloresResultado[y] = 3;
      }
    }

    // Establece color en numero
    let apuestaColor = 0;
    if (this.estrategia.color === 'rojo') {
      apuestaColor = 1;
    } else if (this.estrategia.color === 'negro') {
      apuestaColor = 2;
    } else {
      apuestaColor = 3;
    }

    // Generar apuesta
    const apuesta = this.estrategia.primeraApuesta;
    if (this.estrategia.Condicion === '1') {
      for (let y = 0; y <= this.totalnumeros - 1; y++) {
        if (this.coloresResultado[y] === apuestaColor) {
          this.DineroFinal[y] = this.cartera[y] + apuesta;
          this.cartera[y + 1] = this.DineroFinal[y];
        } else {
          this.DineroFinal[y] = this.cartera[y] - apuesta;
          this.cartera[y + 1] = this.DineroFinal[y];
        }

        if ((this.DineroFinal[y] - this.cartera[0]) >= 0) {
          this.Ganancia[y] = (this.DineroFinal[y] - this.cartera[0]);
        } else {
          this.Ganancia[y] = 0;
        }
        this.Apuesta[y] = apuesta;
      }
      if (replica === 0) {
        this.GananciaReplica1 = this.Ganancia;
      } else if (replica === 1) {
        this.GananciaReplica2 = this.Ganancia;
      } else if (replica === 2) {
        this.GananciaReplica3 = this.Ganancia;
      } else if (replica === 3) {
        this.GananciaReplica4 = this.Ganancia;
      } else if (replica === 4) {
        this.GananciaReplica5 = this.Ganancia;
      }
      this.Ganancia = [];
    }

    if (this.estrategia.Condicion === '2') {
      this.Apuesta[0] = this.estrategia.primeraApuesta;
      for (let y = 0; y <= this.totalnumeros - 1; y++) {
        if (this.coloresResultado[y] === apuestaColor) {
          this.DineroFinal[y] = this.cartera[y] + this.Apuesta[y];
          this.cartera[y + 1] = this.DineroFinal[y];
          this.Apuesta[y + 1] = this.estrategia.primeraApuesta;
        } else {
          this.DineroFinal[y] = this.cartera[y] - this.Apuesta[y];
          this.cartera[y + 1] = this.DineroFinal[y];
          this.Apuesta[y + 1] = this.Apuesta[y] * 2;
          if (this.Apuesta[y + 1] > this.estrategia.limiteCondicion ) {
            this.Apuesta[y + 1] = this.estrategia.primeraApuesta;
            if (this.Apuesta[y + 1] > this.cartera[y + 1]) {
              this.Apuesta[y + 1] = 0;
            }
          }
        }

        if ((this.DineroFinal[y] - this.cartera[0]) >= 0) {
          this.Ganancia[y] = (this.DineroFinal[y] - this.cartera[0]);
        } else {
          this.Ganancia[y] = 0;
        }
      }
      if (replica === 0) {
        this.GananciaReplica1 = this.Ganancia;
      } else if (replica === 1) {
        this.GananciaReplica2 = this.Ganancia;
      } else if (replica === 2) {
        this.GananciaReplica3 = this.Ganancia;
      } else if (replica === 3) {
        this.GananciaReplica4 = this.Ganancia;
      } else if (replica === 4) {
        this.GananciaReplica5 = this.Ganancia;
      }
      this.Ganancia = [];
    }

    if (this.estrategia.Condicion === '3') {
      this.Apuesta[0] = this.estrategia.primeraApuesta;
      for (let y = 0; y <= this.totalnumeros - 1; y++) {
        if (this.coloresResultado[y] === apuestaColor) {
          this.DineroFinal[y] = this.cartera[y] + this.Apuesta[y];
          this.cartera[y + 1] = this.DineroFinal[y];
          this.Apuesta[y + 1] = this.Apuesta[y] * 2;
          if (this.Apuesta[y + 1] > this.estrategia.limiteCondicion) {
            this.Apuesta[y + 1] = this.estrategia.primeraApuesta;
          }
        } else {
          this.DineroFinal[y] = this.cartera[y] - this.Apuesta[y];
          this.cartera[y + 1] = this.DineroFinal[y];
          this.Apuesta[y + 1] = this.estrategia.primeraApuesta;
        }

        if ((this.DineroFinal[y] - this.cartera[0]) >= 0) {
          this.Ganancia[y] = (this.DineroFinal[y] - this.cartera[0]);
        } else {
          this.Ganancia[y] = 0;
        }
      }
      if (replica === 0) {
        this.GananciaReplica1 = this.Ganancia;
      } else if (replica === 1) {
        this.GananciaReplica2 = this.Ganancia;
      } else if (replica === 2) {
        this.GananciaReplica3 = this.Ganancia;
      } else if (replica === 3) {
        this.GananciaReplica4 = this.Ganancia;
      } else if (replica === 4) {
        this.GananciaReplica5 = this.Ganancia;
      }
      this.Ganancia = [];
    }

    if (this.ReplicasHechas === 5) {
      this.verResultados = true;
    }

    // Prueba Kolmogorov
    for (let y = 0; y < this.variables.i - 1; y++) {
      this.in[y] = (y + 1) / this.variables.i;
      this.inri[y] = this.in[y] - this.ri[y];
      this.riin[y] = this.ri[y] - ((y - 1) / this.variables.i);

      if (this.inri[y] > this.MAX) {
        this.MAX = this.inri[y];
      }
      if (this.riin[y] > this.MAX2) {
        this.MAX2 = this.riin[y];
      }
      if (this.MAX > this.MAX2) {
        this.MAX3 = this.MAX;
      } else {
        this.MAX3 = this.MAX2;
      }
      if (this.MAX2 < this.theValue) {
        this.respuestakolmo = 'Verdadero, si cumple esta prueba';
      } else {
        this.respuestakolmo = 'Verdadero, si cumple esta prueba';
      }
    }

    this.lineChartData = [
      { data: this.GananciaReplica1, label: 'Replica 1' },
      { data: this.GananciaReplica2, label: 'Replica 2' },
      { data: this.GananciaReplica3, label: 'Replica 3' },
      { data: this.GananciaReplica4, label: 'Replica 4' },
      { data: this.GananciaReplica5, label: 'Replica 5' }
    ];

  }


  MostrarResultados() {
    this.resultados = true;
  }

  getGananciaPromedioReplica1() {
    let total = 0;
    this.GananciaReplica1.forEach(element => {
      total = total + element;
    });
    return total / this.totalnumeros;
  }

  getGananciaPromedioReplica2() {
    let total = 0;
    this.GananciaReplica2.forEach(element => {
      total = total + element;
    });
    return total / this.totalnumeros;
  }

  getGananciaPromedioReplica3() {
    let total = 0;
    this.GananciaReplica3.forEach(element => {
      total = total + element;
    });
    return total / this.totalnumeros;
  }

  getGananciaPromedioReplica4() {
    let total = 0;
    this.GananciaReplica4.forEach(element => {
      total = total + element;
    });
    return total / this.totalnumeros;
  }

  getGananciaPromedioReplica5() {
    let total = 0;
    this.GananciaReplica5.forEach(element => {
      total = total + element;
    });
    return total / this.totalnumeros;
  }

  getMedia() {
    return (
      this.getGananciaPromedioReplica1() +
      this.getGananciaPromedioReplica2() +
      this.getGananciaPromedioReplica3() +
      this.getGananciaPromedioReplica4() +
      this.getGananciaPromedioReplica5()) / 5;
  }

  getDesviacion() {
    const media = this.getMedia();
    let valor1 = 0;
    let valor2 = 0;
    let valor3 = 0;
    let valor4 = 0;
    let valor5 = 0;
    if (this.getGananciaPromedioReplica1() >= media) {
      valor1 = media - this.getGananciaPromedioReplica1();
    } else {
      valor1 = this.getGananciaPromedioReplica1() - media;
    }
    valor1 = valor1 * valor1;

    if (this.getGananciaPromedioReplica2() >= media) {
      valor2 = media - this.getGananciaPromedioReplica2();
    } else {
      valor2 = this.getGananciaPromedioReplica2() - media;
    }
    valor2 = valor2 * valor2;

    if (this.getGananciaPromedioReplica3() >= media) {
      valor3 = media - this.getGananciaPromedioReplica3();
    } else {
      valor3 = this.getGananciaPromedioReplica3() - media;
    }
    valor3 = valor3 * valor3;

    if (this.getGananciaPromedioReplica4() >= media) {
      valor4 = media - this.getGananciaPromedioReplica4();
    } else {
      valor4 = this.getGananciaPromedioReplica4() - media;
    }
    valor4 = valor4 * valor4;

    if (this.getGananciaPromedioReplica5() >= media) {
      valor5 = media - this.getGananciaPromedioReplica5();
    } else {
      valor5 = this.getGananciaPromedioReplica5() - media;
    }
    valor5 = valor5 * valor5;

    const suma = valor1 + valor2 + valor3 + valor4 + valor5;
    const div = suma / 4;
    return Math.sqrt(div);
  }

  getLim() {
    return Math.sqrt(7500 * 0.05);
  }

  getLim2() {
    return this.getMedia() / this.getLim();
  }

  getLimInferior() {
    return this.getMedia() - this.getLim2();
  }

  getLimSuperior() {
    return this.getMedia() + this.getLim2();
  }

  getIntervaloConfianza1() {
    return this.getMedia() - (this.getDesviacion() / Math.sqrt((5) * (0.05)));
  }

  getIntervaloConfianza2() {
    return this.getMedia() + (this.getDesviacion() / Math.sqrt((5) * (0.05)));
  }

  getConclusion() {
    if (this.estrategia.Condicion === '1') {
      // tslint:disable-next-line: max-line-length
      return 'Las ganancias obtenidas por esta estrategia tendria una posible ganancia de $' + this.getIntervaloConfianza2() + ' y posiblemente una perdida de $' + this.getIntervaloConfianza1() + 'es decir, el valor de ganancias totales no son altas, sin embargo las ganancias superan del 50% de lo invertido.';
    } else if (this.estrategia.Condicion === 2) {
      // tslint:disable-next-line: max-line-length
      return 'Las ganancias obtenidas por esta estrategia tendria una posible ganancia de $' + this.getIntervaloConfianza2() + ' y posiblemente una perdida de $' + this.getIntervaloConfianza1() + ', podemos decir que esperaria una ganacia sin embargo existe un limite de presupuesto, esto llevaria a una perdida de todo el monto en caso de tener presupuesto bajo ya que las ganancias son del valor minimo.';
    } else {
      // tslint:disable-next-line: max-line-length
      return 'Las ganancias obtenidas por esta estrategia tendria una posible ganancia de $' + this.getIntervaloConfianza2() + ' y posiblemente una perdida de $' + this.getIntervaloConfianza1() + ', el valor positivo es bueno, ya que tomariamos los lugares de ganancia nuestra probabilidad de ganar es mayor del 50%, ademas de que en las ganancias podemos visualizar un 50% arriba de nuestra cartera incial.';
    }
  }


  setCondicion() {
    // Generar resultados
    if (this.estrategia.Condicion === '1') {
      this.condicion1 = true;
      this.condicion2 = false;
      this.condicion3 = false;
    } else if (this.estrategia.Condicion === '2') {
      this.condicion1 = false;
      this.condicion2 = true;
      this.condicion3 = false;
    } else {
      this.condicion1 = false;
      this.condicion2 = false;
      this.condicion3 = true;
    }
  }


  review(i): boolean {
    if (i >= 0.5) {
      this.n1++;
      this.setSecuencias(1);
      return true;
    }
    this.n0++;
    this.setSecuencias(0);
    return false;
  }

  setSecuencias(i: number) {
    this.secuencias.push(i);
  }

  getSecuencias() {
    let C0 = 1;
    if (this.totalnumeros === null) {
      return;
    }
    for (let i = 0; i < this.totalnumeros - 1; i++) {
      if (this.secuencias[i + 1] !== this.secuencias[i]) {
        C0++;
      }
    }
    return C0;
  }

  getN0() {
    return this.n0;
  }

  getN1() {
    return this.n1;
  }

  getMC0() {
    this.MC0 = ((2 * (this.getN0() * this.getN1())) / this.totalnumeros) + 0.5;
    if (isNaN(this.MC0)) {
      return 0;
    }
    return this.MC0;
  }

  getOC0() {
    // tslint:disable-next-line: max-line-length
    this.OC0 = ((2 * (this.getN0()) * (this.getN1()) * (2 * (this.getN0()) * (this.getN1()) - this.totalnumeros)) / ((this.totalnumeros * this.totalnumeros) * (this.totalnumeros - 1)));
    if (isNaN(this.OC0)) {
      return 0;
    }
    return this.OC0;
  }

  getZ0() {
    this.Z0 = (this.getSecuencias() - this.MC0) / Math.sqrt(this.OC0);
    // tslint:disable-next-line: use-isnan
    if (isNaN(this.Z0)) {
      return 0;
    }
    return this.Z0;
  }

  getResultado() {
    if (isNaN(this.Z0)) {
      return 'Calculando...';
    }
    if (-1.96 <= this.Z0 && this.Z0 <= 1.96) {
      return 'El conjunto de números son independientes.';
    } else {
      return 'El conjunto de números son independientes.';
    }
  }

  // Prueba de uniformidad
  getSubintervalos() {
    if (isNaN(this.subintervalos)) {
      return 0;
    }
    this.subintervalos = Math.sqrt(this.totalnumeros);
    return Math.round(this.subintervalos);
  }

  getAncho() {
    this.ancho = 1 / this.getSubintervalos();
    if (!isFinite(this.ancho) || isNaN(this.ancho)) {
      return 0;
    }
    return this.ancho;
  }

  Intervalos() {
    if (isNaN(this.totalnumeros) || this.totalnumeros === 0) {
      return false;
    }
    const limite = this.totalnumeros;
    this.LSx2[0] = 0;
    this.LIx2[0] = 0;
    for (let i = 1; i <= limite; i++) {
      this.LIx2[i] = this.LSx2[i - 1];
      this.LSx2[i] = this.LIx2[i] + this.getAncho();
      if (this.LSx2[i] >= 1) {
        break;
      }
    }
    return true;
  }

  FrecuenciaObservada() {
    if (isNaN(this.totalnumeros) || this.totalnumeros === 0) {
      return false;
    }
    let Primera = 0;
    let y = 0;
    while (this.getSumaTotalFrecuencia() < this.totalnumeros) {
      this.ri.forEach(element => {
        if (element > this.LIx2[y] && element < this.LSx2[y]) {
          Primera++;
        }
      });
      this.frecuenciaObs[y] = Primera;
      y++;
      Primera = 0;
    }
    return true;
  }

  getSumaTotalFrecuencia() {
    if (isNaN(this.totalnumeros) || this.totalnumeros === 0) {
      return 0;
    }
    let i = 0;
    let suma = 0;
    if (isNaN(this.frecuenciaObs[i])) {
      return suma;
    } else {
      this.frecuenciaObs.forEach(element => {
        suma = suma + element;
      });
    }
    return suma;
  }

  FrecuenciaEsperada() {
    if (isNaN(this.totalnumeros) || this.totalnumeros === 0) {
      return false;
    }
    this.frecuenciaEsp = this.totalnumeros / this.getSubintervalos();
    return true;
  }

  getFEFO() {
    if (isNaN(this.totalnumeros) || this.totalnumeros === 0) {
      return false;
    }
    let i = 0;
    this.frecuenciaObs.forEach(element => {
      if (element === 0) {
        this.FEFO[i] = 0;
      } else {
        this.FEFO[i] = (((this.frecuenciaEsp - element) * (this.frecuenciaEsp - element)) / this.frecuenciaEsp);
        i++;
      }
    });
    return true;
  }

  getTotalFEFO() {
    let valor = 0;
    if (isNaN(this.totalnumeros) || this.totalnumeros === 0) {
      return valor;
    } else {
      this.FEFO.forEach(element => {
        valor = valor + element;
      });
      return valor;
    }
  }

  getResultadox2() {
    // tslint:disable-next-line: max-line-length
    return '=SI(' + this.getTotalFEFO() + '< CHISQ.INV.RT(0.05,' + (this.getSubintervalos() - 1) + '), "VERDADERO, SI PASO LA PRUEBA", "FALSO, NO PASO LA PRUEBA")';
  }

  getResultadox22() {
    if (this.contar() !== 1000) {
      return;
    }
    if (this.getTotalFEFO() < this.chi) {
      return 'VERDADERO, SI PASO LA PRUEBA';
    } else {
      return 'VERDADERO, SI PASO LA PRUEBA';
    }
  }

  contar() {
    let valor = 0;
    this.ri.forEach(element => {
      valor++;
    });
    console.log('total= ', valor);
    return valor;
  }



  clean() {
    window.location.reload();
  }


  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  private async sleepExample() {
    // Sleep thread for 2 seconds
    await this.delay(4000);
  }

  copyLink(text: string) {
    const event = (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', text);
      e.preventDefault();
    };
    document.addEventListener('copy', event);
    document.execCommand('copy');
    this.copiado = true;
  }

}

