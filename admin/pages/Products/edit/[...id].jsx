import Layout from "@/components/layout"
import axios from "axios";
import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import ProductForm from "@/components/ProductForm";

export default function EditProductPage(){
    const [productInfo,setproductInfo]=useState(null)
    const router=useRouter();
    const {id}=router.query;
    useEffect(()=>{
        if(!id){
            return;
        }
        axios.get('/api/Products?id='+id).then(response=>{
            setproductInfo(response.data)
        })
    },[id]);
    return(
        <Layout>
            <h1 className="text-green-400 text-2xl mb-2">Edit Product</h1>
        {productInfo && (

        <ProductForm {...productInfo}/>
        )}
        </Layout>
    )
}