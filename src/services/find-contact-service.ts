import appInstance from "../app";
import { Contact } from "../models/contact";
import { Debt } from "../models/debt"
import { IContact, IFindContactService, IDebt, IDebtService } from "../types"
import WhatsAppService from "./whatsapp-service"

class FindContactService implements IFindContactService {
  async call(phoneNumber: string): Promise<any> {
    const formattedPhoneNumber = `+55 ${phoneNumber.slice(0, 2)} ${phoneNumber.slice(2, 7)}-${phoneNumber.slice(7)}`

    const contact = await this.findContactByDatabase(phoneNumber) || this.findContactByChatApp(phoneNumber)
  }

  async findContactByDatabase(phoneNumber: string) {
    const contact = await Contact.findOne({
      phone_number: phoneNumber
    }, { __v: 0, _id: 0 })

    return contact;
  }

  async findContactByChatApp(phoneNumber: string) {
    const number = "+911234567890";

    const text = "Hey john";

    const chatId = number.substring(1) + "@c.us";

    appInstance.getWhatsAppService()
  }
}

export default FindContactService