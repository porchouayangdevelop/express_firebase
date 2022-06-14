const {
    mongoose,
    Schema
} = require('mongoose');

const ProviderSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Provider', ProviderSchema);