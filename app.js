const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv/config');

//Import Routes
const postsRoute = require('./routes/posts');
const authRoute = require('./routes/auth');

//database connection
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => { if (err) console.log(err) });

//Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

//Route Middlewares
app.use('/posts', postsRoute);
app.use('/api/v1', authRoute);

//Listening to the server
app.listen(5000, () => { console.log(`Server is up and running`) });