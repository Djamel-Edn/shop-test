import { mongooseConnect } from '@/lib/mongoose';
import { Product } from '@/models/Product';
import Link from 'next/link';
import React from 'react'

export default function soldesPage({Soldesproducts}) {
  return (
    <div className='w-full bg-gray-200 min-h-screen flex flex-col items-center'>
         <div className="flex flex-col items-center mt-8 bg-white w-4/5">

{Soldesproducts?.length > 0 &&
  Soldesproducts.map((product) => (

      <div key={product._id} className="h-28  w-full flex justify-between border border-b-1 border-gray-200  product   "  
      >
          <div className="w-2/5 info block sm:flex">
              <img src={product.images[0]} className="md:w-1/3 sm:w-20 w-1/2 h-16 md:h-24" />
              <div className="mt-2 flex-wrap flex flex-col  truncate">
              <h2 className='w-full  truncate text-xs sm:text-base' >{product.title}</h2>
              <p className='hidden sm:block'>   
                  {product.technicalSheet}
                  </p>
              </div>

           </div>

          <div className="flex justify-end  p-2 w-1/2"><div className='bg-blue-100 w-1/2 flex flex-col justify-center items-center'>
            <p className='line-through'>{product.oldPrice} </p>
            <h3 className='text-lg'>
                {product.price} DA
                </h3>
            <Link key={product._id}  href={'/Products/'+product._id} className='p-1 px-4 bg-forheader text-white'>See More </Link>
          </div></div>
       
         
      </div>
   
  ))}
  </div>
</div>
)}

  







export async function getServerSideProps() {
 
    await mongooseConnect();
    const Soldesproducts = await Product.find({isSolde:true}).lean()
    
   
    return {
      props: {
        Soldesproducts: JSON.parse(JSON.stringify(Soldesproducts)),
        
      },
    };
  }