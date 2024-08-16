const Product = require('../models/product');


exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  const id = req.params.productId;
  if (!editMode) {
    res.redirect('/');
  }
  Product.findByPk(id).then((product)=>{
    if (!product) {
      res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product
    });
  }).catch((err)=>{console.log(err);});}

exports.postEditProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findByPk(prodId)
  .then((product)=>{
    product.title = req.body.title;
    product.imageUrl = req.body.imageUrl;
    product.description = req.body.description;
    product.price = req.body.price;
    return product.save();
  })
  .then((result)=>{
    res.redirect('/');
  })
  .catch((err)=>{console.log(err);})
};

exports.deleteProduct = (req, res, next) => {
  const prodId = req.params.productId;
  console.log(prodId);
  Product.delete(prodId);
  res.redirect('/');
};

exports.postAddProduct = (req, res, next) => {
  console.log(req.body);
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const id = null;
  Product.create({ title: title, price: price, imageUrl: imageUrl, description: description })
    .then((result) => { console.log(result); })
    .catch((err) => { console.log(err); });
};

exports.getProducts = (req, res, next) => {
  Product.findAll().then(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  }).catch((err)=>{console.log(err);})
};
