import express from "express";
import consola, { Consola } from "consola";
import RouteController from "../../routes/RouteController";
import { PrismaClient } from "@prisma/client";
import ProductManager from "../Manager/ProductManager";
import passport from "passport";
import session from "express-session";
import Strategy from "passport-discord";

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

    constructor(port: number = 3000) {
        this.server = express();

        this.db.$connect();

        passport.use(new Strategy({
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: "/auth/callback"
        }, async (accessToken, refreshToken, profile, done) => {
            const id = profile.id;
            const user = await this.db.webAccount.findFirst({
                where: { userId: id }
            });

            if (user) {
                return done(null, {
                    profile, user
                })
            } else {
                this.db.webAccount.create({
                    data: { userId: id }
                }).then(usr => {
                    return done(null, {
                        profile, user: usr
                    })
                })
            }
        }));

        this.server.use(session({
            secret: 'keyboard cat',
            resave: false,
            saveUninitialized: false
        }));
        this.server.use(passport.initialize());
        this.server.use(passport.session());

        this.server.use(express.static(process.cwd() + "/src/public"));
        this.server.set("view engine", "ejs");
        this.server.set('views', process.cwd() + "/src/views");       
        
         // @ts-ignore
        this.server.get("/auth/login", passport.authenticate('discord', { scope: ["identify"], prompt: "consent" }), function(req, res) {})
        this.server.get("/auth/callback",  passport.authenticate('discord', { failureRedirect: '/' }), function(req, res) { res.redirect('/') })
        
        this.server.use("/", RouteController);
        
        this.server.listen(port, () => {
            this.logger.success(`Successfully started server on port ${port}.`)
        });
    }
}