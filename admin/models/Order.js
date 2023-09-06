import  {Schema, model, models} from 'mongoose'

const OrderSchema = new Schema({
    name: String,
    adress: String,
    number: String,
    email: String,
    city: String,
    postal: String,
    products: [{type:Object}], 
    paymentMethod:String,
    orderDate: { type: Date, default: Date.now }, 
    
});

export const Order=models?.Order || model('Order',OrderSchema);