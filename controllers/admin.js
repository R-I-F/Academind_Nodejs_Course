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
  Product.findById(id, (product) => {
    if (!product) {
      res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.fetchAll((products) => {
    const productIndex = products.findIndex((prod) => { return prod.id === prodId })
    const editedProduct = new Product(req.body.title, req.body.imageUrl, req.body.description, req.body.price, req.body.id);
    editedProduct.replace(productIndex);
  });
  res.redirect('/');
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
  Product.fetchAll(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  });
};
