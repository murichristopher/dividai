import axios from "axios";
import appInstance from "../app";
import { Debt } from "../models/debt"
import type { IDebt, IDebtService } from "../types"
import CreateContactService from "./contact-service";

type CreditorAndDebtor = IDebt["creditor"] | IDebt["debtor"];
class CreateDebitService implements IDebtService {
  private contactService: CreateContactService;

  constructor() {
    this.contactService = new CreateContactService();
  }

  async call(debt: IDebt) {
    const newDebt = new Debt(debt);

    try {
      await this.updateCreditorAndDebtorsPhotoUrls(debt.creditor, debt.debtor)

      await this.createCreditorAndDebtorContacts(debt.creditor, debt.debtor)
      return await newDebt.save();
    } catch (e) {
      throw new Error("Failed to create debt");
    }
  }

  private createCreditorAndDebtorContacts(creditor: IDebt["creditor"], debtor: IDebt["debtor"]) {
    return Promise.all([
      this.contactService.call(creditor),
      this.contactService.call(debtor)
    ]);
  }

  private async updateCreditorAndDebtorsPhotoUrls(creditor: IDebt["creditor"], debtor: IDebt["debtor"]) {
    creditor.photo_url = await this.uploadAndGetS3Url(creditor)
    debtor.photo_url = await this.uploadAndGetS3Url(debtor)
  }

  private async uploadAndGetS3Url({ photo_url, phone_number }: CreditorAndDebtor) {
    const s3Service = appInstance.getS3Service();

    const { data } = await axios.get(photo_url, {
      responseType: 'arraybuffer',
    });

    return await s3Service.uploadImageAndReturnUrl({
      fileName: phone_number.split(" ").join(""),
      image: Buffer.from(data, 'binary')
    })
  }
}

export default CreateDebitService