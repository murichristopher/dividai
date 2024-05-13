
import { Debt } from "../models/debt"
import { IMessage } from "../services/whatsapp-service";

export interface IDebt {
  debtor: {
    name: string
    phone_number: string
    photo_url: string
  }
  creditor: {
    name: string
    phone_number: string
    photo_url: string
  }
  value: string
  description: string
  date: string
}

export interface IMessageHandler {
  onMessage(message: IMessage): void
}

export interface IDebtService {
  call(debt: IDebt): void
}