dotenv = require("dotenv")
const mongoose = require ("mongoose")

const connectToDatabase = async()=>{
    mongoose.connect(`${process.env.MONGODB_URL}`)
    .then(()=>{
        console.log("mongoDB connected!")
    })
}
module.exports = connectToDatabase
