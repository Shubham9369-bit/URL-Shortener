const express=require('express');
const mongoose=require('mongoose');
const urlRoutes=require('./routes/Url');

const app=express();
app.use(express.json());

//MongoDB Connect
mongoose.connect('mongodb+srv://Shubham81:Shubham81@cluster0.4wmmwjf.mongodb.net/?appName=Cluster0')
    
.then(()=> console.log("MongoDB Connected"))
.catch(err=> console.log("Error",err));

app.use('/',urlRoutes);
app.listen(5000,()=>console.log('Server is listening on port 5000'));