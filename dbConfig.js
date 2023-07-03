const mongodb = require('mongodb');
const dbdName = 'Gmail-Clone';
const dbdUrl = `mongodb+srv://zen-class-35:Chandru1234@chandruloganathan.ckkhhdb.mongodb.net/${dbdName}?retryWrites=true&w=majority`;
const MongoClient = mongodb.MongoClient;


module.exports ={mongodb,dbdName,dbdUrl,MongoClient}