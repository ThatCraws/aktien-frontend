import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { IStock } from 'src/app/shared/model/stock';
// import { IStockResponse } from 'src/app/shared/model/stock';
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
        return this.http.get<Array<IStock>>(this.config.BASE_URL + this.URL_STOCK_BASE)
    }
}
