import { Router } from "express";
import { createTransaction,deleteTransaction, getTransaction, getTransactions, updateTransaction } from "../controllers/transaction.controllers.js";
import authMiddleware from "../middlewares/auth.js";


const transactionRouter = Router();

transactionRouter.post("/create", authMiddleware, createTransaction);
transactionRouter.get("/", authMiddleware, getTransactions);
transactionRouter.get("/:id", authMiddleware, getTransaction);
transactionRouter.put("/:id", authMiddleware, updateTransaction);
transactionRouter.delete("/:id", authMiddleware, deleteTransaction);

export default transactionRouter;