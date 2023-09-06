import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req,res){
    const {method}=req;
    await mongooseConnect()
    await isAdminRequest(req,res)
    if (method==='GET'){
        if (req.query?.id){
            res.json(await Product.findOne({_id:req.query?.id}) )
        }else {
         
        
        res.json(await Product.find());
    }
    }
    if(method==='POST'){
        const {title,description,price,images,category,technicalSheet,isFeatured,isSolde,isPopular}=req.body;
       const productDoc=await  Product.create({
            title,description,price,images,category,technicalSheet,isFeatured,isSolde,isPopular})
        res.json(true);
    }
    if (method==='PUT'){
        const {title,description,price,images,category,technicalSheet,isFeatured,isSolde,isPopular,oldPrice,_id}=req.body;
        await Product.updateOne({_id},{title,description,price,images,category,technicalSheet,isFeatured,isSolde,isPopular,oldPrice});
        res.json(true);
    }
    if (method === 'DELETE') {
        if (req.query?.id) {
          await Product.deleteOne({_id:req.query?.id});
          res.json(true);
        }
    }
}