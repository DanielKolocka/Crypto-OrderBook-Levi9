const express = require('express');
const app = express();
const dotenv = require('dotenv');
const connectDataBase = require('./config/database');
const bodyParser = require('body-parser');

dotenv.config({ path: 'config/config.env' });

//Connet to DB
connectDataBase();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

//set up body parser 
app.use(express.json());

//Import routes
const orders = require('./routes/order');

app.use('/', orders);

const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
    console.log(`Server started on port ${PORT} in ${process.env.NODE_ENV} mode.`);
});