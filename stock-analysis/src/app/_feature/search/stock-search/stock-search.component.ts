import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { StockService } from 'src/app/_core/service/stock.service';


@Component({
    selector: 'app-stock-search',
    templateUrl: './stock-search.component.html',
    styleUrls: ['./stock-search.component.less']
})
export class StockSearchComponent implements OnInit {
    displayedColumns: string[] = ['name', 'country', 'market_capitalization', 'isin', 'symbol'];
    dataSource = new MatTableDataSource();

    constructor(
        private stockService: StockService
    ) { }

    @ViewChild(MatSort)
    sort: MatSort = new MatSort;

    ngOnInit(): void {
        

        this.stockService.requestStocks().subscribe(
            result => {
                this.dataSource.data = result;

                this.dataSource.sort = this.sort;

                const sortState: Sort = {active: 'market_capitalization', direction: 'desc'};
                this.sort.active = sortState.active;
                this.sort.direction =  sortState.direction;
                this.sort.sortChange.emit(sortState);
            },
            error => {
                null
            },
            () => { }
        );
    }
}
