import React from 'react'
import Header from './Header'
import Footer from './footer'

export default function Layout({children}) {
  return (
    <div className='flex flex-col min-h-screen'>
        <Header/>
    <div className=''>{children}</div>
    <Footer/>
    </div>


    
  )
}
