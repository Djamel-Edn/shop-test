import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";

export default async function handle(req,res){
    const {method}=req;
    await mongooseConnect()
    if (method==='PUT'){
        const {title,description,price,images,category,properties,technicalSheet,isFeatured,isSolde,isPopular,Quantity,_id}=req.body;
        await Product.updateOne({_id},{title,description,price,images,category,properties,technicalSheet,isFeatured,isSolde,isPopular,Quantity});
        res.json(true);
    }
    
}