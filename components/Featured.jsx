import Link from 'next/link'
import React, { useEffect, useState } from 'react'

export default function Featured({products}) {
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [intervalId, setIntervalId] = useState(null);


  useEffect(() => {
    const newIntervalId = setInterval(() => {
      setCurrentProductIndex((prevIndex) => (prevIndex + 1) % products.length);
    }, 5000);

    setIntervalId(newIntervalId);

    return () => {
      if (newIntervalId) {
        clearInterval(newIntervalId);
      }
    };
  }, [products]);

  if (!products || products.length === 0) {
    return null;
  }

  const currentproduct = products[currentProductIndex];

  const handlePrevClick = () => {
    clearInterval(intervalId); // Réinitialiser le timer
    setCurrentProductIndex((prevIndex) =>
      prevIndex === 0 ? products.length - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    clearInterval(intervalId); // Réinitialiser le timer
    setCurrentProductIndex((prevIndex) =>
      (prevIndex + 1) % products.length
    );
  };
  function navigate(index){
    clearInterval(intervalId);
    setCurrentProductIndex(index);
  }

  return (
    <div className='sm:w-4/5 mt-8 w-full relative group  flex flex-col items-center'>
    <button
        className='absolute bottom-40 left-0 hidden group-hover:block'
        onClick={handlePrevClick}
      ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
</svg>
</button>
      <div className='grid  grid-cols-2   w-full  md:p-4  py-2 bg-white h-64 md:h-80  duration-500  rounded-3xl md:gap-4  '>

        <div className='flex flex-col relative py-2 sm:py-0 ml-2  '>
                <h1 className='lg:text-4xl text-lg md:text-2xl sm:mb-4 sm:mt-2 ml-4  '>{currentproduct?.title}</h1>
                <p className='md:text-lg text-sm line-clamp-3 lg:line-clamp-4 sm:mt-0 mt-2  px-1 ml-2 '>{currentproduct?.description}</p>
            <div className='flex justify-center absolute bottom-0 md:bottom-2 w-full'>
                <Link href={'/Products/'+currentproduct?._id} className='opacity-90 hover:opacity-100 md:p-3 py-1.5 px-2 bg-forheader text-center  text-white md:text-xl md:w-1/2 w-3/4 md:1/2  rounded-md'>See more</Link>
            </div>
          </div>
        <div className='flex justify-center items-center  h-full w-full '>
                <img className='sm:w-56 sm:h-56 w-32 h-32 lg:h-64 lg:w-3/5' src={currentproduct?.images?.[0]} alt="Image of a product" />
        </div>
      </div>
      <button
        className='absolute bottom-40 right-0 hidden group-hover:block'
        onClick={handleNextClick}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
</svg>
</button>
    <div className=' mt-4 flex gap-4 '>
    {products && products.map((product,index)=>{
      return(

        <div
            key={index}
            className={`w-16 h-2.5 border border-gray-500 hover:cursor-pointer ${
              currentProductIndex === index ? 'bg-blue-200' : ''
            }`}
            onClick={() => navigate(index)}
          ></div>
      )
    }
    )}
    </div>
    </div>
    
  )
}
