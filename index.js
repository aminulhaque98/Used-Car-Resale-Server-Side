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
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const uesdCarResaleProducts = client.db('nationWideCarResale').collection('products');

        const uesdCarResaleCollection = client.db('nationWideCarResale').collection('categories');

        
        app.get('/categories', async (req, res) => {
            const query = {};
            const options = await uesdCarResaleCollection.find(query).toArray();
            res.send(options);
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