require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const createAdmin = async()=>{
   try{
    await mongoose.connect(process.env.MONGO_URI);
    const existingAdmin = await User.findOne({ email:'admin@rh.com' });
    if(existingAdmin){
        console.log('Admin user already exists');
        return;
    }
    await User.create({
        name: 'Admin',
        email: 'admin@rh.com',
        password:'adel123',
        role:'admin',
    });
    console.log('Admin user created');
   }catch(error){
    console.error(error.message);
    process.exit(1);
   }finally{
    mongoose.connection.close();    
   };
}
createAdmin();   
