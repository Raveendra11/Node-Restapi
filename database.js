//init
const mongoose= require('mongoose');
const assert = require('assert');

const db_url = process.env.DB_URL;
// establish connection
mongoose.connect(
    db_url,
    {
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
    },
    function(error, link) {
        // check error
        assert.equal(error, null, 'DB connection Fail..');
        // ok
        console.log('connection successful');
    }
);
