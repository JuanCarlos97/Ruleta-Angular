import { Component, Input, Output, EventEmitter } from '@angular/core';
import { EstrategiaModel } from '../../models/estrategia.model';
import Swal from 'sweetalert2';
import { EstrategiaService } from '../../services/estrategia.service';

@Component({
  selector: 'app-card-estrategia',
  templateUrl: './card-estrategia.component.html',
  styleUrls: ['./card-estrategia.component.css']
})
export class CardEstrategiaComponent {

  @Input() estrategia: any = {};
  @Input() index: number;

  @Output() estrategiaSeleccionada: EventEmitter<number>;

  constructor(private estrategiaService: EstrategiaService) {
    this.estrategiaSeleccionada = new EventEmitter();
  }

  borrarEstrategia(estrategia: EstrategiaModel) {
    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea borrar a ${estrategia.nombre}`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then(resp => {
      if (resp.value) {
        this.estrategiaService.borrarEstrategia(estrategia.id).subscribe();
      }
    });
  }

}
