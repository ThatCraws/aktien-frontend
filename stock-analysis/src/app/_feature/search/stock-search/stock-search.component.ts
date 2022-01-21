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
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'app-stock-search',
  templateUrl: './stock-search.component.html',
  styleUrls: ['./stock-search.component.less']
})
export class StockSearchComponent implements OnInit {
  // Table
  displayedColumns: string[] = ['name', 'country', 'market_capitalization', 'isin', 'symbol'];
  dataSource = new MatTableDataSource();

  // Filter
  selectedFilter: Map<string, string | null> = new Map<string, string | null>();
  filters: Array<IFilter> = []
  uncheckFilter: Map<string, boolean> = new Map<string, boolean>();

  // Autocomplete searchbar
  formControl = new FormControl();
  options!: string[];
  filteredOptions!: Observable<string[]>;

  // Snackbar properties
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(
    private stockService: StockService,
    private filterService: FilterService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  @ViewChild(MatSort)
  sort: MatSort = new MatSort;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  ngOnInit(): void {
    registerLocaleData(localeDE);

    // Request stocks default settings
    this.requstStockData(this.selectedFilter);

    // Request filters
    this.filterService.requestFilters().subscribe(
      result => {
        this.filters = result;
      },
      error => {
        // Error handling
        this.snackBar.open('Daten konnten nicht geladen werden.', 'Verstanden', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });

        console.log('Filter Daten konnten nicht geladen werden.\nFehlermeldung: ' + error.message);
      },
      () => {}
    );
  }

  ngAfterViewInit() {
    // Set paginator on data source after view initialized
    this.dataSource.paginator = this.paginator;
  }

  /**
   * Filter autocomplete options
   * 
   * @param value Filter value
   * @returns Matching filter options
   */
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  /**
   * Apply filter on data source when text in searchbar is written
   * 
   * @param event Event element
   */
  public onChange(event: any) {
    this.dataSource.filter = event.target.value;
  }

  /**
   * Apply filter when autocomplete option is clicked
   * 
   * @param event Event element
   */
  public onClickAutocomplete(event: any) {
    this.dataSource.filter = event.target.textContent.trim();
  }

  /**
   * Apply selected filter
   * 
   * @param event Event element
   */
  public setFilter(event: any) {
    if (event.source.name == 'country') {
      this.selectedFilter.set(event.source.name, event.value);
    } else {
      this.selectedFilter.set(event.source.name, "" + event.value);
    }

    this.requstStockData(this.selectedFilter);
  }

  /**
   * Request all stocks
   * Filters can limit the result
   * 
   * @param filters Filters which will be applied
   */
  public requstStockData(filters: Map<string, string | null>): void {
    this.stockService.requestStocks(filters).subscribe(
      result => {
        // Set data source for table
        this.dataSource.data = result;

        // Initialize filterable autocomplete options array
        let options: string[] = [];
        result.forEach(function (stock) {
          options.push(stock.name);
        });
        this.options = options;

        // Initialize observer on filterable autocomplete options array
        this.filteredOptions = this.formControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value)),
        )

        // Initialize sort functionality on data source
        this.dataSource.sort = this.sort;

        // Set default sort on column market capitalization
        const sortState: Sort = { active: 'market_capitalization', direction: 'desc' };
        this.sort.active = sortState.active;
        this.sort.direction = sortState.direction;

        // Apply name filter on data source
        this.dataSource.filterPredicate = (data: any, filter: string) => data.name.toLowerCase().indexOf(filter.toLocaleLowerCase()) != -1;

        // Notify table sort state changed
        this.sort.sortChange.emit(sortState);
      },
      error => {
        // Error handling
        this.snackBar.open('Daten konnten nicht geladen werden.', 'Verstanden', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });

        console.log('Aktien Daten konnten nicht geladen werden.\nFehlermeldung: ' + error.message);
      },
      () => {}
    );
  }

  /**
   * Reset a selected filter
   * 
   * @param event Event element
   * @param filterName Filter which will be resetted
   */
  public resetFilter(event: Event, filterName: string): void {
    this.selectedFilter.delete(filterName);
    this.uncheckFilter.set(filterName, false);

    this.requstStockData(this.selectedFilter);
  }

  /**
   * Toggle sidebar
   */
  public navToggle(): void {
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

  /**
   * Click on table row listener
   * Navigate to detail page of stock
   * 
   * @param row Table row
   */
  public getRecord(row: any): void {
    this.router.navigate(['/stock-detail/' + row.stock_id]);
  }

  /**
   * On filter radio button click listener
   * Reset the uncheck map value for filter
   * Needed to uncheck radio buttons
   * 
   * @param event Event element
   * @param filterName Unchecked filter which will be resetted
   */
  public filterOptionClickListener(event: Event, filterName: string) {
    this.uncheckFilter.delete(filterName);
  }
}
