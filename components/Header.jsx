import React, { useContext } from 'react';
import Link from 'next/link';
import { CartContext } from './CartContext';

export default function Header() {

  const {cartProducts}=useContext(CartContext)
  const totalQuantity = cartProducts.reduce((total, product) => total + product.Quantity, 0);
  return (
    <header className='flex header  gap-2 justify-center w-full h-18  py-5 px-2 sm:p-5 sm:gap-16 bg-forheader text-white text-xs md:text-base lg:text-lg'>
        <Link href="/" className=' lg:mr-8 xl:mr-36'>Shop</Link>
      <nav className='flex  gap-2 sm:gap-16 lg:gap-32 lg:ml-10' >
        <div className='flex gap-1 sm:gap-4 md:gap-10'>
        <Link href="/">Home</Link>
        <Link href="/Products">Products</Link>
        <Link href="/Categories">Categories</Link>
        <Link href={'/Soldes'}>Soldes</Link>
        </div>
        <div className='flex gap-1   lg:gap-10 sm:gap-4  md:ml-6 lg:ml-36'>
        <Link href="/Cart" className='mt-1 relative'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>     
          <span className='absolute bottom-3.5 right-0'>
            {totalQuantity}   
            </span>
          </Link>
        <Link href="/Contacts">Contact</Link>
        </div>
      </nav>
    </header>
  )
}
