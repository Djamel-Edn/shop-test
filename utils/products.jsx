import { mongooseConnect } from '@/lib/mongoose';
import { Product } from '@/models/Product';

export async function getProducts() {
  await mongooseConnect();

  const products = await Product.find();
  return JSON.parse(JSON.stringify(products));
}