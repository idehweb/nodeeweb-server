// console.log('#model setting')

export default (mongoose) => {
    const SettingsSchema = new mongoose.Schema({
        title: {},
        siteName: {},
        description: {},
        data: [],
        settings: {},
        siteActive: {type: Boolean, default: true},
        siteActiveMessage: String,
        logo: String,
        ADMIN_ROUTE: String,
        ADMIN_URL: String,
        SHOP_URL: String,
        BASE_URL: String,
        ZIBAL_TOKEN: String,
        ZARINPAL_TOKEN: String,
        primaryColor: String,
        secondaryColor: String,
        textColor: String,
        bgColor: String,
        footerBgColor: String,
        createdAt: {type: Date, default: Date.now},
        updatedAt: {type: Date, default: Date.now},
        activeCategory: [{type: mongoose.Schema.Types.ObjectId, ref: "Category"}],
        dollarPrice: Number,
        derhamPrice: Number,
        sms_welcome: {},
        sms_register: {},
        sms_submitOrderNotPaying: {},
        sms_submitOrderSuccessPaying: {},
        sms_onSendProduct: {},
        sms_onGetProductByCustomer: {},
        sms_submitReview: {},
        sms_onCancel: {}


    });
    return SettingsSchema;

// module.exports = mongoose.model('User', UserSchema);

    // return mongoose.model('Settings', SettingsSchema);
    // export default mongoose.model('User', UserSchema);

    // return User

};
