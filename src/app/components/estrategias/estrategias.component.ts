import { Component, OnInit } from '@angular/core';
import { EstrategiaService } from '../../services/estrategia.service';

@Component({
  selector: 'app-estrategias',
  templateUrl: './estrategias.component.html',
  styleUrls: ['./estrategias.component.css']
})
export class EstrategiasComponent implements OnInit {

  estrategias: any[] = [];
  cargando = false;
  estrategiasVer = false;

  constructor(private estrategiaService: EstrategiaService) { }

  ngOnInit() {
    this.cargando = true;
    this.estrategiaService.getEstrategias().subscribe(resp => {
      this.estrategias = resp;
      this.cargando = false;
    });
  }

  verEstrategias() {
    this.estrategiasVer = true;
  }
}
