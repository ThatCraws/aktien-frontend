import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';

import { StockService } from 'src/app/_core/service/stock.service';

import 'chartjs-adapter-date-fns';
import 'chartjs-chart-financial';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, ChartType } from 'chart.js';
import { de } from 'date-fns/locale';
import localeDE from '@angular/common/locales/de';
import { parseISO } from 'date-fns';
import { CandlestickController, CandlestickElement, OhlcController, OhlcElement } from 'chartjs-chart-financial';
import { IGraph } from 'src/app/shared/model/graph';

@Component({
  selector: 'app-stock-detail',
  templateUrl: './stock-detail.component.html',
  styleUrls: ['./stock-detail.component.less']
})
export class StockDetailComponent implements OnInit {
  // Progressbar
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 50;
  loading = true;

  CandleLine: string = "Wechsel zu Linienchart";
  price: number = 0;
  marketcap: number = 0;
  stockName: string = '';
  rsi: number = 0;
  stockId: string | null = null;
  volatility: number = 0;
  priceEarningRatio: number = 0;

  chartType = 'financialChart'

  constructor(
    private stockService: StockService,
    private route: ActivatedRoute
  ) {
    Chart.register(CandlestickController, OhlcController, CandlestickElement, OhlcElement);
  }
  ngOnInit(): void {
    registerLocaleData(localeDE);

    this.route.paramMap.subscribe(
      paramMap => {
        this.stockId = paramMap.get('stock_id');
      }
    )
    
    this.requestSpecificStockData('1y', '1d');
  }

  public financialChartData: ChartConfiguration['data'] = {
    datasets: [ {
      label: '',
      data: []
    } ]
  };

  public financialChartOptions: ChartConfiguration['options'] = {
    color: '#5f7e97',
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        time: {
          unit: 'day'
        },
        adapters: {
          date: {
            locale: de
          }
        },
        ticks: {
          source: 'auto'
        }
      }
    }
  };

  public financialChartColors = [
    {
      borderColor: '',
      backgroundColor: '',
    },
  ];

  public financialChartLegend = true;
  public financialChartType: ChartType = 'candlestick';
  public financialChartPlugins = [];

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  update(): void {
    // candlestick vs ohlc
    // this.financialChartType = this.financialChartType === 'candlestick' ? 'ohlc' : 'candlestick';
    this.chartType = this.chartType === 'financialChart' ? 'lineChart' : 'financialChart';
    this.CandleLine = this.CandleLine === 'Wechsel zu Candlestick' ? 'Wechsel zu Linienchart' : 'Wechsel zu Candlestick';
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

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: '',
        backgroundColor: '',
        borderColor: '',
        pointBackgroundColor: '',
        pointBorderColor: '',
        pointHoverBackgroundColor: '',
        pointHoverBorderColor: '',
        fill: 'origin',
      }]
  }

  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.12
      }
    },
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      x: {},
      'y-axis-0':
        {
          position: 'left',
        }
    }
  };

  public lineChartType: ChartType = 'line';

  public requestSpecificStockData(period: string, interval: string): void {
    this.loading = true;

    this.stockService.requestStock(this.stockId, period, interval).subscribe(
        result => {
  
          this.price = result.price;
          this.marketcap = result.market_capitalization;
          this.rsi = result.rsi;
          this.volatility = result.historicalVolatility;
          this.priceEarningRatio = result.price_earning_ratio;
          
          let boolingBaender: number[] = []
          let boolingBaenderUp: number[] = []
          let boolingBaenderLow: number[] = []
          for (let i=0; i < result.data.length; i++) {
            boolingBaender[i] = result.gd[i];
            boolingBaenderUp[i] = result.upper[i];
            boolingBaenderLow[i] = result.lower[i];
          }
  
          let dataLine: number[] = [];
          let dataLineLabels: string[] = [];
          for (let i=0; i < result.data.length; i++) {
            dataLine[i] = result.data[i].c;
  
            let label = '';
            if (period == '1d') {
                label = result.data[i].x.substring(11, 16);
            } else {
                let date = new Date(result.data[i].x.substring(0, 10));
                label = date.toLocaleString('de').split(',')[0];
            }
            
            dataLineLabels[i] = label;
          }
  
          for (let i=0; i < result.data.length; i++){
            result.data[i].x = parseISO(result.data[i].x);
          }
  
          this.financialChartData = {
            datasets: [{
              label: result.name,
              data: result.data,
            },
          ]
          };
          
  
          this.lineChartData = {
            datasets: [{
              label: result.name,
              data: dataLine,
            },
            {
              label: "mittleres Bollingband",
              data: boolingBaender,
            },
            {
              label: "oberes Bollingband",
              data: boolingBaenderUp,
            },
            {
              label: "unteres Bollingband",
              data: boolingBaenderLow,
            }],
            labels: dataLineLabels
          };
  
          this.loading = false;
        },
        error => {
          null
        },
        () => {},
      );
  }
}
