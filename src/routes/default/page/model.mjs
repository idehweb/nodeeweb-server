// console.log('#model setting')

export default (mongoose)=>{
    const PageSchema = new mongoose.Schema({
        createdAt: {type: Date, default: Date.now},
        updatedAt: {type: Date, default: Date.now},
        active: {type: Boolean, default: true},
        data: {},
        description: {},
        excerpt: {},
        views: [],
        slug: String,
        title: {},
        elements: {},
        kind: {type: String, default: 'page'},
        classes: {type: String, default: ''},
        backgroundColor: String,
        path: String,
        maxWidth: {type: String, default: '100%'},
        status: {type: String, default: 'processing'},
        photos: [],
        thumbnail: String,

    });
    return PageSchema

};
