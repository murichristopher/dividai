import { Debt } from "../models/debt"
import { IDebt, IDebtService } from "../types"
import WhatsAppService from "./whatsapp-service"

class CreateDebitService implements IDebtService {
  async call(debt: IDebt): Promise<any> {
    console.log("pronto para mandar para o banco de dados")

    const newDebt = new Debt(debt)

    try {
      const res = await newDebt.save();

      console.log("deu tudo certo", res)
      return res;
    } catch (e) {
      console.error("algo deu bem ruim", e)
      return;
    }
  }
}

export default CreateDebitService