import mongoose, { Schema, model } from "mongoose";

const ticketSchema = new Schema({
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: String,
        required: true
    },
}, 
{
    timestamps: {
        createdAt: 'purchase_datetime', // Use `created_at` to store the created date
        updatedAt: false // and `updated_at` to store the last updated date
    }
})

const ticketModel = model('Ticket', ticketSchema);

export default ticketModel
