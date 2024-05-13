import Express, { Application } from "express";
import mongoose = require("mongoose");
import cors from 'cors'
const apiPath = '/api'

export class App {
  public app: Application;

  constructor(
    private port: string,
    routes: Array<{ path: string, router: Express.Router }>,
    middleware: Array<any>,
  ) {
    this.app = Express();

    this.app.use(cors({
      origin: '*',
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
      credentials: true
    }));
    this.app.use(Express.json())
    this.routes(routes);
    this.middleware(middleware);
  }

  public database(uri: string) {
    const connect = () => {
      mongoose
        .connect(uri,)
        .then(() => {
          return;
        })
        .catch((error) => {
          console.log("DATABASE CONNECTION FAILED \n", error);
          return process.exit(1);
        });
    };
    connect();

    mongoose.connection.on("disconnected", connect);
  }

    public listen() {
    this.app.listen(this.port, () => {
      console.log("APP LISTENING ON PORT:", this.port);
    });
  }

  private routes(routes: Array<{ path: string, router: Express.Router }>) {
    routes.forEach((route) => {
      this.app.use(`${apiPath}${route.path}`, route.router);
    });
  }

  private middleware(mware: any[]) {
    mware.forEach((m) => {
      this.app.use(m);
    });
  }
}