import { Collection } from "@discordjs/collection";
import App from "../Web/App";
import Product from "./Product";

export default class ProductManager {

    private app: App;
    protected products: Collection<number, Product> = new Collection();

    constructor(app: App) {
        this.app = app;
        this.load();
    }

    private async load() {
        const products = await this.app.db.product.findMany();

        for (const product of products) {
            this.products.set(product.id, new Product(product as unknown as ProductDetails));
        }
    }

    createProduct(options: ProductDetails) {
        return new Promise<Product>((resolve, reject) => {
            this.app.db.product.create({
                data: options
            }).then(data => {
                const product = new Product(data as unknown as ProductDetails);
                this.products.set(data.id, product);
                resolve(product)
            })
        })
    }

    getProducts() {
        return this.products.toJSON();
    }

    getProduct(id: number) {
        return this.products.get(id);
    }
}

export interface ProductDetails {
    name: string;
    description: string;
    image: string;
    price: number;
}