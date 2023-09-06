import React, { useState } from 'react';
import Link from 'next/link';
import CategoryFilter from '@/components/Categoryfilter';
import { Category } from '@/models/category';
import { mongooseConnect } from '@/lib/mongoose';
import { Product } from '@/models/Product';

export default function Products({ products, hasParent, categories }) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProperties, setSelectedProperties] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const filteredProducts = products.filter((product) => {
    // Filter by selected category
    if (selectedCategory && product.category !== selectedCategory) {
      return false;
    }

    // Filter by search query
    if (searchQuery && !product.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    return true;
  });

  return (
    <>
      <div className='flex justify-between items-center px-6'>
        <h1 className='ml-8 mt-6 mb-6 text-3xl text-center sm:text-start'>All Products</h1>
        <input
          type="text"
          placeholder="Search for products..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className='px-2 py-2 w-1/4'
        />
        <CategoryFilter
          categories={hasParent}
          selectedCategory={selectedCategory}
          selectedProperties={selectedProperties}
          onChange={handleCategoryChange}
        />
      </div>
      <div className='flex justify-center'>
        <div className='lg:ml-2 xl:ml-0 gap-8 text-white w-full h-full flex justify-center flex-wrap p-4'>
          {filteredProducts.map((product) => (
            <Link key={product._id} href={'/Products/' + product._id}>
              <div className='border border-gray-200 hover:border-yellow-900 flex flex-col text-lg gap-2 items-center bg-yellow-700 rounded-3xl w-56 h-80 relative' key={product._id}>
                <div className='bg-white p-2 border border-gray-200 rounded-t-3xl flex justify-center w-full h-40'>
                  <img src={product.images?.[0]} alt="image du produit" srcSet="" className='w-full h-full' />
                </div>
                <h4 className='p-1 mb-16'>
                  {product.title}
                </h4>
                <div className='flex justify-between md:text-lg text-sm items-center w-full absolute bottom-1 px-4 py-2 h-16'>
                  {product.price} Da
                  <button href={'/Products/' + product._id} className='bg-slate-700 p-2 text-sm md:text-base rounded-md'>Read more</button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  await mongooseConnect();
  // Fetch categories
  const categories = await Category.find();

  // Fetch products
  const products = await Product.find();
  const hasParent = categories.filter((Category) => {
    return Category.parent;
  });
  return {
    props: {
      hasParent: JSON.parse(JSON.stringify(hasParent)),
      products: JSON.parse(JSON.stringify(products)),
      categories: JSON.parse(JSON.stringify(categories)),
    },
  };
}
