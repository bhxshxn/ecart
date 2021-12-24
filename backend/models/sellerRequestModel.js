import mongoose from 'mongoose';

const sellerRequestSchema = new mongoose.Schema(
    {
        productType: {
            type: String,
            required: true
        },
        reason: {
            type: String,
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
    },
    {
        timestamps: true,
    }
);
const sellerRequest = mongoose.model('sellerRequest', sellerRequestSchema);
export default sellerRequest;