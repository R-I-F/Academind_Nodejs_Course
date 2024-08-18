const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {

  Product.findAll()
    .then((products) => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      })
    });
};


exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findByPk(prodId)
    .then((product) => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: 'product-detail',
        path: `/products/${prodId}`
      });
      console.log(product);
    })
    .catch((err) => { console.log(err); })
}

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((cart)=>{
      return cart.getProducts()
    })
    .then((cartProducts)=>{
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: cartProducts
      });
    })
    .catch((err)=>{console.log(err);});
};

exports.postCartDeleteItem = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect('/cart')
  })
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId
  let fetchedCart;
  // Product.findById(prodId, (product) => {
  //   Cart.addProduct(product.id, product.price)
  // });
  // res.redirect('/cart');
  // check if the the productId exists in the carItems table, if yes then increment its qty by 1 , if no then add the product with qty 1
  req.user
    .getCart()
    .then((cart)=>{
      fetchedCart = cart
      return cart.getProducts({where : {id : prodId}})
    })
    .then((products)=>{
      if(products.length > 0){
        // products[0].qty ++ ;
        console.log('to be continued');
      } else {
        Product.findByPk(prodId)
        .then((product)=>{
          fetchedCart.addProduct(product, { through: { qty: 1 } });
        })
        .catch((err)=>{console.log(err);});
      }
      res.redirect('/')
    })
    .catch((err)=>{console.log(err);})
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
