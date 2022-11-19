// console.log('#model setting')

export default (mongoose) => {
    const TemplatesSchema = new mongoose.Schema({
        title: String,
        type: String,
        maxWidth: String,
        data: [],
        elements: [],
        classes: String,
        padding: String,
        backgroundColor: String,
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },


    });
    return TemplatesSchema;
};
