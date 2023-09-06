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
    <div className="bg-white p-4 rounded-lg w-1/4 h-64 flex flex-col" ref={modalRef}>
      <div className='flex justify-between w-full'>
        <h2 className="text-lg font-semibold mb-4">Choose Payment method</h2>
        <button onClick={close}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="flex w-full gap-2 flex-grow">
        <div className='flex flex-col h-full'>
          <h2>Hand to hand</h2>
          <button
  className="btn-primary mb-2 w-full h-full"
  type="button"
  onClick={(e) => {
    e.stopPropagation(); // Empêcher la propagation de l'événement
    setShowPaymentModal(false);
    submitForm(e,'hand to hand'); // Appeler submitForm ici

  }}
>
  <img src='' alt="Hand to hand" />
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
