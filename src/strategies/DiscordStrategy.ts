import Strategy from "passport-discord";
import passport from "passport";
import { app } from "..";

passport.use(new Strategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "/auth/callback"
}, async (accessToken, refreshToken, profile, done) => {
    const id = profile.id;
    const user = await app.db.webAccount.findFirst({
        where: { userId: id }
    });

    if (user) {
        return done(null, {
            profile, user
        })
    } else {
        app.db.webAccount.create({
            data: { userId: id }
        }).then(usr => {
            return done(null, {
                profile, user: usr
            })
        })
    }
}));