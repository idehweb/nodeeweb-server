console.log('#model attributes')
export default (mongoose)=>{
    const AttributesSchema = new mongoose.Schema({
        name: {},
        slug: {
            type: String,
            required: false,
            trim: true
        },
        type: {
            type: String,
            default: "normal"
        },
        image: String,
        useInFilter: {
            type: Boolean,
            default: true
        },
        data: {},
        metatitle: {},
        metadescription: {},
        description: {},
        values:[],
        // parent:{type: mongoose.Schema.Types.ObjectId, ref: 'Attributes'} //category_id
    });
    return AttributesSchema

};
