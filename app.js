const express = require('express');
const app = express();
const dotenv = require('dotenv');
const connectDataBase = require('./config/database');

dotenv.config({ path: 'config/config.env' });

//Connet to DB
connectDataBase();

//set up body parser
app.use(express.json());

const PORT = process.env.PORT;
const server = app.listen(PORt, () => {
    console.log(`Server started on port ${PORT} in ${process.env.NODE_ENV} mode.`);
});