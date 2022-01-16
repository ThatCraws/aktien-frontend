import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

import { StockService } from 'src/app/_core/service/stock.service';

import { IFilter } from 'src/app/shared/model/filter';
import { FilterService } from 'src/app/_core/service/filter.service';
import { Observable, startWith, map, debounceTime, pipe} from 'rxjs';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import localeDE from '@angular/common/locales/de';
import { registerLocaleData } from '@angular/common';

@Component({
  selector: 'app-stock-search',
  templateUrl: './stock-search.component.html',
  styleUrls: ['./stock-search.component.less']
})
export class StockSearchComponent implements OnInit {
  stockSearch!: string;

  selectedFilter: Map<string, string | null> = new Map<string, string | null>();
  sector = null;

  displayedColumns: string[] = ['name', 'country', 'market_capitalization', 'isin', 'symbol'];
  dataSource = new MatTableDataSource();
  filters: Array<IFilter> = []

  formControl = new FormControl();
  options!: string[];
  filteredOptions!: Observable<string[]>;
  myForm!: FormGroup;

  uncheckFilter: Map<string, boolean> = new Map<string, boolean>();

  constructor(
    private stockService: StockService,
    private filterService: FilterService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  @ViewChild(MatSort)
  sort: MatSort = new MatSort;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  ngOnInit(): void {
    registerLocaleData(localeDE);

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

  onChange(event: any) {
    this.dataSource.filter = event.target.value;
  }

  onClickAutocomplete(event: any) {
    this.dataSource.filter = event.target.textContent.trim();
  }

  setFilter(event: any) {
    if (event.source.name == 'country') {
      this.selectedFilter.set(event.source.name, event.value);
    } else {
      this.selectedFilter.set(event.source.name, "" + event.value);
    }

    this.requstStockData(this.selectedFilter);
  }

  requstStockData(filters: Map<string, string | null>): void {
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

      this.dataSource.filterPredicate = (data: any, filter: string) => data.name.toLowerCase().indexOf(filter.toLocaleLowerCase()) != -1;
      this.dataSource.filter = '';

      this.sort.sortChange.emit(sortState);
      },
      error => {
        null
      },
      () => { }
    );
  }

  resetFilter(event: Event, filterName: string): void {
    this.selectedFilter.delete(filterName);
    this.uncheckFilter.set(filterName, false);

    this.requstStockData(this.selectedFilter);
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

  getRecord(row: any): void {
    this.router.navigate(['/stock-detail/' + row.stock_id]);
  }

  /**
   * Reset the uncheck map value for filter
   * Needed to uncheck radio buttons
   * 
   * @param event 
   * @param filterName 
   */
  filterOptionClickListener(event: Event, filterName: string) {
        this.uncheckFilter.delete(filterName);
  }
}
