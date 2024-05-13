import { App } from "./config/application";
import dotenv from 'dotenv'
import Routes from "./config/routes";
import Middlewares from "./config/middlewares";
import WhatsAppService from "./services/whatsapp-service";
import DebitMessageHandler from "./handlers/debit-message-handler";
import CreateDebitService from "./services/debit-service";

dotenv.config();
const port = process.env.PORT || '3000'

let dbConString;

try {
  dbConString = process.env.DB_URI!
} catch {
  console.error("Failed to create DB Connection");
}

const app = new App(
  port,
  Routes,
  Middlewares,
);

dbConString
  ? app.database(dbConString)
  : console.error("Not Starting Database Connection");

app.listen();

new WhatsAppService(
  {
    messageHandler: new DebitMessageHandler(
      {
        createDebitService: new CreateDebitService()
      }
    )
  }
)
