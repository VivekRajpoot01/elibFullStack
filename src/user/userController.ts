import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import {config} from "../config/config"
import { User } from "./userTypes";
import { access } from "fs";

const createUser = async(req:Request,res:Response,next:NextFunction)=>{

    const {name,email,password} = req.body;
    //validation
    if(!name || !email || !password){
        const error = createHttpError(400,"All fields are required");
        return next(error);
    }

    //database call

    try{
        const user = await userModel.findOne({email});

    if(user){
        const error = createHttpError(400,"User Already exists");
        return next(error);
    }
    }catch(err){
        return next(createHttpError(500,"Error while getting user"))
    }
    

    //password -> hashed
    const hashedPassword = await bcrypt.hash(password,10);

    let newUser: User;
    try{
        newUser = await userModel.create({
            name,
            email,
            password: hashedPassword,
        });
    }catch(err){
        return next(createHttpError(500,"Error while creating user"))
    }

    try{
        //token generation jwt
        const token = sign({sub:newUser._id},config.jwtSecret as string, {expiresIn: '7d'})
        //process
        //response

        res.status(201).json({accessTokesn: token});

    }catch(err){
        return next(createHttpError(500,"Error while signing jwt token"))
    }
};

const loginUser = async(req:Request,res:Response,next:NextFunction)=>{

    const {email, password} = req.body;

    if(!email || !password){
        return next(createHttpError(400,"All fields are required"));
    }

    try{
        const user = await userModel.findOne({email});

        if(!user){
            return next(createHttpError(404,"User not found"))
        }

        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            return next(createHttpError(400,"Username or password is incorrect"));
        }


        try{
            const token = sign({sub:user._id},config.jwtSecret as string, {expiresIn: '7d'})


            res.json({accessToken: token})
        }catch(err){
            return next(createHttpError(400,"User not exist"));
        }
        


    }catch(err){
        return next(createHttpError(400,"User Not Found"))
    }



    
}

export {createUser, loginUser};