import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-lineal',
  templateUrl: './lineal.component.html'
})
export class LinealComponent implements OnInit {

  variables = {
    g: 0,
    i: 0,
    x: 0,
  }

  m = 0;
  a = 0;
  x = 0;
  g = 0;
  n = 0;
  i = 0;

  xi = [];
  xi1 = [];
  ri = [];
  riTotal = 0;
  riMenos = 0;
  LI = 0;
  LS = 0;
  Respuesta = 'Calculando..';

  constructor() {

   }

  ngOnInit() {
  }

  guardar(forma: NgForm) {
    console.log(forma.value);
    this.m = Math.pow(2, forma.value.g);
    this.a = 5 + (8 * this.m);
    this.x = forma.value.x;
    this.g = forma.value.g;
    this.i = forma.value.i;
    this.n = this.m / 4;

    this.xi[0] = forma.value.x;
    for (let y = 0; y <= forma.value.i; y++) {
      this.xi1[y] = (this.a * this.xi[y]) % (this.m);
      this.xi[y + 1] = this.xi1[y];
      this.ri[y] = this.xi[y] / (this.m - 1);
    }

    for(let y = 0; y < forma.value.i; y++) {
      this.riTotal = this.riTotal + this.ri[y];
    }
    this.riMenos = ( 1 / this.n ) * this.riTotal;
    this.LI = 0.5 - 1.96 * ( 1 / ( Math.sqrt( this.g * this.n)));
    this.LS = 0.5 + 1.96 * ( 1 / ( Math.sqrt( this.g * this.n)));

    if( this.LI <= this.riMenos && this.riMenos <= this.LS) {
      this.Respuesta = 'Verdadero, si cumple';
    } else {
      this.Respuesta = 'Falso, no cumple';
    }
  }

}
