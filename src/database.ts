import mongoose from 'mongoose';
//const { MongoClient } = require("mongodb");
const connectionString = process.env.REACT_APP_MONGO_URI!; //! meaning it exists. believe me

const errorLog = (err:Error) => {
  console.log(err);
}



const connector:Promise<void> = mongoose.connect(connectionString).then(
    () => {
      //ready to use. The `mongoose.connect()` promise resolves to mongoose instance.
      //console.log("Successfully connected to MongoDB.");
    },
    (err:Error) => {
      //handle initial connection error
      console.log("Error: ",err);
    }
);

mongoose.connection.on('error', (err:Error) => {
  errorLog(err);
});

mongoose.connection.on('open', function (ref:any) {
    console.log('Connected to mongo server.');

    mongoose.connection.db.listCollections().toArray(function (err:any, names:any) {
        //console.log(names); //show collections
    });
});
mongoose.connection.on('disconnected', function (ref:any) {
    console.log('Disconnected to mongo server.');

});

module.exports = {
  connector
}
