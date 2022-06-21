const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

// middleware:
const cors = require("cors");
app.use(cors());
app.use(express.json());

// pass:WRupGn3uhevWz9Ot;

// mongodB:

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wuipt.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const productsCollection = client.db("gym").collection("products");

    // get api endpoint to load all data:
    app.get("/products", async (req, res) => {
      const cursor = productsCollection.find({});
      const result = await cursor.limit(6).toArray();

      res.send(result);
    });
    // get api endpoint to load individual  data through passing their id:
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await productsCollection.findOne(query);
      res.send(product);
    });

    // update and decrease the quantity:
    app.put("/deliver/:id", async (req, res) => {
      const id = req.params.id;
      const newQuantity = req.body;
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          quantity: newQuantity.quantityUpdate,
        },
      };
      const result = await productsCollection.updateOne(
        query,
        updateDoc,
        options
      );
      res.send(result);
    });

    // update and increase the quantity:
    app.put("/restock/:id", async (req, res) => {
      const id = req.params.id;
      const selectedProduct = req.body;
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          quantity: selectedProduct.quantityIncrease,
        },
      };
      const result = await productsCollection.updateOne(
        query,
        updateDoc,
        options
      );
      res.send(result);
    });

    // delete a user:
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productsCollection.deleteOne(query);
      res.send(result);
    });

    // manageItem:
    app.get("/manageProducts", async (req, res) => {
      const cursor = productsCollection.find({});
      const result = await cursor.toArray();

      res.send(result);
    });
    // delete a user:
    app.delete("/manageProducts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productsCollection.deleteOne(query);
      res.send(result);
    });

    app.post("/addProduct", async (req, res) => {
      const product = req.body;
      const result = await productsCollection.insertOne(product);
      res.send(result);
      console.log(product);
    });

    app.get("/product/:email", async (req, res) => {
      const query = { email: req.params.email };
      const result = await productsCollection.findOne(query);
      res.send(result);
      // console.log(query);
    });
  } finally {
  }
}
// call the function:
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send({ success: "Horrah! Gym server is running" });
});

app.listen(port, () => {
  console.log(`This server is running on the port ${port}`);
});
