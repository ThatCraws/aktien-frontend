import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockSearchComponent } from './_feature/search/stock-search/stock-search.component';
import { StockDetailComponent } from './_feature/detail/stock-detail/stock-detail.component';

const routes: Routes = [
    {
        path: '',
        component: StockSearchComponent
    },
    {
        path: 'stock-detail/:stock_id',
        component: StockDetailComponent
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
