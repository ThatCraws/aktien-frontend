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
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'app-stock-detail',
  templateUrl: './stock-detail.component.html',
  styleUrls: ['./stock-detail.component.less']
})
export class StockDetailComponent implements OnInit {
  stockId: string | null = null;

  // Progressbar
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 50;
  loading = true;

  // Chart
  CandleLine: string = "Wechsel zu Linienchart";
  chartType = 'financialChart';

  // Stock parameters
  price: number = 0;
  marketcap: number = 0;
  rsi: number = 0;
  volatility: number = 0;
  priceEarningRatio: number = 0;

  // Snackbar properties
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(
    private stockService: StockService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    Chart.register(CandlestickController, OhlcController, CandlestickElement, OhlcElement);
  }
  ngOnInit(): void {
    registerLocaleData(localeDE);

    // Parse stock id from route
    this.route.paramMap.subscribe(
      paramMap => {
        this.stockId = paramMap.get('stock_id');
      }
    )
    
    // Request stock data by default settings
    this.requestSpecificStockData('1y', '1d');
  }

  /**
   * Initialize default financial chart data
   */
  public financialChartData: ChartConfiguration['data'] = {
    datasets: [ {
      label: '',
      data: []
    } ]
  };

  /**
   * Initialize default financial chart options
   */
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

  // Further financial chart options
  public financialChartLegend = true;
  public financialChartType: ChartType = 'candlestick';
  public financialChartPlugins = [];

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  /**
   * Update chart between financial and line chart
   */
  public updateChartType(): void {
    this.chartType = this.chartType === 'financialChart' ? 'lineChart' : 'financialChart';
    this.CandleLine = this.CandleLine === 'Wechsel zu Candlestick' ? 'Wechsel zu Linienchart' : 'Wechsel zu Candlestick';
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
   * Initialize default line chart data
   */
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

  /**
   * Initialize default line chart options
   */
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

  // Further line chart options
  public lineChartType: ChartType = 'line';

  /**
   * Request stock data for the selected stock
   * 
   * @param period Time period of historic data
   * @param interval Time interval of historic data
   */
  public requestSpecificStockData(period: string, interval: string): void {
    this.loading = true;

    this.stockService.requestStock(this.stockId, period, interval).subscribe(
        result => {
          // Initialize the financial parameter from response
          this.price = result.price;
          this.marketcap = result.market_capitalization;
          this.rsi = result.rsi;
          this.volatility = result.historicalVolatility;
          this.priceEarningRatio = result.price_earning_ratio;
          
          // Parse response for Boolinger Baender
          let boolingBaender: number[] = []
          let boolingBaenderUp: number[] = []
          let boolingBaenderLow: number[] = []
          for (let i=0; i < result.data.length; i++) {
            boolingBaender[i] = result.gd[i];
            boolingBaenderUp[i] = result.upper[i];
            boolingBaenderLow[i] = result.lower[i];
          }
  
          // Parse response for line chart
          let dataLine: number[] = [];
          let dataLineLabels: string[] = [];
          for (let i=0; i < result.data.length; i++) {
            dataLine[i] = result.data[i].c;
  
            // Format date by time period
            let label = '';
            if (period == '1d') {
                label = result.data[i].x.substring(11, 16);
            } else {
                let date = new Date(result.data[i].x.substring(0, 10));
                label = date.toLocaleString('de').split(',')[0];
            }
            
            dataLineLabels[i] = label;
          }
  
          // Parse response for financial chart
          for (let i=0; i < result.data.length; i++){
            // Format date
            result.data[i].x = parseISO(result.data[i].x);
          }
  
          // Initialize financial chart with data from response
          this.financialChartData = {
            datasets: [
              {
                label: result.name,
                data: result.data,
              },
            ]
          };
  
          // Initialize line chart with data from response
          this.lineChartData = {
            datasets: [
              {
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
              }
            ],
            labels: dataLineLabels
          };
  
          this.loading = false;
        },
        error => {
          // Error handling
          this.snackBar.open('Daten konnten nicht geladen werden.', 'Verstanden', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
          });
  
          console.log('Aktien Daten für die Aktie ' + this.stockId + ' konnten nicht geladen werden.\nFehlermeldung: ' + error.message);
        },
        () => {},
      );
  }
}
