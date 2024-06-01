import WAWebJS, { Client, LocalAuth, MessageMedia } from 'whatsapp-web.js';
import axios from 'axios';
import { IDebt, IMessage, IMessageFormatter, IMessageHandler } from '../types';
import qrcode from 'qrcode-terminal'
import S3Service from './s3-service';
import appInstance from '../app';

interface IParams {
  messageHandler: IMessageHandler
}
class WhatsAppService {
  public messageHandler: IMessageHandler;
  private client: Client;

  constructor({ messageHandler }: IParams) {
    this.client = new Client({
      puppeteer: {
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
        ],
      },
      authStrategy: new LocalAuth()
    });

    console.log("Starting whatsapp client...")

    this.messageHandler = messageHandler;
    this.initialize();
  }

  private initialize() {
    this.client.on('qr', (qr) => {
      console.log("qr received")
      qrcode.generate(qr, { small: true });
    });

    this.client.on('ready', () => console.log('WhatsApp client is ready'));

    this.client.on('message', async (message) => {
      if (!this.isAllowedMessage(message)) { return; }

      const formattedMessage = await this.formatMessage(message)

      this.messageHandler.onMessage(formattedMessage);
    });

    this.client.initialize();
  }

  private isAllowedMessage(message: WAWebJS.Message): boolean {
    return ["chat", "image"].includes(message.type) && !message.isStatus
  }

  private async formatMessage(message: WAWebJS.Message): Promise<IMessage> {
    const sender = await message.getContact();
    const senderFormattedPhoneNumber = await sender.getFormattedNumber();
    const senderPhotoUrl = await sender.getProfilePicUrl();

    const firstMentionedId = message.mentionedIds[0] as unknown as string
    const mentionedPerson = await this.client.getContactById(firstMentionedId)
    const mentionedPersonPhotoUrl = await mentionedPerson.getProfilePicUrl();
    const mentionedPersonFromattedPhoneNumber = await mentionedPerson.getFormattedNumber();

    return {
      content: message.body,
      sender: {
        name: sender.pushname,
        id: senderFormattedPhoneNumber,
        photo_url: senderPhotoUrl
      },
      mentionedPerson: {
        name: mentionedPerson.pushname || mentionedPerson.verifiedName,
        id: mentionedPersonFromattedPhoneNumber,
        photo_url: mentionedPersonPhotoUrl
      }
    }
  }

  async fetchContactByPhoneNumber(phoneNumber: string) {
    try {
      const sanitized_number = phoneNumber.toString().replace(/[- )(]/g, "");

      const sanitized_number_final = sanitized_number.startsWith('0') ? sanitized_number.substring(1) : sanitized_number;

      const final_number = `55${sanitized_number_final}`;

      const numberDetails = await this.client.getNumberId(final_number);

      const contact = await this.client.getContactById(numberDetails?._serialized!);

      const whatsapp_photo_url = await contact.getProfilePicUrl();

      return {
        name: contact.pushname,
        phone_number: contact.number,
        about: await contact.getAbout(),
        photo_url: whatsapp_photo_url
      }
    } catch (error) {
      console.log("error searching contact", error)
      return null;
    }
  }
}

export default WhatsAppService;
