const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cebya.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("TOUR-BD");
    const packageCollections = database.collection("Packages");
    const BookedPackageCollections = database.collection("BookedPackage");

    //get all packages
    app.get("/packages", async (req, res) => {
      const cursor = packageCollections.find({});
      const result = await cursor.toArray();
      //   console.log(result);
      res.send(result);
    });

    //get specific package
    app.get("/packages/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await packageCollections.findOne(query);
      res.json(result);
    });
    //add packages
    app.post("/packages", async (req, res) => {
      const data = req.body;
      const result = await packageCollections.insertOne(data);
      res.json(result);
    });

    //get all Booked packages
    app.get("/bookedPackage", async (req, res) => {
      const result = await BookedPackageCollections.find({}).toArray();
      res.send(result);
    });
    //get current user packages by email
    app.get("/bookedPackage/:email", async (req, res) => {
      const email = req.params.email;
      // console.log("email", email);
      const query = { email: email };
      const result = await BookedPackageCollections.find(query).toArray();
      res.send(result);
    });
    //get current user by using id
    /*   app.put("/bookedPackage/:id", async (req, res) => {
      // const id = req.query.id;
      // console.log(req.id);
      // const query = { _id: ObjectId(id) };
      // const result = await BookedPackageCollections.find(query).toArray();
      // res.send(result);
    }); */
    //add booked Package
    app.post("/bookedPackage", async (req, res) => {
      const doc = req.body;
      const result = await BookedPackageCollections.insertOne(doc);
      res.send(result);
    });
    //delete item from booked packages
    app.delete("/bookedPackage/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await BookedPackageCollections.deleteOne(query);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);
//home page
app.get("/", (req, res) => {
  res.send("You Tour bd server is running");
});
app.listen(port, () => {
  console.log(`running on port ${port}`);
});
