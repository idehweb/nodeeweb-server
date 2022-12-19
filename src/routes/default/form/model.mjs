console.log('#model product')
export default (mongoose)=>{
    const FormSchema = new mongoose.Schema({
        description: {},
        title: {},
        button: {
            type: String,
            default: "send",
        },
        createdAt: {type: Date, default: new Date()},
        updatedAt: {type: Date, default: new Date()},
        active: {type: Boolean, default: true},
        elements: [],
        responses:[],
        view:{type: Number, default: 1},

    });
    return FormSchema

};
