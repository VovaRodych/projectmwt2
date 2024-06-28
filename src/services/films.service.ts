import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {Injectable, inject} from '@angular/core';
import {Observable, catchError, map, tap} from 'rxjs';
import {Film} from '../entities/film';
import {UsersService} from './users.service';
import {environment} from '../environments/environment';
import {User} from "../entities/user";
import {Router} from "@angular/router";
import {MessageService} from "./message.service";

export interface FilmsResponse {
  items: Film[];
  totalCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class FilmsService {
  constructor(
    private router: Router,
    private messageService: MessageService) {
  }

  usersService = inject(UsersService);
  http = inject(HttpClient);
  url = environment.serverUrl;

  get token() {
    return this.usersService.token;
  }

  getTokenHeader(): {
    headers?: { [header: string]: string },
    params?: HttpParams
  } | undefined {
    if (!this.token) {
      return undefined;
    }
    return {headers: {'X-Auth-Token': this.token}};
  }

  getFilms(orderBy?: string, descending?: boolean, indexFrom?: number, indexTo?: number, search?: string): Observable<FilmsResponse> {
    let options = this.getTokenHeader();
    if (orderBy || descending || indexFrom || indexTo || search) {
      options = {...(options || {}), params: new HttpParams()};
    }
    if (options && options.params) {
      if (orderBy) {
        options.params = options.params.set('orderBy', orderBy);
      }
      if (descending) {
        options.params = options.params.set('descending', descending);
      }
      if (indexFrom) {
        options.params = options.params.set('indexFrom', indexFrom);
      }
      if (indexTo) {
        options.params = options.params.set('indexTo', indexTo);
      }
      if (search) {
        options.params = options.params.set('search', search);
      }
    }
    return this.http.get<FilmsResponse>(this.url + 'films', options).pipe(
      catchError(err => this.usersService.processError(err))
    );
  }

  saveFilm(film: Film): Observable<Film> {
    return this.http.post<Film>(this.url + 'films/', film, this.getTokenHeader())
      .pipe(
        tap(film => {
          this.messageService.success("Film " + film.nazov + " saved");
          this.router.navigateByUrl("/films");
        })
      );
  }
}
