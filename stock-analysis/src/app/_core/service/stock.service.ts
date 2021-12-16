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

    requestStocks(): Observable<Array<IStock>> {
        // let httpParams = new HttpParams();

        // httpParams = httpParams.append('name', 'Deutsche');
        // httpParams = httpParams.append('country', 'DE');
        // httpParams = httpParams.append('index', 1);
        // httpParams = httpParams.append('sector', 40);

        return this.http.get<Array<IStock>>(this.config.BASE_URL + this.URL_STOCK_BASE)
        // return this.http.get<Array<IStock>>(this.config.BASE_URL + this.URL_STOCK_BASE, {params: httpParams})
    }
}
