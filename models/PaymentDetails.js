const mongoose = require('../config/dbconfig');

const PaymentDetails = new mongoose.Schema({
    accountBalance: Number,
    cardNumHash: String,
    lastFourCardNum: String,
    cardName: String,
    creditCardType: {
        type: String,
        enum: {
            values: [
                'debit',
                'visa',
                'mastercard'
            ],
            message: '{VALUE} is not a valid card type.'
        }
    },
    secNumHash: String,
    expiry: String
});

module.exports = PaymentDetails;