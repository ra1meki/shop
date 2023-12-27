const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const objectId = require("mongodb").ObjectId;
      
const app = express();
app.use(express.static("public"));
app.use(express.json());
    
const mongoClient = new MongoClient("mongodb://127.0.0.1:27017/");
   
(async () => {
     try {
        await mongoClient.connect();
        app.locals.collection = mongoClient.db("productsdb").collection("products");
        app.listen(3000);
        console.log("Сервер ожидает подключения...");
    }catch(err) {
        return console.log(err);
    } 
})();
   
app.get("/api/products", async(req, res) => {
           
    const collection = req.app.locals.collection;
    try{
        const products = await collection.find({}).toArray();
        res.send(products);
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }  
});
app.get("/api/products/:id", async(req, res) => {
           
    const collection = req.app.locals.collection;
    try{
        const id = new objectId(req.params.id);
        const product = await collection.findOne({_id: id});
        if(product) res.send(product);
        else res.sendStatus(404);
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});
      
app.post("/api/products", async(req, res)=> {
          
    if(!req.body) return res.sendStatus(400);
          
    const productName = req.body.name;
    const productCost = req.body.cost;
    const product = {name: productName, cost: productCost};
          
    const collection = req.app.locals.collection;
       
    try{
        await collection.insertOne(product);
        res.send(product);
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});
       
app.delete("/api/products/:id", async(req, res)=>{
           
    const collection = req.app.locals.collection;
    try{
        const id = new objectId(req.params.id);
        const product = await collection.findOneAndDelete({_id: id});
        if(product) res.send(product);
        else res.sendStatus(404);
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});
      
app.put("/api/products", async(req, res)=>{
           
    if(!req.body) return res.sendStatus(400);
    const productName = req.body.name;
    const productCost = req.body.cost;
          
    const collection = req.app.locals.collection;
    try{
        const id = new objectId(req.body.id);
        const product = await collection.findOneAndUpdate({_id: id}, { $set: {cost: productCost, name: productName}},
         {returnDocument: "after" });
        if(product) res.send(product);
        else res.sendStatus(404);
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});
    
process.on("SIGINT", async() => {
       
    await mongoClient.close();
    console.log("Приложение завершило работу");
    process.exit();
});

