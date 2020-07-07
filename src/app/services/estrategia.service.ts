import { Injectable } from '@angular/core';
import { EstrategiaModel } from '../models/estrategia.model';
import { HttpClient } from '@angular/common/http';
import { map, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EstrategiaService {

  private url = 'https://ruleta-4d8c9.firebaseio.com';
  private EstrategiaModel;

  constructor(private http: HttpClient) {
    this.EstrategiaModel = this.getEstrategias();
  }

  crearEstrategia(estrategia: EstrategiaModel) {
    return this.http.post(`${this.url}/estrategias.json`, estrategia)
      .pipe(
        map((resp: any) => {
          estrategia.id = resp.name;
          return estrategia;
        })
      );
  }

  actualizarEstrategia(estrategia: EstrategiaModel) {
    const estrategiaTemp = {
      ...estrategia
    };
    delete estrategiaTemp.id;
    return this.http.put(`${this.url}/estrategias/${estrategia.id}.json`, estrategiaTemp);
  }

  borrarEstrategia(id: string) {
    return this.http.delete(`${this.url}/estrategias/${id}.json`);
  }


  getEstrategia(id: string) {
    return this.http.get(`${this.url}/estrategias/${id}.json`);
  }


  getEstrategias() {
    return this.http.get(`${this.url}/estrategias.json`)
      .pipe(
        map(this.crearArreglo),
        delay(0)
      );
  }

  private crearArreglo(estrategiaObj: object) {
    const estrategias: EstrategiaModel[] = [];
    Object.keys(estrategiaObj).forEach(key => {
      const estrategia: EstrategiaModel = estrategiaObj[key];
      estrategia.id = key;
      estrategias.push(estrategia);
    });
    return estrategias;
  }
}
