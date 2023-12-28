const express = require("express");
const mongoose = require("mongoose");
const app = express();
const productRouter = require("./routes/productRouter.js");
const homeRouter = require("./routes/homeRouter.js");
  
 
app.use(express.urlencoded({ extended: false }));
  
app.use("/products", productRouter);;
app.use("/", homeRouter);
  
app.use(function (req, res) {
    res.status(404).send("Not Found")
});
 
async function main() {
 
    try{
        await mongoose.connect("mongodb://127.0.0.1:27017/productsb");
        app.listen(3000);
        console.log("Сервер ожидает подключения...");
    }
    catch(err) {
        return console.log(err);
    }
}
main();
 
process.on("SIGINT", async() => {
      
    await mongoose.disconnect();
    console.log("Приложение завершило работу");
    process.exit();
});