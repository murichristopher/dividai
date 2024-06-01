import { Response, Request } from "express";
import { Contact } from "../models/contact";
import appInstance from "../app";
import axios from "axios";
import CreateContactService from "../services/contact-service";

export class ContactsController {
  async index(req: Request, res: Response) {
    try {
      const contacts = await Contact.find({}, { __v: 0, _id: 0 });
      res.status(200).json(contacts);
    } catch (error) {
      res.status(500).json({ message: "An error occurred", error });
    }
  }

  async create(req: Request, res: Response) {
    const { name, phone_number, photo_url } = req.body;

    const contactService = new CreateContactService();

    try {
      const createdContact = await contactService.call({
        name,
        phone_number,
        photo_url
      })

      return res.status(201).json(createdContact);
    } catch (error) {
      console.error("error", error)
      return res.status(422).json({
        message: "Algo deu errado",
        error: error
      });
    }
  }

  async searchByPhoneNumber(req: Request, res: Response) {
    const { phoneNumber } = req.params;

    try {
      const whatsappService = appInstance.getWhatsAppService();

      if (!phoneNumber) {
        return res.status(400).json({
          message: "Phone number is missing"
        });
      }

      const contact = await whatsappService.fetchContactByPhoneNumber(phoneNumber);

      if (!contact) {
        return res.status(404).json({
          message: "Contact not found"
        });
      }

      return res.status(200).json(contact);
    } catch (error) {
      return res.status(500).json({
        message: "An error occurred",
        error: error
      });
    }
  }


}
