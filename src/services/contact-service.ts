import axios from "axios";
import appInstance from "../app";
import { Contact } from "../models/contact";
import { Debt } from "../models/debt"
import { IContact, IContactService, IDebt, IDebtService } from "../types"
import WhatsAppService from "./whatsapp-service"

class CreateContactService implements IContactService {
  async call(contact: IContact): Promise<any> {
    const contactInDatabase = await Contact.findOne({ phone_number: contact.phone_number }).exec();

    if (contactInDatabase) { return contactInDatabase }

    try {
      const newContact = new Contact({
        ...contact,
        photo_url: await this.uploadAndGetS3Url(contact.photo_url, contact.phone_number)
      })

      const res = await newContact.save()

      console.log("deu tudo certo", res)
      return res;
    } catch (e) {
      console.error("algo deu bem ruim", e)
      return;
    }
  }

  private async uploadAndGetS3Url(photo_url: string, phone_number: string) {
    const s3Service = appInstance.getS3Service();

    try {
      const { data } = await axios.get(photo_url, {
        responseType: 'arraybuffer',
      });

      return await s3Service.uploadImageAndReturnUrl({
        fileName: phone_number.split(" ").join(""),
        image: Buffer.from(data, 'binary')
      });
    } catch (error) {
      throw new Error("Failed to upload image to S3");
    }
  }
}

export default CreateContactService