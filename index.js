const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient } = require('mongodb');
const objectId = require('mongodb').ObjectId;
const app = express();
const port =process.env.PORT|| 5000;


app.use(cors());
app.use(express.json());


    
    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ez3jy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log(uri);
    async function run() {
        try {
          await client.connect();
          const database = client.db("smart-watch");
          const products = database.collection("products");
          const bookings = database.collection("bookings");
          const reviews = database.collection("Revews");
          const users = database.collection("users");
          
          
          //product data getting===============1
        app.get("/products",async(req,res)=>{
            const curser= products.find({});
            const result=await curser.toArray();
            res.send(result)
         })

         ///single product ditails gettint
         app.get("/product/:id",async(req,res)=>{
             const id= req.params.id;
             const filter= {_id:objectId(id)}
             const result = await products.findOne(filter)
             res.send(result)
         })
          //product adding  by insert ======================2
          app.post("/addproduct",async(req,res)=>{
             const product=req.body;
            const result=await products.insertOne(product)
            console.log('add product',result);
            res.send(result)
         })
          
        // product buying from single product page form ===============1
        app.post("/buyproduct",async(req,res)=>{
            const curser=req.body;
            const result=await bookings.insertOne(curser);
            res.send(result);
        })
        //my orders getting by email
        app.get("/myorders",async(req,res)=>{
            const email= req.query.email;
            const query= {email:email}
            const orders= bookings.find(query);
            const result= await orders.toArray();
            res.send(result)
            
        })

        // Customer Revew adding by insert  ===============1
        app.post("/review",async(req,res)=>{
            const curser=req.body;
            const result=await reviews.insertOne(curser);
            res.send(result);
        })
        // Customer Revew getting by get method  ===============1
        app.get("/reviews",async(req,res)=>{
            const curser= reviews.find({})
            const result= await curser.toArray();
            res.send(result);
        })

        
        //users api data insert by post=======================1
        app.post("/users",async(req,res)=>{
            const curser=req.body;
            const result=await users.insertOne(curser);
            res.send(result);
        })

        ///user cheeking and not duplecate====================4
        app.put("/users",async(req,res)=>{
            const user=req.body;
            const filter={email:user.email};
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result=await users.updateOne(filter,updateDoc,options);
            res.send(result);
        })
     
        //all users api data getting ===========================2
        app.get("/users",async(req,res)=>{
            const curser= users.find({});
            const result=await curser.toArray();
            res.send(result);
        })


        //cheking admin with email==========================3
        app.get("/users/:email",async(req,res)=>{
            const email= req.params.email;
            const query= {email:email}
            const user=await users.findOne(query);
            console.log(user);
            let isAdmin=false;
            if(user?.role==='admin'){
                isAdmin=true;
            }
            res.send({admin:isAdmin});
        })

        ///user make Admin=============================5
        app.put("/users/admin",async(req,res)=>{
            const user=req.body;
            const filter={email:user.email};
            const updateDoc = { $set: {role:'admin'} };
            const result=await users.updateOne(filter,updateDoc);
            res.send(result);
        })
        // manege all order api data getting ==================2
        app.get("/manegeorder",async(req,res)=>{
            const curser= bookings.find({});
            const result=await curser.toArray();
            res.send(result);
        })
        //manege orders update put
        app.put("/manegeorder/:id",async(req,res)=>{
            const id = req.params.id;
            const filter={_id:objectId(id)}
            const order=req.body;
            const curser={
                title:order.title,
                name:order.name,
                price:order.price,
                email:order.email,
                date:order.date,
                number:order.number,
                address:order.address,
                date:order.date,
                status:order.status,
            };
            const options = { upsert: true };
            const updateDoc = { $set: curser };
            const result=await bookings.updateOne(filter,updateDoc,options);
            res.send(result);
        })
        //products order delete function
        app.delete('/myorders/:id',async(req,res)=>{
            const id=req.params.id;
            const filter={_id:objectId(id)};
            const result= await bookings.deleteOne(filter);
            res.send(result)
        }) 
        //products  delete function by admin
        app.delete('/manegproduct/:id',async(req,res)=>{
            const id=req.params.id;
            const filter={_id:objectId(id)};
            const result= await products.deleteOne(filter);
            res.send(result)
        }) 

        } finally {
        //   await client.close();
        }
      }
      run().catch(console.dir);


    app.get('/',(req,res)=>{
        res.send('i am from server')
    })

    app.listen(port,()=>{
        console.log('server ready to port',port);
    })

