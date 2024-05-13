import { IDebt, IDebtService, IMessageHandler } from "../types";
import { IMessage } from "../services/whatsapp-service";
interface IParams {
  createDebitService: IDebtService
}

class DebitMessageHandler implements IMessageHandler {
  public createDebitService: IDebtService

  constructor({ createDebitService }: IParams) {
    this.createDebitService = createDebitService;
  }
  onMessage(message: IMessage): void {
    console.log("cachorro safado")
    if (this.isDebtCommandMessage(message.content)) {
      const debt = this.parseMessageToDebt(message)

      this.createDebitService.call(debt)
    }

    return;
  }


  private isDebtCommandMessage(message: string): boolean {
    return message.startsWith("/debit")
  }

  private parseMessageToDebt(message: IMessage): IDebt {
    const args = message.content.slice(6).trim();
    const parts = args.split(' ');
    const value = parseFloat(parts[1].replace(",",".")); // TODO: lidar com cenário de espaços em branco

    const subArray = parts.slice(2);

    const name = subArray.join(' ');

    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    const res = {
      description: name,
      debtor: {
        phone_number: message?.sender?.id!,
        photo_url: message?.sender?.photo_url!,
        name: message?.sender?.name!,
      },
      creditor: {
        phone_number: message?.mentionedPerson?.id!,
        photo_url: message?.mentionedPerson?.photo_url!,
        name: message?.mentionedPerson?.name!,
      },
      date: this.formatDateToCustomPattern(),
      value: formatter.format(value)
    };

    console.log("resposta final", res)

    return res
  }

  formatDateToCustomPattern() {
    const date = new Date();

    const year = date.getFullYear();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');

    return `${year}-${day}-${month}`;
  }

}

export default DebitMessageHandler