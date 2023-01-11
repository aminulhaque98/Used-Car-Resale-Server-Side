const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000
require('dotenv').config();
const app = express();

//middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tg7jnth.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const uesdCarResaleProducts = client.db('nationWideCarResale').collection('products');

        const uesdCarResaleCollection = client.db('nationWideCarResale').collection('categories');

        const uesdCarResaleBooking = client.db('nationWideCarResale').collection('bookings');
        const uesdCarResaleUsers = client.db('nationWideCarResale').collection('users');


        app.get('/products', async (req, res) => {
            const query = {};
            const products = await uesdCarResaleProducts.find(query).toArray();
            res.send(products);
        });

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { category_id: id };
            const product = await uesdCarResaleProducts.find(query).toArray();
            res.send(product);

        });

        app.get('/categories', async (req, res) => {
            const query = {};
            const options = await uesdCarResaleCollection.find(query).toArray();
            res.send(options);
        });

        app.post('/bookings', async(req,res)=>{
            const book =req.body;
            const result = await uesdCarResaleBooking.insertOne(book);
            res.send(result);
        });

        app.get('/bookings', async (req,res)=>{
            const email=req.query.email;
            const query = {email:email};
            const bookings = await uesdCarResaleBooking.find(query).toArray();
            res.send(bookings);
        });

app.post('/users',async(req,res)=>{
    const user=req.body;
    const result = await uesdCarResaleUsers.insertOne(user);
    res.send(result);
})

    }
    finally {

    }

}
run().catch(console.log);



app.get('/', async (req, res) => {
    res.send('products resale server is running')
})

app.listen(port, () => console.log(`Products resale portal is running ${port}`))