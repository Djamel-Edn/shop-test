import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { Category } from "@/models/category";
import Link from "next/link";
import { useState } from 'react';

export default function SubcategoryPage({ SubCategory, hasParent, allProducts,Categories }) {
    const list = hasParent.filter(category => category.parent === SubCategory._id);

  const products = allProducts.filter(product => product.category === SubCategory._id);
  const popularproducts = allProducts.filter(product => {
    const productParentCategoryId = Categories.find(cat => cat._id === product.category)?.parent;
    return productParentCategoryId !== null && product.isPopular && productParentCategoryId==SubCategory.parent
  });
  const [carouselOffset, setCarouselOffset] = useState(0);
  const length = popularproducts.length;
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
    <div className="w-full flex flex-col items-center h-screen  ">
      <div className='w-4/5 flex flex-col mb-10 '>
        {list && (
          <h2 className="text-2xl mb-5 mt-2">{SubCategory.name}</h2>
        )}
        {products.length > 0 && (
          <div className='lg:ml-2 xl:ml-0  gap-4 text-white  w-full  flex justify-center  flex-wrap '>
          {products.map(product => (
              <Link key={product._id}  href={'/Products/'+product._id}>
              <div className='border border-gray-200 hover:border-yellow-900 flex flex-col text-lg gap-2 items-center bg-yellow-700 rounded-3xl  w-56 h-80 relative' key={product._id}>
                <div className='bg-white p-2 border border-gray-200 rounded-t-3xl flex justify-center w-full h-40'>
                  <img src={product.images?.[0]} alt="image du produit" srcSet="" className='w-full h-full'/>
                </div>
                <h4 className='p-1 mb-16'>
                  {product.title}
                </h4>
                <div className='flex justify-between md:text-lg text-sm items-center w-full absolute bottom-1 px-4 py-2 h-16'>
                  {product.price} Da
                  <p href={'/'} className='bg-slate-700 p-2 text-sm md:text-base rounded-md'>Read more</p>
                </div>
              </div>
              </Link>
            ))}
         </div>
        )}
        <div className='flex flex-wrap gap-4'>
          {list.length > 0 && list.map(category => (
            <Link key={category._id} href={'/Categories/' + category._id}>
              <div className='w-48 bg-gray-200 h-48 rounded-sm'>{category.name}</div>
            </Link>
          ))}
        </div> 
      </div>
      <div className=' w-full  '>

      {popularproducts.length>0 &&(
          <div className='w-full  bg-blue-200  flex flex-col items-center relative overflow-hidden py-2   '>
            <h2 className='w-full text-start text-2xl ml-16 mt-4'>Popular Products</h2>
                    <button className='absolute top-44 left-0 z-10' onClick={handleLeftClick}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
            </button>
            <div className='w-11/12 overflow-hidden'>
          <div className=' w-full h-64  mt-8  flex gap-3 transition-transform ' style={{ transform: `translateX(-${carouselOffset}px)`}}>
        { popularproducts.map((product)=>{
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
      </div>
    </div>

  );
            

}

export async function getServerSideProps(context) {
  const { id } = context.query;

  await mongooseConnect();

  const SubCategory = await Category.findById(id);
  const Categories = await Category.find();
  const allProducts = await Product.find();

  const hasParent = Categories.filter(category => category.parent);

  return {
    props: {
      allProducts: JSON.parse(JSON.stringify(allProducts)),
      SubCategory: JSON.parse(JSON.stringify(SubCategory)),
      hasParent: JSON.parse(JSON.stringify(hasParent)),
      Categories: JSON.parse(JSON.stringify(Categories))
    }
  };
}
