import path from 'node:path';
import fs from 'node:fs';
import { Request,Response,NextFunction } from "express"
import cloudinary from "../config/cloudinary";
import createHttpError from 'http-errors';
import bookModel from './bookModel';
import { isGeneratorObject } from 'node:util/types';


const createBook = async(req:Request,res:Response,next:NextFunction)=>{
    
    const {title, genre} = req.body;

    



    
    console.log("files",req.files);

    const files = req.files as {[fieldname: string]: Express.Multer.File[]};
    const coverImageMemeType = files.coverImage[0].mimetype.split('/').at(-1);
    const fileName = files.coverImage[0].filename;
    const filepath = path.resolve(__dirname, '../../public/data/uploads',fileName);

    try{
        const uploadResult = await cloudinary.uploader.upload(filepath,{
            filename_override: fileName,
            folder: "book-covers",
            format: coverImageMemeType
        })
        const bookFileName = files.file[0].filename;
        const bookFilepath = path.resolve(__dirname, '../../public/data/uploads',bookFileName);
        const bookFileUploadResult = await cloudinary.uploader.upload(bookFilepath,{
            resource_type: 'raw',
            filename_override: bookFileName,
            folder: 'book-pdfs',
            format: 'pdf'
        })
        console.log("bookFileUploadResult",bookFileUploadResult);


        console.log("uploadResult", uploadResult);

        // @ts-ignore
        console.log("userId",req.userId)

        const newBook = await bookModel.create({
            title,
            genre,
            author: "67e18cb3097103d6de778932",
            coverImage: uploadResult.secure_url,
            file: bookFileUploadResult.secure_url
        })

        //delete temp file
        await fs.promises.unlink(filepath);
        await fs.promises.unlink(bookFilepath);

        res.status(201).json({id: newBook._id});
    }catch(err){
        console.log(err);
        return next(createHttpError(500,"Error while uploading the file"));
    }
};

export {createBook};

