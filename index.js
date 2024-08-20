const express=require("express");
const cors=require("cors");
const { auth } = require("express-oauth2-jwt-bearer");
const axios =require("axios");
const userRouter=require("./routes/userRouter")
const bodyParser = require("body-parser");
const Port=process.env.Port||4444;
const env = require("dotenv");
env.config();

const app=express();
app.use(cors());
app.use(bodyParser.json());
app.use("/api",userRouter);

const verifyJwt = auth({
  audience: process.env.audience,
  issuerBaseURL: process.env.issuerURI,
  tokenSigningAlg: "RS256",
});

app.use(verifyJwt);

app.get("/",(req,res)=>{
    console.log("hello")
})

app.get("/active",(req,res)=>{
    res.send("active");
})
app.listen(Port,()=>{
    console.log(`Server is running on ${Port}`)
})