import { Response, Request } from "express";
import { Debt } from "../models/debt";

export class DebtsController {
  async index(req: Request, res: Response) {
    const debts = await Debt.find({}, { __v: 0, _id: 0 });

    res.status(200).json(debts)
  }

  async create(req: Request, res: Response) {
    const { debtor, creditor, value, description, date } = req.body;

    const newDebt = new Debt({
      debtor,
      creditor,
      value,
      description,
      date
    });

    try {
      const createdDebt = await newDebt.save();

      console.log("deu tudo certo", createdDebt)
      return res.status(201).json(createdDebt);
    } catch (error) {
      return res.status(422).json(
        {
          message: "algo deu errado",
          error: error
        }
      )
    }
  }

}