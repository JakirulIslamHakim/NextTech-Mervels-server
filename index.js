const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// nextech-marvels EaoIzwx8ROWqC5Gu

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  "mongodb+srv://nextech-marvels:EaoIzwx8ROWqC5Gu@cluster0.5prtsfh.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const productsCollection = client.db("productsDB").collection("products");
    const AddCartProductsCollection = client
      .db("productsDB")
      .collection("addCart");
    const reviewCollection = client.db("productsDB").collection("review");

    app.get("/products/:brand", async (req, res) => {
      const brand = req.params.brand.toLowerCase();
      const query = { brand: brand };
      const result = await productsCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.findOne(query);
      res.send(result);
    });

    app.put("/product/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const product = req.body;
      const updateProduct = {
        $set: {
          name: product.name,
          image: product.image,
          price: product.price,
          rating: product.rating,
          productType: product.productType,
          brand: product.brand,
          description: product.description,
        },
      };
      const result = await productsCollection.updateOne(
        filter,
        updateProduct,
        options
      );
      res.send(result);
    });

    app.get("/myCart/:mail", async (req, res) => {
      const mail = req.params.mail;
      const query = { userEmail: mail };
      const cursor = await AddCartProductsCollection.find(query).toArray();
      res.send(cursor);
    });

    // app.get("/cart/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: id };
    //   const cursor = await AddCartProductsCollection.findOne(query);
    //   console.log(cursor);
    //   res.send(cursor);
    // });

    app.post("/addProduct", async (req, res) => {
      const product = req.body;
      const result = await productsCollection.insertOne(product);
      res.send(result);
    });

    app.post("/addCart", async (req, res) => {
      const addProduct = req.body;
      console.log(addProduct);
      const result = await AddCartProductsCollection.insertOne(addProduct);
      res.send(result);
    });

    app.delete("/cart/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: id };
      // console.log(query);
      const result = await AddCartProductsCollection.deleteOne(query);
      res.send(result);
      // console.log(result);
    });

    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("HEllO World");
});

app.listen(port, () => {
  console.log(`the server is running port ${port}`);
});
