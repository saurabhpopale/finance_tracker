import mongoose, { Document, Schema } from "mongoose";

export interface ITransaction extends Document {
    user: mongoose.Types.ObjectId;
    type: "income" | "expense";
    amount: number;
    category: string;
    description?: string;
    date: Date;
}

const transactionSchema = new Schema<ITransaction>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        type: {
            type: String,
            enum: ["income", "expense"],
            required: true
        },

        amount: {
            type: Number,
            required: true,
            min: 0
        },

        category: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            trim: true
        },

        date: {
            type: Date,
            required: true,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

const Transaction = mongoose.model<ITransaction>(
    "Transaction",
    transactionSchema
);

export default Transaction;