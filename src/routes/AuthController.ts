import { Router } from "express";
import passport from "passport";

const router = Router();

router.get("/login", passport.authenticate('discord', { scope: ["identify"], prompt: "consent" }), function(req, res) {})
router.get("/callback",  passport.authenticate('discord', { failureRedirect: '/' }), function(req, res) { res.redirect('/') })


export default router;