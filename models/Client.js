const mongoose = require('../config/dbconfig');
const User = require('./User');
const PaymentDetails = require('./PaymentDetails');

const ClientModel = User.discriminator('Client', 
    new mongoose.Schema({
        accountType: {
            type: String,
            enum: {
                values: [
                    'corporate',
                    'academic',
                    'individual'
                ],
                message: '{VALUE} is not a valid account type.'
            }
        },
        notificationPreference: {
            type: String,
            enum: {
                values: [
                    'text',
                    'email'
                ],
                message: '{VALUE} is not a valid preference.'
            }
        },
        phoneNumber: String,
        paymentDetails: PaymentDetails
    })
);

module.exports = ClientModel;