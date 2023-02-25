// console.log('#model setting')
import bcrypt from 'bcrypt';

export default (mongoose)=>{
    const ModelSchema = new mongoose.Schema({
        title: String,
        description: String,
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
        data: {},
        history: {},
        task: {},
        customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" }, //category_id
        comment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" }, //category_id
        user: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" }, //category_id
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, //category_id
        order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" }, //category_id
        transaction: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }, //category_id
        settings: { type: mongoose.Schema.Types.ObjectId, ref: "Settings" }, //category_id
        sms: { type: mongoose.Schema.Types.ObjectId, ref: "Sms" } //category_id

    });
    return ModelSchema


};
