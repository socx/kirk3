import { BusinessEntity } from "./businessEntityInterfaces"
import { Address } from "./addressInterfaces"

export interface AssetValue {
  amount: number,
  valuationDate: Date
}

export interface Investment {
  depositAmount?: number,
  fees?: number,
  enhancementCosts?: number,
  financeAdvance?: number,
}

enum PeriodType { Daily, Weekly, Monthly, Quarterly, Yearly };
export interface PeriodicIncome {
  amount?: number,
  periodType?: PeriodType,
}

export interface Shareholding {
  shareholder?: BusinessEntity,
  holding?: number,
}

export interface BaseAsset {
  type: string,
  acquisitionDate?: Date,
  acquisitionPrice?: Number,
  address: Address,
  financeOutstanding?: Number,
  financeProvider?: BusinessEntity,
  investment?: Investment,
  periodicIncome?: PeriodType,
  marketValue?: AssetValue,
  minimumEquity?: Number,
  shareholders?: [Shareholding],
  users?: string [],
  createdAt?: string,
  updatedAt?: string,
  deletedAt?: string,
}

export interface Asset extends BaseAsset {
  id? : string
}