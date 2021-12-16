import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs';
import { IStock } from 'src/app/shared/model/stock';
import { ConfigService } from 'src/app/_core/config/config.service';

@Injectable({
    providedIn: 'root'
})
export class StockService {
    private URL_STOCK_BASE = 'api/stocks/';

    constructor(
        private config: ConfigService,
        private http: HttpClient
    ) { }

    requestStocks(filters: Map<string, string>): Observable<Array<IStock>> {
        let httpParams = new HttpParams();

        for (let filter of filters.entries()) {
            httpParams = httpParams.append(filter[0], filter[1]);
        }
        
        return this.http.get<Array<IStock>>(this.config.BASE_URL + this.URL_STOCK_BASE, {params: httpParams})
    }
}
