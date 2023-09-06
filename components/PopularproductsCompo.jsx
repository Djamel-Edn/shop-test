import Link from 'next/link';
import React from 'react'

export default function PopularproductsCompo({popularProducts}) {
  if (popularProducts.length==0){return;}
  else{
    
    
  return (
    <div className='w-full min-h-screen flex flex-col  bg-gray-100 mt-16'>
      <h2 className=' text-2xl m-8 text-center md:text-start'>Popular Products</h2>
      
    
      <div className='min-h-screen lg:ml-2 xl:ml-16  gap-4 text-white lg:w-11/12 w-full h-full flex flex-wrap justify-center'>
        {popularProducts.map(product=>(
          <Link href={'/Products/'+product._id} 
          className=' border border-gray-200 hover:border-yellow-900  lg:ml-10 md:ml-1 md:w-44 flex flex-col md:text-lg text-base gap-2  items-center bg-yellow-700 rounded-3xl lg:w-56  w-52  md:h-80 relative' key={product._id}>
              <div className=' hover:border-yellow-900 bg-white    rounded-t-3xl flex justify-center w-full h-36 md:h-48'>
              <img src={product.images[0]} alt="image du produit" srcSet="" className='w-full rounded-t-3xl h-full'/>
              </div>
            <div className=' flex flex-col px-1.5 h-28   w-full truncate '>
              <h4 className=' truncate w-full mb-1 text-center'>
                {product.title}
                </h4>
                <div className=" w-full h-16  text-base " >
             {product.technicalSheet &&(
               
              <p className='ml-1 white-space:normal truncate h-16'>{product.technicalSheet}</p>
             )}
            </div>
              <div className='flex justify-between md:text-lg text-sm items-center w-full absolute bottom-1 px-3 py-2 h-16'>
              {product.price} Da
              <button  className=' bg-slate-700 p-2 text-sm lg:text-base rounded-md'>Read more</button>
              </div>
            </div>
          
          </Link>
        ))}
      </div>
      

    </div>
        )}
}
