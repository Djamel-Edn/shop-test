import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "./auth/[...nextauth]";
import { Order } from "@/models/Order";

export default async function handle(req, res) {
  await isAdminRequest(req, res);

  const { method } = req;
  await mongooseConnect();
  
  if (method === 'DELETE') {
    const id = req.query.id; // Utilisez req.query.id pour obtenir l'ID de la requête
    try {
      await Order.deleteOne({ _id: id });
      res.json('ok');
    } catch (error) {
      console.error('Error deleting order:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  if (method==='GET'){
    res.json(await Order.find());
  }
}
