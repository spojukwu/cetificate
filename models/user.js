const mongoose = require('mongoose');  


const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true, unique: true },  
    email: { type: String, required: true, unique: true },  
  
},{
    timestamps: true 
});  


const Users = mongoose.model('User', userSchema);  
module.exports = Users; 