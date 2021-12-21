import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

import { StockService } from 'src/app/_core/service/stock.service';

import { IFilter } from 'src/app/shared/model/filter';
import { FilterService } from 'src/app/_core/service/filter.service';
import { Observable, startWith, map } from 'rxjs';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';

@Component({
    selector: 'app-stock-search',
    templateUrl: './stock-search.component.html',
    styleUrls: ['./stock-search.component.less']
})
export class StockSearchComponent implements OnInit {
    stockSearch!: string;
    // selectedFilter: Map<string, string> = new Map<string, string>([
    //    ['sector', ''],
    //    ['index', ''],
    //    ['country', ''],
    // ]
    // );
    selectedFilter: Map<string, string> = new Map<string, string>();
    sector = null;

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

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    ngOnInit(): void {
        this.requstStockData(this.selectedFilter);

        this.filterService.requestFilters().subscribe(
            result => {
                this.filters = result;
            },
            error => {

            },
            () => { }
        );
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this.options.filter(option => option.toLowerCase().includes(filterValue));
    }

    onSubmit(event: any) {
        this.dataSource.filter = event.target.stock.value;
    }

    setFilter(event: any) {
        if (event.source.name == 'country') {
            this.selectedFilter.set(event.source.name, event.value);
        } else {
            this.selectedFilter.set(event.source.name, "" + event.value);
        }

        this.requstStockData(this.selectedFilter);
    }

    requstStockData(filters: Map<string, string>): void {
        this.stockService.requestStocks(filters).subscribe(
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
    }

    resetFilter(event: any): void {
        this.sector = null;
    }

    navToggle(): void {
        const primaryNav = document.querySelector(".primary-navbar");
        const nav = document.querySelector(".hamburger");
        let visibility = primaryNav!.getAttribute("data-visible");
        if (visibility == "false"){
          primaryNav!.setAttribute("data-visible", "true");
          nav!.setAttribute("aria-expanded", "true");
        }
        else {
          primaryNav!.setAttribute("data-visible", "false");
          nav!.setAttribute("aria-expanded", "false");
        }
    }
}
