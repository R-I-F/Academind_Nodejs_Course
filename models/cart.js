const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');

const p = path.join(rootDir, 'data', 'cart.json');
module.exports = class Cart {

    static addProduct(id, productPrice) {
        let cart = { products: [], totalPrice: 0 };
        // {products:[ {id:1, qty:1} ...] , totalPrice:12 }
        fs.readFile(p, (err, fileContent) => {
            if (!err) {
                // look for the product
                cart = JSON.parse(fileContent);
            }
            const isProdInsideCart = cart.products.some((product) => product.id === id);
            if (isProdInsideCart) {
                //  if product is found increment its qty and add its value to the total price
                const productIndex = cart.products.findIndex((product) => product.id === id);
                let product = cart.products[productIndex];
                const incrementdProduct = { ...product, qty: product.qty++ };
                product = incrementdProduct;
            } else {
                // if product is not inside the cart then add a new product to the products array and increment it's value to the total price
                cart.products.push({ id: id, qty: 1 });
            }
            cart.totalPrice += parseFloat(productPrice);
            fs.writeFile(p, JSON.stringify(cart), (err) => {
                console.log(err);
            });
        });
    }

    static deleteProduct(id, productPrice) {
        fs.readFile(p, (err, fileContent) => {
            if (!err) {
                let cart = JSON.parse(fileContent);
                const productIndex = cart.products.findIndex((prods) => { return prods.id === id });
                const product = cart.products.find((prods) => { return prods.id === id });
                
                if(product.qty > 1 ){
                    const totalProductPrice = product.qty*productPrice;
                    cart.totalPrice -= totalProductPrice;
                } else {

                    cart.totalPrice -= productPrice;
                }
                
                const newProducts = cart.products.filter((prods) => { return prods.id !== id });
                cart.products = [...newProducts];
                fs.writeFile(p, JSON.stringify(cart), (err) => {
                    console.log(err);
                });
            } else { console.log(err); }
        })
    }

    static getCart(cb){
        fs.readFile(p, (err, fileContent) => {
            if(err){
                cb(null);
            }
            else {
                let cart = JSON.parse(fileContent);
                cb(cart);
            }
        });
    }
}