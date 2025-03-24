import express, {Request,Response,NextFunction} from 'express'
import createHttpError ,{ HttpError } from 'http-errors'
import {config} from "./config/config"
const app = express()


app.get("/",(req,res,next)=>{

    
    // const error = createHttpError(400, "something went wrong")
    // throw error;

    res.json({"message":"Welcome to our elib apis"})

})

//global error handler



 /* 
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;
  
    return res.status(statusCode).json({
      message: err.message,
      errorStack: config.env === 'development' ? err.stack || '' : '',
    })
  });
*/
export default app;