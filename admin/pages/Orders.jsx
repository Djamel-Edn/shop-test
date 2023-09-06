import Layout from '@/components/layout'
import React, { useEffect, useState } from 'react'
import axios from 'axios';

  
export default function OrdersPage() {
  const [Orders, setOrders] = useState([]);
  const [LocalselectedOrders, setLocalSelectedOrders] = useState(getStorage('selectedOrders'));
  useEffect(() => {
    fetchOrders(); 
  }, []);
useEffect(() => {
  const intervalId = setInterval(fetchOrders,   5*60 * 1000); 
  return () => {
    clearInterval(intervalId);
  };
}, []);
  function getStorage(key) {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : []; // Parse the JSON data
    }
    return [];
  }

  const toggleOrderSelection = (orderId) => {
    if (LocalselectedOrders.includes(orderId)) {
      setLocalSelectedOrders(LocalselectedOrders.filter(id => id !== orderId));
    } else {
      setLocalSelectedOrders([...LocalselectedOrders, orderId]);
    }
  };

  async function deleteOrder(id) {
    const result = confirm('Are you sure you want to delete it?');
    if (result) {
      try {
        await axios.delete(`/api/Orders?id=${id}`);
        setOrders(Orders.filter(order=>{
          return(id!==order._id)
        }))
      } catch (error) {
        console.error('Error deleting order:', error);
      }
    }
  }


  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/Orders');
      // Tri des commandes par ordre décroissant de date
      const sortedOrders = response.data.sort((a, b) => {
        const dateA = new Date(a.orderDate);
        const dateB = new Date(b.orderDate);
        return dateB - dateA;
      });
      setOrders(sortedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

 

  useEffect(() => {
    localStorage.setItem('selectedOrders', JSON.stringify(LocalselectedOrders));
  }, [LocalselectedOrders]);

  

   
  return (
    <Layout>
      <table className='basic ml-8  '>
        <thead>
          <tr className='grid ' style={{ gridTemplateColumns: '0.7fr 0.5fr 0.4fr 1fr 0.3fr 0.15fr 0.10fr' }}>
            <th>Date</th>
            <th>Info</th>
            <th>Method</th>
            <th>Products</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {Orders.length > 0 && Orders.map((order) => {
            const totalOrderPrice = order.products.reduce((total, product) => {
              return total + product.price * product.Quantity;
            }, 0);
            return (
              <tr key={order._id} className='grid border border-gray-300' style={{ gridTemplateColumns: '0.7fr 0.5fr 0.4fr 1fr 0.3fr 0.15fr 0.10fr' }}>
                <td className='flex items-center p-2 border border-gray-300 '>{new Date(order.orderDate).toLocaleDateString() + ' ' + order.orderDate.substring(11, 16)}</td>
                <td className='p-1'>
                  {order.name}<br />{order.email}<br />{order.number}<br />{order.adress}<br />{order.city}<br />{order.postal}
                </td>
                <td className='border border-gray-300 p-1'>{order.paymentMethod}</td>
                <td className='border border-gray-300 p-1'>{order.products.map((product) => {
                  return (
                    <div key={product._id}>

                      {product.title} x {product.Quantity}<br />
                    </div>
                    
                  )
                })}</td>
                <td >{totalOrderPrice} DA</td>
                <td>
                  <input
                    type="checkbox"
                    checked={LocalselectedOrders.includes(order._id)}
                    onChange={() => toggleOrderSelection(order._id)}
                  />
                </td>
                <td>
                  <button className='p-1' onClick={() => deleteOrder(order._id)}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg></button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </Layout>
  )
}

