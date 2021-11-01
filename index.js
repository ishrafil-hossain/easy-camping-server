const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y6gag.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        // console.log('connect to database')
        const database = client.db('easyCamping');
        const offersCollection = database.collection('offers');
        const BookingCollection = database.collection('booking');

        // GET API 
        app.get('/offers', async (req, res) => {
            const cursor = offersCollection.find({});
            const offers = await cursor.toArray();
            res.send(offers);
        })

        // GET Single offer 
        app.get('/offers/:id', async (req, res) => {
            const id = req.params.id;
            console.log('i have gotten', id);
            const query = { _id: id };
            const offer = await offersCollection.findOne(query);
            res.json(offer);
        });

        // POST API 
        app.post('/offers', async (req, res) => {
            const offer = req.body;
            console.log('hitting the api', offer)

            const result = await offersCollection.insertOne(offer);
            console.log(result);
            res.json(result);
        });

        //booking tour
        app.post("/myBooking", async (req, res) => {
            console.log(req.body);
            const result = await BookingCollection.insertOne(req.body);
            res.send(result);
        });


        // add booking 
        app.post("/addBooking", async (req, res) => {
            // console.log(req.body);
            const result = await BookingCollection.insertOne(req.body)
            console.log(result);
            res.json(result);
        });

        // DELETE API 
        app.delete('/myBooking/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: id };
            const result = await BookingCollection.deleteOne(query);
            res.json(result);
        });


        // get my booking 
        app.get("/myBooking/:email", async (req, res) => {
            console.log(req.params.email);
            const result = await BookingCollection.find({ email: req.params.email }).toArray();
            // console.log(result);
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('this is server');
});

app.listen(port, () => {
    console.log('Listening port', port);
});