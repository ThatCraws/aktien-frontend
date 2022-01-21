import { ISector } from './sector'
import { IExchange } from './exchange'
import { IIndex } from './index'

export interface IStock {
  stock_id: number
  name: string
  country: string
  market_capitalization: number
  isin: string
  symbol: string
  sectors: Array<ISector>
  exchanges: Array<IExchange>
  indices: Array<IIndex>
  data: Array<any>
  historicalVolatility: number
  rsi: number
  price: number
  price_earning_ratio: number
  gd: Array<number>
  upper: Array<number>
  lower: Array<number>
}
