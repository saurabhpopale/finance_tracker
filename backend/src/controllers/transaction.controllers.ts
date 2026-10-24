import { Response } from "express";

import Transaction from "../models/transaction.model.js";
import { AuthRequest } from "../types/auth.js";

export const createTransaction = async (req: AuthRequest,res: Response): Promise<void> => {
    try {
        if (!req.userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized"
            });

            return;
        }

        const {
            type,
            amount,
            category,
            description,
            date
        } = req.body;

        if (!type || !amount || !category) {
            res.status(400).json({
                success: false,
                message: "Type, amount and category are required"
            });

            return;
        }

        if (
            type !== "income" &&
            type !== "expense"
        ) {
            res.status(400).json({
                success: false,
                message: "Type must be income or expense"
            });

            return;
        }

        const transaction = await Transaction.create({
            user: req.userId,
            type,
            amount,
            category,
            description,
            date: date || new Date()
        });

        res.status(201).json({
            success: true,
            message: "Transaction created successfully",
            transaction
        });

    } catch (error) {
        console.error(
            "Create transaction error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


export const getTransactions = async (req: AuthRequest,res: Response): Promise<void> => {
    try {
        if (!req.userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized"
            });

            return;
        }

        const transactions = await Transaction
            .find({
                user: req.userId
            })
            .sort({
                date: -1
            });

        res.status(200).json({
            success: true,
            transactions
        });

    } catch (error) {
        console.error(
            "Get transactions error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


export const getTransaction = async (req: AuthRequest,res: Response): Promise<void> => {
    try {
        if (!req.userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized"
            });

            return;
        }

        const transaction = await Transaction.findOne({
            _id: req.params.id,
            user: req.userId
        });

        if (!transaction) {
            res.status(404).json({
                success: false,
                message: "Transaction not found"
            });

            return;
        }

        res.status(200).json({
            success: true,
            transaction
        });

    } catch (error) {
        console.error(
            "Get transaction error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const updateTransaction = async (req: AuthRequest,res: Response): Promise<void> => {
    try {
        if (!req.userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized"
            });

            return;
        }

        const {
            type,
            amount,
            category,
            description,
            date
        } = req.body;

        const transaction = await Transaction.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.userId
            },
            {
                type,
                amount,
                category,
                description,
                date
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!transaction) {
            res.status(404).json({
                success: false,
                message: "Transaction not found"
            });

            return;
        }

        res.status(200).json({
            success: true,
            message: "Transaction updated successfully",
            transaction
        });

    } catch (error) {
        console.error(
            "Update transaction error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


export const deleteTransaction = async (req: AuthRequest,res: Response): Promise<void> => {
    try {
        if (!req.userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized"
            });

            return;
        }

        const transaction =
            await Transaction.findOneAndDelete({
                _id: req.params.id,
                user: req.userId
            });

        if (!transaction) {
            res.status(404).json({
                success: false,
                message: "Transaction not found"
            });

            return;
        }

        res.status(200).json({
            success: true,
            message: "Transaction deleted successfully"
        });

    } catch (error) {
        console.error(
            "Delete transaction error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};