import Featured from './../components/Featured';
import { mongooseConnect } from '@/lib/mongoose';
import { Product } from '@/models/Product';
import PopularproductsCompo from '@/components/PopularproductsCompo';
import { getProducts } from './../utils/products';
import Link from 'next/link';
import { useState } from 'react';

export default function Home({ featuredproducts, popularProducts,latestProducts }) {
  
    
    const [carouselOffset, setCarouselOffset] = useState(0);
    const length=latestProducts.length;
    const handleRightClick = () => {
      

        if (carouselOffset> (length-7)*200)
        {setCarouselOffset(0)
        }else{
          
          setCarouselOffset(carouselOffset + 205);
        }
      
      
    }
    const handleLeftClick = () => {
      
      if(carouselOffset==0){setCarouselOffset((length-7)*200)}
      else{
        setCarouselOffset(carouselOffset - 205);

      }
    
    
  }
  return (
       
      <main className=' min-h-screen   flex items-center bg-slate-700  w-full  flex-col '>
        <Featured products={featuredproducts} />
        
      <PopularproductsCompo  popularProducts={popularProducts}/>

      {latestProducts.length>0 &&(
      <div className='w-full  bg-blue-200  flex flex-col items-center relative overflow-hidden   h-96'>
        <h2 className='w-full text-start text-2xl ml-16 mt-4'>Latest Products</h2>
                <button className='absolute top-44 left-0 z-10' onClick={handleLeftClick}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
      </svg>
        </button>
        <div className='w-11/12 overflow-hidden'>
      <div className=' w-full h-64  mt-8  flex gap-3 transition-transform ' style={{ transform: `translateX(-${carouselOffset}px)`}}>
    { latestProducts.map((product)=>{
      return (
      <Link href={'/Products/'+product._id} 
      className=' border border-gray-300 hover:border-yellow-900 text-white rounded-t-3xl h-64  bg-yellow-700 w-48 relative' key={product._id}>
          <div className=' hover:border-yellow-900 bg-white  rounded-t-3xl flex justify-center w-full' style={{height:'135px'}}>
          <img src={product.images[0]} alt="image du produit" srcSet="" className='w-full rounded-t-3xl h-full'/>
          </div>
        <div className=' flex flex-col px-1.5 mt-2    w-48 truncate '>
          <h4 className=' truncate w-44 mb-1 text-center'>
            {product.title}
            </h4>
            <div className=" w-full h-16  text-base " >
         {product.technicalSheet &&(
           
          <p className='ml-1 white-space:normal truncate h-16'>{product.technicalSheet}</p>
         )}
        </div>
          <div className='flex text-sm justify-between items-center w-44 gap-6 absolute bottom-0 py-1 h-16'>
          {product.price} Da
          <button  className=' bg-slate-700 p-2 text-sm lg:text-base rounded-md'>Read more</button>
          </div>
        </div>
      </Link>

        )
      })}
      </div>
          
        </div>
      <button className='absolute top-44 right-0   z-10'  onClick={handleRightClick} >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="rotate-180 w-8 h-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
      </svg>
        </button>
      </div>
      )}
      </main>
  );
}

export async function getServerSideProps() {
 
  await mongooseConnect();
  const featuredproducts = await Product.find({isFeatured:true}).lean();
  const products=await getProducts()
  
  const popularProducts = products.filter(product => {
   
    return (product.isPopular);
  }).slice(0,10);
  const lastestProducts = products.sort((a, b) => a.createdAt - b.createdAt).slice(0, 21);
  return {
    props: {
      featuredproducts: JSON.parse(JSON.stringify(featuredproducts)),
      popularProducts: JSON.parse(JSON.stringify(popularProducts)),
      latestProducts: JSON.parse(JSON.stringify(lastestProducts)),
    },
  };
}

