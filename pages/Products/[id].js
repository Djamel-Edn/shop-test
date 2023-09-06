import React, { useContext, useState } from 'react';
import { mongooseConnect } from '@/lib/mongoose';
import { Product } from '@/models/Product';
import { CartContext } from '@/components/CartContext';
import axios from 'axios';

export default function ProductDetail({ product }) {
  const [bigimg,setBigImg]=useState(product?.images?.[0]);
  const [updatedProduct,setUpdatedProduct]=useState(product)
  let firstFourSentences='';
  let sentences='';
  const id=product._id;
  if(product.technicalSheet){

    const sentences = product.technicalSheet.split('-');
     firstFourSentences = sentences.slice(0, 4).join('- ');
  }
  const {cartProducts,setCartProducts}= useContext(CartContext)
  function addToCart(){
    setCartProducts(prev=>[...prev,updatedProduct])
  }
  async function handleQuantity(value){
    const updatedProducttemp = { ...product, Quantity: parseInt(value,10) };
    setUpdatedProduct(updatedProducttemp);
    
    await axios.put(`/api/Products/`, { ...updatedProduct , id });
  }
  return (
    <div className='flex flex-col min-h-screen bg-gray-200'>
    <div className=' flex justify-center '>

      <div className=' flex flex-col w-full md:w-4/5 bg-white p-2 lg:p-6 '>
        <h1 className='text-2xl mt-2 w-1/2 mb-2 ml-4 text-center md:text-start'> {product.title}</h1>
        {product.technicalSheet && firstFourSentences &&  (<h3 className='mb-4 w-1/2 ml-4'>{firstFourSentences}</h3>)}
        <div className='flex flex-col md:flex-row w-full  '>
          <div className='flex flex-col w-full md:w-1/3 p-2 items-center '>
            <div className='h-3/5'> <img src={bigimg} alt="image du produit" srcSet="" className='w-full h-full'/></div>
            <div className='flex w-full flex-wrap h-1/5 mt-2 '>{product.images.length>0 && (
              product.images.map(img=>(
                <img key={img} src={img} alt="image du produit" srcSet="" className='w-1/5 h-full opacity-80 hover:opacity-100 hover:cursor-pointer' onClick={()=>setBigImg(img)}/>
              ))
            )}
            </div>
          </div>
        <div className='w-full p-3 md:px-0  md:w-2/5  lg:mr-8 md:py-8 text-lg '><p>{product.description}</p></div>
        <div className='p-2 py-10 bg-forheader gap-1 text-white w-full md:w-1/3 lg:w-1/4 md:ml-10 flex flex-col items-center'>
          <h2 className='text-lg mt-6 text-center '>Price <br></br>{product.price}  DA</h2> 
              <label className='mt-6 text-lg'>Quantity</label>
        <select className='w-20 h-10 text-center text-gray-700' value={updatedProduct.Quantity} onChange={ev=>handleQuantity(ev.target.value)} >
          <option value='1'>1</option>
          <option value='2'>2</option>
          <option value='3'>3</option>
          <option value='4'>4</option>
          <option value='5'>5</option>
          <option value='6'>6</option>
          <option value='7'>7</option>
          <option value='8'>8</option>
          <option value='9'>9</option>
        </select>
        <button onClick={addToCart} className='bg-yellow-700  p-2 w-3/5 opacity-90 hover:opacity-100 rounded-md mt-16 flex justify-center'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
</svg>
Add to cart</button>
          </div>
        </div>
      </div>
      </div>
    {product.technicalSheet &&(
      <div className='w-full  text-white flex justify-center'>
        <div className='w-4/5 bg-slate-700 p-6 px-10'>
      <h2 className='text-xl mb-2'>
        TechnicalSheet:
      </h2>
      <ul className='list-disc ml-2'>
        {sentences && sentences.map(sentence => (
          <li key={sentence}>{sentence}</li>
        ))}
      </ul>
  </div>
    </div>
    )}
      </div>
  )
}

export async function getServerSideProps(context) {
  await mongooseConnect();
    
  const { id } = context.query;
    
  
    const product = await Product.findById(id);
    return {
      props: {
        product: JSON.parse(JSON.stringify(product)),
      },
    
  } 
  
}
