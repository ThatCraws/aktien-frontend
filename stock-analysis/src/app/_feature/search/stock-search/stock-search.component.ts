import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { IStock, IStockResponse } from 'src/app/shared/model/stock';
import { StockService } from 'src/app/_core/service/stock.service';


@Component({
    selector: 'app-stock-search',
    templateUrl: './stock-search.component.html',
    styleUrls: ['./stock-search.component.less']
})
export class StockSearchComponent implements OnInit {

    displayedColumns: string[] = ['name', 'country', 'market_capitalization', 'isin', 'symbol'];
    public dataSource: IStock[] = [];
    
    stocks!: IStockResponse

    constructor(
        private stockService: StockService
    ) { }

    ngOnInit(): void {
        this.stockService.requestStocks().subscribe(
            result => {
                this.dataSource = result;
            },
            error => {
                null
            },
            () => { }
        );
    }

}
