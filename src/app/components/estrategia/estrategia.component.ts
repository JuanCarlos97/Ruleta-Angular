import { Component, OnInit } from '@angular/core';
import { EstrategiaModel } from '../../models/estrategia.model';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { EstrategiaService } from '../../services/estrategia.service';
import { format } from 'url';

@Component({
  selector: 'app-estrategia',
  templateUrl: './estrategia.component.html',
  styleUrls: ['./estrategia.component.css']
})
export class EstrategiaComponent implements OnInit {

  estrategia: EstrategiaModel = new EstrategiaModel();

  constructor(
    private estrategiaService: EstrategiaService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== 'nuevo') {
      this.estrategiaService.getEstrategia(id).subscribe((resp: EstrategiaModel) => {
        this.estrategia = resp;
        this.estrategia.id = id;
      });
    }
  }

  getCondicion() {
    if (this.estrategia.Condicion !== '1') {
      return true;
    }
  }

  guardar(form: NgForm) {
    if (form.invalid) {
      return;
    }

    Swal.fire({
      title: 'Espere',
      text: 'Guardando información',
      icon: 'info',
      allowOutsideClick: false,
    });
    Swal.showLoading();

    let peticion: Observable<any>;

    if (this.estrategia.id) {
      peticion = this.estrategiaService.actualizarEstrategia(this.estrategia);
    } else {
      peticion = this.estrategiaService.crearEstrategia(this.estrategia);
    }

    peticion.subscribe((resp) => {
      Swal.fire({
        title: this.estrategia.nombre,
        text: 'Se actualizó correctamente',
        icon: 'success',
      });
    });
  }
}
