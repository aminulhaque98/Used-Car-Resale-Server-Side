const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000

const app = express();

//middleware
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    res.send('products resale server is running')
})

app.listen(port, () => console.log(`Products resale portal is running ${port}`))