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
}