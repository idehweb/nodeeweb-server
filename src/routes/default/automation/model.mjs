// console.log('#model setting')
import bcrypt from 'bcrypt';

export default (mongoose)=>{
    const ModelSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        functions: [],
        title: {},
        trigger: String,
        status: {type: String, default: 'active'},
        admin: {type: mongoose.Schema.Types.ObjectId, ref: 'Admin'},
        createdAt: {type: Date, default: Date.now},
        updatedAt: {type: Date, default: Date.now},

    });
    return ModelSchema


};
