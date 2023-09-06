import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/category";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req,res) {
    
    const {method}=req;
    await mongooseConnect()
    await isAdminRequest(req,res)
    if (method === 'GET') {
        const allCategories = await Category.find();
        const categoriesWithEmptyParent = allCategories.filter(category => !category.parent );
        const categoriesWithParent = allCategories.filter(category => category.parent);
        res.json({
            allCategories:allCategories,
            categoriesWithEmptyParent: categoriesWithEmptyParent,
            categoriesWithParent: categoriesWithParent,
            
        });
    }


    if (method === 'POST'){
        const { name, parentCategory,imageUrl } = req.body;
    
        let categoryDoc;
        if (parentCategory) {
            categoryDoc = await Category.create({
                name,
                parent: parentCategory || undefined,
                
                imageUrl
            });
        } else {
            categoryDoc = await Category.create({
                name,
                
                imageUrl
            });
        }
        res.json(categoryDoc);
    }
    if (method === "PUT") {
        const { name, parentCategory, imageUrl, _id } = req.body;
    
        const updatedData = {
            name,
            parent: parentCategory === '' ? null : parentCategory,
            
            imageUrl,
        };
    
        const categoryDoc = await Category.updateOne({_id},updatedData);
        res.json(categoryDoc);
    }
    

    if (method === 'DELETE'){
        const {id} = req.query;
        const allCategories = await Category.find();
        const categoriesWithParent = allCategories.filter(category => category.parent);
        if (id){
            {categoriesWithParent.map(async category =>{
                if (category.parent.toString()===id){
                    await Category.deleteOne({_id:category._id});
                }
            })
            }
            {allCategories.map( async category=>{
                if (category._id.toString()===id){
                   await  Category.deleteOne({_id:id});
                }
            }
            )}
              res.json('ok')
        }

    }
}