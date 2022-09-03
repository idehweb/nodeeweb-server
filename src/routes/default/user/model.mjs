// console.log('#model product')
import bcrypt from 'bcrypt';

export default (mongoose)=>{
    // if(mongoose)
    const UserSchema = new mongoose.Schema({
        email: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },
        username: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },
        nickname: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: false,
        },
        token: {
            type: String,
            required: false,
        },
        createdAt: {type: Date, default: Date.now},
        updatedAt: {type: Date, default: Date.now},
        active: {type: Boolean, default: true},

    });


//authenticate input against database
    UserSchema.statics.authenticate = function (username, password, callback) {
        const User = mongoose.model("User", UserSchema);
        User.findOne({ username: username })
            .exec(function (err, user) {
                if (err) {
                    return callback(err)
                } else if (!user) {
                    let err = new Error('User not found.');
                    err.status = 401;
                    return callback(err);
                }
                bcrypt.compare(password, user.password, function (err, result) {
                    if (result === true) {
                        return callback(null, user);
                    } else {
                        return callback();
                    }
                })
            });
    };

//hashing a password before saving it to the database
    UserSchema.pre('save', function (next) {
        let user = this;
        console.log('presave');
        bcrypt.hash(user.password, 10, function (err, hash) {
            if (err) {
                return next(err);
            }
            console.log('aftersave');
            user.password = hash;
            next();
        })
    });


// module.exports = mongoose.model('User', UserSchema);

    // return mongoose.model('User', UserSchema);
    return UserSchema;
    // export default mongoose.model('User', UserSchema);

    // return User

};
