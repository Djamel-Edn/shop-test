import { CartContext } from "@/components/CartContext";
import axios from "axios";
import { create_payement } from "chargily-epay-react-js";
import { useContext, useEffect, useRef, useState } from "react";

export default function CartPage() {
  
  const [name, setName] = useState('');
  const [adress, setAdress] = useState('');
  const [number, setNumber] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [postal, setPostal] = useState('');
  const [canConfirm, setCanConfirm] = useState(true);
  const { cartProducts, setCartProducts } = useContext(CartContext);
  let Total = 0;
  cartProducts.map((product) => { Total += product.Quantity * product.price });
  
  function handleQuantity(productId, value) {
    const updatedCartProducts = cartProducts.map((product) => {
      if (product._id === productId) {
        return { ...product, Quantity: parseInt(value, 10) };
      } 
      return product;
    });

    setCartProducts(updatedCartProducts);
  }
  const handlepay = async()=>{

    const invoice = {
      "amount":Total,
      "invoice_number":Math.random(), 
      "client":name, 
      'client_email':email,
      "mode":"EDAHABIA",
      "webhook_url":"https://your_beeceptor_url.free.beeceptor.com", // here is the webhook url, use beecptor to easly see the post request and it's body, you will use this in backened to save and validate the transactions.
      "back_url":"http://localhost:3001/Cart", // to where the user will be redirected after he finish/cancel the payement 
      "discount" :0
  }
    try {
      await create_payement(invoice)
    } catch (error) {
      // handle your error here 
      console.log(error)
    }
  }
  function deleteProducts(id) {
    const newlist = cartProducts.filter(product => product._id !== id);
    setCartProducts(newlist);
  }

  const handleAddToCart = () => {
    const timestamp = new Date().getTime();
    localStorage.setItem('lastAddToCartTimestamp', timestamp.toString());
    setCanConfirm(false);

    setTimeout(() => {
      setCanConfirm(true);
    }, 5 * 60 * 1000);
  };

  useEffect(() => {
    const lastTimestamp = localStorage.getItem('lastAddToCartTimestamp');
    if (lastTimestamp) {
      const currentTime = new Date().getTime();
      const lastClickTime = parseInt(lastTimestamp, 10);
      const timeDifference = currentTime - lastClickTime;

      if (timeDifference < 5 * 60 * 1000) {
        setCanConfirm(false);

        setTimeout(() => {
          setCanConfirm(true);
        }, 5 * 60 * 1000 - timeDifference);
      }
    }
  }, []);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        if (!event.target.classList.contains("btn-primary") && !event.target.parentElement.classList.contains("btn-primary")) {
          setShowPaymentModal(false);
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
function check(){
  if (!adress || !email || !city || !postal  ) {
    alert('Veuillez remplir tous les champs .');
    return;
  }
  setShowPaymentModal(true)
}
  function submitForm(event,selectedPaymentMethod) {
    event.preventDefault();
    
    
    const formData = {
      name,
      adress,
      number,
      email,
      city,
      postal,
      products: JSON.stringify(cartProducts),
      paymentMethod: selectedPaymentMethod,
    };
    axios.post('/api/Orders', formData)
    .then(response => {
        setCanConfirm(false); 
      })
      .catch(error => {
        console.errorr(error)
      });
    handleAddToCart();
  }

  function close() {
    setShowPaymentModal(false);
  }

  return (
    <div className="w-full min-h-screen flex flex-col py-8 bg-slate-300 items-center">
      <h1 className="text-2xl">Cart</h1>
      <div className="flex w-full px-2 md:px-6 min-h-screen mt-8 gap-2 lg:gap-10 flex-col items-center md:items-start  md:flex-row">
        <div className="h-full bg-white rounded-lg p-2 py-3 w-full md:w-11/12">
          {!cartProducts?.length && <div> Your cart is Empty</div>}
          {cartProducts && (
            <div className="w-full flex flex-col text-sm">
              <div className="w-full grid-container tableau">
                <div className="">Name</div>
                <div className='flex justify-center'>Price</div>
                <div className='flex justify-center'>Quantity</div>
                <div className='flex justify-center ml-1 md:ml-0'>Sub-Total</div>
              </div>
              <div className="border border-gray-900"></div>
              <div className="flex flex-col items-center">
                {cartProducts?.length > 0 &&
                  cartProducts.map((product) => (
                    <div key={product._id} className="h-24 w-full flex grid-container product">
                      <div className="w-full info block sm:flex">
                        <img src={product.images[0]} className="md:w-1/3 sm:w-20 w-1/2 h-16 md:h-24" />
                        <div className="mt-2 flex-wrap flex flex-col truncate">
                          <h2 className='w-full truncate text-xs sm:text-base'>{product.title}</h2>
                          <p className='hidden sm:block'>{product.technicalSheet}</p>
                        </div>
                      </div>
                      <div className="flex justify-center mt-3">{product.price}</div>
                      <div className='flex justify-center mt-2.5'>
                        <select className="flex w-10 sm:w-20 h-8" value={product.Quantity} onChange={ev => handleQuantity(product._id, ev.target.value)}>
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
                      </div>
                      <div className="flex justify-center mt-3">{product.price * product.Quantity} DA</div>
                      <div className='mt-3'><button onClick={() => deleteProducts(product._id)}>X</button></div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
        {!!cartProducts.length && (
          <div className="md:w-1/3 w-full h-96 flex flex-col p-2 bg-white rounded-lg">
            <h2 className="w-full text-center text-lg">Total: <br />{Total} DA</h2>
            <h2 className="w-full text-center text-lg">Order information</h2>
            <form className="flex flex-col items-center text-sm sm:text-base w-full gap-2 " onSubmit={submitForm}>
              <input
                type="text"
                placeholder="Name :optional"
                className="bg-gray-200 p-1 px-2 w-4/5"
                value={name}
                onChange={ev => { setName(ev.target.value) }}
              />
              <input
                type="text"
                placeholder="Address"
                className="bg-gray-200 p-1 px-2 w-4/5"
                value={adress}
                onChange={ev => { setAdress(ev.target.value) }}
              />
              <input
                type="tel"
                placeholder="Number"
                className="bg-gray-200 p-1 px-2 w-4/5"
                value={number}
                onChange={ev => { setNumber(ev.target.value) }}
              />
              <input
                type="text"
                placeholder="Email address"
                className="bg-gray-200 p-1 px-2 w-4/5"
                value={email}
                onChange={ev => { setEmail(ev.target.value) }}
              />
              <div className='grid grid-cols-2 gap-2 w-4/5'>
                <input
                  type="text"
                  placeholder="City"
                  className="bg-gray-200 p-1 px-2"
                  value={city}
                  onChange={ev => { setCity(ev.target.value) }}
                />
                <input
                  type="number"
                  placeholder="Postal Code"
                  className="bg-gray-200 p-1 px-2"
                  value={postal}
                  onChange={ev => { setPostal(ev.target.value) }}
                />
              </div>
              <input
                type="hidden"
                className="bg-gray-200 p-1 px-2"
                name='products'
                value={JSON.stringify(cartProducts)}
              />
              <button className="confirm w-44 lg:w-4/5 mt-2 bg-slate-200 px-3 py-2 rounded-md opacity-70 hover:opacity-100"
                type='button'
                disabled={!canConfirm}
                onClick={ check}
              >
                Confirm Command
              </button>
              <p>Only one confirmation in 5 minutes..</p>
            
              {showPaymentModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-4 rounded-lg w-1/4 h-88 flex flex-col" ref={modalRef}>
      <div className='flex justify-between w-full'>
        <h2 className="text-lg font-semibold mb-4">Choose Payment method</h2>
        <button onClick={close}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="flex w-full gap-2 flex-grow">
        <div className='flex flex-col items-center h-full'>
          <h2>Hand to hand</h2>
          <button
  className="btn-primary mb-2 w-1/2 h-full"
  type="button"
  onClick={(e) => {
    e.stopPropagation(); 
    setShowPaymentModal(false);
    submitForm(e,'hand to hand'); 

  }}
>
  <img src='data:image/png;base64,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'
   alt="Hand to hand" />
</button>

        </div>
        
      </div>
    </div>
  </div>
)}
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
