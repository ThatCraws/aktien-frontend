export interface IFilter {
  name: string
  options: Array<IOption>
}

export interface IOption {
  name: string
  value: number | string
}