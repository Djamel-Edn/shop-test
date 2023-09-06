import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";

export default async function handler(req,res){
  
        await mongooseConnect()
        const {name,adress,number,email,city,postal,products,paymentMethod}=req.body;
        const list =JSON.parse(products)
        
        try {
             const Doc =await Order.create({
                name,adress,number,email,city,postal,products:list,paymentMethod
            });
            res.status(200).json(Doc); 
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred while saving the order.' });
          }
        
    



}