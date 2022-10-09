import { Router } from "express";
import { app } from "..";

const router = Router();

router.get("/", (req, res) => {
    res.render("store", {
        products: app.productManager.getProducts().map(r => r.data)
    });
});

router.get("/:id", (req, res) => {
    let product = app.productManager.getProduct(parseInt(req.params.id));
    if (!product) {
        return res.redirect("/store")
    }

    res.render("product", {
        product: product.data
    })
})

export default router;