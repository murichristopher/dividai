import dotenv from 'dotenv';
import { App as Application } from "./config/application";
import Routes from "./config/routes";
import Middlewares from "./config/middlewares";
import WhatsAppService from "./services/whatsapp-service";
import DebitMessageHandler from "./handlers/debit-message-handler";
import CreateDebitService from "./services/debit-service";
import AWS from 'aws-sdk';
import S3Service from './services/s3-service';

dotenv.config();

class App {
  private static instance: App;
  public app!: Application;
  public whatsAppService!: WhatsAppService;
  public s3Service!: S3Service;

  private constructor() {
    this.initialize();
  }

  private initialize() {
    const port = process.env.PORT || '3000';

    let dbConString: string | undefined;

    try {
      dbConString = process.env.DB_URI;
    } catch {
      console.error("Failed to create DB Connection");
    }

    this.app = new Application(
      port,
      Routes,
      Middlewares,
    );

    if (dbConString) {
      this.app.database(dbConString);
    } else {
      console.error("Not Starting Database Connection");
    }

    this.app.listen();

    try {
      AWS.config.update({
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        region: process.env.S3_REGION
      });
      this.s3Service = new S3Service(new AWS.S3());

    } catch {
      console.error("Failed to connect to AWS S3");
    }

    this.whatsAppService = new WhatsAppService(
      {
        messageHandler: new DebitMessageHandler(
          {
            createDebitService: new CreateDebitService()
          }
        )
      }
    );
  }

  public static getInstance(): App {
    if (!App.instance) {
      App.instance = new App();
    }
    return App.instance;
  }

  public getWhatsAppService(): WhatsAppService {
    return this.whatsAppService;
  }

  public getS3Service(): S3Service {
    return this.s3Service;
  }

  public getAppInstance(): Application {
    return this.app;
  }
}

const appInstance = App.getInstance();

export default appInstance;
