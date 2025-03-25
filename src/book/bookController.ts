import path from 'node:path';
import { Request,Response,NextFunction } from "express"
import cloudinary from "../config/cloudinary";


const createBook = async(req:Request,res:Response,next:NextFunction)=>{
    res.json({})


    console.log("files",req.files);

    const files = req.files as {[fieldname: string]: Express.Multer.File[]};
    const coverImageMemeType = files.coverImage[0].mimetype.split('/').at(-1);
    const fileName = files.coverImage[0].filename;
    const filepath = path.resolve(__dirname, '../../public/data/uploads',fileName);

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
};

export {createBook};

