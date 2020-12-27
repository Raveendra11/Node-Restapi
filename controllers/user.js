// To build API's

const router = require('express').Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const {check, validationResult} = require('express-validator');
const user = require('../model/user');

// middleware setup

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));

// Router       //Router is an built in module which handles HTTP req - GET POST PUT DELETE
router.all('/',
    function(req, res){
        return res.json({
            status:true,
            message: 'User Controller working..'
        });
    });         
// Create new user
router.post(
    '/createNew',       // 1st parameter, can be any name
    [                   // 2nd parameter, validation rule
        // Check not empty fields
        check('username').not().isEmpty().trim().escape(),
        check('password').not().isEmpty().trim().escape(),
        check('email').not().isEmpty().trim().escape()
    ],
    function(req, res){ // call back function with req and response
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(422).json({
                status:false,
                message: 'form validation error..',
                errors: errors.array()
            });
        }
        // Hash password
        const hashedPassword = bcrypt.hashSync(req.body.password,10);
// create variables for user module
        var temp = new user({
            username : req.body.username,
            email : req.body.email,
            password : hashedPassword
        });
        // insert data using save method
        temp.save(function(error, result){
            if(error) {
                return res.json({
                    status: false,
                    message : 'DB connection failed..',
                    error : error
                });
            }
            // ok
            return res.json({
                status:true,
                message: 'Success..',
                result:result
            });
        })
    }
);



router.get(
    '/find/:email',
    function(req, res) {
        user.find({email: req.params.email}, {password:0}, function(error, result){
            if(error) {
                return res.json({
                    status:false,
                    message: 'data is not find',
                    error:error
                });
            }
            // Ok
            return res.json({
                status:true,
                message:'Success..',
                result:result
            });
        });
    }
);
// find document from database

router.get(
    '/allData',
    function(req, res) {
        user.find(function(error, result){
            if(error) {
                return res.json({
                    status:false,
                    message: 'data is not find',
                    error:error
                });
            }
            // Ok
            return res.json({
                status:true,
                message:'Success..',
                result:result
            });
        });
    }
);

// To update the data
router.put(
    '/update/:email',
    function(req,res) {
        if(res.params.email) {
            user.update({email: req.params.email}, {username: 'Pikesh Vas'}, function(error, result){
                if(error){
                    return res.json({
                        status:false,
                        message:'Data is not find',
                        error:error
                    });
                }
            });
        } else {
            return res.json({
                status:false,
                message: 'Email is not found..',
            });
        }
    }
);

// Find the document from database to delete
router.delete(
    '/remove/:email',
    function(req,res) {
        if(req.params.email) {
            user.remove({email:req.params.email}, function(error, result){
                if(error) {
                    return res.json({
                        status:false,
                        message:'Data not found..',
                        error:error
                    });
                }
                // Ok
                return res.json({
                    status:true,
                    message:'Success..',
                    result:result
                });
            });
        } else {
            return res.json({
                status:false,
                message:'Email is not found..'
            });
        }
    }
);
// login router for user
router.post(
    '/login',
    [
        // Check not empty fields
        check('password').not().isEmpty().trim().escape(),
        check('email').isEmail().normalizeEmail()
    ],
    function(req, res) {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(422).json({
                status:false,
                message:'Form validation error',
                errors:errors.array()
            });
        }
        user.findOne(
            {email:req.body.email},
            function(error, result) {
                if(error) {
                    return res.json({
                        status:false,
                        message: 'DB read fail',
                        errors:error
                    });
                }
                // result is empty or not
                if(result) {
                    const isMatch = bcrypt.compareSync(req.body.password, result.password);
                    if(isMatch) {
                        return res.json({
                            status:true,
                            message: 'User login success..',
                            result:result
                        });
                    } else{
                        return res.json({
                            status:false,
                            message: 'User login fail..'
                        });
                    }
                }
            }
        );
    }
);
// module export

module.exports = router;