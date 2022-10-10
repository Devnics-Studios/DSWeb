import express from "express";
import consola, { Consola } from "consola";
import RouteController from "../../routes/RouteController";
import { PrismaClient } from "@prisma/client";
import ProductManager from "../Manager/ProductManager";
import passport from "passport";
import session from "express-session";
import "../../strategies/DiscordStrategy";

passport.serializeUser((user, done) => {
    return done(null, user);
})

passport.deserializeUser((user, done) => {
    return done(null, user);
})

export default class App {

    private server: express.Express;
    
    public logger: Consola = consola;
    public db = new PrismaClient();
    public productManager = new ProductManager(this);

    constructor(port: number = 3001) {
        this.server = express();

        this.db.$connect();

        this.server.use(session({
            secret: 'ExtremlySecretSecret',
            resave: false,
            saveUninitialized: false
        }));
        this.server.use(passport.initialize());
        this.server.use(passport.session());

        this.server.use(express.static(process.cwd() + "/src/public"));
        this.server.set("view engine", "ejs");
        this.server.set('views', process.cwd() + "/src/views");       
        
        this.server.use("/", RouteController);
        
        this.server.listen(port, () => {
            this.logger.success(`Successfully started server on port ${port}.`)
        });
    }
}