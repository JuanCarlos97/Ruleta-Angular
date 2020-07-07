import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nolineal',
  templateUrl: './nolineal.component.html'
})
export class NolinealComponent implements OnInit {

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


  constructor(private router: Router) { }

  ngOnInit() {
  }

  guardar(forma: NgForm) {

    this.totalnumeros = forma.value.i;
    this.m = forma.value.m;
    this.x = forma.value.x;
    this.xi[0] = forma.value.x;
    for (let y = 0; y <= forma.value.i - 1; y++) {
      this.xi1[y] = ((this.xi[y] * this.xi[y]) % (forma.value.m));
      this.xi[y + 1] = this.xi1[y];
      this.ri[y] = this.xi[y] / (forma.value.m - 1);
    }

    // Prueba Kolmogorov
    for (let y = 0; y < forma.value.i - 1; y++) {
      this.in[y] = (y + 1) / forma.value.i;
      this.inri[y] = this.in[y] - this.ri[y];
      this.riin[y] = this.ri[y] - ((y - 1) / forma.value.i);

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
        this.respuestakolmo = 'Falso, no cumple esta prueba';
      }
    }

    // Prueba arriba y abajo
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
      return 'El conjunto de números no son independientes.';
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
    let limite = this.totalnumeros;
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
    if ( isNaN(this.frecuenciaObs[i]) ) {
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
      if ( element === 0) {
        this.FEFO[i] = 0;
      } else {
        this.FEFO[i] = ( ( (this.frecuenciaEsp - element) * (this.frecuenciaEsp - element) ) / this.frecuenciaEsp );
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
    if ( this.contar() !== 1000) {
      return;
    }
    if ( this.getTotalFEFO() < this.chi) {
      return 'VERDADERO, SI PASO LA PRUEBA';
    } else {
      return 'FALSO, NO PASO LA PRUEBA';
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
