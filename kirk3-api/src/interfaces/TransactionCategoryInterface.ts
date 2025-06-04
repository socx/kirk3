export interface BaseTransactionCategory {
  name : string,
  description : string,
  code : string,
}

export interface TransactionCategory extends BaseTransactionCategory {
  id : string
}
