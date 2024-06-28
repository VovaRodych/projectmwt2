import {Component, OnInit, inject} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {MaterialModule} from '../../modules/material.module';
import {map, of, pipe, switchMap, tap} from 'rxjs';
import {FilmsResponse, FilmsService} from '../../services/films.service';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Film} from "../../entities/film";

@Component({
  selector: 'app-edit-film',
  standalone: true,
  imports: [MaterialModule, RouterLink, ReactiveFormsModule],
  templateUrl: './edit-film.component.html',
  styleUrl: './edit-film.component.css'
})
export class EditFilmComponent implements OnInit {
  route = inject(ActivatedRoute);
  filmsService = inject(FilmsService);
  films: Film[] = [];
  film = new Film('', 0, '');
  editForm = new FormGroup({
    nazov: new FormControl('', {
      validators: [Validators.required, Validators.minLength(3)]
    }),
    rok: new FormControl(0, [Validators.required]),
    slovenskyNazov: new FormControl('', [Validators.required]),
    afi1998: new FormControl(0),
    afi2007: new FormControl(0)
  });

  ngOnInit(): void {
    this.filmsService.getFilms(undefined, undefined, undefined, 5000).pipe(
      tap(response => this.films = response.items),
      switchMap(() => this.route.paramMap),
      map(params => Number(params.get('id')) || undefined),
      switchMap(id => {
          const film = this.films.find(film => film.id === id) || new Film('', 0, '');
          return of(film);
        }
      )).subscribe(film => {
      this.film = film;
      console.log("Editing film:", film);
      this.editForm.patchValue({
        nazov: film.nazov,
        rok: film.rok,
        slovenskyNazov: film.slovenskyNazov,
        afi1998: film.poradieVRebricku['AFI 1998'],
        afi2007: film.poradieVRebricku['AFI 2007'],
      });
    });
  }

  submit() {
    this.film.nazov = this.nazov.value.trim();
    this.film.rok = this.rok.value;
    this.film.slovenskyNazov = this.slovenskyNazov.value.trim();
    this.film.poradieVRebricku = {'AFI 1998': this.afi1998.value, 'AFI 2007': this.afi2007.value}

    this.filmsService.saveFilm(this.film).subscribe();
  }

  get nazov(): FormControl<string> {
    return this.editForm.get('nazov') as FormControl<string>;
  }

  get rok(): FormControl<number> {
    return this.editForm.get('rok') as FormControl<number>;
  }

  get slovenskyNazov(): FormControl<string> {
    return this.editForm.get('slovenskyNazov') as FormControl<string>;
  }

  get afi1998(): FormControl<number> {
    return this.editForm.get('afi1998') as FormControl<number>;
  }

  get afi2007(): FormControl<number> {
    return this.editForm.get('afi2007') as FormControl<number>;
  }
}
