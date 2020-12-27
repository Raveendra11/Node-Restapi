const mongoose = require('mongoose');

const userSchema = mongoose.Schema({

username:{

    type:String,
    require:true
},
email:{
    type:String,
    require:true,
    unique:true
},
password:{
    type:String,
    require:true
},
isActive:{
    type:Boolean,
    default:true
},
createdOn:{
    type:Date,
    default:Date.now()
}
});

mongoose.model('user', userSchema);

module.exports = mongoose.model('user');





