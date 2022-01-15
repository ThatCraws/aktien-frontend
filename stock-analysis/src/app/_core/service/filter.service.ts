import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { IFilter } from 'src/app/shared/model/filter';
import { ConfigService } from 'src/app/_core/config/config.service';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private URL_FILTER_BASE = 'api/filters/';

  constructor(
    private config: ConfigService,
    private http: HttpClient
  ) { }

  requestFilters(): Observable<Array<IFilter>> {
    return this.http.get<Array<IFilter>>(this.config.BASE_URL + this.URL_FILTER_BASE)
  }
}
