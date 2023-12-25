const express = require("express");
const fs = require("fs");

const app = express();
const jsonParser = express.json();

app.use(express.static(__dirname + "/public"));

app.get("/api/products", function (req, res) {

  let content = fs.readFileSync("products.json", "utf8");
  let products = JSON.parse(content);
  res.send(products);
});

app.get("/api/products/:id", function(req, res) {

  let id = req.params.id;
  let content = fs.readFileSync("products.json", "utf8");
  let products = JSON.parse(content);
  let product;

  for (let i = 0; i < products.length; i++) {
    if (products[i].id == id) {
      product = products[i];
      break;
    }
  }

  if (product) {
    res.send(product);
  } else {
    res.status(404).send("Product isn't found");
  }

});

app.post("/api/products", jsonParser, function (req, res) {
  
  if (!req.body) res.sendStatus(400);

  let productName = req.body.name;
  let productCost = req.body.cost;
  let product = {name: productName, cost: productCost};

  let data = fs.readFileSync("products.json", "utf8");
  let products = JSON.parse(data);

  let id = Math.max(...products.map((product) => product.id));
  
  if (Number.isFinite(id)) {
    product.id = id + 1;
  } else {
    product.id = 1;
  }
  
  products.push(product);

  data = JSON.stringify(products);
  fs.writeFileSync("products.json", data);
  res.send(product);
});

app.delete("/api/products/:id", function (req, res) {

  let id = req.params.id;
  let data = fs.readFileSync("products.json", "utf8");
  let products = JSON.parse(data);
  let index = -1;

  for (let i = 0; i < products.length; i++) {
    if (products[i].id == id) {
      index = i;
      break;
    }
  }

  if (index > -1) {
    let product = products.splice(index, 1)[0];
    
    for (let i = 0; i < products.length; i++) {
      products[i].id = i + 1;
    }
    
    let data = JSON.stringify(products);
    fs.writeFileSync("products.json", data);
    res.send(product);
  } 
  else {
    res.status(404).send("Product isn't found by ID");
  }
});

app.put("/api/products", jsonParser, function (req, res) {

  if (!req.body) res.status(400).send("Failed to change");
  
  let productId = req.body.id;
  let productName = req.body.name;
  let productCost = req.body.cost;

  let data = fs.readFileSync("products.json", "utf8");
  let products = JSON.parse(data);
  let product;

  for (let i = 0; i < products.length; i++) {
    if (products[i].id == productId) {
      product = products[i];
      break;
    }
  }

  if (product) {
    product.cost = productCost;
    product.name = productName;
    let data = JSON.stringify(products);
    fs.writeFileSync("products.json", data);
    res.send(product);
  } 
  else {
    res.status(404).send(product);
  }
});

app.listen(3000, function() {
  console.log("Server started");
});

