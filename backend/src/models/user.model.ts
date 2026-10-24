import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;

    isVerified: boolean;

    otpHash?: string;
    otpExpiresAt?: Date;
    otpAttempts: number;
    otpPurpose?: "register" | "reset";
}

const userSchema = new Schema<IUser>(
    {
        firstName: {
            type: String,
            required: true,
            trim: true
        },

        lastName: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        isVerified: {
            type: Boolean,
            default: false
        },

        otpHash: {
            type: String,
            select: false
        },

        otpExpiresAt: {
            type: Date,
            select: false
        },

        otpAttempts: {
            type: Number,
            default: 0,
            select: false
        },

        otpPurpose: {
            type: String,
            enum: ["register", "reset"],
            select: false
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;