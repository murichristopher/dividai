import WAWebJS, { Client, LocalAuth, MessageMedia } from 'whatsapp-web.js';
import axios from 'axios';
import { IMessageHandler } from '../types';
import qrcode from 'qrcode-terminal'
interface IParams {
  messageHandler: IMessageHandler
}
const wwebVersion = '2.2412.54';
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
      }
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

      console.log("mensagem permitida!!!!")

      const formattedMessage = await this.formatMessage(message)

      this.messageHandler.onMessage(formattedMessage)
    });

    this.client.initialize();
  }

  private isAllowedMessage(message: WAWebJS.Message): boolean {
    return ["chat", "image"].includes(message.type) && !message.isStatus
  }

  private async formatMessage(message: WAWebJS.Message): Promise<IMessage> {
    const contact = await message.getContact();
    const number = await contact.getFormattedNumber();


    console.log("ESSES FORAM MENCIONADOS", message.mentionedIds)


    const re = message.mentionedIds[0] as unknown as string
    console.log("re", re)

    if (re === undefined) {

      return {
        content: message.body,
        sender: {
          name: contact.pushname,
          id: number,
          photo_url: "a"
        }
      }
    }

    const mentionedPerson = await this.client.getContactById(re)
    const cliente = await message.getChat()


    const photo_url = await contact.getProfilePicUrl();
    const photo_urlMentionedPerson = await mentionedPerson.getProfilePicUrl();
    const mentionedPersonNumber = await mentionedPerson.getFormattedNumber();

    return {
      content: message.body,
      sender: {
        name: contact.pushname,
        id: number,
        photo_url: photo_url
      },
      mentionedPerson: {
        name: mentionedPerson.pushname || mentionedPerson.verifiedName,
        id: mentionedPersonNumber,
        photo_url: photo_urlMentionedPerson
      }
    }
  }


  async getImageAsBase64(url: string) {
    const response = await axios.get(url, {
      responseType: 'arraybuffer'
    });
    return Buffer.from(response.data, 'binary').toString('base64');
  }

  async sendImage(client: WAWebJS.Chat, recipientId: string, imageUrl: string, caption: string) {
    try {
      const imageBase64 = await this.getImageAsBase64(imageUrl);
      const media = new MessageMedia('image/jpeg', imageBase64, 'image.jpg');
      console.log('Image sent successfully!');
    } catch (error) {
      console.error('Failed to send image:', error);
    }
  }

}

export default WhatsAppService;
