// init
require('dotenv').config();         // to call port number
const express = require('express'); 
const morgan = require('morgan');
const cors = require('cors');

const app = express();          //created instance of express, and called port no.

const port = process.env.PORT;
const database = require('./database');
const userController = require('./controllers/user');   // to set the URl, for user controller

//middleware setup

app.use(morgan('dev'));
app.use(cors());
app.use('/api/user', userController);   

// default routes

app.all('/',
    function(req, res){
        return res.json({
            status:true,
            message: 'Index page working..'
        });
    });

// start server
app.listen(port,
    function() {
        console.log('server running in port:' + port);
    });
