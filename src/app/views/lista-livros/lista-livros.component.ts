import {
  tap,
  map,
  switchMap,
  filter,
  debounceTime,
  catchError,
  throwError,
  of,
} from 'rxjs';
import { Component } from '@angular/core';
import { LivroService } from 'src/app/service/livro.service';
import { Item, LivrosResultado } from 'src/app/models/interfaces';
import { LivroVolumeInfo } from 'src/app/models/livroVolumeInfo';
import { FormControl } from '@angular/forms';

const PAUSA = 700;
@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css'],
})
export class ListaLivrosComponent {
  campoBusca = new FormControl();
  mensagemErro = '';
  livrosResultado: LivrosResultado;

  constructor(private service: LivroService) {}

  totalDeLivros$ = this.campoBusca.valueChanges.pipe(
    debounceTime(PAUSA),
    filter((valorDigitado) => valorDigitado.length >= 3),
    tap(() => console.log('tab---')),
    switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
    map(resultado => this.livrosResultado = resultado),
    catchError(erro => {
      console.log(erro)
      return of()
    })
  );

  livrosEncontrados$ = this.campoBusca.valueChanges.pipe(
    debounceTime(PAUSA),
    filter((valorDigitado) => valorDigitado.length >= 3),
    tap(() => console.log('tab---')),
    switchMap((valorDigitado) => this.service.buscar(valorDigitado)),

    tap((retornoAPI) => console.log(retornoAPI)),
    map((resultado) => resultado.items ?? []),
    map((items) => this.livrosResultadoParaLivros(items)),
    catchError((erro) => {
      console.log(erro);
      return throwError(
        () => new Error((this.mensagemErro = 'ops, ocorreu um erro.'))
      );
    })
  );

  livrosResultadoParaLivros(items: Item[]): LivroVolumeInfo[] {
    return items.map((item) => {
      return new LivroVolumeInfo(item);
    });
  }
}
