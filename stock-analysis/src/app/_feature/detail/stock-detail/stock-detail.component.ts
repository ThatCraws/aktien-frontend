import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { StockService } from 'src/app/_core/service/stock.service';

import 'chartjs-adapter-date-fns';
import 'chartjs-chart-financial';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, ChartType } from 'chart.js';
import { enUS } from 'date-fns/locale';
import { add, parseISO } from 'date-fns';
import { CandlestickController, CandlestickElement, OhlcController, OhlcElement } from 'chartjs-chart-financial';

@Component({
  selector: 'app-stock-detail',
  templateUrl: './stock-detail.component.html',
  styleUrls: ['./stock-detail.component.less']
})
export class StockDetailComponent implements OnInit {
    stockId: string | null = null;

    barCount = 60;
    initialDateStr = '2017-04-01T00:00:00';

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
            let test = "hallo";
        },
        error => {
            null
        },
        () => { }
    );
  }

//   public financialChartData: ChartConfiguration['data'] = {
//     datasets: [ {
//       label: 'CHRT - Chart.js Corporation',
//     //   data: this.getRandomData(this.initialDateStr, this.barCount)
//       data:  [
//         {
//           x: +parseISO(this.initialDateStr),
//           o: 1,
//           h: 1.5,
//           l: 0.75,
//           c: 1.25,
//         },
//     ]
//     } ]
//   };

  public financialChartData: ChartConfiguration['data'] = {
    datasets: [ {
      label: 'CHRT - Chart.js Corporation',
      data: this.getRandomData(this.initialDateStr, this.barCount)
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

  randomNumber(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  randomBar(date: Date, lastClose: number): { c: number; x: number; h: number; l: number; o: number } {
    const open = this.randomNumber(lastClose * 0.95, lastClose * 1.05);
    const close = this.randomNumber(open * 0.95, open * 1.05);
    const high = this.randomNumber(Math.max(open, close), Math.max(open, close) * 1.1);
    const low = this.randomNumber(Math.min(open, close) * 0.9, Math.min(open, close));
    return {
      x: +date,
      o: open,
      h: high,
      l: low,
      c: close
    };
  }

  getRandomData(dateStr: string, count: number): { c: number; x: number; h: number; l: number; o: number }[] {
    let date = parseISO(dateStr);
    const data = [ this.randomBar(date, 30) ];
    while (data.length < count) {
      date = add(date, { days: 1 });
      if (date.getDay() <= 5) {
        data.push(this.randomBar(date, data[data.length - 1].c));
      }
    }
    return data;
  }

  update(): void {
    // candlestick vs ohlc
    this.financialChartType = this.financialChartType === 'candlestick' ? 'ohlc' : 'candlestick';
  }
}
