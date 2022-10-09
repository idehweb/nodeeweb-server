// console.log('#model setting')

export default (mongoose) => {
    const PluginsSchema = new mongoose.Schema({
        title: {},
        active: {type: Boolean, default: true},
        path: String,
        createdAt: {type: Date, default: Date.now},
        updatedAt: {type: Date, default: Date.now},

    });
    return PluginsSchema;

// module.exports = mongoose.model('User', UserSchema);

    // return mongoose.model('Settings', SettingsSchema);
    // export default mongoose.model('User', UserSchema);

    // return User

};
