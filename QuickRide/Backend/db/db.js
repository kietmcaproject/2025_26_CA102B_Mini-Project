const mongoose = require('mongoose');
const uri=process.env.DB_CONNECT
console.log(uri);

function connectToDb() {
    mongoose.connect(process.env.DB_CONNECT
    ).then(() => {
        console.log('Connected to DB');
    }).catch(err => console.log(err));
}


module.exports = connectToDb;