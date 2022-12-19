// console.log('#model setting')
import bcrypt from 'bcrypt';

export default (mongoose)=>{

    const CustomerSchema = new mongoose.Schema({
        email: {
            type: String,
            required: false,
            trim: true
        },
        phoneNumber: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },
        nickname: {
            type: String
        },
        firstName: String,
        lastName: String,
        birthday: String,
        birthdate: { type: Date},
        internationalCode: String,
        sex: String,
        source:  { type: String, default: "WEBSITE"},
        bankData: {},
        data: {},
        type: {
            type: String,
            required: false,
            default: 'user'
        },
        contacts: [{ _id: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" } }],
        wishlist: [{ _id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" } }],
        customerGroup: [{ type: mongoose.Schema.Types.ObjectId, ref: "CustomerGroup" }],
        password: String,
        age: { type: Number },
        whatsapp: { type: Boolean, default: false },
        active: { type: Boolean, default: true },
        activationCode: Number,
        tokens: [{ token: String, os: String }],
        notificationTokens: [{ token: String, updatedAt: { type: Date, default: Date.now } }],
        credit: { type: Number, default: 0 },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
        score: { type: Number, default: 0 },
        invitationCode: Number,
        invitation_list: [{
            customer_id: String
        }],
        photos: [{
            name: String,
            url: String
        }],
        address: []
    });

//authenticate input against database
    CustomerSchema.statics.authenticate = function(phoneNumber, password, callback) {
        const Customer = mongoose.model("Customer", CustomerSchema);
        Customer.findOne({ phoneNumber: phoneNumber }, "photos , nickname , firstName , lastName , email , password , tokens  , phoneNumber , address , authCustomerWithPassword , internationalCode").lean()
            .exec(function(err, user) {
                if (err) {
                    return callback(err);
                } else if (!user) {
                    let err = new Error("User not found.");
                    err.status = 401;
                    return callback(err);
                }
                bcrypt.compare(password, user.password, function(err, result) {
                    if (result === true) {
                        delete user.password;
                        // var token='';
                        if (user.tokens && user.tokens.length) {
                            user.token = user.tokens[user.tokens.length - 1].token;
                        }
                        delete user.tokens;

                        return callback(null, user);
                    } else {
                        return callback();
                    }
                });
            });
    };

    return CustomerSchema
// module.exports = mongoose.model('User', UserSchema);

    // return mongoose.model('Settings', SettingsSchema);
    // export default mongoose.model('User', UserSchema);

    // return User

};
