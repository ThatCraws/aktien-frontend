import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';

import { MatTableModule } from '@angular/material/table'
import { MatSortModule } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { PaginatorInternationalizationComponent, PaginatorInternationalization } from './shared/model/paginator/paginator-internationalization';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StockSearchComponent } from './_feature/search/stock-search/stock-search.component';
import { StockDetailComponent } from './_feature/detail/stock-detail/stock-detail.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    declarations: [
        AppComponent,
        StockSearchComponent,
        StockDetailComponent,
        PaginatorInternationalizationComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MatTableModule,
        MatSortModule,
        MatToolbarModule,
        MatFormFieldModule,
        MatAutocompleteModule,
        MatInputModule,
        MatCardModule,
        MatRadioModule,
        MatButtonModule,
        MatIconModule,
        MatPaginatorModule,
        NgChartsModule
    ],
    providers: [
        {
            provide: MatPaginatorIntl, useClass: PaginatorInternationalization
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
