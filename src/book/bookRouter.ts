import express from "express";
import { createBook } from "./bookController";

const userRouter = express.Router();

//routes
userRouter.post("/",createBook);



export default userRouter;