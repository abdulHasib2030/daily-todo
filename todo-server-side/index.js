require('dotenv').config()
const express = require('express');
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express()
app.use(cors({
    origin: [
       'http://localhost:5173', 
    ],
    credentials: true,
}))

const port = process.env.PORT || 5000
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.kpzks.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const userCollection = client.db('scic-todo').collection('users')
    const todoCollection = client.db('scic-todo').collection('todo')

    // -----------user first regist data store databas ------------------//
    app.post('/signup', async(req, res)=>{
        const data = req.body;
        console.log(data);
        const findEmail = await userCollection.findOne({email:data.email})
        if(!findEmail){
          const result = await userCollection.insertOne(data)
          res.send(result)
        }
        else{
          res.send({msg: "Already user add"})
        }
    })

  // -----------user add task store databas ------------------//
    app.post('/tasks', async(req, res)=>{
      const data = req.body;
      const result = await todoCollection.insertOne(data)
      res.send(result)
    })
  // -----------user view task  ------------------//
app.get('/tasks', async(req, res)=>{
  const result = await todoCollection.find().toArray()
  res.send(result)
})

   

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, ()=>{console.log("Port Running", port);})
