
import WAWebJS from "whatsapp-web.js";
import { Debt } from "../models/debt"

export interface IMessage {
  content: string
  sender?: {
    name?: string
    id?: string
    photo_url: string
  }
  mentionedPerson?: {
    name?: string
    id?: string
    photo_url?: string
  }
}
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


export interface IContact {
  name: string
  phone_number: string
  photo_url: string
}

export interface IMessageHandler {
  onMessage(message: IMessage): void
}

export interface IMessageFormatter {
  format(message: WAWebJS.Message): Promise<IMessage>
}

export interface IDebtService {
  call(debt: IDebt): void
}
export interface IContactService {
  call(debt: IContact): void
}
export interface IFindContactService {
  call(phoneNumber: string): void
}
