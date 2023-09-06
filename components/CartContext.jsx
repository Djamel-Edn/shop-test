import React, { createContext, useEffect, useState } from "react";

export const CartContext = createContext({});

export function CartContextProvider({ children }) {
  const ls=typeof window !=="undefined" ? window.localStorage:null
  
    const [cartProducts,setCartProducts]=useState( [])
    useEffect(()=>{
      if (cartProducts.length>0){
        ls.setItem('cart',JSON.stringify(cartProducts))
      }
    },[cartProducts])
    useEffect(()=>{
      if (ls && ls.getItem('cart')){
        setCartProducts( JSON.parse(ls.getItem('cart')))
      }
    },[])
  return (
    <CartContext.Provider value={{cartProducts,setCartProducts}}>
      {children}
    </CartContext.Provider>
  );
}

