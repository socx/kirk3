export interface BaseFinanceCategory {
  name : string,
  description : string,
  code : string,
}

export interface FinanceCategory extends BaseFinanceCategory {
  id : string
}
