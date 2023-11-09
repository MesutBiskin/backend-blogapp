import express from "express";
import cors from "cors";
import { MongoClient ,ObjectId} from "mongodb";

import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGO_URI);
const db = client.db("blogapp-c12");
const blogPosts = db.collection("blog-posts");
const userDb = db.collection("users");

client.connect();
console.log("Connected to Mongo");

//GET ALL BLOG POSTS

app.get("/", async (req, res) => {
  const allPosts = await blogPosts.find().toArray();
  console.log("allPosts -> ", allPosts);
  res.send(allPosts);
});

// CREATE BLOG POSTS

app.post("/", async (req, res) => {
  const newBlogPost = { title: req.body.title, content: req.body.content };
  await blogPosts.insertOne(newBlogPost);

  const allPosts = await blogPosts.find().toArray();
  res.send(allPosts);
});
//sign up
app.post("/signup", async (req, res) => {
  const userAdded = await userDb.insertOne({
    email: req.body.email,
    password: req.body.password,
  });
  console.log("user added to db ->", userAdded);
  res.send(userAdded);
});

//log in
app.post("/login", (req, res) => {
  console.log(req.body);
  const userFound = userDb.findOne({ email: req.body.email });

  res.send(userFound);
});

//delete one blog post

app.delete("/", async (req, res) => {
	//req.query 
	//console.log(req.query);
	console.log(req.params);

	//const _id = new ObjectId(req.query._id)
	const _id = new ObjectId(req.params._id)
  // 1. GET ITEM FROM REQUEST
  // 2.GETITEM FROM ITEM
  // 3. WE PASS ID INTO findOneAndDelete
  const itemDeleted = await blogPosts.findOneAndDelete({_id: _id})
	res.send(itemDeleted)
})

const port = parseInt(process.env.PORT) || 8080;
app.listen(port, () => console.log("Api listening on port 8080 😎"));
