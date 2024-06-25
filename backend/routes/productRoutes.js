import express from 'express';
const router = express.Router();
// import products from '../data/products.js';
import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js';

router.get('/', asyncHandler(async (req, res) => {
  const products = await Product.find({});
  console.log(products);
  res.json(products);
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if(product) {
    console.log(product);
    return res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
}));

export default router;