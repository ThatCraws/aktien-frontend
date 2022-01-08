import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { StockService } from 'src/app/_core/service/stock.service';

import 'chartjs-adapter-date-fns';
import 'chartjs-chart-financial';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, ChartType } from 'chart.js';
import { enUS } from 'date-fns/locale';
import { parseISO } from 'date-fns';
import { CandlestickController, CandlestickElement, OhlcController, OhlcElement } from 'chartjs-chart-financial';
import { IGraph } from 'src/app/shared/model/graph';

@Component({
  selector: 'app-stock-detail',
  templateUrl: './stock-detail.component.html',
  styleUrls: ['./stock-detail.component.less']
})
export class StockDetailComponent implements OnInit {
  stockName: string = '';
  stockId: string | null = null;

  constructor(
    private stockService: StockService,
    private route: ActivatedRoute
  ) {
    Chart.register(CandlestickController, OhlcController, CandlestickElement, OhlcElement);
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(
        paramMap => {
          this.stockId = paramMap.get('stock_id');
        }
    )
    this.stockService.requestStock(this.stockId).subscribe(
        result => {
          
          for (let i=0; i < result.data.length; i++){
            result.data[i].x = parseISO(result.data[i].x);
          }

          this.financialChartData = {
            datasets: [ {
              label: result.name,
              data: result.data,
            } ]
          };
        },
        error => {
          null
        },
        () => {},
    );
  }

  public financialChartData: ChartConfiguration['data'] = {
    datasets: [ {
      label: '',
      data: []
    } ]
  };

  public financialChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        time: {
          unit: 'day'
        },
        adapters: {
          date: {
            locale: enUS
          }
        },
        ticks: {
          source: 'auto'
        }
      }
    }
  };

//   public financialChartOptions: ChartConfiguration['options'] = {};

  public financialChartColors = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
  ];

  public financialChartLegend = true;
  public financialChartType: ChartType = 'candlestick';
  public financialChartPlugins = [];

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  update(): void {
    // candlestick vs ohlc
    this.financialChartType = this.financialChartType === 'candlestick' ? 'ohlc' : 'candlestick';
  }
}
