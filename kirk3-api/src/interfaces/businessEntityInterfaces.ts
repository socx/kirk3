import { ContactInfo } from "./contactInfoInterfaces";

export interface BusinessEntity {
  type: string,
  name: string,
  contactInfo?: ContactInfo,
}