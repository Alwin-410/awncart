const { MongoClient } = require("mongodb");
const url = "mongodb://localhost:27017/";
const client = new MongoClient(url);

async function createUser() {
  try {
    await client.connect();

    const db = client.db("mydb");
    const collection = db.collection("sa");

    await collection.insertOne({ name: "alwin", age: 23 });

    console.log("1 Document Inserted");
  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }
}
createUser()
