import React from 'react'
import { Category } from '@/models/category';
import { mongooseConnect } from '@/lib/mongoose';
import Link from 'next/link';

export default function CategoriesPage({MainCategories,hasParent}) {
  return (
    <div className='w-full flex flex-col items-center min-h-screen bg-gray-100 p-2'>
        {MainCategories?.length>0 && MainCategories.map(MainCategory=>{
                return(

                    <div className='w-4/5 p-2' key={MainCategory._id}>
                      <h2 className='text-2xl'>  {MainCategory.name}</h2>
                        <div className='flex flex-wrap gap-2 p-2'>
                        {hasParent?.length > 0 &&
  hasParent.map(subcategory => {
    if (subcategory.parent === MainCategory._id) {
      return (
        <Link href={'/Categories/' + subcategory._id} key={subcategory._id}>
          <div className='bg-slate-400 w-48 h-40 rounded-md flex flex-col item-center'>
            <h2 className='text-center text-lg'>{subcategory.name}</h2>
            <img src={subcategory?.imageUrl} className='h-32 mt-1 w-full' alt='category image' />
          </div>
        </Link>
      );
    }
  })}
                        </div>
                        </div>
                )
        }
        )}


    </div>
  )
}




export async function getServerSideProps() {
 
    await mongooseConnect();
    
    const Categories=await Category.find()
    
    const MainCategories = Categories.filter(Category => {
     
      return (!Category.parent);
    })
    const hasParent=Categories.filter(Category=>{return (Category.parent);})
    return {
      props: {
        MainCategories: JSON.parse(JSON.stringify(MainCategories)),
        hasParent:JSON.parse(JSON.stringify(hasParent))
      },
    };
  }