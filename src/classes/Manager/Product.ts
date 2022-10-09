import { ProductDetails } from "./ProductManager";

export default class Product {

    public data: ProductDetails;

    constructor(data: ProductDetails) {
        this.data = data;
    }

    get id() {
        return this.id
    };

    get name() {
        return this.name;
    }

    get description() {
        return this.description;
    }

    get image() {
        return this.image;
    }

    get price() {
        return this.price;
    }
}