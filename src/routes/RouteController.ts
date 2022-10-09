import { Router } from "express";
import StoreController from "./StoreController";

const router = Router();

router.get("/", (req, res) => {
    res.render("index", {
        loggedIn: req.isAuthenticated(),
        user: req.user ?? null
    });
});

router.use("/store", StoreController);

export default router;