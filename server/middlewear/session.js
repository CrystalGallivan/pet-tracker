import expressSession from 'express-session'
var mongoStore = require("connect-mongodb-session")(expressSession);

var store = new mongoStore({
  uri: "mongodb://student:student123@cluster0-shard-00-00-hlah1.mongodb.net:27017,cluster0-shard-00-01-hlah1.mongodb.net:27017,cluster0-shard-00-02-hlah1.mongodb.net:27017/pet-tracker?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority",
  collection: "Sessions"
});

store.on("error", function (err) {
  console.log("[SESSION ERROR]", err);
});


export default class Session {
  constructor() {
    this.express = expressSession({
      secret: "th1s is 0ur s3cr3t",
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 * 52 * 2,
      },
      store,
      resave: true,
      saveUninitialized: true
    })
  }
}