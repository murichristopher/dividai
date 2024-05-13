import bodyParser from 'body-parser';
import cors from 'cors'
import { Response, Request, NextFunction } from 'express'

const middlewares = [
  bodyParser.json(),
  bodyParser.urlencoded({ extended: true }),
  cors({ origin: '*' }),
  function (req: Request, res: Response, next: NextFunction) {
    res.set('Cache-Control', 'no-store, max-age=0')
    next()
  },
  function (req: Request, res: Response, next: NextFunction) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  },
  function (req: Request, res: Response) {
    res.status(404).json({
      error: "Not Found",
      message: "The requested resource was not found."
    });
  }
]

export default middlewares