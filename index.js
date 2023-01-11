const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000
require('dotenv').config();
const app = express();

//middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tg7jnth.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send('unauthorized access');
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN, function (error, decoded) {
        if (error) {
            return res.status(403).send({ message: 'forbideden access' })
        }
        req.decoded = decoded;
        next();
    })
}


async function run() {
    try {
        const carResaleProductsCollection = client.db('nationWideCarResale').collection('products');

        const carResaleCategoryCollection = client.db('nationWideCarResale').collection('categories');

        const carResaleBookingCollection = client.db('nationWideCarResale').collection('bookings');
        const carResaleUsersCollection = client.db('nationWideCarResale').collection('users');


        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await carResaleProductsCollection.insertOne(product);
            res.send(result);
            console.log(result)
        });


        app.get('/products', async (req, res) => {
            const query = {};
            const products = await carResaleProductsCollection.find(query).toArray();
            res.send(products);
        });


        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { category_id: id };
            const product = await carResaleProductsCollection.find(query).toArray();
            res.send(product);

        });

        app.get('/categories', async (req, res) => {
            const query = {};
            const options = await carResaleCategoryCollection.find(query).toArray();
            res.send(options);
        });

        app.post('/bookings', async (req, res) => {
            const book = req.body;
            const result = await carResaleBookingCollection.insertOne(book);
            res.send(result);
        });

        app.get('/bookings', verifyJWT, async (req, res) => {
            const email = req.query.email;
            const decodedEmail = req.decoded.email;
            if (email !== decodedEmail) {
                return res.status(403).send({ message: 'forbidden access' });
            }
            const query = { email: email };
            const bookings = await carResaleBookingCollection.find(query).toArray();
            res.send(bookings);
        });

        app.get('/jwt', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const user = await carResaleUsersCollection.findOne(query);
            if (user) {
                const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, { expiresIn: '10d' })
                return res.send({ accessToken: token });
            }
            console.log(user);
            res.status(403).send({ accessToken: "" })
        });

        //get all users
        app.get('/users', async (req, res) => {
            const query = {};
            const allUsers = await carResaleUsersCollection.find(query).toArray();
            res.send(allUsers);
        });

        // get buyer user

        // app.get('/users/buyer', async (req, res) => {
        //     const Buyer = req.params.Buyer;
        //     const query = { role: Buyer };
        //     const allBuyer = await carResaleUsersCollection.find(query).toArray();
        //     res.send(allBuyer);
        //     console.log(buyer)
        // });

        app.get('/users/buyer/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const user = await carResaleUsersCollection.find(query);
            res.send({ isBuyer: user?.role === 'Buyer' })
        });



        //get admin user
        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const user = await carResaleUsersCollection.findOne(query);
            res.send({ isAdmin: user?.role === 'Admin' })
        });


        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await carResaleUsersCollection.insertOne(user);
            res.send(result);
        });

        //make admin
        app.put('/users/admin/:id', verifyJWT, async (req, res) => {
            //verify admin user
            const decodedEmail = req.decoded.email;
            const query = { email: decodedEmail };
            const user = await carResaleUsersCollection.findOne(query);
            if (user?.role !== 'Admin') {
                return res.status(403).send({ message: 'forbidden access' })
            }

            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    role: 'Admin'
                }
            }
            const result = await carResaleUsersCollection.updateOne(filter, updatedDoc, options);
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