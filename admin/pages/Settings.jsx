import React, { useState, useEffect } from 'react';
import { Product } from '@/models/Product';
import { mongooseConnect } from '@/lib/mongoose';
import Layout from '@/components/layout';
import axios from 'axios';

export default function Settings({ productlist }) {
    const [selectedProduct, setselectedProduct] = useState(null);
    const [selectedProductid, setselectedProductid] = useState('');
    const [products, setProducts] = useState([]);
    const [oldpricev,setOldPricev]=useState(0);
   
    useEffect( ()=>{
        async function update(){
            const updatedProduct = { ...selectedProduct, oldPrice:parseFloat(oldpricev) };
            

            await axios.put(`/api/Products/`, { ...updatedProduct, selectedProductid });
        }
        update()
    },[oldpricev])
    useEffect(() => {
        if (selectedProduct) {
          setOldPricev(selectedProduct.oldPrice || 0);
        }
      }, [selectedProduct]);
      
    useEffect(()=>{

        if (productlist.length > 0) {
            setProducts(productlist);
        }
    }

    ,[productlist])
    useEffect(() => {
        if (selectedProductid) {
            const selectedProductobj = products.find(product => product._id === selectedProductid);
            setselectedProduct(selectedProductobj );
        }
    }, [selectedProductid,products]);
    
    const handleYesClick = async () => {
        if (selectedProduct) {
            const updatedProduct = { ...selectedProduct, isFeatured: true };
            setselectedProduct(updatedProduct);
            await axios.put(`/api/Products/`, { ...updatedProduct, selectedProductid });
    
            // Mettre à jour l'objet products après la mise à jour
            const updatedProducts = products.map(product =>
                product._id === updatedProduct._id ? updatedProduct : product
            );
            setProducts(updatedProducts);
        }
    };
    const handleYesClick2 = async () => {
        if (selectedProduct) {
            const updatedProduct = { ...selectedProduct, isPopular: true };
            setselectedProduct(updatedProduct);
            await axios.put(`/api/Products/`, { ...updatedProduct, selectedProductid });
    
            const updatedProducts = products.map(product =>
                product._id === updatedProduct._id ? updatedProduct : product
            );
            setProducts(updatedProducts);
        }
    };
    const handleYesClick3 = async () => {
        if (selectedProduct) {
            const updatedProduct = { ...selectedProduct, isSolde: true };
            setselectedProduct(updatedProduct);
            await axios.put(`/api/Products/`, { ...updatedProduct, selectedProductid });
    
            const updatedProducts = products.map(product =>
                product._id === updatedProduct._id ? updatedProduct : product
            );
            setProducts(updatedProducts);
        }
    };
    
    const handleNoClick = async () => {
        if (selectedProduct) {
            const updatedProduct = { ...selectedProduct, isFeatured: false };
            setselectedProduct(updatedProduct);
            await axios.put(`/api/Products/`, { ...updatedProduct, selectedProductid });
    
            // Mettre à jour l'objet products après la mise à jour
            const updatedProducts = products.map(product =>
                product._id === updatedProduct._id ? updatedProduct : product
            );
            setProducts(updatedProducts);
        }
    };
    const handleNoClick2 = async () => {
        if (selectedProduct) {
            const updatedProduct = { ...selectedProduct, isPopular: false };
            setselectedProduct(updatedProduct);
            await axios.put(`/api/Products/`, { ...updatedProduct, selectedProductid });
    
            // Mettre à jour l'objet products après la mise à jour
            const updatedProducts = products.map(product =>
                product._id === updatedProduct._id ? updatedProduct : product
            );
            setProducts(updatedProducts);
        }
    };
    const handleNoClick3 = async () => {
        if (selectedProduct) {
            const updatedProduct = { ...selectedProduct, isSolde: false };
            setselectedProduct(updatedProduct);
            await axios.put(`/api/Products/`, { ...updatedProduct, selectedProductid });
    
            // Mettre à jour l'objet products après la mise à jour
            const updatedProducts = products.map(product =>
                product._id === updatedProduct._id ? updatedProduct : product
            );
            setProducts(updatedProducts);
        }
    };
    
    
    

    return (
        <Layout>
            <div className='text-white  h-3/5 flex flex-col items-center justify-center gap-2 text-lg'>
                <select value={selectedProductid} onChange={ev => setselectedProductid(ev.target.value)} className='text-black w-2/5'>
                <option value="">Select a product</option>
                {products.map(product => (
                    <option key={product._id} value={product._id}>
                        {product.title}
                    </option>
                ))}
            </select>
                <label>Featured Product</label>
                {selectedProduct && (
                    <div className='flex w-2/5 justify-between text-white mt-2 '>
                        <button className={selectedProduct.isFeatured ? 'p-3 w-32 bg-green-300' : 'p-3 w-32 border-2 border-green-300'} onClick={handleYesClick}>
                            Yes
                        </button>
                        <button className={selectedProduct.isFeatured ? 'p-3 w-32 border-2 border-red-200' : 'p-3 w-32 bg-red-300'} onClick={handleNoClick}>
                            No
                        </button>
                    </div>
                )}
                <label >Popular</label>
                {selectedProduct && (
                    <div className='flex w-2/5 justify-between text-white mt-2 '>
                        <button className={selectedProduct.isPopular ? 'p-3 w-32 bg-green-300' : 'p-3 w-32 border-2 border-green-300'} onClick={handleYesClick2}>
                            Yes
                        </button>
                        <button className={selectedProduct.isPopular ? 'p-3 w-32 border-2 border-red-200' : 'p-3 w-32 bg-red-300'} onClick={handleNoClick2}>
                            No
                        </button>
                    </div>
                )}      
                 <label >Soldes Products</label>
                {selectedProduct && (
                    <div className='flex flex-col  gap-2 w-2/5'>

                    
                    <div className='flex w-full justify-between text-white mt-2 '>
                        <button className={selectedProduct.isSolde ? 'p-3 w-32 bg-green-300' : 'p-3 w-32 border-2 border-green-300'} onClick={handleYesClick3}>
                            Yes
                        </button>
                        <button className={selectedProduct.isSolde ? 'p-3 w-32 border-2 border-red-200' : 'p-3 w-32 bg-red-300'} onClick={handleNoClick3}>
                            No
                        </button>
                    </div>
                {selectedProduct.isSolde && (
                    <div className='flex justify-center mt-3 '>
                        <input placeholder='old price' type='number'  value={oldpricev }
        onChange={(ev) => setOldPricev(ev.target.value)}/>

                    </div>
                )}
                    </div>
                )}      
            </div>
        </Layout>
    );
}

export async function getServerSideProps() {
    await mongooseConnect();

    const products = await Product.find();
    return {
        props: {
            productlist: JSON.parse(JSON.stringify(products)),
        },
    };
}
