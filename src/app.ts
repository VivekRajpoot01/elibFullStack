import express from 'express'

const app = express()


app.get("/",(req,res,next)=>{
    res.json({"message":"Welcome to our elib apis"})
})

export default app;