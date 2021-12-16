import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { StockService } from 'src/app/_core/service/stock.service';

import { IFilter } from 'src/app/shared/model/filter';
import { FilterService } from 'src/app/_core/service/filter.service';
import { Observable, startWith, map } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'app-stock-search',
    templateUrl: './stock-search.component.html',
    styleUrls: ['./stock-search.component.less']
})
export class StockSearchComponent implements OnInit {
    @Input() stockSearch!: string;

    displayedColumns: string[] = ['name', 'country', 'market_capitalization', 'isin', 'symbol'];
    dataSource = new MatTableDataSource();
    filters: Array<IFilter> = []

    formControl = new FormControl();
    options!: string[];
    filteredOptions!: Observable<string[]>;

    constructor(
        private stockService: StockService,
        private filterService: FilterService
    ) { }

    @ViewChild(MatSort)
    sort: MatSort = new MatSort;

    ngOnInit(): void {
        this.stockService.requestStocks().subscribe(
            result => {
                this.dataSource.data = result;

                let options: string[] = [];
                result.forEach(function (stock) {
                    options.push(stock.name);
                });
                this.options = options;

                this.filteredOptions = this.formControl.valueChanges.pipe(
                    startWith(''),
                    map(value => this._filter(value)),
                )

                this.dataSource.sort = this.sort;

                const sortState: Sort = { active: 'market_capitalization', direction: 'desc' };
                this.sort.active = sortState.active;
                this.sort.direction = sortState.direction;

                this.dataSource.filterPredicate = (data: any, filter: string) => data.name.indexOf(filter) != -1;
                this.dataSource.filter = '';

                this.sort.sortChange.emit(sortState);
            },
            error => {
                null
            },
            () => { }
        );



        this.filterService.requestFilters().subscribe(
            result => {
                this.filters = result;
            },
            error => {

            },
            () => { }
        );
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this.options.filter(option => option.toLowerCase().includes(filterValue));
    }

    onSubmit(event: any) {
        let temp = event.target.stock.value;
        this.dataSource.filter = temp;

        return temp;
     }
}
