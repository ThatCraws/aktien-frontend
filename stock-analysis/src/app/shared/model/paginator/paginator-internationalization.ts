import {Component, Injectable} from '@angular/core';
import {MatPaginator, MatPaginatorIntl} from '@angular/material/paginator';
import {Subject} from 'rxjs';

@Injectable()
export class PaginatorInternationalization implements MatPaginatorIntl {
  changes = new Subject<void>();

  // For internationalization, the `$localize` function from
  // the `@angular/localize` package can be used.
  firstPageLabel = 'Erste Seite';
  itemsPerPageLabel = 'Aktien pro Seite:';
  lastPageLabel = 'Letzte Seite';

  // You can set labels to an arbitrary string too, or dynamically compute
  // it through other third-party internationalization libraries.
  nextPageLabel = 'Nächste Seite';
  previousPageLabel = 'Vorherige Seite';

  getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0) {
      return 'Seite 1 von 1';
    }
    const amountPages = Math.ceil(length / pageSize);
    page += 1;
    return 'Seite ' + page + ' von ' + amountPages;
  }
}

/**
 * @title Paginator internationalization
 */
@Component({
  selector: 'paginator-internationalization',
  templateUrl: 'paginator-internationalization.html',
})
export class PaginatorInternationalizationComponent {}