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
        <div className='flex flex-col items-center h-full w-full'>
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
