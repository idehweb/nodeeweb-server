// console.log('#model setting')

export default (mongoose) => {
    const SettingsSchema = new mongoose.Schema({
        title: {},
        siteName: {},
        description: {},
        messages: [],
        data: [],
        settings: {},
        siteActive: {type: Boolean, default: true},
        tax: {type: Boolean, default: true},
        taxAmount: Number,
        factore_shop_name: String,
        factore_shop_address: String,
        factore_shop_phoneNumber: String,
        factore_shop_faxNumber: String,
        factore_shop_postalCode: String,
        factore_shop_submitCode: String,
        factore_shop_internationalCode: String,
        defaultSmsGateway: String,
        defaultBankGateway: String,
        siteActiveMessage: String,
        logo: String,
        header_first: String,
        header_last: String,
        body_first: String,
        body_last: String,
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
        currency: {type: String, default: 'Toman'},
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
