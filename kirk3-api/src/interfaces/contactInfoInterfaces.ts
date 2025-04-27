import { Address } from "./addressInterfaces";

export interface ContactInfo {
  telephones: [string],
  emails: [string],
  address: Address,
}
